import { NextResponse } from "next/server";
import { getProvider, claimProfile } from "@/lib/db-queries";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { npi, email } = body as { npi?: string; email?: string };

    // Validate inputs
    if (!npi || !email) {
      return NextResponse.json(
        { success: false, message: "NPI and email are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(npi)) {
      return NextResponse.json(
        { success: false, message: "Invalid NPI number." },
        { status: 400 }
      );
    }

    // Verify NPI exists
    const provider = await getProvider(npi);
    if (!provider) {
      return NextResponse.json(
        { success: false, message: "Provider not found." },
        { status: 404 }
      );
    }

    // Attempt to claim
    const result = await claimProfile(npi, email);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          code: result.code,
          message: "This profile has already been claimed.",
        },
        { status: 409 }
      );
    }

    // Send verification email
    const providerName = `Dr. ${provider.first_name} ${provider.last_name}`;
    const profileUrl = `https://npixray.com/provider/${npi}`;

    if (resend) {
      try {
        await resend.emails.send({
          from: "NPIxray <reports@npixray.com>",
          to: email,
          subject: `Verify your NPIxray profile claim — ${providerName}`,
          html: buildClaimEmailHtml({ providerName, npi, profileUrl }),
        });
      } catch (emailError) {
        console.error("[claim] Failed to send verification email:", emailError);
        // Claim is still stored — email failure is non-blocking
      }
    } else {
      console.log("[claim] RESEND_API_KEY not set — skipping verification email");
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent. Check your inbox!",
    });
  } catch (error) {
    console.error("[claim] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

function buildClaimEmailHtml({
  providerName,
  npi,
  profileUrl,
}: {
  providerName: string;
  npi: string;
  profileUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verify Your NPIxray Profile</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;color:#e5e5e5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="font-size:24px;font-weight:bold;color:#ffffff;letter-spacing:-0.5px;">
                NPI<span style="color:#E8A824;">xray</span>
              </span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background-color:#111118;border:1px solid rgba(232,168,36,0.2);border-radius:16px;padding:40px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:14px;color:#999;text-transform:uppercase;letter-spacing:2px;">
                Profile Claim Verification
              </p>
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:bold;color:#ffffff;">
                ${providerName}
              </h1>
              <p style="margin:0 0 24px;font-size:14px;color:#999;">
                NPI ${npi}
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#ccc;line-height:1.6;">
                Someone (hopefully you!) claimed this provider profile on NPIxray. Click below to verify ownership and unlock exclusive features.
              </p>
              <a href="${profileUrl}" style="display:inline-block;background-color:#E8A824;color:#0a0a0f;text-decoration:none;font-weight:600;font-size:16px;padding:14px 32px;border-radius:12px;">
                Verify My Profile
              </a>
              <p style="margin:24px 0 0;font-size:12px;color:#666;">
                If you didn&rsquo;t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#666;">
                &copy; ${new Date().getFullYear()} NPIxray. All rights reserved.
              </p>
              <p style="margin:0;font-size:11px;color:#555;">
                <a href="https://npixray.com" style="color:#666;text-decoration:none;">npixray.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

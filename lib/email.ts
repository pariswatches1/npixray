import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface WelcomeEmailParams {
  to: string;
  providerName: string;
  npi: string;
  specialty: string;
  totalMissedRevenue: number;
}

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function buildEmailHtml({
  providerName,
  npi,
  specialty,
  totalMissedRevenue,
}: Omit<WelcomeEmailParams, "to">): string {
  const scanUrl = `https://npixray.com/scan/${npi}`;
  const missed = formatCurrency(totalMissedRevenue);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your NPIxray Revenue Report</title>
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

          <!-- Hero -->
          <tr>
            <td style="background-color:#111118;border:1px solid rgba(232,168,36,0.2);border-radius:16px;padding:40px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:14px;color:#999;text-transform:uppercase;letter-spacing:2px;">
                Revenue Analysis Ready
              </p>
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:bold;color:#ffffff;">
                ${providerName}
              </h1>
              <p style="margin:0 0 24px;font-size:14px;color:#999;">
                ${specialty} &bull; NPI ${npi}
              </p>

              <!-- Missed Revenue Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                <tr>
                  <td style="background-color:rgba(232,168,36,0.08);border:1px solid rgba(232,168,36,0.25);border-radius:12px;padding:20px 40px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">
                      Estimated Missed Revenue
                    </p>
                    <p style="margin:0;font-size:36px;font-weight:bold;color:#E8A824;font-family:'Courier New',monospace;">
                      ${missed}<span style="font-size:16px;color:#999;font-family:-apple-system,sans-serif;">/yr</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <a href="${scanUrl}" style="display:inline-block;background-color:#E8A824;color:#0a0a0f;text-decoration:none;font-weight:600;font-size:16px;padding:14px 32px;border-radius:12px;">
                View Full Report
              </a>
            </td>
          </tr>

          <!-- What's Included -->
          <tr>
            <td style="padding:32px 0;">
              <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#ffffff;">
                Your report includes:
              </h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${[
                  "E&M coding gap analysis with shift recommendations",
                  "CCM, RPM, BHI, and AWV program opportunities",
                  "Specialty benchmark comparisons",
                  "90-day prioritized action plan",
                ].map(item => `
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#ccc;">
                    <span style="color:#E8A824;margin-right:8px;">&#x2713;</span>
                    ${item}
                  </td>
                </tr>`).join("")}
              </table>
            </td>
          </tr>

          <!-- Upsell -->
          <tr>
            <td style="background-color:#111118;border:1px solid rgba(232,168,36,0.15);border-radius:12px;padding:24px 32px;">
              <h3 style="margin:0 0 8px;font-size:16px;color:#E8A824;font-weight:600;">
                Want Patient-Level Insights?
              </h3>
              <p style="margin:0 0 16px;font-size:14px;color:#999;line-height:1.6;">
                Upgrade to NPIxray Intelligence ($99/mo) for CSV billing uploads,
                patient eligibility lists, AI coding recommendations, and MIPS tracking.
              </p>
              <a href="https://npixray.com/pricing" style="font-size:14px;color:#E8A824;text-decoration:none;font-weight:600;">
                View Plans &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0;text-align:center;border-top:1px solid rgba(255,255,255,0.05);margin-top:32px;">
              <p style="margin:0 0 8px;font-size:12px;color:#666;">
                &copy; ${new Date().getFullYear()} NPIxray. All rights reserved.
              </p>
              <p style="margin:0;font-size:11px;color:#555;">
                Data from CMS.gov public datasets. Not medical advice.<br/>
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

/**
 * Send a welcome email with scan summary.
 * Returns true if sent successfully, false otherwise.
 * Gracefully no-ops if RESEND_API_KEY is not set.
 */
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<boolean> {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — skipping welcome email");
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: "NPIxray <reports@npixray.com>",
      to: params.to,
      subject: `${params.providerName} is missing ${formatCurrency(params.totalMissedRevenue)}/yr in revenue`,
      html: buildEmailHtml(params),
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[email] Failed to send welcome email:", err);
    return false;
  }
}

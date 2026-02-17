import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "npixray2025indexnowkey";
const INDEXNOW_HOST = "https://npixray.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls } = body as { urls?: string[] };

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "Request body must include a non-empty 'urls' array." },
        { status: 400 }
      );
    }

    // Limit to 10,000 URLs per IndexNow spec
    if (urls.length > 10000) {
      return NextResponse.json(
        { error: "Maximum 10,000 URLs per request." },
        { status: 400 }
      );
    }

    // Ensure all URLs belong to our host
    const validUrls = urls.filter(
      (url) =>
        url.startsWith(INDEXNOW_HOST) ||
        url.startsWith("https://npixray.com") ||
        url.startsWith("https://www.npixray.com")
    );

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid URLs provided. All URLs must belong to npixray.com." },
        { status: 400 }
      );
    }

    // Submit to IndexNow API
    const indexNowPayload = {
      host: "npixray.com",
      key: INDEXNOW_KEY,
      keyLocation: `${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: validUrls,
    };

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(indexNowPayload),
    });

    const statusCode = response.status;

    // IndexNow returns 200 or 202 on success
    if (statusCode === 200 || statusCode === 202) {
      return NextResponse.json({
        success: true,
        submitted: validUrls.length,
        skipped: urls.length - validUrls.length,
        indexnow_status: statusCode,
      });
    }

    // Handle IndexNow errors
    const errorText = await response.text().catch(() => "Unknown error");
    return NextResponse.json(
      {
        success: false,
        submitted: 0,
        indexnow_status: statusCode,
        error: `IndexNow API returned ${statusCode}: ${errorText}`,
      },
      { status: 502 }
    );
  } catch (err) {
    console.error("IndexNow API error:", err);
    return NextResponse.json(
      { error: "Internal server error while submitting to IndexNow." },
      { status: 500 }
    );
  }
}

// GET endpoint to verify the key
export async function GET() {
  return NextResponse.json({
    service: "IndexNow",
    key: INDEXNOW_KEY,
    key_location: `${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    usage: "POST an array of URLs to this endpoint to submit to IndexNow for instant indexing on Bing and Yandex.",
    example: {
      method: "POST",
      body: {
        urls: [
          "https://npixray.com/research",
          "https://npixray.com/data-api",
        ],
      },
    },
  });
}

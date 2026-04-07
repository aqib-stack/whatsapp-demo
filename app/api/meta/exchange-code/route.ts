import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: "Missing code." }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing NEXT_PUBLIC_META_APP_ID or META_APP_SECRET. Add them to enable server-side code exchange.",
        },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    });

    if (redirectUri) {
      params.set("redirect_uri", redirectUri);
    }

    const response = await fetch(`https://graph.facebook.com/v23.0/oauth/access_token?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to exchange code: ${String(error)}` },
      { status: 500 }
    );
  }
}

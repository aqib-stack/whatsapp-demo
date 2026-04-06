import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    if (!to) {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!phoneNumberId || !token) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN in .env.local",
        },
        { status: 500 }
      );
    }

    const cleanPhone = String(to).replace(/\+/g, "").replace(/\s/g, "");

    const response = await fetch(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "template",
          template: {
            name: "hello_world",
            language: {
              code: "en_US",
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Template message sent successfully.",
      sentTo: `+${cleanPhone}`,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to send message: ${String(error)}` },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, locale } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.NEWSLETTER_AUDIENCE_ID;

    if (!apiKey) {
      console.warn("[Newsletter] RESEND_API_KEY not set");
      return NextResponse.json({ ok: true });
    }

    // Add contact to Resend Audience
    if (audienceId) {
      const contactRes = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            unsubscribed: false,
          }),
        }
      );

      if (!contactRes.ok) {
        const body = await contactRes.text();
        // 409 = already subscribed, treat as success
        if (contactRes.status !== 409) {
          console.error("[Newsletter] Contact add error:", contactRes.status, body);
        }
      }
    }

    // Notify site owner
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "newsletter@tuncer-byte.com",
        to: "tuncerbostancibasi@gmail.com",
        subject: `Yeni abone: ${email}`,
        html: `
          <p><strong>Yeni newsletter abonesi</strong></p>
          <p>Email: <strong>${email}</strong></p>
          <p>Dil: ${locale === "tr" ? "Türkçe" : "English"}</p>
          <p style="color:#888;font-size:12px">tuncer-byte.com newsletter formu</p>
        `,
      }),
    });

    console.log(`[Newsletter] Subscribed: ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Newsletter] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

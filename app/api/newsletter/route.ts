import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, locale } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("[Newsletter] RESEND_API_KEY not set");
      return NextResponse.json({ ok: true });
    }

    // Send notification email to site owner
    const res = await fetch("https://api.resend.com/emails", {
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

    if (!res.ok) {
      const body = await res.text();
      console.error("[Newsletter] Resend error:", res.status, body);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    console.log(`[Newsletter] Subscribed: ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Newsletter] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

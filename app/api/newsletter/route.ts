import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

    const resend = new Resend(apiKey);

    // Add contact to Resend Audience
    if (audienceId) {
      const { error: contactError } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });

      if (contactError) {
        // "already exists" is fine — treat as success
        const msg = (contactError as { message?: string }).message ?? "";
        if (!msg.toLowerCase().includes("already")) {
          console.error("[Newsletter] Contact add error:", contactError);
        }
      }
    }

    // Notify site owner
    await resend.emails.send({
      from: "newsletter@tuncer-byte.com",
      to: "tuncerbostancibasi@gmail.com",
      subject: `Yeni abone: ${email}`,
      html: `
        <p><strong>Yeni newsletter abonesi</strong></p>
        <p>Email: <strong>${email}</strong></p>
        <p>Dil: ${locale === "tr" ? "Türkçe" : "English"}</p>
        <p style="color:#888;font-size:12px">tuncer-byte.com newsletter formu</p>
      `,
    });

    console.log(`[Newsletter] Subscribed: ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Newsletter] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

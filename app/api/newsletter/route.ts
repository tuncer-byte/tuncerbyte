import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { email, locale, source } = await req.json();

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
    const now = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
    await resend.emails.send({
      from: "newsletter@tuncer-byte.com",
      to: "tuncerbostancibasi@gmail.com",
      subject: `+1 abone: ${email}`,
      html: `
        <div style="font-family:monospace;max-width:480px;padding:24px;background:#fff;border:1px solid #e5e5e5;border-radius:8px;">
          <p style="margin:0 0 16px;font-size:18px;font-weight:700;">📬 Yeni newsletter abonesi</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:8px 0;color:#888;width:80px;">Email</td>
              <td style="padding:8px 0;font-weight:700;">${email}</td>
            </tr>
            <tr style="border-top:1px solid #f0f0f0;">
              <td style="padding:8px 0;color:#888;">Dil</td>
              <td style="padding:8px 0;">${locale === "tr" ? "🇹🇷 Türkçe" : "🇬🇧 English"}</td>
            </tr>
            <tr style="border-top:1px solid #f0f0f0;">
              <td style="padding:8px 0;color:#888;">Kaynak</td>
              <td style="padding:8px 0;">${source ?? "—"}</td>
            </tr>
            <tr style="border-top:1px solid #f0f0f0;">
              <td style="padding:8px 0;color:#888;">Zaman</td>
              <td style="padding:8px 0;">${now}</td>
            </tr>
          </table>
        </div>
      `,
    });

    console.log(`[Newsletter] Subscribed: ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Newsletter] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

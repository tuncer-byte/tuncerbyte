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

    // Welcome email to subscriber
    const isTr = locale === "tr";
    await resend.emails.send({
      from: "newsletter@tuncer-byte.com",
      to: email,
      subject: isTr ? "Hoş geldin! 👋 tuncer-byte.com bültenine abone oldun" : "Welcome! 👋 You're subscribed to tuncer-byte.com",
      html: `<!DOCTYPE html>
<html lang="${isTr ? "tr" : "en"}">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:monospace,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid #e5e5e5;">
            <a href="https://tuncer-byte.com" style="text-decoration:none;color:#111;font-weight:700;font-size:15px;font-family:monospace;">tuncer-byte.com</a>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 0;">
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#111;line-height:1.3;font-family:monospace;">
              ${isTr ? "Hoş geldin! 👋" : "Welcome aboard! 👋"}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 0;">
            <p style="margin:0;font-size:15px;color:#555;line-height:1.7;">
              ${isTr
                ? "Bültene abone olduğun için teşekkürler. Yeni bir yazı yayınladığımda direkt inbox'ına gelecek."
                : "Thanks for subscribing! Every time I publish a new post, it'll land straight in your inbox."}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0;">
            <p style="margin:0;font-size:14px;color:#555;line-height:1.7;font-weight:600;">
              ${isTr ? "Başlamak için birkaç yazı:" : "A few posts to start with:"}
            </p>
            <ul style="margin:8px 0 0;padding-left:20px;font-size:14px;color:#555;line-height:2;">
              <li><a href="https://tuncer-byte.com/${isTr ? "tr" : "en"}/blog/${isTr ? "mcp-nedir-neden-onemli" : "what-is-mcp"}" style="color:#111;">${isTr ? "MCP Nedir ve Neden Önemli?" : "What is MCP and Why Does it Matter?"}</a></li>
              <li><a href="https://tuncer-byte.com/${isTr ? "tr" : "en"}/blog/${isTr ? "bir-gunde-ai-agent-kurulumu" : "building-ai-agents-for-production"}" style="color:#111;">${isTr ? "Bir Günde AI Agent Kurulumu" : "Building AI Agents for Production"}</a></li>
              <li><a href="https://tuncer-byte.com/${isTr ? "tr" : "en"}/blog/${isTr ? "vibe-coding-temelleri" : "vibe-coding-fundamentals"}" style="color:#111;">${isTr ? "Vibe Coding Temelleri" : "Vibe Coding Fundamentals"}</a></li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 0;">
            <a href="https://tuncer-byte.com/${isTr ? "tr" : "en"}/blog" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:700;font-family:monospace;">
              ${isTr ? "Tüm yazılara bak →" : "Browse all posts →"}
            </a>
          </td>
        </tr>
        <tr><td style="padding:32px 32px 0;"><hr style="border:none;border-top:1px solid #e5e5e5;margin:0;"/></td></tr>
        <tr>
          <td style="padding:20px 32px 32px;">
            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;font-family:monospace;">
              ${isTr
                ? `Bu maili <a href="https://tuncer-byte.com" style="color:#aaa;">tuncer-byte.com</a> bültenine abone olduğun için aldın.`
                : `You're receiving this because you subscribed to <a href="https://tuncer-byte.com" style="color:#aaa;">tuncer-byte.com</a>.`}
              <br/>
              <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#aaa;">${isTr ? "Aboneliği iptal et" : "Unsubscribe"}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    console.log(`[Newsletter] Subscribed: ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Newsletter] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

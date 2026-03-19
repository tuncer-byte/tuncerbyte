import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tuncer-byte.com";

function buildEmailHtml(params: {
  title: string;
  excerpt: string;
  url: string;
  locale: string;
}) {
  const { title, excerpt, url, locale } = params;
  const isTr = locale === "tr";

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:monospace,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #e5e5e5;">
              <a href="${BASE_URL}" style="text-decoration:none;color:#111;font-weight:700;font-size:15px;font-family:monospace;">
                tuncer-byte.com
              </a>
            </td>
          </tr>

          <!-- Label -->
          <tr>
            <td style="padding:32px 32px 0;">
              <p style="margin:0;font-size:11px;font-family:monospace;color:#888;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">
                ${isTr ? "Yeni Yazı" : "New Post"}
              </p>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:12px 32px 0;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#111;line-height:1.3;font-family:monospace;">
                ${title}
              </h1>
            </td>
          </tr>

          <!-- Excerpt -->
          <tr>
            <td style="padding:16px 32px 0;">
              <p style="margin:0;font-size:15px;color:#555;line-height:1.7;">
                ${excerpt}
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:28px 32px 0;">
              <a href="${url}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:700;font-family:monospace;">
                ${isTr ? "Yazıyı Oku →" : "Read Post →"}
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:32px 32px 0;">
              <hr style="border:none;border-top:1px solid #e5e5e5;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 32px;">
              <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;font-family:monospace;">
                ${isTr
                  ? `Bu maili <a href="${BASE_URL}" style="color:#aaa;">${BASE_URL}</a> bültenine abone olduğun için aldın.`
                  : `You're receiving this because you subscribed to <a href="${BASE_URL}" style="color:#aaa;">${BASE_URL}</a>.`
                }
                <br />
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#aaa;">
                  ${isTr ? "Aboneliği iptal et" : "Unsubscribe"}
                </a>
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

export async function POST(req: NextRequest) {
  try {
    // Auth: NEWSLETTER_SECRET header required
    const secret = process.env.NEWSLETTER_SECRET;
    const authHeader = req.headers.get("x-newsletter-secret");

    if (!secret || authHeader !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, excerpt, slug, locale = "tr" } = await req.json();

    if (!title || !excerpt || !slug) {
      return NextResponse.json({ error: "title, excerpt and slug are required" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.NEWSLETTER_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      return NextResponse.json({ error: "RESEND_API_KEY or NEWSLETTER_AUDIENCE_ID not set" }, { status: 500 });
    }

    const postUrl = `${BASE_URL}/${locale}/blog/${slug}`;
    const html = buildEmailHtml({ title, excerpt, url: postUrl, locale });

    // Get all contacts from audience
    const contactsRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!contactsRes.ok) {
      const body = await contactsRes.text();
      console.error("[Send Newsletter] Contacts fetch error:", body);
      return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
    }

    const { data: contacts } = await contactsRes.json() as {
      data: { id: string; email: string; unsubscribed: boolean }[];
    };

    const activeContacts = contacts.filter((c) => !c.unsubscribed);

    if (activeContacts.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: "No active subscribers" });
    }

    // Send batch emails (Resend batch: max 100 per request)
    const subject = locale === "tr"
      ? `Yeni Yazı: ${title}`
      : `New Post: ${title}`;

    const batches: { from: string; to: string; subject: string; html: string }[][] = [];
    for (let i = 0; i < activeContacts.length; i += 100) {
      batches.push(
        activeContacts.slice(i, i + 100).map((c) => ({
          from: "newsletter@tuncer-byte.com",
          to: c.email,
          subject,
          html,
        }))
      );
    }

    let totalSent = 0;
    for (const batch of batches) {
      const batchRes = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batch),
      });

      if (batchRes.ok) {
        totalSent += batch.length;
      } else {
        const body = await batchRes.text();
        console.error("[Send Newsletter] Batch error:", batchRes.status, body);
      }
    }

    console.log(`[Send Newsletter] Sent to ${totalSent} subscribers for: ${slug}`);
    return NextResponse.json({ ok: true, sent: totalSent });
  } catch (err) {
    console.error("[Send Newsletter] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

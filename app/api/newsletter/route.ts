import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, locale } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.NEWSLETTER_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      console.warn("[Newsletter] RESEND_API_KEY or NEWSLETTER_AUDIENCE_ID not set");
      return NextResponse.json({ ok: true }); // graceful fallback
    }

    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[Newsletter] Resend error:", res.status, body);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    console.log(`[Newsletter] Subscribed: ${email} (${locale ?? "unknown"})`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Newsletter] Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

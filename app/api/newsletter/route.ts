import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, locale } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Log for now — wire up your preferred email service here:
    // e.g. Resend, Buttondown, Mailchimp, ConvertKit, etc.
    console.log(`[Newsletter] New subscriber: ${email} (${locale ?? "unknown"})`);

    // Example Resend integration (uncomment + add RESEND_API_KEY env var):
    // await fetch("https://api.resend.com/audiences/{audience_id}/contacts", {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, unsubscribed: false }),
    // });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

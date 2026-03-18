"use client";

import { useState } from "react";

interface Props {
  locale: string;
}

export default function NewsletterForm({ locale }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isTr = locale === "tr";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="newsletter-box">
      <div className="newsletter-icon">✉</div>
      <div className="newsletter-body">
        <p className="newsletter-heading">
          {isTr ? "Yeni yazıları email'e al" : "Get new posts by email"}
        </p>
        <p className="newsletter-sub">
          {isTr
            ? "Yeni bir yazı yayınlandığında direkt inbox'ına gelsin."
            : "New posts delivered straight to your inbox."}
        </p>
        {status === "success" ? (
          <p className="newsletter-success">
            {isTr ? "✓ Kaydoldun, teşekkürler!" : "✓ Subscribed, thank you!"}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isTr ? "email@adresin.com" : "your@email.com"}
              className="newsletter-input"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              className="newsletter-btn"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "..."
                : isTr
                ? "Abone Ol"
                : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="newsletter-error">
            {isTr ? "Bir hata oluştu, tekrar dene." : "Something went wrong, please try again."}
          </p>
        )}
      </div>
    </div>
  );
}

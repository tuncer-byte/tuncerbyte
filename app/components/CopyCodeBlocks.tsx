"use client";

import { useEffect } from "react";

export default function CopyCodeBlocks() {
  useEffect(() => {
    const pres = document.querySelectorAll<HTMLElement>(".blog-post-content pre");

    pres.forEach((pre) => {
      if (pre.querySelector(".copy-code-btn")) return;

      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "copy-code-btn";
      btn.textContent = "copy";
      btn.setAttribute("aria-label", "Copy code");

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = "✓";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "copy";
            btn.classList.remove("copied");
          }, 2000);
        } catch {
          // clipboard not available
        }
      });

      pre.appendChild(btn);
    });
  }, []);

  return null;
}

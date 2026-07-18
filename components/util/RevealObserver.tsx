"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Observes every element tagged with `data-reveal` and adds `.is-revealed`
 * when it scrolls into view. Server components stay server components —
 * they only need the data attribute (optionally `data-reveal-delay="150"`).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"));
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay;
            if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
            el.classList.add("is-revealed");
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

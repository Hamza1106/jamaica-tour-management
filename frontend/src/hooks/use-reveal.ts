import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Scroll-reveal: adds `.is-visible` to any `.reveal` element that enters
 * the viewport. Re-runs on every route change so navigating to a new page
 * always triggers the animation fresh.
 */
export function useScrollReveal() {
  // Re-run when the URL changes (each page navigation)
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Small delay so the new page's DOM has painted before we observe
    const timer = setTimeout(() => {
      // Reset all reveals on this page first
      document.querySelectorAll<HTMLElement>(".reveal.is-visible").forEach((el) => {
        el.classList.remove("is-visible");
      });

      const els = document.querySelectorAll<HTMLElement>(".reveal");
      if (!els.length) return;

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io.unobserve(e.target);
            }
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      els.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname]); // re-fires on every route change
}

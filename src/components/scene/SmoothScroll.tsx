"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useScrollState } from "@/components/scene/useScrollState";

gsap.registerPlugin(ScrollTrigger);

/**
 * Owns the scroll engine. Nothing else may create a Lenis instance or drive
 * gsap.ticker.
 *
 * Order matters and is load-bearing: Lenis exists, then ScrollTrigger is
 * wired to it, then ScrollTrigger.refresh() runs, and only after all of that
 * does anything downstream create a trigger. A pin built against a scroller
 * ScrollTrigger has not yet measured jumps at the pin boundary.
 */
export default function SmoothScroll() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Reduced motion: no smoothing, no rAF loop, native scrolling only.
    if (reducedMotion) return;

    const lenis = new Lenis({ lerp: 0.08 });

    // 1. ScrollTrigger learns about every Lenis scroll before any trigger
    //    exists to read a stale position.
    lenis.on("scroll", ScrollTrigger.update);

    // 2. One clock. GSAP drives Lenis instead of Lenis running its own rAF,
    //    so tweens and scroll can never advance on different frames.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 3. Measure once the wiring is live.
    ScrollTrigger.refresh();

    // 4. Only now create triggers. Scroll reveals are declared in markup with
    //    data-reveal-on-scroll and fire once, at 60% of the viewport.
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal-on-scroll]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          once: true,
          onEnter: () => el.classList.add("is-revealed"),
        });
      });
    });

    // In-page anchors must go through Lenis or they bypass smoothing and
    // land at a position ScrollTrigger has not been told about.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      // The nav is fixed, so landing a section at y=0 puts its first line
      // underneath it.
      lenis.scrollTo(target as HTMLElement, { offset: -104 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reducedMotion]);

  useScrollState(reducedMotion);

  return null;
}

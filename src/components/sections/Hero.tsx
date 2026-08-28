"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { site } from "@/data/site";
import { fieldState } from "@/components/scene/fieldState";
import { useReducedMotion } from "@/lib/useReducedMotion";

const LINES = ["I build", "systems that", "remember"];

/**
 * The three display lines, rendered twice: once in the layer that sits in
 * front of the canvas and once in the layer behind it. Hidden lines keep their
 * box so both copies lay out identically and the visible words stay aligned.
 */
function HeroLines({ show }: { show: number[] }) {
  return (
    <div className="hero-layer" aria-hidden="true">
      {LINES.map((line, i) => {
        const visible = show.includes(i);
        return (
          <div key={line} className="overflow-hidden">
            <span
              data-hero-line={visible ? i : undefined}
              className="hero-line"
              style={{ visibility: visible ? "visible" : "hidden" }}
            >
              {line}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Hero() {
  const reducedMotion = useReducedMotion();

  // The whole load sequence, one timeline: field first, then type, then chrome.
  useEffect(() => {
    const lines = Array.from(
      document.querySelectorAll<HTMLElement>("[data-hero-line]"),
    ).sort(
      (a, b) =>
        Number(a.dataset.heroLine ?? 0) - Number(b.dataset.heroLine ?? 0),
    );
    const chrome = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (reducedMotion) {
      gsap.set(lines, { y: "0%" });
      gsap.set(chrome, { opacity: 1, y: 0 });
      fieldState.reveal = 1;
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(fieldState, { reveal: 1, duration: 0.9, ease: "power2.out" }, 0)
        .to(lines, { y: "0%", duration: 1.1, stagger: 0.09 }, 0.35)
        .fromTo(
          "[data-reveal='nav']",
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.7 },
          1.0,
        )
        .to("[data-reveal='meta']", { opacity: 1, duration: 0.7 }, 1.25);
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col justify-between pt-32 pb-8"
    >
      {/* One accessible copy of the headline. The visual layers are aria-hidden. */}
      <h1 className="visually-hidden">
        Abhijay Singh Panwar. I build systems that remember.
      </h1>

      <div className="hero-stage">
        {/* Behind the canvas: the sphere passes in front of this line. */}
        <div className="hero-layer-back shell">
          <HeroLines show={[1]} />
        </div>

        {/* In front of the canvas: these lines occlude the sphere. */}
        <div className="hero-layer-front shell">
          <HeroLines show={[0, 2]} />
        </div>
      </div>

      <div className="above-field shell w-full" data-reveal="meta">
        <div className="border-hairline mb-6 w-full max-w-[26rem] border-t" />
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="flex flex-col gap-1">
            <p className="mono">{site.role}</p>
            <p className="mono">{site.location}</p>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <p className="mono flex items-center gap-2">
              <span aria-hidden="true">↓</span> Scroll
            </p>
            <p className="mono">CGPA {site.cgpa}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

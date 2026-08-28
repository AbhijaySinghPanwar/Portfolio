"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionIndex from "@/components/ui/SectionIndex";
import { experience } from "@/data/experience";
import { fieldState } from "@/components/scene/fieldState";

const role = experience[0];
const BEATS = role.beats.length;

export default function Experience() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const lastBeat = useRef(-1);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Pinned only on a real pointer-and-space layout. On phones the pin fights
    // the page scroll, and under reduced motion hijacking scroll is hostile.
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const trigger = ScrollTrigger.create({
          trigger: section.current,
          start: "top top",
          end: "+=250%",
          pin: stage.current,
          pinSpacing: true,
          // Pre-empts the pin by a frame so the swap cannot land visibly late
          // when scrolling slowly into the boundary.
          anticipatePin: 1,
          onUpdate: (self) => {
            if (fill.current) {
              fill.current.style.transform = `scaleX(${self.progress})`;
            }

            const index = Math.min(BEATS - 1, Math.floor(self.progress * BEATS));
            if (index !== lastBeat.current) {
              lastBeat.current = index;
              // Direct write, no React state in the render loop.
              fieldState.beat = index;
              setActive(index);
            }
          },
          // Outside the pinned range no lane is lit.
          onLeave: () => {
            fieldState.beat = -1;
          },
          onLeaveBack: () => {
            fieldState.beat = -1;
          },
          onEnter: () => {
            fieldState.beat = lastBeat.current;
          },
          onEnterBack: () => {
            fieldState.beat = lastBeat.current;
          },
        });

        // A pin changes document height, so everything measured before it
        // needs to re-measure.
        ScrollTrigger.refresh();

        return () => {
          trigger.kill();
          fieldState.beat = -1;
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="experience" ref={section} className="above-field">
      <div
        ref={stage}
        data-pin-stage=""
        className="flex min-h-svh flex-col justify-center py-24 md:py-0"
      >
        <div className="shell">
          <SectionIndex index="03" label="Experience" />

          <header className="mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 className="font-display text-bone text-[length:var(--text-title)]">
              {role.company}
            </h2>
            <p className="mono">{role.period}</p>
          </header>
          <p className="mono mt-3">{role.title}</p>

          {/* Progress rail. Scales from the left across the whole pinned run. */}
          <div className="bg-hairline relative mt-14 h-px w-full overflow-hidden">
            {/* Initial scale is set inline, not with a utility class. Tailwind
                v4's scale-x-0 compiles to the standalone `scale` property,
                which applies independently of `transform` and would pin this
                to zero width no matter what the scroll handler writes. */}
            <span
              ref={fill}
              aria-hidden="true"
              className="bg-iodine absolute inset-0 block origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <ol className="mt-0 grid md:grid-cols-4">
            {role.beats.map((beat, i) => {
              const isActive = i === active;
              const isPast = i < active;

              return (
                <li
                  key={beat.id}
                  data-beat={i}
                  aria-current={isActive ? "step" : undefined}
                  className="border-hairline border-b pt-8 pb-10 md:border-r md:border-b-0 md:pr-8 md:pl-8 md:first:pl-0 md:last:border-r-0"
                >
                  <span
                    aria-hidden="true"
                    className={`mb-6 block h-1.5 w-1.5 rounded-[var(--radius-pill)] transition-colors duration-500 ${
                      isActive
                        ? "bg-ember"
                        : isPast
                          ? "bg-iodine"
                          : "bg-hairline"
                    }`}
                  />
                  <p
                    className={`mono mono-500 transition-colors duration-500 ${
                      isActive ? "text-iodine" : ""
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")} · {beat.label}
                  </p>
                  {/* Inactive beats stay at muted, which still clears 4.5:1.
                      Advancing must not make three quarters of the section
                      unreadable. */}
                  <h3
                    className={`mt-4 text-[length:var(--text-lead)] leading-tight transition-colors duration-500 ${
                      isActive ? "text-bone" : "text-muted"
                    }`}
                  >
                    {beat.title}
                  </h3>
                  <p className="prose-body text-muted mt-4 text-[length:var(--text-small)]">
                    {beat.body}
                  </p>
                  <p
                    className={`mono mt-6 transition-colors duration-500 ${
                      isActive ? "text-ember" : ""
                    }`}
                  >
                    {beat.metric}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

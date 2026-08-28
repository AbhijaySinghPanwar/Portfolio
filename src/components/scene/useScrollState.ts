"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fieldState } from "@/components/scene/fieldState";

/** Where on screen the field state is read from, as a fraction of viewport
 *  height. Above centre, because sections here are shorter than the viewport:
 *  probing at the middle meant the next section was already dominant while the
 *  current one was still being read. */
export const PROBE = 0.4;

/**
 * Maps scroll position onto the latent field's four resting states.
 *
 *   0  sphere    hero and about
 *   1  stream    experience, points flowing through pipeline lanes
 *   2  collapse  work and skills, pushed right and dimmed so cards read
 *   3  core      contact, converged and breathing
 *
 * Expressed as keyframes in absolute document pixels rather than a magic
 * fraction of page height, so adding or resizing a section cannot silently
 * shift where a transition lands.
 */

type Keyframe = { at: number; state: number };

function documentTop(el: Element): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

function buildKeyframes(): Keyframe[] {
  const vh = window.innerHeight;

  const experience = document.querySelector("#experience");
  const work = document.querySelector("#work");
  const skills = document.querySelector("#skills");
  const contact = document.querySelector("#contact");
  if (!experience || !work || !skills || !contact) return [];

  const top = (el: Element) => documentTop(el);
  const bottom = (el: Element) => documentTop(el) + el.getBoundingClientRect().height;
  return [
    // Hold the sphere until the experience section is genuinely arriving.
    // Anchored to section edges rather than a fraction of page height, so a
    // section growing or shrinking cannot slide a transition somewhere else.
    { at: top(experience) - vh * 0.15, state: 0 },
    { at: top(experience) + vh * 0.45, state: 1 },
    // Stay a stream for the whole experience section, however tall it gets
    // once the pinned timeline stretches it.
    { at: bottom(experience) - vh * 0.15, state: 1 },
    { at: top(work) + vh * 0.2, state: 2 },
    // Dimmed all the way through the project rows and the skills matrix.
    { at: bottom(skills), state: 2 },
    { at: top(contact) + vh * 0.35, state: 3 },
  ];
}

function sample(keys: Keyframe[], probe: number): number {
  if (keys.length === 0) return 0;
  if (probe <= keys[0].at) return keys[0].state;

  for (let i = 1; i < keys.length; i++) {
    const prev = keys[i - 1];
    const next = keys[i];
    if (probe > next.at) continue;

    const span = next.at - prev.at;
    if (span <= 0) return next.state;

    const t = (probe - prev.at) / span;
    return prev.state + (next.state - prev.state) * t;
  }

  return keys[keys.length - 1].state;
}

export function useScrollState(reducedMotion: boolean) {
  useEffect(() => {
    // The field renders one static frame under reduced motion, so there is
    // nothing for scroll to drive.
    if (reducedMotion) return;

    let keys = buildKeyframes();

    const update = () => {
      const scroll = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      fieldState.progress = max > 0 ? Math.min(scroll / max, 1) : 0;
      fieldState.targetState = sample(keys, scroll + window.innerHeight * PROBE);
    };

    const refresh = () => {
      keys = buildKeyframes();
      update();
    };

    // ScrollTrigger already recomputes on resize, font load and DOM change;
    // piggybacking on its refresh keeps one source of truth for measurement.
    ScrollTrigger.addEventListener("refresh", refresh);
    window.addEventListener("scroll", update, { passive: true });
    refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", refresh);
      window.removeEventListener("scroll", update);
    };
  }, [reducedMotion]);
}

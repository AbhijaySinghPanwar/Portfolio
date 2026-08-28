"use client";

import { useEffect, useState } from "react";
import { PROBE } from "@/components/scene/useScrollState";

/**
 * Which section the reader is currently in.
 *
 * Reads the same probe line as the latent field's state machine, so the active
 * nav pill and the field can never disagree about where on the page you are.
 * Returns the last section whose top has passed the probe.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const sectionIds = key.split(",");

    const update = () => {
      const probe = window.scrollY + window.innerHeight * PROBE;
      let current: string | null = null;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (probe >= el.getBoundingClientRect().top + window.scrollY) {
          current = id;
        }
      }

      // React bails out when the value is unchanged, so this is safe to call
      // on every scroll event.
      setActive(current);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [key]);

  return active;
}

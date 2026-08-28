"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query. The server snapshot is always false, so anything that
 * depends on this must render sensibly in the "no match" state first.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

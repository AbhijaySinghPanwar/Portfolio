"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

/**
 * The theme lives on the root element, not in React state, because it has to
 * be set before first paint by the inline script in the document head.
 * Everything else reads it from there.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function read(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function useTheme(): Theme {
  // Server snapshot is dark: the site is dark by default, so the markup
  // rendered on the server is already correct for it.
  return useSyncExternalStore(subscribe, read, () => "dark" as Theme);
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode, or storage disabled. The choice just will not persist.
  }
}

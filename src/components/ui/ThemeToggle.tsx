"use client";

import { setTheme, useTheme } from "@/lib/useTheme";

export default function ThemeToggle({ compact }: { compact?: boolean }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className={`mono hover:text-bone flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2.5 transition-colors duration-300`}
    >
      <span className="theme-swatch" aria-hidden="true" />
      {/* Label only where there is room; the swatch carries it otherwise. */}
      <span className={compact ? "visually-hidden" : "hidden lg:inline"}>
        {next}
      </span>
    </button>
  );
}

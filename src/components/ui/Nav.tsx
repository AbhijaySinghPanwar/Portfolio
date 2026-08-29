"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { useActiveSection } from "@/lib/useActiveSection";
import { useMediaQuery } from "@/lib/useMediaQuery";
import ThemeToggle from "@/components/ui/ThemeToggle";

/** Order follows page order. The nav is a table of contents, not a menu. */
const items = [
  { label: "about", href: "#about", id: "about" },
  { label: "internship", href: "#experience", id: "experience" },
  { label: "projects", href: "#work", id: "work" },
  { label: "contact", href: "#contact", id: "contact" },
];

const sectionIds = items.map((item) => item.id);

function NavLink({
  item,
  active,
  compact,
  onNavigate,
}: {
  item: (typeof items)[number];
  active: boolean;
  /** Panel links need a 44px tap target; pill links are already that tall. */
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "true" : undefined}
      className={`mono rounded-[var(--radius-pill)] px-4 py-2.5 transition-colors duration-300 ${
        compact ? "flex min-h-11 items-center" : "block"
      } ${active ? "text-bone bg-iodine/12" : "hover:text-bone"}`}
    >
      {item.label}
    </a>
  );
}

export default function Nav() {
  const active = useActiveSection(sectionIds);
  // Five pills do not fit alongside the wordmark at phone widths.
  const compact = useMediaQuery("(max-width: 767px)");
  const [open, setOpen] = useState(false);

  // Collapsing back to the wide layout must not leave a stale open panel.
  useEffect(() => {
    if (!compact) setOpen(false);
  }, [compact]);

  const activeLabel = items.find((item) => item.id === active)?.label;

  return (
    <header className="fixed top-0 right-0 left-0 z-50" data-reveal="nav">
      <span className="nav-scrim" aria-hidden="true" />
      <nav
        aria-label="Primary"
        className="shell flex items-center justify-between py-6"
      >
        <a
          href="#hero"
          className="nav-logo hover:text-iodine transition-colors duration-300"
          aria-label="Abhijay Singh Panwar, back to top"
        >
          A
          <span aria-hidden="true" className="nav-logo-dot" />
        </a>

        {compact ? (
          <div className="relative">
            <div className="border-hairline bg-graphite/60 flex items-center gap-1 rounded-[var(--radius-pill)] border p-1 backdrop-blur-[12px]">
              <ThemeToggle compact />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="nav-index"
                className={`mono min-h-11 rounded-[var(--radius-pill)] px-4 py-2.5 transition-colors duration-300 ${
                  open ? "text-bone bg-iodine/12" : "hover:text-bone"
                }`}
              >
                {activeLabel ?? "index"}
              </button>
              <a
                href={site.resume}
                download
                className="mono text-bone border-hairline hover:border-iodine flex min-h-11 items-center rounded-[var(--radius-pill)] border px-4 py-2.5 transition-colors duration-300"
              >
                résumé
              </a>
            </div>

            <ul
              id="nav-index"
              hidden={!open}
              className="border-hairline bg-graphite/80 absolute top-full right-0 mt-2 flex w-44 flex-col gap-1 rounded-[var(--radius-xs)] border p-2 backdrop-blur-[12px]"
            >
              {items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    active={active === item.id}
                    compact
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="border-hairline bg-graphite/60 flex items-center rounded-[var(--radius-pill)] border p-1 backdrop-blur-[12px]">
              <ThemeToggle />
            </div>
            <ul className="border-hairline bg-graphite/60 flex items-center gap-1 rounded-[var(--radius-pill)] border p-1 backdrop-blur-[12px]">
              {items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} active={active === item.id} />
                </li>
              ))}
              <li>
                <a
                  href={site.resume}
                  download
                  className="mono text-bone border-hairline hover:border-iodine block rounded-[var(--radius-pill)] border px-4 py-2.5 transition-colors duration-300"
                >
                  résumé
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

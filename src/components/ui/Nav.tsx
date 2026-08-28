"use client";

import { site } from "@/data/site";

const items = [
  { label: "work", href: "#work" },
  { label: "about", href: "#about" },
  { label: "contact", href: "#contact" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50" data-reveal="nav">
      <nav
        aria-label="Primary"
        className="shell flex items-center justify-between py-6"
      >
        <a
          href="#hero"
          className="mono mono-500 text-bone hover:text-iodine transition-colors duration-300"
          aria-label="Abhijay Singh Panwar, back to top"
        >
          A<span className="text-ember">•</span>
        </a>

        <ul className="border-hairline bg-graphite/60 flex items-center gap-1 rounded-[var(--radius-pill)] border p-1 backdrop-blur-[12px]">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="mono hover:text-bone block rounded-[var(--radius-pill)] px-4 py-2.5 transition-colors duration-300"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.resume}
              className="mono text-bone border-hairline hover:border-iodine block rounded-[var(--radius-pill)] border px-4 py-2.5 transition-colors duration-300"
              download
            >
              résumé
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

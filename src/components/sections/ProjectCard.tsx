"use client";

import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const accent = project.accent === "ember" ? "var(--ember)" : "var(--iodine)";

  return (
    <article
      data-project={project.id}
      className="group border-hairline scroll-mt-32 border-t py-16 md:min-h-[60vh]"
      style={{ ["--accent" as string]: accent }}
    >
      {/* Same indent as the section eyebrows: a row index scrolling past the
          fixed wordmark collides with it otherwise. */}
      <p data-eyebrow className="mono mono-500 pl-12 md:pl-16">
        <span className="text-bone">04</span>
        <span className="px-2 opacity-40">/</span>
        <span className="text-bone">{project.index}</span>
      </p>

      <header className="mt-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <h3 className="serif-title">{project.name}</h3>
        {project.live && (
          <p className="mono text-ember flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-2">
              Live
              <span
                aria-hidden="true"
                className="bg-ember inline-block h-1.5 w-1.5 rounded-[var(--radius-pill)]"
              />
            </span>
            {/* Qualifiers on the badge, not warnings. Plain HTTP and free-tier
                sleep are both things worth knowing before clicking through. */}
            {project.insecure && <span className="text-muted">HTTP</span>}
            {project.coldStart && (
              <span className="text-muted">{project.coldStart}</span>
            )}
          </p>
        )}
      </header>

      <p className="serif-sub mt-5">{project.tagline}</p>

      <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-8">
        <p className="prose-body text-muted md:col-span-7">{project.body}</p>

        <ul className="chip-list content-start md:col-span-4 md:col-start-9">
          {project.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        {project.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mono text-bone hover:text-[var(--accent)] transition-colors duration-300"
            >
              → {link.label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}

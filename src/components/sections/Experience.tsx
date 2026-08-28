import SectionIndex from "@/components/ui/SectionIndex";
import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <section id="experience" className="above-field shell scroll-mt-32">
      <SectionIndex index="03" label="Experience" />

      {experience.map((role) => (
        <article key={role.company} className="mt-16">
          <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 className="font-display text-bone text-[length:var(--text-title)]">
              {role.company}
            </h2>
            <p className="mono">{role.period}</p>
          </header>
          <p className="mono mt-3">{role.title}</p>

          {/* P2 turns this rail into a pinned horizontal scrub. Vertical stack
              is the mobile layout and the reduced-motion layout. */}
          <ol className="border-hairline mt-16 grid gap-px border-t md:grid-cols-4">
            {role.beats.map((beat, i) => (
              <li
                key={beat.id}
                data-beat={i}
                className="border-hairline border-b pt-8 pb-10 md:border-r md:border-b-0 md:pr-8 md:pl-8 md:first:pl-0 md:last:border-r-0"
              >
                <p className="mono mono-500 text-iodine">
                  {String(i + 1).padStart(2, "0")} · {beat.label}
                </p>
                <h3 className="text-bone mt-4 text-[length:var(--text-lead)] leading-tight">
                  {beat.title}
                </h3>
                <p className="prose-body text-muted mt-4 text-[length:var(--text-small)]">
                  {beat.body}
                </p>
                <p className="mono text-ember mt-6">{beat.metric}</p>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </section>
  );
}

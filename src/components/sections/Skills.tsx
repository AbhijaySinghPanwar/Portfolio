import SectionIndex from "@/components/ui/SectionIndex";
import { skills } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="above-field shell scroll-mt-32">
      <SectionIndex index="05" label="Toolset" />

      <p className="mono mt-6 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="bg-ember inline-block h-1 w-1 rounded-[var(--radius-pill)]"
        />
        marks something used in a project above
      </p>

      <div className="mt-16 flex flex-col gap-12">
        {skills.map((group) => (
          <div
            key={group.label}
            className="border-hairline grid gap-6 border-t pt-6 md:grid-cols-12 md:gap-8"
          >
            <h3 className="mono mono-500 text-bone md:col-span-3">
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-2 md:col-span-9">
              {group.items.map((skill) => (
                <li
                  key={skill.name}
                  className="mono border-hairline hover:border-iodine flex items-center gap-2 rounded-[var(--radius-xs)] border px-3 py-2 transition-colors duration-300"
                >
                  {skill.evidenced && (
                    <span
                      aria-hidden="true"
                      className="bg-ember inline-block h-1 w-1 shrink-0 rounded-[var(--radius-pill)]"
                    />
                  )}
                  {skill.name}
                  {skill.evidenced && (
                    <span className="visually-hidden">, used in shipped work</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

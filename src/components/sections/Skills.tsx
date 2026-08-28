import SectionIndex from "@/components/ui/SectionIndex";
import { skills, type Skill } from "@/data/skills";

function Chip({ skill }: { skill: Skill }) {
  return (
    <li className="mono border-hairline hover:border-iodine flex items-center gap-2 rounded-[var(--radius-xs)] border px-3 py-2 whitespace-nowrap transition-colors duration-300">
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
  );
}

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
        {skills.map((group, i) => (
          <div
            key={group.label}
            className="border-hairline grid gap-6 border-t pt-6 md:grid-cols-12 md:gap-8"
          >
            {/* Label stays put in the gutter, outside the moving track. */}
            <h3 className="mono mono-500 text-bone md:col-span-3">
              {group.label}
            </h3>

            <div
              className="marquee md:col-span-9"
              data-dir={i % 2 === 0 ? "left" : "right"}
            >
              <div className="marquee-inner">
                <ul className="marquee-track">
                  {group.items.map((skill) => (
                    <Chip key={skill.name} skill={skill} />
                  ))}
                </ul>
                {/* Second copy is what makes the loop seamless. Hidden from
                    assistive tech so the list is not read out twice. */}
                <ul className="marquee-track" data-clone="true" aria-hidden="true">
                  {group.items.map((skill) => (
                    <Chip key={skill.name} skill={skill} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

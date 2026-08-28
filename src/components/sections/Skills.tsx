import SectionIndex from "@/components/ui/SectionIndex";
import { skills, type Skill } from "@/data/skills";

function SkillItem({ skill }: { skill: Skill }) {
  return (
    <li className="token-item">
      <span className="token-name" data-evidenced={skill.evidenced}>
        {skill.name}
      </span>
      {skill.evidenced && (
        <span className="visually-hidden">, used in shipped work</span>
      )}
      {/* Separator, not a marker. Keeps the sequence continuous across the
          loop seam, where the last name meets the first again. */}
      <span className="token-dot" aria-hidden="true" />
    </li>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="above-field shell scroll-mt-32">
      <SectionIndex index="05" label="Toolset" />

      <p className="mono mt-6">
        Brighter names are used in a project above
      </p>

      <div className="mt-16 flex flex-col gap-10">
        {skills.map((group, i) => (
          <div
            key={group.label}
            className="border-hairline grid gap-4 border-t pt-6 md:grid-cols-12 md:gap-8"
          >
            {/* Label stays put in the gutter, outside the moving track. */}
            <h3 className="mono mono-500 text-bone md:col-span-2 md:pt-3">
              {group.label}
            </h3>

            <div
              className="marquee md:col-span-10"
              data-dir={i % 2 === 0 ? "left" : "right"}
            >
              <div className="marquee-inner">
                <ul className="marquee-track">
                  {group.items.map((skill) => (
                    <SkillItem key={skill.name} skill={skill} />
                  ))}
                </ul>
                {/* Second copy is what makes the loop seamless. Hidden from
                    assistive tech so the list is not read out twice. */}
                <ul className="marquee-track" data-clone="true" aria-hidden="true">
                  {group.items.map((skill) => (
                    <SkillItem key={skill.name} skill={skill} />
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

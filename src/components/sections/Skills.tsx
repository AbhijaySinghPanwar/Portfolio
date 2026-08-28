import SectionIndex from "@/components/ui/SectionIndex";
import { skills, type Skill } from "@/data/skills";

/**
 * Chips per half-track. Short groups repeat more times, so that one half is
 * always wider than the widest viewport and the loop seam can never be on
 * screen at the same time as its own copy.
 */
const MIN_CHIPS_PER_TRACK = 18;

function Chip({ skill }: { skill: Skill }) {
  return (
    <li className="chip">
      {skill.evidenced && <span className="chip-dot" aria-hidden="true" />}
      {skill.name}
      {skill.evidenced && (
        <span className="visually-hidden">, used in shipped work</span>
      )}
    </li>
  );
}

function Track({ items, clone }: { items: Skill[]; clone?: boolean }) {
  return (
    <ul
      className="marquee-track"
      data-clone={clone ? "true" : undefined}
      aria-hidden={clone ? "true" : undefined}
    >
      {items.map((skill, i) => (
        <Chip key={`${skill.name}-${i}`} skill={skill} />
      ))}
    </ul>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="above-field shell scroll-mt-32">
      <SectionIndex index="05" label="Toolset" />

      <p className="mono mt-6 flex items-center gap-2">
        <span aria-hidden="true" className="chip-dot" />
        marks something used in a project above
      </p>

      <div className="mt-16 flex flex-col gap-8">
        {skills.map((group, i) => {
          const repeats = Math.max(
            1,
            Math.ceil(MIN_CHIPS_PER_TRACK / group.items.length),
          );
          const track = Array.from({ length: repeats }, () => group.items).flat();

          return (
            <div
              key={group.label}
              className="border-hairline flex flex-col gap-4 border-t pt-6 md:flex-row md:items-center md:gap-8"
            >
              {/* Fixed lane. The moving track never enters it, so the first
                  chip cannot collide with the label at any width. */}
              <h3 className="mono mono-500 text-bone md:w-[140px] md:shrink-0">
                {group.label}
              </h3>

              <div
                className="marquee md:min-w-0 md:flex-1"
                data-dir={i % 2 === 0 ? "left" : "right"}
              >
                <div className="marquee-inner">
                  <Track items={track} />
                  <Track items={track} clone />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

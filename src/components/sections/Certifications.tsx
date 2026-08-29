import { certifications } from "@/data/skills";

/**
 * Sits between the toolset and contact, without a section index. These are
 * credentials rather than a chapter of the page, so they get a label and a
 * rule instead of a number.
 */
export default function Certifications() {
  return (
    <section
      id="certifications"
      aria-label="Certifications"
      className="above-field shell scroll-mt-32"
    >
      <div className="border-hairline border-t pt-6">
        <p className="mono mono-500 text-bone">Certifications</p>

        <ul className="scrim mt-6 flex flex-col">
          {certifications.map((cert) => (
            <li
              key={cert.name}
              className="border-hairline flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-4 first:border-t"
            >
              <span className="serif-value">{cert.name}</span>
              <span className="mono">
                {cert.issuer} · {cert.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

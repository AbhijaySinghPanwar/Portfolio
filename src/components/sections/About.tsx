import SectionIndex from "@/components/ui/SectionIndex";
import { site } from "@/data/site";

export default function About() {
  return (
    <section id="about" className="above-field shell scroll-mt-32">
      <SectionIndex index="02" label="Background" />

      <div className="mt-16 grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p className="prose-body text-bone">{site.bio}</p>
        </div>

        <dl className="md:col-span-4 md:col-start-9">
          {site.spec.map((row) => (
            <div
              key={row.key}
              className="border-hairline flex items-baseline justify-between gap-6 border-b py-3 first:border-t"
            >
              <dt className="mono">{row.key}</dt>
              <dd className="mono text-bone text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

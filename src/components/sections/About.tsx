import Image from "next/image";
import SectionIndex from "@/components/ui/SectionIndex";
import { site } from "@/data/site";

export default function About() {
  return (
    <section id="about" className="above-field shell scroll-mt-32">
      <SectionIndex index="02" label="Background" />

      <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-8">
        <figure className="portrait reveal-up md:col-span-4" data-reveal-on-scroll>
          <Image
            src="/portrait.jpg"
            alt={site.name}
            width={1040}
            height={1300}
            priority={false}
          />
        </figure>

        <div className="flex flex-col gap-12 md:col-span-7 md:col-start-6">
          <p className="prose-body text-bone">{site.bio}</p>

          <dl>
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
      </div>
    </section>
  );
}

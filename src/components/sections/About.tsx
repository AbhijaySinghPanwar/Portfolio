import Image from "next/image";
import SectionIndex from "@/components/ui/SectionIndex";
import { site } from "@/data/site";

export default function About() {
  return (
    <section id="about" data-veil="1" className="above-field shell scroll-mt-32">
      <SectionIndex index="02" label="Background" />

      {/* Explicit 38% track rather than a 12-column span, so the portrait's
          share of the content width is stated rather than approximated. */}
      <div className="mt-16 grid gap-12 md:grid-cols-[38%_1fr] md:gap-16">
        <figure className="portrait reveal-up" data-reveal-on-scroll>
          <Image
            src="/portrait.jpg"
            alt={site.name}
            width={828}
            height={867}
            priority={false}
          />
          <span className="portrait-grain" aria-hidden="true" />
        </figure>

        <div className="flex flex-col gap-12">
          <p className="prose-body scrim">{site.bio}</p>

          <dl className="scrim">
            {site.spec.map((row) => (
              <div
                key={row.key}
                className="border-hairline flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-5 first:border-t"
              >
                <dt className="mono">{row.key}</dt>
                <dd className="serif-value text-right">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

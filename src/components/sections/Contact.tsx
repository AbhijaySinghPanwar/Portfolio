import SectionIndex from "@/components/ui/SectionIndex";
import { site } from "@/data/site";

const year = new Date().getFullYear();

export default function Contact() {
  const channels = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    {
      label: "Phone",
      value: site.phone,
      href: `tel:${site.phone.replace(/\s/g, "")}`,
    },
    { label: "GitHub", value: "AbhijaySinghPanwar", href: site.github },
    { label: "LinkedIn", value: "abhijay-singh-panwar", href: site.linkedin },
    { label: "Résumé", value: "Download PDF", href: site.resume },
  ];

  return (
    <section id="contact" className="above-field shell scroll-mt-32">
      <SectionIndex index="06" label="Contact" />

      <a
        href={`mailto:${site.email}`}
        data-magnetic=""
        className="serif-title mt-16 block break-words"
      >
        Say hello
      </a>

      <ul className="scrim mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <li key={channel.label} className="border-hairline border-t pt-4">
            <p className="mono">{channel.label}</p>
            <a
              href={channel.href}
              className="serif-value hover:text-ember mt-2 block break-words transition-colors duration-300"
            >
              {channel.value}
            </a>
          </li>
        ))}
      </ul>

      <footer className="border-hairline mt-24 flex flex-wrap items-baseline justify-between gap-4 border-t py-8">
        <p className="mono">
          Built with Next.js, Three.js and GSAP · {year}
        </p>
        <p className="mono">{site.name}</p>
      </footer>
    </section>
  );
}

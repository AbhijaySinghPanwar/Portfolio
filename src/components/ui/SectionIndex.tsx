type Props = {
  index: string;
  label: string;
};

/**
 * The "01 / INDEX" mono eyebrow that opens every section.
 *
 * Indented clear of the wordmark. The nav is fixed, so as a section scrolls up
 * its eyebrow passes straight through the "A" in the top-left corner. The
 * indent is the wordmark's own width plus its gutter, at each breakpoint.
 */
export default function SectionIndex({ index, label }: Props) {
  return (
    <p data-eyebrow className="mono mono-500 pl-12 md:pl-24">
      <span className="text-bone">{index}</span>
      <span className="px-2 opacity-40">/</span>
      <span>{label}</span>
    </p>
  );
}

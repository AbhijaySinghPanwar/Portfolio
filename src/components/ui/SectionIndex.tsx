type Props = {
  index: string;
  label: string;
};

/** The "01 / INDEX" mono eyebrow that opens every section. */
export default function SectionIndex({ index, label }: Props) {
  return (
    <p className="mono mono-500">
      <span className="text-bone">{index}</span>
      <span className="px-2 opacity-40">/</span>
      <span>{label}</span>
    </p>
  );
}

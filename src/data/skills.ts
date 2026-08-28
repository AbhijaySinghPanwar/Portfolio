import { projects, type Project } from "@/data/projects";
import { experience } from "@/data/experience";

/**
 * The matrix is authored as plain names. Which chips earn an ember dot is
 * derived from the project and experience data below, so there is exactly one
 * place where "used in real work" is recorded and it cannot drift.
 */
const GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["Python", "C++", "JavaScript", "TypeScript", "SQL", "HTML/CSS"],
  },
  {
    label: "Frameworks",
    items: ["FastAPI", "Node.js", "Express.js", "React", "Gradio", "Bootstrap"],
  },
  {
    label: "AI / ML",
    items: [
      "Gemini API",
      "Groq",
      "Sentence-Transformers",
      "CLIP",
      "BLIP-2",
      "Whisper",
      "ONNX Runtime",
      "Hugging Face",
    ],
  },
  {
    label: "Data Engineering",
    items: ["Apache Spark", "Databricks", "Pandas", "Power BI"],
  },
  {
    label: "Databases",
    items: [
      "PostgreSQL (RDS)",
      "MongoDB",
      "Qdrant",
      "KùzuDB",
      "MySQL",
      "SQLite",
      "Prisma",
    ],
  },
  {
    label: "Developer Tools",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "Nginx",
      "AWS EC2",
      "AWS SSM Parameter Store",
      "Vercel",
      "Hugging Face Spaces",
    ],
  },
];

/**
 * Suffixes that carry no meaning when comparing a chip to a stack entry.
 * Dropping them is what lets "Express.js" match "Express" and "Gemini API"
 * match "Gemini" without a hand-written alias table.
 */
const NOISE = new Set(["js", "api"]);

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[.\-_/()]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0 && !NOISE.has(token));
}

/** A deployment host is evidence of the platform, same as a stack entry. */
function platformsFromLinks(project: Project): string[] {
  const found: string[] = [];

  for (const link of project.links) {
    let host: string;
    try {
      host = new URL(link.href).hostname;
    } catch {
      continue;
    }

    if (host.endsWith("github.com")) found.push("Git", "GitHub");
    else if (host.endsWith("vercel.app")) found.push("Vercel");
    else if (host.endsWith("huggingface.co"))
      found.push("Hugging Face", "Hugging Face Spaces");
    else if (host.endsWith("onrender.com")) found.push("Render");
  }

  return found;
}

const CORPUS: string[][] = [
  ...projects.flatMap((p) => [...p.stack, ...platformsFromLinks(p)]),
  ...experience.flatMap((role) => role.stack),
]
  .map(tokenize)
  .filter((tokens) => tokens.length > 0);

/**
 * Evidenced when the chip and a corpus entry describe the same thing: one
 * token set contains the other. Subset rather than substring, so "MySQL" does
 * not match "SQL".
 */
function isEvidenced(name: string): boolean {
  const chip = tokenize(name);
  if (chip.length === 0) return false;

  return CORPUS.some(
    (entry) =>
      chip.every((token) => entry.includes(token)) ||
      entry.every((token) => chip.includes(token)),
  );
}

export type Skill = {
  name: string;
  /** True when this appears in a project stack or the experience entry. */
  evidenced: boolean;
};

export type SkillGroup = {
  label: string;
  items: Skill[];
};

export const skills: SkillGroup[] = GROUPS.map((group) => ({
  label: group.label,
  items: group.items.map((name) => ({ name, evidenced: isEvidenced(name) })),
}));

export type Certification = {
  name: string;
  issuer: string;
  date: string;
};

export const certifications: Certification[] = [
  { name: "100 Days of Python", issuer: "Udemy", date: "Jul 2026" },
  { name: "Full-Stack Web Development Bootcamp", issuer: "Udemy", date: "May 2026" },
  { name: "Generative AI with watsonx", issuer: "IBM", date: "Jun 2025" },
  { name: "C++ DSA", issuer: "PW Skills", date: "Jun 2024" },
];

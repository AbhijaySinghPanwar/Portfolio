export type Skill = {
  name: string;
  /** Project ids where this is actually used. Non-empty earns an ember dot. */
  evidence: string[];
};

export type SkillGroup = {
  label: string;
  items: Skill[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "Python", evidence: ["smritikosh", "resumeai", "connect4"] },
      { name: "TypeScript", evidence: ["healthcare"] },
      { name: "JavaScript", evidence: ["healthcare", "skillswap"] },
      { name: "SQL", evidence: ["resumeai", "healthcare"] },
      { name: "C++", evidence: [] },
    ],
  },
  {
    label: "Frameworks",
    items: [
      { name: "React", evidence: ["smritikosh", "healthcare"] },
      { name: "FastAPI", evidence: ["smritikosh", "resumeai"] },
      { name: "Node.js", evidence: ["healthcare", "skillswap"] },
      { name: "Express", evidence: ["healthcare", "skillswap"] },
      { name: "Gradio", evidence: ["connect4"] },
      { name: "Bootstrap", evidence: ["skillswap"] },
    ],
  },
  {
    label: "AI / ML",
    items: [
      { name: "CLIP", evidence: ["smritikosh"] },
      { name: "BLIP-2", evidence: ["smritikosh"] },
      { name: "Whisper", evidence: ["smritikosh"] },
      { name: "sentence-transformers", evidence: ["resumeai"] },
      { name: "ONNX Runtime", evidence: ["resumeai"] },
      { name: "Gemini API", evidence: ["resumeai", "connect4"] },
      { name: "OpenAI API", evidence: ["connect4"] },
      { name: "Groq", evidence: ["healthcare", "connect4"] },
    ],
  },
  {
    label: "Data Engineering",
    items: [
      { name: "Apache Spark", evidence: [] },
      { name: "ETL Pipelines", evidence: ["smritikosh"] },
      { name: "Schema Validation", evidence: ["smritikosh"] },
      { name: "Pandas", evidence: ["resumeai"] },
      { name: "Power BI", evidence: [] },
    ],
  },
  {
    label: "Databases",
    items: [
      { name: "PostgreSQL", evidence: ["resumeai", "healthcare"] },
      { name: "MongoDB", evidence: ["connect4", "skillswap"] },
      { name: "Qdrant", evidence: ["smritikosh"] },
      { name: "KùzuDB", evidence: ["smritikosh"] },
      { name: "SQLite", evidence: ["connect4"] },
      { name: "Prisma", evidence: ["healthcare"] },
      { name: "SQLAlchemy", evidence: ["resumeai"] },
      { name: "Alembic", evidence: ["resumeai"] },
    ],
  },
  {
    label: "Developer Tools",
    items: [
      { name: "Git", evidence: [] },
      { name: "Docker", evidence: ["resumeai"] },
      { name: "AWS EC2", evidence: ["resumeai"] },
      { name: "AWS RDS", evidence: ["resumeai"] },
      { name: "SSM Parameter Store", evidence: ["resumeai"] },
      { name: "Nginx", evidence: ["resumeai"] },
      { name: "Hugging Face Spaces", evidence: ["connect4"] },
      { name: "Vercel", evidence: ["healthcare"] },
    ],
  },
];

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

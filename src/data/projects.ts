export type Accent = "iodine" | "ember";

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  /** Two or three lines, plain language. No marketing voice. */
  body: string;
  stack: string[];
  links: ProjectLink[];
  accent: Accent;
  /** Shown as a [LIVE] badge when the thing is deployed and reachable. */
  live: boolean;
  /** Served over plain HTTP. Qualifies the live badge rather than hiding it. */
  insecure?: boolean;
  /** Free-tier host that sleeps when idle. Sets the visitor's expectation. */
  coldStart?: string;
};

export const projects: Project[] = [
  {
    id: "smritikosh",
    index: "01",
    name: "Smritikosh",
    tagline: "Multimodal personal memory retrieval",
    body: "Ingests a personal photo, video, audio and document archive, then answers natural-language questions about it. A seven-phase pipeline handles multimodal extraction, episode segmentation, a memory graph, tiered scheduling with query-triggered deepening, entity resolution with correction propagation, and privacy-tiered routing. Validated end to end against a real archive of roughly 500 items.",
    stack: ["Python", "CLIP", "BLIP-2", "Whisper", "Qdrant", "KùzuDB", "FastAPI", "React"],
    links: [
      { label: "GitHub", href: "https://github.com/AbhijaySinghPanwar/Smritikosh" },
    ],
    accent: "iodine",
    live: false,
  },
  {
    id: "resumeai",
    index: "02",
    name: "ResumeAI",
    tagline: "ATS resume analysis platform",
    body: "Semantic resume-to-job matching across ten-plus job categories, with parsing, ATS scoring, skill-gap analysis, AI rewriting and interview prep. Validated on sixty-plus real resumes. Moving inference to ONNX Runtime cut latency by about forty percent. Runs on EC2 behind Nginx with RDS Postgres, secrets in SSM Parameter Store and migrations through Alembic.",
    stack: [
      "FastAPI",
      "Docker",
      "AWS EC2",
      "RDS PostgreSQL",
      "AWS SSM Parameter Store",
      "Nginx",
      "SQLAlchemy",
      "Alembic",
      "ONNX Runtime",
      "sentence-transformers",
      "Gemini API",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/AbhijaySinghPanwar/resumeAI" },
      { label: "Live", href: "http://32.236.237.82/" },
    ],
    accent: "ember",
    live: true,
    insecure: true,
  },
  {
    id: "healthcare",
    index: "03",
    name: "Healthcare Manager",
    tagline: "Booking system that refuses to double-book",
    body: "Overlapping bookings are impossible at the database level: a Postgres GiST exclusion constraint rejects them before application code ever runs. A hold-then-confirm state machine moves a slot from HELD to CONFIRMED or EXPIRED on a five-minute TTL, with SHA-256 idempotency keys and SELECT FOR UPDATE SKIP LOCKED handling concurrent claims. Groq handles symptom triage, calendar events use deterministic IDs, and node-cron sends reminders.",
    stack: [
      "Node.js",
      "Express",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "React",
      "JWT",
      "Groq",
      "Google Calendar OAuth 2.0",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/AbhijaySinghPanwar/Healthcare-Appointment" },
      { label: "Live", href: "https://healthcare-appointment-zeta.vercel.app" },
    ],
    accent: "ember",
    live: true,
  },
  {
    id: "connect4",
    index: "04",
    name: "Connect-4 LLM Arena",
    tagline: "Language models playing each other, out loud",
    body: "Four-plus models compete head to head while streaming their reasoning as they play. ELO ratings, a live leaderboard and match history across a hundred-plus games. A separate benchmark engine scores play against alpha-beta minimax and emits HTML reports, cutting manual model comparison time roughly in half.",
    stack: [
      "Python",
      "Gradio",
      "OpenAI",
      "Gemini",
      "Groq",
      "MongoDB",
      "SQLite",
      "Hugging Face Spaces",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/AbhijaySinghPanwar/Connect-4" },
      {
        label: "HF Space",
        href: "https://huggingface.co/spaces/Abhijay18/connect4-llm-arena",
      },
    ],
    accent: "ember",
    live: true,
    coldStart: "~30s cold start",
  },
  {
    id: "skillswap",
    index: "05",
    name: "SkillSwap",
    tagline: "Peer-to-peer skill exchange",
    body: "Full-stack matching platform with profiles, automated skill matching across fifty-plus test users, real-time chat and exchange-request workflows. Auth is JWT and bcrypt with Google OAuth 2.0 across protected routes.",
    stack: [
      "Node.js",
      "Express",
      "JavaScript",
      "HTML/CSS",
      "MongoDB",
      "JWT",
      "Google OAuth 2.0",
      "Bootstrap",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/AbhijaySinghPanwar/skillswap" },
      { label: "Live", href: "https://skillswap-b68k.onrender.com/" },
    ],
    accent: "iodine",
    live: true,
    coldStart: "~50s cold start",
  },
];

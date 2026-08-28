export const site = {
  name: "Abhijay Singh Panwar",
  role: "B.Tech IT · VIT Vellore · 2027",
  location: "Indore, IN",
  cgpa: "8.77",
  classXII: "93.6%",
  email: "abhijaypanwar7@gmail.com",
  phone: "TODO: fill phone",
  github: "https://github.com/AbhijaySinghPanwar",
  linkedin: "TODO: fill LinkedIn URL",
  resume: "/Abhijay_Singh_Panwar_Resume.pdf",
  bio: "Final-year IT student at VIT Vellore. I work on retrieval systems and data pipelines, the unglamorous middle layer where embeddings, schemas and inference latency decide whether a product actually works. Most of what is below is deployed and takes real traffic.",
  spec: [
    { key: "Education", value: "B.Tech Information Technology" },
    { key: "Institution", value: "VIT Vellore" },
    { key: "Graduating", value: "2027" },
    { key: "CGPA", value: "8.77" },
    { key: "Class XII", value: "93.6%" },
    { key: "Location", value: "Indore, India" },
    { key: "Focus", value: "Retrieval · Pipelines · Inference" },
  ],
} as const;

export const sections = [
  { id: "hero", index: "01", label: "Index" },
  { id: "about", index: "02", label: "Background" },
  { id: "experience", index: "03", label: "Experience" },
  { id: "work", index: "04", label: "Selected Work" },
  { id: "skills", index: "05", label: "Toolset" },
  { id: "contact", index: "06", label: "Contact" },
] as const;

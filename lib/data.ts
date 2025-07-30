import { PersonalInfo, ProjectData } from "@/types/data.types";

export const personalInfo: PersonalInfo = {
  name: "Salmoon",
  title: "Full Stack Developer",
  email: "salmanalfarisi261002@gmail.com",
  github: "https://github.com/msafdev",
  linkedin: "https://linkedin.com/in/msafdev",
  location: "Jakarta, Indonesia",
  bio: "Passionate developer with expertise in modern web technologies. I love creating elegant solutions to complex problems and building user-centric applications.",
};

export const projects: ProjectData[] = [
  {
    name: "Kodeify",
    type: ["Portfolio", "Web"],
    github: "https://github.com/yourusername/terminal-portfolio",
  },
  {
    name: "Airestate",
    type: ["SaaS", "PWA"],
    github: "https://github.com/yourusername/task-app",
  },
  {
    name: "Hr Hub",
    type: ["Dashboard", "Web"],
    github: "https://github.com/yourusername/ecommerce",
  },
];

export const skills = {
  languages: ["JavaScript", "TypeScript", "Python", "Go", "SQL"],
  frontend: ["React", "Next.js", "Vue.js", "Tailwind CSS", "HTML5", "CSS3"],
  backend: ["Node.js", "Express", "Fastify", "PostgreSQL", "MongoDB"],
  tools: ["Git", "Docker", "AWS", "Vercel", "Figma", "VS Code"],
};

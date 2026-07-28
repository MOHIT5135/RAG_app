import {
  Globe,
  Palette,
  FileCode2,
  Atom,
  Server,
  Boxes,
  Database,
  Cpu,
  Sparkles,
  Bot,
  BrainCircuit,
  Container,
} from "lucide-react";

export const techStack = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Beautiful and responsive user interfaces.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",

    technologies: [
      {
        name: "HTML5",
        icon: Globe,
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      },
      {
        name: "CSS3",
        icon: Palette,
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      },
      {
        name: "JavaScript",
        icon: FileCode2,
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      },
      {
        name: "React",
        icon: Atom,
        url: "https://react.dev",
      },
    ],
  },

  {
    id: "backend",
    title: "Backend",
    description: "Scalable APIs and server-side architecture.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",

    technologies: [
      {
        name: "Node.js",
        icon: Server,
        url: "https://nodejs.org/docs/latest/api/",
      },
      {
        name: "Express",
        icon: Boxes,
        url: "https://expressjs.com/",
      },
      {
        name: "MongoDB",
        icon: Database,
        url: "https://www.mongodb.com/docs/",
      },
      {
        name: "ChromaDB",
        icon: Cpu,
        url: "https://docs.trychroma.com/",
      },
    ],
  },

  {
    id: "ai",
    title: "AI & RAG",
    description: "Large Language Models and semantic retrieval.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",

    technologies: [
      {
        name: "Gemini",
        icon: Sparkles,
        url: "https://ai.google.dev/",
      },
      {
        name: "OpenAI",
        icon: Bot,
        url: "https://platform.openai.com/docs",
      },
      {
        name: "LangChain",
        icon: BrainCircuit,
        url: "https://js.langchain.com/docs/introduction/",
      },
      {
        name: "LLMs",
        icon: Cpu,
        url: "https://en.wikipedia.org/wiki/Large_language_model",
      },
    ],
  },

  {
    id: "deployment",
    title: "Deployment",
    description: "Production-ready containerized deployment.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",

    technologies: [
      {
        name: "Docker",
        icon: Container,
        url: "https://docs.docker.com/",
      },
    ],
  },
];

export const highlights = [
  {
    title: "Modern Stack",
    value: "12+ Technologies",
  },
  {
    title: "AI Powered",
    value: "Gemini + RAG",
  },
  {
    title: "Vector Search",
    value: "ChromaDB",
  },
  {
    title: "Production Ready",
    value: "Dockerized",
  },
];
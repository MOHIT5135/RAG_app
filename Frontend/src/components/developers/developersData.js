import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import amit from "@/assets/developers/Amit.jpeg";
import mohit from "@/assets/developers/Mohit.jpeg";

export const developers = [
  {
    id: 1,

    name: "Amit Sain",

    role: "Full Stack Developer",

    description:
      "Full Stack & AI Integration developer passionate about building modern SaaS apps with MERN, RAG, LLMs and Generative AI.",

    avatar: amit,

    skills: [
      "React",
      "Node.js",
      "MongoDB",
      "Docker",
      "Gemini",
    ],

    github:
      "https://github.com/amitsain001",

    linkedin:
      "https://www.linkedin.com/in/amit-sain-281a02309/",

    social: [
      {
        icon: FaGithub,
        url: "https://github.com/amitsain001",
      },
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/amit-sain-281a02309/",
      },
    ],
  },

  {
    id: 2,

    name: "Mohit Kumar",

    role: "Backend & AI Developer",

    description:
      "Focused on scalable backend architecture, Retrieval-Augmented Generation, embeddings and vector databases.",

    avatar: mohit,

    skills: [
      "Express",
      "ChromaDB",
      "LangChain",
      "Gemini",
      "RAG"
    ],

    github:
      "https://github.com/MOHIT5135",

    linkedin:
      "https://www.linkedin.com/in/mohit-kumar-774489366/",

    social: [
      {
        icon: FaGithub,
        url: "https://github.com/MOHIT5135",
      },
      {
        icon: FaLinkedin,
        url: "https://www.linkedin.com/in/mohit-kumar-774489366/",
      },
    ],
  },
];
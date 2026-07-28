import UseCaseCard from "./UseCaseCard";

const useCases = [
  {
    icon: "🎓",
    title: "Students",
    description:
      "Turn lecture notes, books and study material into your personal AI tutor.",

    points: [
      "Ask questions from notes",
      "Summarize chapters",
      "Prepare for exams",
      "Instant revision",
    ],

    badge: "AI Tutor",
  },

  {
    icon: "💼",
    title: "Professionals",
    description:
      "Analyze reports, contracts and business documents within seconds.",

    points: [
      "Contract analysis",
      "Meeting reports",
      "Research documents",
      "Quick summaries",
    ],

    badge: "Enterprise",
  },

  {
    icon: "👨‍💻",
    title: "Developers",
    description:
      "Search technical documentation and project knowledge using natural language.",

    points: [
      "API documentation",
      "README search",
      "Codebase knowledge",
      "Technical manuals",
    ],

    badge: "Semantic Search",
  },

  {
    icon: "🏢",
    title: "Businesses",
    description:
      "Build internal AI assistants powered by company knowledge bases.",

    points: [
      "Company policies",
      "Employee handbook",
      "Knowledge base",
      "Internal documentation",
    ],

    badge: "Team AI",
  },
];

export default function UseCases() {
  return (
    <section className="relative py-16">

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="absolute right-0 bottom-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />

      </div>

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-[0.3em] text-violet-500">
            Use Cases
          </p>

          <h2 className="mt-5 text-5xl font-bold leading-tight">
            Built for everyone
            <br />
            working with documents
          </h2>

          <p className="mt-7 text-xl leading-9 text-muted-foreground">
            Whether you're studying, building software or managing business
            documents, RAGify helps you find answers instantly using AI-powered
            semantic search.
          </p>

        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">

          {useCases.map((item) => (
            <UseCaseCard
              key={item.title}
              {...item}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description:
      "Vector similarity search delivers answers within milliseconds.",
  },
  {
    icon: "🤖",
    title: "Gemini AI",
    description:
      "Generate contextual responses powered by Google's Gemini model.",
  },
  {
    icon: "📄",
    title: "Multiple Formats",
    description:
      "Upload PDF, DOCX, TXT & PPT documents with ease.",
  },
  {
    icon: "🧠",
    title: "Smart Retrieval",
    description:
      "Retrieval-Augmented Generation ensures accurate and grounded answers.",
  },
  {
    icon: "🔒",
    title: "Secure Storage",
    description:
      "Documents are stored safely with persistent ChromaDB vector storage.",
  },
  {
    icon: "🚀",
    title: "Scalable",
    description:
      "Built with React, Node.js, Docker and ChromaDB for production use.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-14">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-violet-500 font-semibold">

            FEATURES

          </p>

          <h2 className="mt-4 text-4xl font-bold">

            Everything you need to build
            AI document assistants

          </h2>

          <p className="mt-5 text-lg text-muted-foreground">

            Built with modern AI technologies including
            Gemini AI, ChromaDB and Retrieval-Augmented
            Generation.

          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
import {
  FileText,
  Scissors,
  Brain,
  Database,
  Search,
  Bot,
  MessageSquareText,
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Upload Documents",
    description:
      "Upload PDF, DOCX, TXT or PPT files. RAGify securely processes your documents.",
  },
  {
    icon: Scissors,
    title: "Chunking",
    description:
      "Documents are intelligently split into semantic chunks for better retrieval.",
  },
  {
    icon: Brain,
    title: "Generate Embeddings",
    description:
      "Gemini converts every chunk into vector embeddings that capture semantic meaning.",
  },
  {
    icon: Database,
    title: "Store in ChromaDB",
    description:
      "Embeddings are stored inside ChromaDB for lightning-fast similarity search.",
  },
  {
    icon: Search,
    title: "Semantic Retrieval",
    description:
      "When a user asks a question, only the most relevant chunks are retrieved.",
  },
  {
    icon: Bot,
    title: "Gemini AI",
    description:
      "The retrieved context is sent to Gemini AI to generate an accurate response.",
  },
  {
    icon: MessageSquareText,
    title: "Answer with Sources",
    description:
      "Users receive a grounded answer together with the document citations used.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">

      <div className="mx-auto max-w-6xl px-6">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold tracking-widest text-violet-500 uppercase">
            How It Works
          </p>

          <h2 className="mt-5 text-4xl font-bold lg:text-5xl">
            How RAGify understands
            <br />
            your documents
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A complete Retrieval-Augmented Generation (RAG) pipeline powered
            by Gemini AI and ChromaDB.
          </p>

        </div>

        {/* Timeline */}

        <div className="relative mx-auto mt-24 max-w-3xl">

          {/* Vertical Line */}

          <div className="absolute left-7 top-0 h-full w-0.5 bg-border" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative mb-12 flex gap-8"
              >

                {/* Circle */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    bg-background
                    shadow-lg
                  "
                >

                  <Icon className="h-6 w-6 text-violet-500" />

                </div>

                {/* Card */}

                <div
                  className="
                    flex-1
                    rounded-3xl
                    border
                    bg-background/50
                    backdrop-blur-xl
                    p-7
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-violet-500/40
                    hover:shadow-2xl
                  "
                >

                  <div className="mb-2 flex items-center gap-3">

                    <span
                      className="
                        rounded-full
                        bg-violet-500/10
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-violet-500
                      "
                    >
                      Step {index + 1}
                    </span>

                  </div>

                  <h3 className="text-2xl font-bold">

                    {step.title}

                  </h3>

                  <p className="mt-3 leading-8 text-muted-foreground">

                    {step.description}

                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}
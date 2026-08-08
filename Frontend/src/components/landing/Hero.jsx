import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {

  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden scroll-mt-20" >

      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute right-10 bottom-0 h-112 w-md rounded-full bg-cyan-500/10 blur-[170px]" />

      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid min-h-[85vh] items-center gap-20 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            {/* Badge */}

            <div className="mb-6 mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm backdrop-blur-xl">

              <Sparkles className="h-4 w-4 text-violet-500" />

              Powered by Gemini AI + RAG

            </div>

            {/* Heading */}

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl xl:text-6xl">

              Build AI
              <br />

              Chatbots
              <br />

              <span className="bg-linear-to-r from-violet-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">

                Powered by

              </span>

              <br />

              Your Documents

            </h1>

            {/* Description */}

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">

              Upload PDF, DOCX, TXT & PPT documents and instantly chat with
              them using Gemini AI, Retrieval-Augmented Generation (RAG),
              semantic search and ChromaDB Vector Database.

            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/chat")}
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-white px-5 py-1 text-lg font-semibold uppercase tracking-wider text-black transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-200 hover:shadow-2xl"
              >
                START CHATTING

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8 py-6 text-base transition-all hover:-translate-y-1"
              >

                View GitHub

              </Button>

            </div>

            {/* Tech Stack */}

            <div className="mt-10 flex flex-wrap gap-3">

              <span className="rounded-full border bg-muted/40 px-4 py-2 text-sm font-medium">

                ⚡ Gemini AI

              </span>

              <span className="rounded-full border bg-muted/40 px-4 py-2 text-sm font-medium">

                📄 PDF / DOCX / TXT / PPT

              </span>

              <span className="rounded-full border bg-muted/40 px-4 py-2 text-sm font-medium">

                🧠 ChromaDB

              </span>

              <span className="rounded-full border bg-muted/40 px-4 py-2 text-sm font-medium">

                🚀 Semantic Search

              </span>

            </div>

          </div>

          {/* RIGHT */}

          <div className="hidden lg:flex items-center justify-center">

            <div
              className="
                relative
                h-125
                w-full
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-background/40
                backdrop-blur-3xl
                shadow-[0_20px_80px_rgba(59,130,246,0.15)]
              "
            >

              {/* Glow */}

              <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-violet-500/20 blur-[110px]" />

              <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[130px]" />

              {/* Placeholder */}

              <div className="flex h-full flex-col items-center justify-center px-10 text-center">

                <div className="text-7xl">

                  🤖

                </div>

                <h2 className="mt-6 text-4xl font-bold">

                  AI Preview

                </h2>

                <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">

                  Soon this panel will display an interactive RAG
                  visualization showing PDF upload, chunking,
                  embeddings, vector search and AI-generated answers.

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function FooterCTA() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border bg-linear-to-br from-violet-500/10 via-background to-cyan-500/10 p-10 lg:p-14">

      {/* Background Glow */}

      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-[140px]" />

      <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[140px]" />

      {/* Content */}

      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Badge */}

        <span
          className="
            rounded-full
            border
            border-violet-500/20
            bg-violet-500/10
            px-5
            py-2
            text-sm
            font-medium
            text-violet-400
          "
        >
          🚀 Build AI Applications Faster
        </span>

        {/* Heading */}

        <h2 className="mt-8 max-w-4xl text-4xl font-bold leading-tight lg:text-5xl">

          Ready to Build Your Own
          <br />

          AI Document Assistant?

        </h2>

        {/* Description */}

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">

          Upload documents, retrieve relevant context using
          ChromaDB, and generate intelligent responses with
          Gemini AI through Retrieval-Augmented Generation.

        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap justify-center gap-5">

          {/* Get Started */}

          <a
            href="#"
            className="
              inline-flex
              items-center
              rounded-xl
              bg-violet-600
              px-8
              py-4
              text-base
              font-semibold
              text-white
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-violet-700
              hover:shadow-xl
              hover:shadow-violet-500/30
            "
          >
            Get Started

            <ArrowRight className="ml-2 h-5 w-5" />

          </a>

          {/* GitHub */}

          <a
            href="https://github.com/MOHIT5135/RAG_app"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              rounded-xl
              border
              border-border
              bg-background/60
              px-8
              py-4
              text-base
              font-medium
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-violet-500
              hover:bg-violet-500/10
              hover:shadow-xl
              hover:shadow-violet-500/20
            "
          >
            <FaGithub className="mr-2 h-5 w-5" />

            View Source Code

          </a>

        </div>

        {/* Stats */}

        <div className="mt-12 flex flex-wrap justify-center gap-10 text-sm">

          <div>

            <p className="text-3xl font-bold text-violet-400">
              RAG
            </p>

            <p className="mt-1 text-muted-foreground">
              Powered Retrieval
            </p>

          </div>

          <div>

            <p className="text-3xl font-bold text-violet-400">
              Gemini
            </p>

            <p className="mt-1 text-muted-foreground">
              AI Model
            </p>

          </div>

          <div>

            <p className="text-3xl font-bold text-violet-400">
              ChromaDB
            </p>

            <p className="mt-1 text-muted-foreground">
              Vector Database
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
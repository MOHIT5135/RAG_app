export default function FooterBottom() {
  return (
    <div
      className="
        mt-16
        border-t
        border-border/60
        pt-8
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          justify-between
          gap-6
          text-center
          md:flex-row
          md:text-left
        "
      >
        {/* Left */}

        <div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-foreground">
              RAGify
            </span>
            . All rights reserved.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Built with ❤️ using React • Node.js • Gemini •
            LangChain • ChromaDB
          </p>

        </div>

        {/* Center */}

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-violet-500/20
            bg-violet-500/10
            px-4
            py-2
          "
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

          <span className="text-sm font-medium text-violet-400">
            Version 1.0.0
          </span>

        </div>

        {/* Right */}

        <p className="text-sm text-muted-foreground">
          Designed & Developed by{" "}
          <span className="font-semibold text-violet-400">
            Amit Sain
          </span>{" "}
          &{" "}
          <span className="font-semibold text-violet-400">
            Mohit Kumar 
          </span>
        </p>

      </div>
    </div>
  );
}
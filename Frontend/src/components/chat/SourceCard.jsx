import { useState } from "react";
import {
  FileText,
  Hash,
  Brain,
  ArrowUpRight,
  ChevronUp,
} from "lucide-react";

const SourceCard = ({ source }) => {
  const [expanded, setExpanded] = useState(false);

  // Convert distance to similarity percentage
  const similarity =
    typeof source.distance === "number"
      ? `${((1 - source.distance) * 100).toFixed(1)}%`
      : "N/A";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">

      {/* Document Name */}
      <div className="flex items-center gap-2">

        <FileText className="h-4 w-4 shrink-0 text-violet-400" />

        <h3
          className="truncate text-sm font-semibold text-white"
          title={source.fileName}
        >
          {source.fileName}
        </h3>

      </div>

      {/* Chunk Number */}
      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">

        <Hash className="h-3.5 w-3.5" />

        <span>
          Chunk #{source.chunkIndex + 1}
        </span>

      </div>

      {/* Retrieval Method */}
      <div className="mt-2 flex items-center gap-2 text-xs">

        <Brain className="h-3.5 w-3.5 text-violet-400" />

        <span className="rounded-full bg-violet-600/15 px-2 py-1 text-violet-300">
          {source.retrievalMethod}
        </span>

      </div>

      {/* Similarity */}
      <div className="mt-3 flex items-center justify-between">

        <span className="text-xs text-zinc-500">
          Similarity
        </span>

        <span className="rounded-full bg-emerald-600/20 px-2 py-1 text-xs font-medium text-emerald-400">
          {similarity}
        </span>

      </div>

      {/* Preview */}
      <div
        className={`mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3 ${
          expanded
            ? "max-h-64 overflow-y-auto"
            : "max-h-36 overflow-hidden"
        }`}
      >
        <p className="text-xs leading-6 text-zinc-400">
          {source.text}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">

        <span className="text-[11px] text-zinc-500">
          Source #{source.number}
        </span>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-xs font-medium text-violet-400 transition hover:text-violet-300"
        >
          {expanded ? (
            <>
              Collapse
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              View
              <ArrowUpRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>

      </div>

    </div>
  );
};

export default SourceCard;
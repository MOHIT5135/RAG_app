import { useState } from "react";
import {
  FileText,
  Hash,
  Brain,
  ArrowUpRight,
  ChevronUp,
} from "lucide-react";

const SourceCard = ({
  source,
  darkMode = true,
}) => {
  const [expanded, setExpanded] = useState(false);

  // ==========================================================
  // Convert distance to similarity percentage
  // ==========================================================

  const similarity =
    typeof source.distance === "number"
      ? `${((1 - source.distance) * 100).toFixed(1)}%`
      : "N/A";

  return (
    <div
      className={`
        rounded-xl
        border
        p-4
        transition-colors
        duration-200

        ${
          darkMode
            ? "border-zinc-800 bg-zinc-900"
            : "border-zinc-200 bg-zinc-50"
        }
      `}
    >

      {/* =====================================================
          Document Name
      ====================================================== */}

      <div className="flex min-w-0 items-center gap-2">

        <FileText
          className={`
            h-4
            w-4
            shrink-0

            ${
              darkMode
                ? "text-violet-400"
                : "text-violet-600"
            }
          `}
        />

        <h3
          className={`
            truncate
            text-sm
            font-semibold

            ${
              darkMode
                ? "text-white"
                : "text-zinc-900"
            }
          `}
          title={source.fileName}
        >
          {source.fileName}
        </h3>

      </div>

      {/* =====================================================
          Chunk Number
      ====================================================== */}

      <div
        className={`
          mt-3
          flex
          items-center
          gap-2
          text-xs

          ${
            darkMode
              ? "text-zinc-400"
              : "text-zinc-500"
          }
        `}
      >

        <Hash className="h-3.5 w-3.5" />

        <span>
          Chunk #{source.chunkIndex + 1}
        </span>

      </div>

      {/* =====================================================
          Retrieval Method
      ====================================================== */}

      <div className="mt-2 flex items-center gap-2 text-xs">

        <Brain
          className={`
            h-3.5
            w-3.5

            ${
              darkMode
                ? "text-violet-400"
                : "text-violet-600"
            }
          `}
        />

        <span
          className={`
            rounded-full
            px-2
            py-1

            ${
              darkMode
                ? "bg-violet-600/15 text-violet-300"
                : "bg-violet-100 text-violet-600"
            }
          `}
        >
          {source.retrievalMethod}
        </span>

      </div>

      {/* =====================================================
          Similarity
      ====================================================== */}

      <div className="mt-3 flex items-center justify-between gap-2">

        <span
          className={`
            text-xs

            ${
              darkMode
                ? "text-zinc-500"
                : "text-zinc-500"
            }
          `}
        >
          Similarity
        </span>

        <span
          className={`
            rounded-full
            px-2
            py-1
            text-xs
            font-medium

            ${
              darkMode
                ? "bg-emerald-600/20 text-emerald-400"
                : "bg-emerald-100 text-emerald-600"
            }
          `}
        >
          {similarity}
        </span>

      </div>

      {/* =====================================================
          Preview
      ====================================================== */}

      <div
        className={`
          mt-4
          rounded-lg
          border
          p-3

          ${
            darkMode
              ? "border-zinc-800 bg-zinc-950"
              : "border-zinc-200 bg-white"
          }

          ${
            expanded
              ? "max-h-64 overflow-y-auto"
              : "max-h-36 overflow-hidden"
          }
        `}
      >
        <p
          className={`
            wrap-break-word
            text-xs
            leading-6

            ${
              darkMode
                ? "text-zinc-400"
                : "text-zinc-600"
            }
          `}
        >
          {source.text}
        </p>
      </div>

      {/* =====================================================
          Footer
      ====================================================== */}

      <div
        className={`
          mt-4
          flex
          items-center
          justify-between
          gap-2
          border-t
          pt-3

          ${
            darkMode
              ? "border-zinc-800"
              : "border-zinc-200"
          }
        `}
      >

        <span
          className={`
            text-[11px]

            ${
              darkMode
                ? "text-zinc-500"
                : "text-zinc-500"
            }
          `}
        >
          Source #{source.number}
        </span>

        <button
          type="button"
          onClick={() =>
            setExpanded((prev) => !prev)
          }
          className={`
            flex
            shrink-0
            items-center
            gap-1
            text-xs
            font-medium
            transition

            ${
              darkMode
                ? "text-violet-400 hover:text-violet-300"
                : "text-violet-600 hover:text-violet-700"
            }
          `}
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
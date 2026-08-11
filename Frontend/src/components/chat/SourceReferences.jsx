import { Library, X } from "lucide-react";

import SourceCard from "./SourceCard";

const SourceReferences = ({
  sources = [],
  isOpen = false,
  onClose = () => {},
  darkMode = true,
}) => {
  return (
    <>
      {/* =====================================================
          Mobile Backdrop
      ====================================================== */}

      {isOpen && (
        <div
          className={`
            fixed
            inset-0
            z-40
            lg:hidden

            ${
              darkMode
                ? "bg-black/70"
                : "bg-black/40"
            }
          `}
          onClick={onClose}
        />
      )}

      {/* =====================================================
          Sources Panel
      ====================================================== */}

      <aside
        className={`
          fixed
          right-0
          top-0
          z-50
          h-full
          w-[85%]
          max-w-sm
          shadow-2xl
          transition-all
          duration-300

          ${
            darkMode
              ? "border-l border-zinc-800 bg-zinc-950"
              : "border-l border-zinc-200 bg-white"
          }

          lg:static
          lg:z-auto
          lg:h-full
          lg:max-h-full
          lg:max-w-none
          lg:shadow-none
          lg:min-h-0

          ${
            isOpen
              ? "translate-x-0 lg:w-80"
              : "translate-x-full lg:w-0 lg:border-l-0"
          }
        `}
      >
        <div className="flex h-full min-h-0 min-w-0 flex-col">

          {/* =================================================
              Header
          ================================================== */}

          <div
            className={`
              flex
              shrink-0
              items-center
              justify-between
              border-b
              px-4
              py-4

              ${
                darkMode
                  ? "border-zinc-800"
                  : "border-zinc-200"
              }
            `}
          >
            <div className="flex min-w-0 items-center gap-2">

              <Library
                className={`
                  h-5
                  w-5
                  shrink-0

                  ${
                    darkMode
                      ? "text-violet-400"
                      : "text-violet-600"
                  }
                `}
              />

              <h2
                className={`
                  text-sm
                  font-semibold

                  ${
                    darkMode
                      ? "text-white"
                      : "text-zinc-900"
                  }
                `}
              >
                Sources
              </h2>

              {/* Source Count */}

              <span
                className={`
                  rounded-full
                  px-2
                  py-0.5
                  text-xs

                  ${
                    darkMode
                      ? "bg-violet-600/20 text-violet-400"
                      : "bg-violet-100 text-violet-600"
                  }
                `}
              >
                {sources.length}
              </span>

            </div>

            {/* =================================================
                Mobile Close
            ================================================== */}

            <button
              type="button"
              onClick={onClose}
              className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                transition

                ${
                  darkMode
                    ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }

                lg:hidden
              `}
              aria-label="Close sources"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

          {/* =================================================
              Content
          ================================================== */}

          {sources.length === 0 ? (

            <div
              className="
                flex
                min-h-0
                flex-1
                items-center
                justify-center
                px-6
                text-center
              "
            >
              <p
                className={`
                  text-sm
                  leading-6

                  ${
                    darkMode
                      ? "text-zinc-500"
                      : "text-zinc-500"
                  }
                `}
              >
                Ask a question to see
                <br />
                source references.
              </p>
            </div>

          ) : (

            <div
              className="
                min-h-0
                flex-1
                space-y-3
                overflow-y-auto
                overscroll-contain
                p-4
              "
            >
              {sources.map((source, index) => (
                <SourceCard
                  key={`${source.fileName}-${index}`}
                  source={source}
                  darkMode={darkMode}
                />
              ))}
            </div>

          )}

        </div>
      </aside>
    </>
  );
};

export default SourceReferences;
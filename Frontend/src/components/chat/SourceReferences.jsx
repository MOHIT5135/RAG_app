import { Library, X } from "lucide-react";

import SourceCard from "./SourceCard";

const SourceReferences = ({
  sources = [],
  isOpen = false,
  onClose = () => {},
}) => {
  return (
    <>
      {/* =====================================================
          Mobile Backdrop
      ====================================================== */}
      {isOpen && (
        <div
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-[2px]
            lg:hidden
          "
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
          border-l
          border-zinc-800
          bg-zinc-950
          shadow-2xl
          transition-transform
          duration-300
          lg:static
          lg:z-auto
          lg:h-auto
          lg:max-w-none
          lg:shadow-none
          ${
            isOpen
              ? "translate-x-0 lg:w-80"
              : "translate-x-full lg:w-0"
          }
        `}
      >
        <div className="flex h-full min-w-0 flex-col">

          {/* =================================================
              Header
          ================================================== */}

          <div className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-zinc-800
            px-4
            py-4
          ">

            <div className="flex min-w-0 items-center gap-2">

              <Library className="h-5 w-5 shrink-0 text-violet-400" />

              <h2 className="text-sm font-semibold text-white">
                Sources
              </h2>

              <span className="
                rounded-full
                bg-violet-600/20
                px-2
                py-0.5
                text-xs
                text-violet-400
              ">
                {sources.length}
              </span>

            </div>

            {/* Mobile Close */}
            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-zinc-400
                transition
                hover:bg-zinc-800
                hover:text-white
                lg:hidden
              "
              aria-label="Close sources"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

          {/* =================================================
              Content
          ================================================== */}

          {sources.length === 0 ? (

            <div className="
              flex
              flex-1
              items-center
              justify-center
              px-6
              text-center
            ">

              <p className="text-sm leading-6 text-zinc-500">
                Ask a question to see
                <br />
                source references.
              </p>

            </div>

          ) : (

            <div className="
              flex-1
              space-y-3
              overflow-y-auto
              p-4
            ">

              {sources.map((source, index) => (
                <SourceCard
                  key={`${source.fileName}-${index}`}
                  source={source}
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
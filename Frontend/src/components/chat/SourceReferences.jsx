import { Library, PanelRightClose } from "lucide-react";

import SourceCard from "./SourceCard";

const SourceReferences = ({
  sources = [],
  isOpen = false,
}) => {

  return (
    <aside
      className={`
        border-l border-zinc-800
        bg-zinc-950
        transition-all duration-300
        overflow-hidden
        ${
          isOpen
            ? "w-80"
            : "w-0 border-l-0"
        }
      `}
    >

      <div className="flex h-full flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">

          <div className="flex items-center gap-2">

            <Library className="h-5 w-5 text-violet-400" />

            <h2 className="text-sm font-semibold text-white">
              Sources
            </h2>

            <span className="rounded-full bg-violet-600/20 px-2 py-0.5 text-xs text-violet-400">
              {sources.length}
            </span>

          </div>

        </div>

        {/* Empty */}
        {sources.length === 0 ? (

          <div className="flex flex-1 items-center justify-center px-6 text-center">

            <p className="text-sm text-zinc-500">
              Ask a question to see
              source references.
            </p>

          </div>

        ) : (

          <div className="flex-1 space-y-3 overflow-y-auto p-4">

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
  );
};

export default SourceReferences;
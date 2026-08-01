import {
  FileText,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import { formatFileSize } from "@/utils/formatFileSize";

const SelectedFile = ({
  file,
  onRemove,
}) => {
  if (!file) return null;

  return (
    <div
      className="
        rounded-3xl
        border
        border-emerald-500/20
        bg-emerald-500/5
        p-6
        backdrop-blur-xl
      "
    >
      <div className="flex items-center justify-between gap-5">

        {/* Left */}

        <div className="flex items-center gap-5">

          {/* Icon */}

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-violet-500/10
            "
          >
            <FileText
              className="h-7 w-7 text-violet-400"
            />
          </div>

          {/* Details */}

          <div>

            <div className="flex items-center gap-2">

              <h3 className="font-semibold text-lg">

                {file.name}

              </h3>

              <CheckCircle2
                className="
                  h-5
                  w-5
                  text-emerald-500
                "
              />

            </div>

            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              {formatFileSize(file.size)}
            </p>

          </div>

        </div>

        {/* Remove */}

        <button
          onClick={onRemove}
          className="
            rounded-xl
            border
            border-red-500/20
            p-3
            transition-all
            duration-300
            hover:bg-red-500/10
            hover:border-red-500/40
          "
        >
          <Trash2
            className="
              h-5
              w-5
              text-red-400
            "
          />
        </button>

      </div>

    </div>
  );
};

export default SelectedFile;
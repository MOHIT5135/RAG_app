import { UploadCloud } from "lucide-react";
import { uploadConfig } from "@/data/uploadConfig";

const UploadDropzone = ({ onBrowse }) => {
  return (
    <div
      className="
        relative
        rounded-3xl
        border-2
        border-dashed
        border-violet-500/30
        bg-zinc-900/40
        px-8
        py-16
        transition-all
        duration-300
        hover:border-violet-500
        hover:bg-zinc-900/70
      "
    >
      {/* Upload Icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/30">
        <UploadCloud className="h-10 w-10 text-violet-400" />
      </div>

      {/* Heading */}
      <h3 className="mt-6 text-center text-2xl font-semibold text-white">
        Drag & Drop your documents here
      </h3>

      {/* Description */}
      <p className="mt-3 text-center text-zinc-400">
        or click the button below to browse your computer
      </p>

      {/* Browse Button */}
      <div className="mt-8 flex justify-center">
        <button
            type="button"
            onClick={onBrowse}
            className="
                rounded-xl
                bg-violet-600
                px-6
                py-3
                font-medium
                text-white
                transition-all
                duration-300
                hover:bg-violet-500
                hover:scale-105
            "
            >
            Browse Files
        </button>
      </div>

      {/* Supported Files */}
      <div className="mt-10 space-y-2 text-center">
        <p className="text-sm text-zinc-400">
          <span className="font-semibold text-white">Supported:</span>{" "}
          {uploadConfig.supportedFormats}
        </p>

        <p className="text-sm text-zinc-400">
          <span className="font-semibold text-white">Maximum Size:</span>{" "}
          {uploadConfig.maxFileSizeLabel}
        </p>
      </div>
    </div>
  );
};

export default UploadDropzone;
import {
  ShieldCheck,
  BrainCircuit,
  Database,
  FileText,
} from "lucide-react";

import { uploadConfig } from "@/data/uploadConfig";

const features = [
  {
    icon: FileText,
    title: "Supported Formats",
    description: uploadConfig.supportedFormats,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },

  {
    icon: ShieldCheck,
    title: "Maximum File Size",
    description: uploadConfig.maxFileSizeLabel,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },

  {
    icon: BrainCircuit,
    title: "AI Processing",
    description:
      "Automatic chunking, embeddings and semantic indexing.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },

  {
    icon: Database,
    title: "Vector Storage",
    description:
      "Embeddings securely stored in ChromaDB.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

const UploadInfo = () => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.title}
            className="
              group
              rounded-3xl
              border
              border-border
              bg-background/60
              backdrop-blur-xl
              p-6
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-violet-500/40
              hover:shadow-xl
              hover:shadow-violet-500/10
            "
          >
            {/* Icon */}

            <div
              className={`
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                ${feature.bg}
              `}
            >
              <Icon
                className={`h-7 w-7 ${feature.color}`}
              />
            </div>

            {/* Title */}

            <h3 className="mt-5 text-lg font-semibold">
              {feature.title}
            </h3>

            {/* Description */}

            <p
              className="
                mt-2
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              {feature.description}
            </p>

          </div>
        );
      })}

    </div>
  );
};

export default UploadInfo;
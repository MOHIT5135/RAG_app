import { ExternalLink } from "lucide-react";

export default function TechnologyChip({
  technology,
  color,
  bg,
  border,
}) {
  const Icon = technology.icon;

  return (
    <a
      href={technology.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        className={`
          group
          flex
          items-center
          justify-between
          rounded-2xl
          border
          ${border}
          bg-background/70
          backdrop-blur-xl
          px-5
          py-4
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          hover:shadow-violet-500/10
          hover:border-violet-500/40
        `}
      >
        {/* Left Side */}
        <div className="flex items-center gap-4">

          {/* Icon */}
          <div
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              ${bg}
            `}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>

          {/* Text */}
          <div>
            <h4 className="text-lg font-semibold">
              {technology.name}
            </h4>

            <p className="text-sm text-muted-foreground">
              Technology
            </p>
          </div>

        </div>

        {/* Arrow */}
        <ExternalLink
          className="
            h-5
            w-5
            text-muted-foreground
            transition-all
            duration-300
            group-hover:translate-x-1
            group-hover:text-violet-500
          "
        />
      </div>
    </a>
  );
}
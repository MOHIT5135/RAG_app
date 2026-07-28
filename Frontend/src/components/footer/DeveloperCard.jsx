import { ExternalLink } from "lucide-react";

export default function DeveloperCard({ developer }) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-border
        bg-background/60
        backdrop-blur-xl
        p-5
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-violet-500/40
        hover:shadow-2xl
        hover:shadow-violet-500/10
      "
    >
      {/* Top */}

      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-bold">
            {developer.name}
          </h4>

          <p className="mt-1 text-sm text-muted-foreground">
            {developer.role}
          </p>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-violet-500/10
            text-violet-500
          "
        >
          👨‍💻
        </div>
      </div>

      {/* Skills */}

      <div className="mt-5 flex flex-wrap gap-2">
        {developer.skills.map((skill) => (
          <span
            key={skill}
            className="
              rounded-full
              border
              border-violet-500/20
              bg-violet-500/10
              px-3
              py-1
              text-xs
              font-medium
              text-violet-500
            "
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Social */}

      <div className="mt-6 flex items-center gap-3">
        {developer.socials.map((social, index) => {
          const Icon = social.icon;

          return (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-border
                transition-all
                duration-300
                hover:border-violet-500
                hover:bg-violet-500
                hover:text-white
              "
            >
              <Icon size={18} />
            </a>
          );
        })}

        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          View Profile

          <ExternalLink
            size={14}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </div>
      </div>
    </div>
  );
}
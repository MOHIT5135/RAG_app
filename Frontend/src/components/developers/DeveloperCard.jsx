import {
  ExternalLink,
} from "lucide-react";

import DeveloperSkill from "./DeveloperSkill";

export default function DeveloperCard({
  developer,
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-linear-to-br
        from-background
        via-background
        to-violet-950/10
        p-7
        transition-all
        duration-500
        hover:-translate-y-3
        hover:border-violet-500/60
        hover:shadow-[0_25px_80px_rgba(139,92,246,0.25)]
        hover:shadow-violet-500/10
      "
    >
      {/* Glow Effect */}

      <div
        className="
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
          bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_60%)]
        "
      />

      {/* Content */}

      <div className="relative z-10">

        {/* Top */}

        <div className="flex items-start justify-between">

          <div>

            <h3 className="text-2xl font-bold">
              {developer.name}
            </h3>

            <p className="mt-1 text-violet-400 font-medium">
              {developer.role}
            </p>

          </div>

          {/* Avatar */}

            <div
                className="
                    relative
                    h-24
                    w-24
                    rounded-full
                    p-1
                    bg-linear-to-r
                    from-violet-500
                    via-fuchsia-500
                    to-cyan-500
                    shadow-2xl
                    shadow-violet-500/50
                "
            >
                <img
                    src={developer.avatar}
                    alt={developer.name}
                    className="
                    h-full
                    w-full
                    rounded-full
                    object-cover
                    border-2
                    border-background
                    transition-all
                    duration-500
                    group-hover:scale-110
                    group-hover:rotate-2
                    "
                />

                <span
                    className="
                        absolute
                        bottom-1
                        right-1
                        h-4
                        w-4
                        rounded-full
                        border-2
                        border-background
                        bg-emerald-500
                        shadow-lg
                        shadow-emerald-500/60
                    "
                />

            </div>

        </div>

        {/* Description */}

        <p
          className="
            mt-6
            leading-8
            text-muted-foreground
          "
        >
          {developer.description}
        </p>

        {/* Skills */}

        <div className="mt-7 flex flex-wrap gap-3">

          {developer.skills.map((skill) => (
            <DeveloperSkill
              key={skill}
              skill={skill}
            />
          ))}

        </div>

        {/* Bottom */}

        <div
          className="
            mt-8
            flex
            items-center
            justify-between
          "
        >

          {/* Social */}

          <div className="flex gap-3">

            {developer.social.map(
              (item, index) => {
                const Icon = item.icon;

                return (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-border
                      bg-background
                      transition-all
                      duration-300
                      hover:border-violet-500
                      hover:bg-violet-500/10
                      hover:text-violet-400
                    "
                  >
                    <Icon size={24} />
                  </a>
                );
              }
            )}

          </div>

          {/* Profile */}

          <a
            href={developer.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-muted-foreground
              transition-all
              duration-300
              hover:text-violet-400
            "
          >
            View Profile

            <ExternalLink
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
                group-hover:-translate-y-1
              "
            />

          </a>

        </div>

      </div>
    </div>
  );
}
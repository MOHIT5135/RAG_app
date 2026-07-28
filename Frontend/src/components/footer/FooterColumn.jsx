import { ChevronRight } from "lucide-react";

export default function FooterColumn({
  title,
  links,
}) {
  return (
    <div>

      {/* Heading */}

      <h3 className="mb-6 text-lg font-semibold">
        {title}
      </h3>

      {/* Links */}

      <ul className="space-y-4">

        {links.map((link) => (

          <li key={link.name}>

            <a
              href={link.href}
              target={
                link.href.startsWith("http")
                  ? "_blank"
                  : "_self"
              }
              rel={
                link.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="
                group
                inline-flex
                items-center
                gap-2
                text-muted-foreground
                transition-all
                duration-300
                hover:text-violet-500
              "
            >

              <ChevronRight
                className="
                  h-4
                  w-4
                  -translate-x-2
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:translate-x-0
                  group-hover:opacity-100
                "
              />

              <span
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                {link.name}
              </span>

            </a>

          </li>

        ))}

      </ul>

    </div>
  );
}
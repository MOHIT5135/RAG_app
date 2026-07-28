import { ChevronRight } from "lucide-react";
import { footerLinks } from "./footerData";

export default function FooterLinks() {
  return (
    <div
      className="
        grid
        gap-10
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {footerLinks.map((section) => (
        <div key={section.title}>

          {/* Heading */}

          <h3
            className="
              mb-6
              text-lg
              font-semibold
              text-foreground
            "
          >
            {section.title}
          </h3>

          {/* Links */}

          <ul className="space-y-4">

            {section.links.map((link) => (

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
                    hover:text-violet-400
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
      ))}
    </div>
  );
}
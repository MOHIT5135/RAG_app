import { contacts } from "./footerData";

export default function FooterBrand() {
  return (
    <div>

      {/* Logo */}

      <div className="flex items-center gap-4">

        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-linear-to-br
            from-violet-500
            via-fuchsia-500
            to-cyan-500
            text-3xl
            shadow-xl
            shadow-violet-500/20
          "
        >
          🤖
        </div>

        <div>

          <h2 className="text-4xl font-bold">

            RAGify

          </h2>

          <p className="text-sm text-muted-foreground">

            AI Powered Document Assistant

          </p>

        </div>

      </div>

      {/* Description */}

      <p
        className="
          mt-8
          max-w-md
          leading-8
          text-muted-foreground
        "
      >
        RAGify is an AI-powered document assistant built
        with React, Node.js, Gemini AI, LangChain and
        ChromaDB to deliver fast, accurate and contextual
        answers from your documents.
      </p>

      {/* Contact */}

      <div className="mt-10 space-y-5">

        {contacts.map((contact, index) => {

          const Icon = contact.icon;

          return (
            <a
              key={index}
              href={contact.href}
              className="
                group
                flex
                items-center
                gap-4
                transition-all
                duration-300
                hover:translate-x-1
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  bg-background/60
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  group-hover:border-violet-500/40
                  group-hover:bg-violet-500/10
                "
              >

                <Icon className="h-5 w-5 text-violet-400" />

              </div>

              <div>

                <p className="text-sm font-medium">

                  {contact.title}

                </p>

                <p className="text-sm text-muted-foreground">

                  {contact.value}

                </p>

              </div>

            </a>

          );

        })}

      </div>

    </div>
  );
}
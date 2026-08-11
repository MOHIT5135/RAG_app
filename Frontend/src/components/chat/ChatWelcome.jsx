import {
  Bot,
  Sparkles,
  FileSearch,
} from "lucide-react";

const ChatWelcome = ({
  darkMode = true,
}) => {
  return (
    <div
      className={`
        flex
        w-full
        max-w-4xl
        flex-col
        items-center
        justify-center
        px-4
        py-8
        text-center
        transition-colors
        sm:px-6
      `}
    >

      {/* =====================================================
          AI Icon
      ====================================================== */}

      <div
        className={`
          mb-4
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          sm:mb-5
          sm:h-16
          sm:w-16

          ${
            darkMode
              ? "bg-violet-600/20"
              : "bg-violet-100"
          }
        `}
      >
        <Bot
          className={`
            h-7
            w-7
            sm:h-8
            sm:w-8

            ${
              darkMode
                ? "text-violet-400"
                : "text-violet-600"
            }
          `}
        />
      </div>

      {/* =====================================================
          Heading
      ====================================================== */}

      <h2
        className={`
          text-xl
          font-bold
          sm:text-2xl

          ${
            darkMode
              ? "text-white"
              : "text-zinc-900"
          }
        `}
      >
        Welcome to RAGify AI
      </h2>

      {/* =====================================================
          Description
      ====================================================== */}

      <p
        className={`
          mt-3
          max-w-xl
          text-sm
          leading-6
          sm:text-base
          sm:leading-7

          ${
            darkMode
              ? "text-zinc-400"
              : "text-zinc-600"
          }
        `}
      >
        Ask questions about your uploaded documents and receive
        AI-powered answers with accurate source references.
      </p>

      {/* =====================================================
          Feature Cards
      ====================================================== */}

      <div
        className="
          mt-6
          grid
          w-full
          max-w-3xl
          grid-cols-1
          gap-3
          sm:mt-8
          md:grid-cols-2
        "
      >

        {/* ===================================================
            Search Documents
        ==================================================== */}

        <div
          className={`
            rounded-xl
            border
            p-4
            text-left
            transition
            sm:p-5

            ${
              darkMode
                ? `
                  border-zinc-800
                  bg-zinc-900
                  hover:border-violet-500
                `
                : `
                  border-zinc-200
                  bg-zinc-50
                  hover:border-violet-400
                `
            }
          `}
        >

          <div
            className={`
              mb-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg

              ${
                darkMode
                  ? "bg-violet-600/20"
                  : "bg-violet-100"
              }
            `}
          >
            <FileSearch
              className={`
                h-5
                w-5

                ${
                  darkMode
                    ? "text-violet-400"
                    : "text-violet-600"
                }
              `}
            />
          </div>

          <h3
            className={`
              text-sm
              font-semibold
              sm:text-base

              ${
                darkMode
                  ? "text-white"
                  : "text-zinc-900"
              }
            `}
          >
            Search Documents
          </h3>

          <p
            className={`
              mt-2
              text-sm
              leading-6

              ${
                darkMode
                  ? "text-zinc-400"
                  : "text-zinc-600"
              }
            `}
          >
            Ask questions about PDFs, DOCX, PPT, TXT and other
            uploaded files.
          </p>

        </div>

        {/* ===================================================
            AI Answers
        ==================================================== */}

        <div
          className={`
            rounded-xl
            border
            p-4
            text-left
            transition
            sm:p-5

            ${
              darkMode
                ? `
                  border-zinc-800
                  bg-zinc-900
                  hover:border-violet-500
                `
                : `
                  border-zinc-200
                  bg-zinc-50
                  hover:border-violet-400
                `
            }
          `}
        >

          <div
            className={`
              mb-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg

              ${
                darkMode
                  ? "bg-violet-600/20"
                  : "bg-violet-100"
              }
            `}
          >
            <Sparkles
              className={`
                h-5
                w-5

                ${
                  darkMode
                    ? "text-violet-400"
                    : "text-violet-600"
                }
              `}
            />
          </div>

          <h3
            className={`
              text-sm
              font-semibold
              sm:text-base

              ${
                darkMode
                  ? "text-white"
                  : "text-zinc-900"
              }
            `}
          >
            AI Powered Answers
          </h3>

          <p
            className={`
              mt-2
              text-sm
              leading-6

              ${
                darkMode
                  ? "text-zinc-400"
                  : "text-zinc-600"
              }
            `}
          >
            Receive contextual answers generated directly from
            your uploaded documents.
          </p>

        </div>

      </div>

      {/* =====================================================
          Hint
      ====================================================== */}

      <p
        className={`
          mt-6
          text-xs
          sm:mt-8

          ${
            darkMode
              ? "text-zinc-500"
              : "text-zinc-500"
          }
        `}
      >
        Start by asking a question below 👇
      </p>

    </div>
  );
};

export default ChatWelcome;
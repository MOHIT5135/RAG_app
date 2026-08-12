import { Bot } from "lucide-react";

const TypingIndicator = ({
  darkMode = true,
}) => {
  return (
    <div className="flex w-full justify-start">
      <div className="flex w-full max-w-3xl gap-2 sm:gap-3">

        {/* =====================================================
            AI Avatar
        ====================================================== */}

        <div
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            sm:h-9
            sm:w-9

            ${
              darkMode
                ? "border border-zinc-700 bg-zinc-900"
                : "border border-zinc-200 bg-zinc-100"
            }
          `}
        >
          <Bot
            className={`
              h-4
              w-4
              sm:h-5
              sm:w-5

              ${
                darkMode
                  ? "text-violet-400"
                  : "text-violet-600"
              }
            `}
          />
        </div>

        {/* =====================================================
            Typing Bubble
        ====================================================== */}

        <div
          className={`
            rounded-2xl
            border
            px-4
            py-3
            sm:px-5
            sm:py-4

            ${
              darkMode
                ? "border-zinc-800 bg-zinc-900"
                : "border-zinc-200 bg-zinc-50"
            }
          `}
        >

          {/* AI Name */}

          <p
            className={`
              mb-2
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              sm:mb-3
              sm:text-xs

              ${
                darkMode
                  ? "text-violet-400"
                  : "text-violet-600"
              }
            `}
          >
            RAGify AI
          </p>

          {/* Thinking Animation */}

          <div className="flex items-center gap-2">

            <span
              className={`
                text-sm

                ${
                  darkMode
                    ? "text-zinc-400"
                    : "text-zinc-500"
                }
              `}
            >
              Thinking
            </span>

            <div className="flex gap-1">

              <span
                className={`
                  h-2
                  w-2
                  animate-bounce
                  rounded-full

                  ${
                    darkMode
                      ? "bg-violet-400"
                      : "bg-violet-500"
                  }
                `}
              />

              <span
                className={`
                  h-2
                  w-2
                  animate-bounce
                  rounded-full

                  ${
                    darkMode
                      ? "bg-violet-400"
                      : "bg-violet-500"
                  }
                `}
                style={{
                  animationDelay: "0.15s",
                }}
              />

              <span
                className={`
                  h-2
                  w-2
                  animate-bounce
                  rounded-full

                  ${
                    darkMode
                      ? "bg-violet-400"
                      : "bg-violet-500"
                  }
                `}
                style={{
                  animationDelay: "0.3s",
                }}
              />

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TypingIndicator;
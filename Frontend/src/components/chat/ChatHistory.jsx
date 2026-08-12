import {
  MessageSquare,
  Trash2,
} from "lucide-react";

import { useChatHistory } from "@/context/ChatHistoryContext";

const ChatHistory = ( {darkMode}) => {
  const {
    history,
    selectedChat,
    loadConversation,
    removeConversation,
  } = useChatHistory();

  // ==========================================================
  // Empty State
  // ==========================================================

  if (history.length === 0) {
    return (
      <div className={`
        rounded-xl border p-3 ${ darkMode ? 
        "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white" }`} 
      >
        <p
          className={`text-center text-xs ${
            darkMode
              ? "text-zinc-500"
              : "text-zinc-400"
          }`}
        >
          No conversations yet
        </p>
      </div>
    );
  }

  // ==========================================================
  // History List
  // ==========================================================

  return (
    <div className="space-y-1">

      {history.map((chat) => {
        const isActive =
          selectedChat?._id === chat._id;

        return (

          <button
            key={chat._id}
            onClick={() => loadConversation(chat._id)}
            className={`
              group
              flex
              w-full
              items-center
              gap-2
              rounded-lg
              border
              px-3
              py-2
              text-left
              transition-all
              duration-200

              ${
                isActive
                  ? darkMode
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-violet-400 bg-violet-50"
                  : darkMode
                    ? "border-zinc-800 bg-zinc-900 hover:border-violet-500 hover:bg-zinc-800"
                    : "border-zinc-200 bg-white hover:border-violet-400 hover:bg-violet-50"
              }
            `}
          >

            {/* Icon */}

            <div
              className={`
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-md

                ${
                  isActive
                    ? darkMode
                      ? "bg-violet-600/30"
                      : "bg-violet-100"
                    : darkMode
                      ? "bg-violet-600/15"
                      : "bg-violet-50"
                }
              `}
            >

              <MessageSquare
                className="h-4 w-4 text-violet-400"
              />

            </div>

            {/* Title */}

            <div className="min-w-0 flex-1">

              <p
                className={`truncate text-sm font-medium ${
                  darkMode
                    ? "text-white"
                    : "text-zinc-900"
                }`}
                title={chat.title}
              >

                {chat.title}

              </p>

            </div>

            {/* Delete */}

            <Trash2
              onClick={(e) => {

                e.stopPropagation();

                removeConversation(chat._id);

              }}
              className={`
                h-4
                w-4
                shrink-0
                transition-all

                ${
                  darkMode
                    ? "text-zinc-500 hover:text-red-400"
                    : "text-zinc-400 hover:text-red-500"
                }

                group-hover:opacity-100
              `}
            />

          </button>

        );

    })}

  </div>

  );

};

export default ChatHistory;
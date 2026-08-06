import {
  MessageSquare,
  Trash2,
} from "lucide-react";

import { useChatHistory } from "@/context/ChatHistoryContext";

const ChatHistory = () => {

  const {

    history,

    selectedChat,

    loadConversation,

    removeConversation,

  } = useChatHistory();

  if (history.length === 0) {

    return (

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">

        <p className="text-center text-xs text-zinc-500">

          No conversations yet

        </p>

      </div>

    );

  }

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
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-violet-500 hover:bg-zinc-800"
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
                    ? "bg-violet-600/30"
                    : "bg-violet-600/15"
                }
              `}
            >

              <MessageSquare className="h-4 w-4 text-violet-400" />

            </div>

            {/* Title */}

            <div className="min-w-0 flex-1">

              <p
                className="truncate text-sm font-medium text-white"
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
              className="
                h-4
                w-4
                shrink-0
                text-zinc-500
                opacity-0
                transition-all
                hover:text-red-400
                group-hover:opacity-100
              "
            />

          </button>

        );

      })}

    </div>

  );

};

export default ChatHistory;
import { MessageSquareText } from "lucide-react";

const ChatHistory = ({ history = [] }) => {
  return (
    <div className="space-y-3">

      {history.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-center">
          <p className="text-sm text-zinc-400">
            No conversations yet.
          </p>
        </div>
      ) : (
        history.map((chat) => (
          <button
            key={chat.id}
            className="flex w-full items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-left transition-all duration-200 hover:border-violet-500 hover:bg-zinc-800"
          >
            <div className="rounded-lg bg-violet-600/20 p-2">
              <MessageSquareText className="h-5 w-5 text-violet-400" />
            </div>

            <div className="flex-1 overflow-hidden">

              <h4 className="truncate font-medium text-white">
                {chat.title}
              </h4>

              <p className="mt-1 text-xs text-zinc-400">
                {chat.timestamp}
              </p>

            </div>
          </button>
        ))
      )}

    </div>
  );
};

export default ChatHistory;
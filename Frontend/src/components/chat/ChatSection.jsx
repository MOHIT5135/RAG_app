import { useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SourceReferences from "./SourceReferences";

const ChatSection = ({
  uploadedDocuments,
  messages,
  sources,
  isTyping,
  error,
  onSend,
  onNewChat,
}) => {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <section className="h-screen overflow-hidden bg-zinc-950">

      <div className="flex h-full">

        {/* Left Sidebar */}
        <ChatSidebar
          uploadedDocuments={uploadedDocuments}
          isOpen={sidebarOpen}
        />

        {/* Main Area */}
        <div className="flex flex-1 flex-col">

          <ChatHeader
            uploadedDocuments={uploadedDocuments}
            onNewChat={onNewChat}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sourcesOpen={sourcesOpen}
            setSourcesOpen={setSourcesOpen}
          />

          <div className="flex flex-1 overflow-hidden">

            {/* Chat */}
            <div className="flex flex-1 flex-col">

              <div className="flex-1 overflow-y-auto">
                <ChatMessages
                  messages={messages}
                  isTyping={isTyping}
                />
              </div>

              <ChatInput
                onSend={onSend}
                isTyping={isTyping}
              />

            </div>

            {/* Source References */}
            <SourceReferences
              sources={sources}
              isOpen={sourcesOpen}
            />

          </div>

        </div>

      </div>

    </section>
  );
};

export default ChatSection;
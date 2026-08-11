import { useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SourceReferences from "./SourceReferences";
import ChatUploadModal from "./ChatUploadModal";

const ChatSection = ({
  uploadedDocuments,
  selectedDocuments,
  setSelectedDocuments,
  messages,
  sources,
  isTyping,
  onSend,
  onNewChat,
}) => {
  // =====================================================
  // Theme
  // =====================================================
  const [darkMode, setDarkMode] = useState(true);

  // =====================================================
  // Sidebar / Sources / Upload Modal
  // =====================================================
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <section
      className={`h-screen w-full overflow-hidden ${
        darkMode
          ? "bg-zinc-950 text-white"
          : "bg-white text-zinc-900"
      }`}
    >
      {/* =====================================================
          Upload Modal
      ====================================================== */}
      <ChatUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        darkMode={darkMode}
      />

      <div className="flex h-full w-full">

        {/* =====================================================
            Mobile Sidebar Overlay
        ====================================================== */}
        {sidebarOpen && (
          <div
            className={`fixed inset-0 z-40 md:hidden ${
              darkMode
                ? "bg-black/60"
                : "bg-black/30"
            }`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* =====================================================
            Sidebar
        ====================================================== */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50
            w-[85%] max-w-[320px]
            transform transition-transform duration-300

            md:relative
            md:z-auto
            md:w-auto
            md:max-w-none
            md:transform-none

            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:w-0 md:opacity-0"
            }
          `}
        >
          <ChatSidebar
            uploadedDocuments={uploadedDocuments}
            selectedDocuments={selectedDocuments}
            setSelectedDocuments={setSelectedDocuments}
            isOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
          />
        </div>

        {/* =====================================================
            Main Content
        ====================================================== */}
        <div
          className={`flex min-w-0 flex-1 flex-col ${
            darkMode
              ? "bg-zinc-950"
              : "bg-white"
          }`}
        >

          {/* ===================================================
              Header
          ==================================================== */}
          <div className="shrink-0">
            <ChatHeader
              uploadedDocuments={uploadedDocuments}
              onNewChat={onNewChat}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              sourcesOpen={sourcesOpen}
              setSourcesOpen={setSourcesOpen}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </div>

          {/* ===================================================
              Middle Area
          ==================================================== */}
          <div className="relative flex min-h-0 flex-1 overflow-hidden">

            {/* =================================================
                Chat Area
            ================================================== */}
            <div className="flex min-w-0 flex-1 flex-col">

              {/* =================================================
                  Messages / Welcome
              ================================================== */}
              <div className="min-h-0 flex-1 overflow-hidden">
                <ChatMessages
                  messages={messages}
                  isTyping={isTyping}
                  darkMode={darkMode}
                />
              </div>

              {/* =================================================
                  Input
              ================================================== */}
              <div className="shrink-0">
                <ChatInput
                  onSend={onSend}
                  isTyping={isTyping}
                  onUploadClick={() => setUploadModalOpen(true)}
                  darkMode={darkMode}
                />
              </div>

            </div>

            {/* =================================================
                Sources Mobile Overlay
            ================================================== */}
            {sourcesOpen && (
              <div
                className={`fixed inset-0 z-40 md:hidden ${
                  darkMode
                    ? "bg-black/60"
                    : "bg-black/30"
                }`}
                onClick={() => setSourcesOpen(false)}
              />
            )}

            {/* =================================================
                Sources
            ================================================== */}
            <div
              className={`
                fixed inset-y-0 right-0 z-50
                w-[88%] max-w-95
                transform transition-transform duration-300

                md:relative
                md:z-auto
                md:w-auto
                md:max-w-none
                md:transform-none

                ${
                  sourcesOpen
                    ? "translate-x-0"
                    : "translate-x-full md:w-0 md:opacity-0"
                }
              `}
            >
              <SourceReferences
                sources={sources}
                isOpen={sourcesOpen}
                onClose={() => setSourcesOpen(false)}
                darkMode={darkMode}
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ChatSection;
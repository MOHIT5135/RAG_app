import {
  Bot,
  Sparkles,
  FileSearch,
} from "lucide-react";

const ChatWelcome = () => {

  return (

    <div
      className="
        flex
        w-full
        max-w-4xl
        flex-col
        items-center
        justify-center
        text-center
        px-4
        py-8
        sm:px-6
      "
    >

      {/* AI Icon */}

      <div
        className="
          mb-4
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-violet-600/20
          sm:mb-5
          sm:h-16
          sm:w-16
        "
      >
        <Bot
          className="
            h-7
            w-7
            text-violet-400
            sm:h-8
            sm:w-8
          "
        />
      </div>


      {/* Heading */}

      <h2
        className="
          text-xl
          font-bold
          text-white
          sm:text-2xl
        "
      >
        Welcome to RAGify AI
      </h2>


      {/* Description */}

      <p
        className="
          mt-3
          max-w-xl
          text-sm
          leading-6
          text-zinc-400
          sm:text-base
          sm:leading-7
        "
      >
        Ask questions about your uploaded documents and receive
        AI-powered answers with accurate source references.
      </p>


      {/* Feature Cards */}

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

        {/* Search */}

        <div
          className="
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            p-4
            text-left
            transition
            hover:border-violet-500
            sm:p-5
          "
        >

          <div
            className="
              mb-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-violet-600/20
            "
          >
            <FileSearch className="h-5 w-5 text-violet-400" />
          </div>

          <h3 className="text-sm font-semibold text-white sm:text-base">
            Search Documents
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Ask questions about PDFs, DOCX, PPT, TXT and other
            uploaded files.
          </p>

        </div>


        {/* AI Answers */}

        <div
          className="
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            p-4
            text-left
            transition
            hover:border-violet-500
            sm:p-5
          "
        >

          <div
            className="
              mb-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-violet-600/20
            "
          >
            <Sparkles className="h-5 w-5 text-violet-400" />
          </div>

          <h3 className="text-sm font-semibold text-white sm:text-base">
            AI Powered Answers
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Receive contextual answers generated directly from
            your uploaded documents.
          </p>

        </div>

      </div>


      {/* Hint */}

      <p className="mt-6 text-xs text-zinc-500 sm:mt-8">
        Start by asking a question below 👇
      </p>

    </div>

  );
};

export default ChatWelcome;
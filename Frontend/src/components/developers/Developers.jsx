import { motion } from "framer-motion";

import DeveloperCard from "./DeveloperCard";
import { developers } from "./developersData";

export default function Developers() {
  return (
    <section
      id="developers"
      className="relative overflow-hidden py-10"
    >
      {/* Background Glow */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div
          className="
            absolute
            left-0
            top-20
            h-96
            w-96
            rounded-full
            bg-violet-500/10
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            right-0
            bottom-10
            h-96
            w-96
            rounded-full
            bg-cyan-500/10
            blur-[160px]
          "
        />

      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-3xl text-center"
        >

          <p
            className="
              font-semibold
              uppercase
              tracking-[0.3em]
              text-violet-500
            "
          >
            Behind RAGify
          </p>

          <h2 className="mt-5 text-4xl font-bold lg:text-5xl">

            Built by Passionate
            <br />
            Software Engineers

          </h2>

          <p
            className="
              mt-6
              text-lg
              leading-8
              text-muted-foreground
            "
          >
            RAGify is collaboratively developed by passionate
            developers focused on creating modern AI-powered
            applications using Retrieval-Augmented Generation,
            Gemini AI, ChromaDB and the MERN Stack.

          </p>

        </motion.div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 lg:grid-cols-2">

          {developers.map((developer, index) => (

            <motion.div
              key={developer.id}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
              }}
            >

              <DeveloperCard
                developer={developer}
              />

            </motion.div>

          ))}

        </div>

        {/* Bottom Quote */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className="
            mx-auto
            mt-20
            max-w-4xl
            rounded-3xl
            border
            bg-background/50
            p-8
            text-center
            backdrop-blur-xl
          "
        >

          <p
            className="
              text-xl
              font-medium
              italic
              text-muted-foreground
              leading-9
            "
          >
            "We believe AI should augment 
            human intelligence—not replace it. 
            RAGify is our vision of making document 
            understanding faster, smarter and accessible 
            to everyone."
          </p>

        </motion.div>

      </div>
    </section>
  );
}
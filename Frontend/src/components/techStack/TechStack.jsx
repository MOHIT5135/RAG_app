import { motion } from "framer-motion";
import { techStack, highlights } from "./techStackData";
import TechCategory from "./TechCategory";

export default function TechStack() {
  return (
    <section className="relative overflow-hidden py-16">

      {/* Background Glow */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-violet-500/10 blur-[160px]" />

        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[180px]" />

      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >

          <p className="font-semibold uppercase tracking-[0.35em] text-violet-500">

            Technology Stack

          </p>

          <h2 className="mt-5 text-4xl font-bold lg:text-5xl">

            Built With Modern
            <br />
            AI Technologies

          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">

            RAGify combines modern frontend technologies,
            scalable backend services, AI models and vector
            databases into one production-ready application.

          </p>

        </motion.div>

        {/* Categories */}

        <div className="mt-20 grid gap-8 lg:grid-cols-2">

          {techStack.map((category, index) => (

            <motion.div
              key={category.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
              }}
            >

              <TechCategory
                {...category}
              />

            </motion.div>

          ))}

        </div>

        {/* Bottom Highlights */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
          }}
          className="mt-20"
        >

          <div
            className="
              rounded-3xl
              border
              bg-background/60
              backdrop-blur-xl
              p-8
            "
          >

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              {highlights.map((item) => (

                <div
                  key={item.title}
                  className="text-center"
                >

                  <p className="text-3xl font-bold text-violet-500">

                    {item.value}

                  </p>

                  <p className="mt-2 text-muted-foreground">

                    {item.title}

                  </p>

                </div>

              ))}

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
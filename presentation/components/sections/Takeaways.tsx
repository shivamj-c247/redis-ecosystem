"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const TAKEAWAYS = [
  {
    line: "Redis is more than a cache.",
    sub: "It's a multi-model database disguised as one.",
  },
  {
    line: "Data structures > strings.",
    sub: "Hashes, Sorted Sets, Streams collapse complex problems.",
  },
  {
    line: "Vector search lives in Redis.",
    sub: "One system for KV, search, vectors, and pubsub.",
  },
  {
    line: "AI workloads are Redis workloads.",
    sub: "Cache, RAG, memory, sessions — same engine.",
  },
];

export function Takeaways() {
  return (
    <SectionWrapper
      id="takeaways"
      number={21}
      eyebrow="The four things"
      title={
        <>
          What to <span className="gradient-text">walk away</span> with.
        </>
      }
    >
      <div className="space-y-6">
        {TAKEAWAYS.map((t, i) => (
          <motion.div
            key={t.line}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex items-baseline gap-6 border-b border-redis-line/60 pb-6"
          >
            <span className="font-mono text-3xl text-redis-red/60 md:text-5xl">
              0{i + 1}
            </span>
            <div className="flex-1">
              <h3 className="text-balance text-2xl font-semibold leading-tight md:text-4xl">
                {t.line}
              </h3>
              <p className="mt-2 text-redis-muted md:text-lg">{t.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-16 grid gap-4 md:grid-cols-2"
      >
        <a
          href="/appendix"
          className="glass group flex items-center justify-between gap-4 rounded-2xl p-6 transition-colors hover:border-redis-red/40"
        >
          <div>
            <div className="text-xs uppercase tracking-widest text-redis-red">
              Bonus
            </div>
            <div className="mt-1 text-xl font-semibold">Redis ecosystem</div>
            <div className="mt-1 text-sm text-redis-muted">
              JSON · Search · Stack · Insight · OM · Vector Sets
            </div>
          </div>
          <ArrowUpRight className="text-redis-muted transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-redis-red" />
        </a>

        <a
          href="#"
          className="group flex items-center justify-between gap-4 rounded-2xl bg-redis-red p-6 transition-all hover:shadow-[0_0_40px_rgba(220,56,45,0.4)]"
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/80">
              <Sparkles size={12} />
              Try the practicals
            </div>
            <div className="mt-1 text-xl font-semibold">6 runnable demos</div>
            <div className="mt-1 text-sm text-white/80">
              cache · langcache · search · RAG · idempotency · memory
            </div>
          </div>
          <Github className="text-white/90 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </a>
      </motion.div>

      <div className="mt-20 text-center">
        <div className="text-xs uppercase tracking-widest text-redis-muted">
          Thank you
        </div>
        <div className="mt-2 text-balance text-2xl text-white/90 md:text-3xl">
          Questions?
        </div>
      </div>
    </SectionWrapper>
  );
}

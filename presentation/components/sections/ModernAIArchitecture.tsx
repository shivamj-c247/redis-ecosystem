"use client";

import { motion } from "framer-motion";
import { Search, Brain, Database, Bot, FileSearch } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const PIPELINE = [
  { label: "User query", sub: "natural language", tone: "white" },
  { label: "Embedding model", sub: "text → vector", tone: "amber" },
  { label: "Redis Vector DB", sub: "KNN retrieval", tone: "red" },
  { label: "Relevant context", sub: "top-k documents", tone: "amber" },
  { label: "LLM", sub: "generate answer", tone: "amber" },
  { label: "AI response", sub: "grounded + cited", tone: "white" },
] as const;

const CARDS = [
  { icon: Search, title: "Vector Search", body: "HNSW KNN over embeddings — millions of vectors in milliseconds." },
  { icon: FileSearch, title: "Semantic Retrieval", body: "Pull documents by meaning to ground the model's answer." },
  { icon: Database, title: "AI Memory", body: "Durable long-term knowledge the model can query on demand." },
  { icon: Bot, title: "Agent Memory", body: "Per-session and per-agent state, tools, and scratchpads." },
  { icon: Brain, title: "Context Retrieval", body: "Assemble just-in-time context windows from Redis." },
];

export function ModernAIArchitecture() {
  return (
    <SectionWrapper
      id="ai-architecture"
      number={15}
      eyebrow="Architecture"
      title={
        <>
          Redis in <span className="gradient-text">modern AI</span> systems.
        </>
      }
      description="The retrieval-augmented generation (RAG) loop — Redis sits at the center as the vector store, memory, and cache."
    >
      {/* RAG pipeline with animated flow */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-redis-red">
            Retrieval-Augmented Generation (RAG)
          </span>
          <span className="rounded-full bg-redis-red/15 px-3 py-1 text-xs text-redis-redLight">
            data flow
          </span>
        </div>

        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:overflow-x-auto md:pb-2">
          {PIPELINE.map((node, i) => (
            <div key={node.label} className="flex items-center gap-3 md:shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`min-w-[150px] rounded-xl border px-4 py-3 ${
                  node.tone === "red"
                    ? "border-redis-red/50 bg-redis-red/10"
                    : node.tone === "amber"
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-white/20 bg-white/5"
                }`}
              >
                <div className="font-medium">{node.label}</div>
                <div className="mt-0.5 text-xs text-redis-muted">{node.sub}</div>
              </motion.div>
              {i < PIPELINE.length - 1 && (
                <div className="relative hidden h-px w-8 overflow-hidden bg-redis-line md:block">
                  <motion.span
                    className="absolute inset-y-0 left-0 w-3 bg-redis-red"
                    animate={{ x: ["-12px", "32px"] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Capability cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-5"
          >
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-redis-red/15 text-redis-red">
              <c.icon size={18} />
            </div>
            <div className="font-semibold">{c.title}</div>
            <div className="mt-1.5 text-sm text-redis-muted">{c.body}</div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

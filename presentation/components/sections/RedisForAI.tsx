"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Search, Database } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { VectorSpace } from "@/components/vis/VectorSpace";
import { EmbeddingFlow } from "@/components/vis/EmbeddingFlow";

const CARDS = [
  {
    icon: Sparkles,
    title: "Vector Search",
    body: "HNSW + cosine on FLOAT32 buffers — KNN over millions of vectors in milliseconds.",
  },
  {
    icon: Brain,
    title: "Embeddings",
    body: "Store the output of any embedding model as a hash field. No separate vector DB.",
  },
  {
    icon: Search,
    title: "Semantic Search",
    body: "Find by meaning, not by keyword. The user's intent maps to the closest doc.",
  },
  {
    icon: Database,
    title: "AI Memory",
    body: "Lists, Hashes, Streams — session memory, agent state, conversation history.",
  },
];

export function RedisForAI() {
  return (
    <SectionWrapper
      id="redis-ai"
      number={10}
      eyebrow="Redis for AI"
      title={
        <>
          One database for
          <span className="gradient-text"> every AI workload.</span>
        </>
      }
      description="Vector store, semantic cache, session memory, rate limit. Production AI systems stitch four of these together — and Redis does all four."
    >
      <div className="mb-12">
        <EmbeddingFlow />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_460px]">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
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

          <div className="mt-6">
            <CodeBlock
              language="bash"
              code={`# One-time: create a vector index
FT.CREATE idx:rag ON HASH PREFIX 1 rag:doc:
  SCHEMA embedding VECTOR HNSW 6
         TYPE FLOAT32 DIM 768
         DISTANCE_METRIC COSINE
         title TEXT body TEXT

# Per query: KNN top-3
FT.SEARCH idx:rag "*=>[KNN 3 @embedding $vec AS score]"
  PARAMS 2 vec <bytes> SORTBY score DIALECT 2`}
            />
          </div>
        </div>

        <div className="glass aspect-square overflow-hidden rounded-2xl p-2">
          <VectorSpace />
          <div className="mt-2 text-center text-xs text-redis-muted">
            20 corpus vectors projected to 2D
          </div>
        </div>
      </div>

      <RAGDiagram />
    </SectionWrapper>
  );
}

function RAGDiagram() {
  const steps = [
    { label: "Question", sub: "user input", color: "white" },
    { label: "Embed", sub: "text → vector", color: "amber" },
    { label: "Redis", sub: "KNN top-k", color: "red" },
    { label: "LLM", sub: "answer + context", color: "amber" },
    { label: "Answer", sub: "+ sources", color: "white" },
  ];

  return (
    <div className="mt-16">
      <div className="mb-4 text-xs uppercase tracking-widest text-redis-red">
        RAG Architecture
      </div>
      <div className="glass overflow-x-auto rounded-2xl p-6">
        <div className="flex min-w-[640px] items-center justify-between gap-3">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`rounded-xl border px-4 py-3 ${
                  s.color === "red"
                    ? "border-redis-red/50 bg-redis-red/10"
                    : s.color === "amber"
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-white/20 bg-white/5"
                }`}
              >
                <div className="font-medium">{s.label}</div>
                <div className="mt-0.5 text-xs text-redis-muted">{s.sub}</div>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.1, duration: 0.4 }}
                  className="h-px w-8 origin-left bg-gradient-to-r from-redis-red to-transparent"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

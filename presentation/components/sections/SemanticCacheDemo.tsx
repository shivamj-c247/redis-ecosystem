"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Zap } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { VectorSpace } from "@/components/vis/VectorSpace";
import { CodeBlock } from "@/components/ui/CodeBlock";

const EXAMPLES = [
  "What is Redis?",
  "Explain Redis to me",
  "How do I cache LLM responses?",
  "Tell me about vector search",
  "Can Redis handle rate limiting?",
];

export function SemanticCacheDemo() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  function submit(text: string) {
    setQuery(text);
    setSubmitted(text);
  }

  return (
    <SectionWrapper
      id="semantic-cache"
      number={11}
      eyebrow="Live demo"
      title={
        <>
          Type a question.<br />
          <span className="gradient-text">Watch the cache decide.</span>
        </>
      }
      description="Different wording, same intent → semantic hit. This is what Practical 2 does for real with Gemini embeddings + Redis Vector."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_460px]">
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(query);
              }}
              className="flex items-center gap-3"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me anything about Redis..."
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-redis-muted"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-redis-red text-white transition-all hover:bg-redis-redLight hover:shadow-[0_0_30px_rgba(220,56,45,0.5)]"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => submit(ex)}
                  className="rounded-full border border-redis-line bg-black/40 px-3 py-1 text-xs text-redis-muted transition-colors hover:border-redis-red/40 hover:text-white"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass space-y-4 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Zap size={14} className="text-redis-red" />
                  <span className="font-mono text-redis-muted">last query</span>
                </div>
                <div className="text-lg">"{submitted}"</div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Latency label="Cache hit" value="4ms" sub="Redis GET" tone="hit" />
                  <Latency
                    label="Cache miss"
                    value="850ms"
                    sub="Gemini roundtrip"
                    tone="miss"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <CodeBlock
            language="js"
            code={`// The real version (Practical 2)
const queryVec = await embed(question);
const r = await redis.ft.search(
  "idx:langcache",
  "*=>[KNN 1 @embedding $vec AS score]",
  { PARAMS: { vec: queryVec }, DIALECT: 2 }
);
if (r.documents[0]?.value.score <= 0.15)
  return r.documents[0].value.answer; // semantic hit`}
          />
        </div>

        <div className="glass aspect-square overflow-hidden rounded-2xl p-2">
          <VectorSpace query={submitted ?? undefined} />
        </div>
      </div>
    </SectionWrapper>
  );
}

function Latency({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "hit" | "miss";
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        tone === "hit"
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-amber-500/30 bg-amber-500/5"
      }`}
    >
      <div className="text-xs uppercase tracking-widest text-redis-muted">{label}</div>
      <div
        className={`mt-1 text-3xl font-semibold ${
          tone === "hit" ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-redis-muted">{sub}</div>
    </div>
  );
}

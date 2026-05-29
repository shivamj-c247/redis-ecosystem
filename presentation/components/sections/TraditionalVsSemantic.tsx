"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ArrowDown } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const FLOW = ["User query", "Embedding", "Vector search", "Hit / Miss"];

export function TraditionalVsSemantic() {
  return (
    <SectionWrapper
      id="cache-vs-semantic"
      number={12}
      eyebrow="Caching"
      title={
        <>
          Traditional vs <span className="gradient-text">Semantic</span> caching.
        </>
      }
      description="Same two questions, two very different outcomes. The difference is whether you match text or meaning."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <CompareCard
          variant="traditional"
          title="Traditional cache"
          subtitle="Exact string match"
          result="Cache MISS"
          explanation="Traditional caching keys on the exact string. A reworded question is a brand-new key — so it misses and calls the LLM again."
        />
        <CompareCard
          variant="semantic"
          title="Semantic cache"
          subtitle="Meaning match via embeddings"
          result="Cache HIT"
          explanation="Semantic caching embeds the query and compares vector similarity. Different words, same intent → it reuses the cached answer."
        />
      </div>

      {/* Flow visualization */}
      <div className="mt-10 glass rounded-2xl p-6">
        <div className="mb-6 text-center text-xs uppercase tracking-widest text-redis-red">
          How a semantic cache decides
        </div>
        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center md:gap-0">
          {FLOW.map((step, i) => (
            <div key={step} className="flex flex-col items-center md:flex-row">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`rounded-xl border px-5 py-3 text-sm font-medium ${
                  i === FLOW.length - 1
                    ? "border-redis-red/50 bg-redis-red/10"
                    : "border-redis-line bg-black/40"
                }`}
              >
                {step}
              </motion.div>
              {i < FLOW.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.1 }}
                  className="text-redis-muted md:mx-3"
                >
                  <ArrowDown size={18} className="md:hidden" />
                  <span className="hidden md:inline">→</span>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-redis-red/20 to-transparent p-px"
      >
        <div className="rounded-2xl bg-redis-ink/60 p-6 text-center">
          <div className="text-xs uppercase tracking-widest text-redis-red">
            Key takeaway
          </div>
          <p className="mt-2 text-balance text-2xl font-semibold md:text-3xl">
            Traditional caching matches <span className="text-redis-muted">text</span>.
            <br className="hidden md:block" /> Semantic caching matches{" "}
            <span className="gradient-text">intent</span>.
          </p>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}

function CompareCard({
  variant,
  title,
  subtitle,
  result,
  explanation,
}: {
  variant: "traditional" | "semantic";
  title: string;
  subtitle: string;
  result: string;
  explanation: string;
}) {
  const isHit = variant === "semantic";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`glass rounded-2xl p-6 ${
        isHit ? "border-emerald-500/20" : "border-amber-500/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="mt-0.5 text-sm text-redis-muted">{subtitle}</div>
        </div>
        {isHit ? (
          <CheckCircle2 className="text-emerald-400" />
        ) : (
          <XCircle className="text-amber-400" />
        )}
      </div>

      <div className="mt-5 space-y-3">
        <QueryRow n={1} text='"What is Redis?"' note="stored in cache" />
        <QueryRow n={2} text='"What does Redis do?"' note="incoming query" highlight />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className={`mt-5 rounded-xl border p-4 text-center text-lg font-semibold ${
          isHit
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : "border-amber-500/30 bg-amber-500/10 text-amber-300"
        }`}
      >
        {result}
      </motion.div>

      <p className="mt-4 text-sm text-redis-muted">{explanation}</p>
    </motion.div>
  );
}

function QueryRow({
  n,
  text,
  note,
  highlight,
}: {
  n: number;
  text: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
        highlight ? "bg-white/5" : "bg-black/30"
      }`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-redis-red/15 font-mono text-xs text-redis-redLight">
        {n}
      </span>
      <span className="font-mono text-sm">{text}</span>
      <span className="ml-auto text-xs text-redis-muted">{note}</span>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Gauge,
  PiggyBank,
  Bot,
  Layers,
  Check,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const FEATURES = [
  { icon: Sparkles, title: "Semantic caching", body: "Match by meaning, not exact text — paraphrases hit the cache." },
  { icon: Wand2, title: "Automatic embeddings", body: "LangCache generates and indexes embeddings for you." },
  { icon: Gauge, title: "Faster responses", body: "Cache hits return in milliseconds instead of an LLM roundtrip." },
  { icon: PiggyBank, title: "Lower LLM costs", body: "Every hit is a token charge you never pay." },
  { icon: Bot, title: "AI agent optimization", body: "Reuse tool/agent responses across similar requests." },
  { icon: Layers, title: "RAG optimization", body: "Cache retrieved-and-generated answers at the edge of your pipeline." },
];

const WHY = [
  "No infrastructure to manage",
  "Fully managed service",
  "Built on Redis Vector Database",
  "Cost optimization out of the box",
  "Faster AI applications",
];

export function LangCache() {
  return (
    <SectionWrapper
      id="langcache"
      number={14}
      eyebrow="Managed service"
      title={
        <>
          Redis <span className="gradient-text">LangCache</span>.
        </>
      }
      description="Managed semantic caching for AI applications — the pattern from Practical 2, without running the vector index yourself."
    >
      {/* Feature grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-5"
          >
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-redis-red/15 text-redis-red">
              <f.icon size={18} />
            </div>
            <div className="font-semibold">{f.title}</div>
            <div className="mt-1.5 text-sm text-redis-muted">{f.body}</div>
          </motion.div>
        ))}
      </div>

      {/* Architecture / decision flow */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <div className="mb-6 text-xs uppercase tracking-widest text-redis-red">
            How LangCache serves a query
          </div>

          <div className="flex flex-col items-center gap-3">
            <FlowNode label="User query" />
            <Down />
            <FlowNode label="LangCache" accent />
            <Down />
            <FlowNode label="Embedding generation" />
            <Down />
            <FlowNode label="Vector search" />
            <Down />
            <FlowNode label="Match found?" diamond />

            <div className="mt-2 grid w-full gap-3 sm:grid-cols-2">
              <Branch
                tone="good"
                head="YES → Cache hit"
                lines={["Return cached response", "~milliseconds, no LLM cost"]}
              />
              <Branch
                tone="bad"
                head="NO → Cache miss"
                lines={["Call the LLM", "Store response for next time"]}
              />
            </div>
          </div>
        </div>

        {/* Why LangCache */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 text-xs uppercase tracking-widest text-redis-red">
            Why LangCache?
          </div>
          <ul className="space-y-3">
            {WHY.map((w, i) => (
              <motion.li
                key={w}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check size={12} />
                </span>
                <span className="text-sm text-white/90">{w}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}

function FlowNode({
  label,
  accent,
  diamond,
}: {
  label: string;
  accent?: boolean;
  diamond?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`px-5 py-2.5 text-sm font-medium ${
        diamond
          ? "rotate-0 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200"
          : accent
          ? "rounded-xl border border-redis-red/50 bg-redis-red/10 text-redis-redLight"
          : "rounded-xl border border-redis-line bg-black/40"
      }`}
    >
      {label}
    </motion.div>
  );
}

function Down() {
  return <ArrowDown size={16} className="text-redis-muted" />;
}

function Branch({
  tone,
  head,
  lines,
}: {
  tone: "good" | "bad";
  head: string;
  lines: string[];
}) {
  const good = tone === "good";
  return (
    <div
      className={`rounded-xl border p-4 ${
        good
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-amber-500/30 bg-amber-500/5"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 text-sm font-semibold ${
          good ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        <ArrowRight size={14} />
        {head}
      </div>
      <ul className="mt-2 space-y-1">
        {lines.map((l) => (
          <li key={l} className="text-xs text-redis-muted">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

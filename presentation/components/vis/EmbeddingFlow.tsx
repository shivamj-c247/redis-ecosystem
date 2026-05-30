"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const VECTOR_PREVIEW = [0.12, -0.34, 0.81, 0.05, -0.67, 0.42, 0.91];
const EMBED_MODEL = "gemini-embedding-001";
const EMBED_DIM = "768d";

export function EmbeddingFlow() {
  return (
    <div className="grid items-center gap-4 rounded-2xl border border-redis-line bg-black/40 p-6 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <Node
        title="Input"
        body='"What is Redis?"'
        kind="text"
      />
      <Arrow />
      <Node
        title="Embed model"
        body={EMBED_MODEL}
        kind="model"
        icon={<Sparkles size={14} />}
      />
      <Arrow />
      <Node
        title={`Vector (${EMBED_DIM})`}
        body={
          <div className="font-mono text-[11px] text-amber-200">
            [
            {VECTOR_PREVIEW.map((v, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {v.toFixed(2)}
                {i < VECTOR_PREVIEW.length - 1 ? ", " : ""}
              </motion.span>
            ))}
            {", ..."} ]
          </div>
        }
        kind="vec"
      />
    </div>
  );
}

function Node({
  title,
  body,
  kind,
  icon,
}: {
  title: string;
  body: React.ReactNode;
  kind: "text" | "model" | "vec";
  icon?: React.ReactNode;
}) {
  const tint =
    kind === "text"
      ? "border-white/20 bg-white/5"
      : kind === "model"
      ? "border-redis-red/40 bg-redis-red/10"
      : "border-amber-500/40 bg-amber-500/5";
  return (
    <div className={`rounded-xl border p-4 ${tint}`}>
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-redis-muted">
        {icon}
        {title}
      </div>
      <div className="mt-2 text-sm">{body}</div>
    </div>
  );
}

function Arrow() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="hidden md:block"
    >
      <ArrowRight size={20} className="text-redis-muted" />
    </motion.div>
  );
}

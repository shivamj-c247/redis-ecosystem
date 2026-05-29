"use client";

import { motion } from "framer-motion";
import { Database, Zap, Check, X, GitBranch } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const COMPARE: { dim: string; db: string; redis: string }[] = [
  { dim: "Storage", db: "Disk (pages, buffer pool)", redis: "RAM (optional persistence)" },
  { dim: "Read latency", db: "~10–50 ms", redis: "< 1 ms" },
  { dim: "Data model", db: "Relational tables", redis: "Strings, Hashes, Sets, ZSets, Streams, JSON, Vectors" },
  { dim: "Query", db: "SQL, joins, ad-hoc", redis: "Key access + structure ops" },
  { dim: "Scaling", db: "Vertical, read replicas", redis: "Horizontal (cluster sharding)" },
  { dim: "Durability", db: "Strong (ACID)", redis: "Tunable (RDB / AOF)" },
  { dim: "Best at", db: "Source of truth, complex queries", redis: "Speed layer, caching, real-time" },
];

const PERF = [
  { label: "Cache GET (Redis)", value: 1, suffix: " ms", tone: "redis" as const },
  { label: "Indexed SQL read", value: 15, suffix: " ms", tone: "db" as const },
  { label: "Uncached join", value: 120, suffix: " ms", tone: "db" as const },
];

export function TraditionalDbVsRedis() {
  const maxPerf = Math.max(...PERF.map((p) => p.value));
  return (
    <SectionWrapper
      id="db-vs-redis"
      number={7}
      eyebrow="Comparison"
      title={
        <>
          Traditional database vs <span className="gradient-text">Redis</span>.
        </>
      }
      description="They're not rivals — they're layers. A database is your source of truth; Redis is the speed layer in front of it."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Comparison table */}
        <div className="glass overflow-hidden rounded-2xl">
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] border-b border-redis-line text-xs uppercase tracking-widest">
            <div className="p-4 text-redis-muted">Dimension</div>
            <div className="flex items-center gap-1.5 p-4 text-redis-muted">
              <Database size={13} /> Traditional DB
            </div>
            <div className="flex items-center gap-1.5 p-4 text-redis-red">
              <Zap size={13} /> Redis
            </div>
          </div>
          {COMPARE.map((row, i) => (
            <motion.div
              key={row.dim}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-[1fr_1.2fr_1.2fr] border-b border-redis-line/50 text-sm last:border-0"
            >
              <div className="p-4 font-medium">{row.dim}</div>
              <div className="p-4 text-redis-muted">{row.db}</div>
              <div className="p-4 text-white/90">{row.redis}</div>
            </motion.div>
          ))}
        </div>

        {/* Performance comparison */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-5 text-xs uppercase tracking-widest text-redis-red">
            Typical read latency
          </div>
          <div className="space-y-4">
            {PERF.map((p) => (
              <div key={p.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-redis-muted">{p.label}</span>
                  <span className="font-mono font-semibold">
                    <AnimatedCounter to={p.value} suffix={p.suffix} />
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(p.value / maxPerf) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${
                      p.tone === "redis"
                        ? "bg-gradient-to-r from-redis-red to-redis-redLight"
                        : "bg-white/20"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-redis-muted">
            Lower is better. Redis serves the hot path; the DB stays the system of record.
          </p>
        </div>
      </div>

      {/* Architecture: DB alone vs DB + Redis */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ArchCard
          title="Without Redis"
          nodes={["App", "Database"]}
          note="Every request hits disk. Latency and DB load grow with traffic."
        />
        <ArchCard
          title="With Redis as speed layer"
          nodes={["App", "Redis (cache)", "Database"]}
          note="Hot reads served from RAM; the DB only sees cache misses."
          accent
        />
      </div>

      {/* Decision tree */}
      <div className="mt-6 glass rounded-2xl p-6">
        <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-widest text-redis-red">
          <GitBranch size={14} />
          When should you reach for Redis?
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Decision
            tone="yes"
            head="Use Redis when…"
            items={[
              "The same data is read far more than written",
              "You need sub-ms latency on the hot path",
              "Sessions, rate limits, queues, leaderboards",
              "Real-time: pub/sub, streams, live counters",
              "Vector search / semantic cache for AI",
            ]}
          />
          <Decision
            tone="no"
            head="Stick with a database when…"
            items={[
              "You need ACID transactions across many rows",
              "Complex ad-hoc queries and joins",
              "Data must never be lost (system of record)",
              "Working set is far larger than affordable RAM",
            ]}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

function ArchCard({
  title,
  nodes,
  note,
  accent,
}: {
  title: string;
  nodes: string[];
  note: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass rounded-2xl p-6 ${accent ? "border-redis-red/40" : ""}`}
    >
      <div className="mb-4 text-sm font-semibold">{title}</div>
      <div className="flex items-center gap-2">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center gap-2">
            <span
              className={`rounded-lg px-3 py-2 text-sm ${
                accent && n.startsWith("Redis")
                  ? "bg-redis-red/15 text-redis-redLight"
                  : "bg-white/5 text-white/90"
              }`}
            >
              {n}
            </span>
            {i < nodes.length - 1 && <span className="text-redis-muted">→</span>}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-redis-muted">{note}</p>
    </motion.div>
  );
}

function Decision({
  tone,
  head,
  items,
}: {
  tone: "yes" | "no";
  head: string;
  items: string[];
}) {
  const yes = tone === "yes";
  return (
    <div
      className={`rounded-xl border p-5 ${
        yes ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"
      }`}
    >
      <div
        className={`mb-3 text-sm font-semibold ${
          yes ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        {head}
      </div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-white/90">
            {yes ? (
              <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />
            ) : (
              <X size={14} className="mt-0.5 shrink-0 text-amber-300" />
            )}
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

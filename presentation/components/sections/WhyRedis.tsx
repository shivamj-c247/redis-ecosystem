"use client";

import { motion } from "framer-motion";
import { Zap, Database, MessageSquare, Layers, Clock, BrainCircuit } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const CARDS = [
  {
    icon: Zap,
    title: "Sub-millisecond",
    body: "In-memory store with single-threaded event loop. p99 < 1ms under load.",
    user: "Twitter timeline",
  },
  {
    icon: Database,
    title: "More than KV",
    body: "Strings, Hashes, Lists, Sets, Sorted Sets, Streams, Vectors. The right tool per job.",
    user: "Instagram, Pinterest",
  },
  {
    icon: MessageSquare,
    title: "Pub/Sub + Streams",
    body: "Fire-and-forget channels for live UIs, append-only logs for event sourcing.",
    user: "Slack, Discord",
  },
  {
    icon: Layers,
    title: "Caching that scales",
    body: "Sit between your app and the DB. Or between your app and OpenAI.",
    user: "Stripe, Shopify",
  },
  {
    icon: Clock,
    title: "TTL everywhere",
    body: "Built-in expiry on every key. Sessions, rate limits, idempotency — for free.",
    user: "GitHub sessions",
  },
  {
    icon: BrainCircuit,
    title: "Vectors for AI",
    body: "RediSearch + HNSW = production-grade vector DB inside the same Redis.",
    user: "OpenAI ecosystem",
  },
];

const STATS = [
  { value: 100, suffix: "k+", label: "ops/sec/node", decimals: 0 },
  { value: 1, suffix: "ms", label: "p99 latency", decimals: 1, prefix: "<" },
  { value: 30, suffix: " years", label: "of Redis", decimals: 0 },
  { value: 16384, suffix: "", label: "hash slots in cluster", decimals: 0 },
];

export function WhyRedis() {
  return (
    <SectionWrapper
      id="why-redis"
      number={2}
      eyebrow="Why Redis"
      title={
        <>
          The most underused
          <span className="gradient-text"> infrastructure </span>
          in your stack.
        </>
      }
      description="Redis went from a session cache to a multi-model database that quietly powers half the internet. Here's what it really is in 2026."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className="group glass relative overflow-hidden rounded-2xl p-6"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-redis-red/0 to-redis-red/0 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-redis-red/15 text-redis-red transition-colors group-hover:bg-redis-red group-hover:text-white">
              <card.icon size={20} />
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-redis-muted">{card.body}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-redis-muted">
              <span className="h-px w-4 bg-redis-red" />
              Used at: <span className="text-white/80">{card.user}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="text-3xl font-semibold text-white md:text-4xl">
              <AnimatedCounter
                to={s.value}
                prefix={s.prefix ?? ""}
                suffix={s.suffix}
                decimals={s.decimals}
              />
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-redis-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

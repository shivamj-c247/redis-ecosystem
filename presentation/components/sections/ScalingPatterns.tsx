"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Shield, UserCheck, Radio, Lock, Activity, ChevronDown } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface Pattern {
  id: string;
  icon: typeof Gauge;
  title: string;
  blurb: string;
  pros: string[];
  cons: string[];
  cmd: string;
}

const PATTERNS: Pattern[] = [
  {
    id: "cache",
    icon: Gauge,
    title: "API Caching",
    blurb: "Sit between your app and your slow upstream. Save latency and dollars.",
    pros: ["Sub-ms reads", "Tunable TTL", "Drop-in for any HTTP layer"],
    cons: ["Stale-data risk", "Eviction strategy required"],
    cmd: 'SET cache:user:42 "{...}" EX 300\nGET cache:user:42',
  },
  {
    id: "rate-limit",
    icon: Shield,
    title: "Rate Limiting",
    blurb: "Fixed-window or token-bucket counters with TTL.",
    pros: ["O(1) per request", "Accurate per-window", "Works across a fleet"],
    cons: ["Window boundary spikes", "Tune TTL carefully"],
    cmd: "INCR rate:user:42:60s\nEXPIRE rate:user:42:60s 60",
  },
  {
    id: "session",
    icon: UserCheck,
    title: "Session Storage",
    blurb: "Stateless web servers, stateful Redis. Sliding TTL refreshes on access.",
    pros: ["Global access", "Auto-expiry", "Tiny memory footprint"],
    cons: ["Lose session if Redis lost", "Replicate for HA"],
    cmd: "HSET sess:abc user 42 csrf x\nEXPIRE sess:abc 1800",
  },
  {
    id: "pubsub",
    icon: Radio,
    title: "Pub / Sub",
    blurb: "Fire-and-forget broadcast to all subscribers of a channel.",
    pros: ["Real-time UI updates", "Cache invalidation broadcasts"],
    cons: ["No durability", "No replay", "Use Streams if you need either"],
    cmd: "PUBLISH chat.42 \"hello\"\nSUBSCRIBE chat.42",
  },
  {
    id: "lock",
    icon: Lock,
    title: "Distributed Locks",
    blurb: "SET NX EX — the textbook safe-by-default lock primitive.",
    pros: ["Two commands total", "TTL prevents zombie locks"],
    cons: ["Single-node failure scenarios", "Consider Redlock for HA"],
    cmd: 'SET lock:foo "$token" NX EX 10\nDEL lock:foo  // by holder only',
  },
  {
    id: "realtime",
    icon: Activity,
    title: "Real-time Systems",
    blurb: "Streams + Pub/Sub + Sorted Sets — the live-app trifecta.",
    pros: ["Event sourcing built-in", "Consumer groups for parallelism"],
    cons: ["Bound memory or trim aggressively", "Plan retention up-front"],
    cmd: "XADD events * type click\nXREADGROUP GROUP g c COUNT 10",
  },
];

export function ScalingPatterns() {
  const [open, setOpen] = useState<string | null>(PATTERNS[0].id);

  return (
    <SectionWrapper
      id="scaling"
      number={6}
      eyebrow="Scaling"
      title={
        <>
          Six patterns that <span className="gradient-text">absorb 80%</span> of
          backend complexity.
        </>
      }
      description="Each of these is a battle-tested Redis recipe. Open one to see the trade-offs and the canonical commands."
    >
      <div className="space-y-3">
        {PATTERNS.map((p) => (
          <PatternRow
            key={p.id}
            pattern={p}
            isOpen={open === p.id}
            onToggle={() => setOpen(open === p.id ? null : p.id)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

function PatternRow({
  pattern,
  isOpen,
  onToggle,
}: {
  pattern: Pattern;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = pattern.icon;
  return (
    <motion.div layout className="glass overflow-hidden rounded-2xl">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-redis-red/15 text-redis-red">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="font-semibold">{pattern.title}</div>
          <div className="mt-0.5 text-sm text-redis-muted">{pattern.blurb}</div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={18} className="text-redis-muted" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid gap-4 border-t border-redis-line px-5 pb-5 pt-4 lg:grid-cols-2">
              <div className="space-y-3">
                <ProsCons label="Pros" items={pattern.pros} variant="pro" />
                <ProsCons label="Cons" items={pattern.cons} variant="con" />
              </div>
              <CodeBlock code={pattern.cmd} language="bash" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProsCons({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: "pro" | "con";
}) {
  return (
    <div>
      <div
        className={`mb-2 text-xs uppercase tracking-widest ${
          variant === "pro" ? "text-emerald-400" : "text-amber-300"
        }`}
      >
        {label}
      </div>
      <ul className="space-y-1.5 text-sm">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <span
              className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                variant === "pro" ? "bg-emerald-400" : "bg-amber-300"
              }`}
            />
            <span className="text-redis-muted">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

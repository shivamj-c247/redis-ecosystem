"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

interface Alt {
  id: string;
  name: string;
  tagline: string;
  vs: string;
  pros: string[];
  cons: string[];
  verdict: string;
}

const ALTS: Alt[] = [
  {
    id: "memcached",
    name: "Memcached",
    tagline: "Pure in-memory string cache",
    vs: "Redis vs Memcached",
    pros: ["Dead simple", "Multi-threaded", "Great raw KV throughput"],
    cons: [
      "Strings only — no data structures",
      "No persistence",
      "No replication / cluster built in",
      "No pub/sub, streams, or vectors",
    ],
    verdict: "Pick Memcached for a trivial volatile cache. Pick Redis the moment you need structure, persistence, or HA.",
  },
  {
    id: "hazelcast",
    name: "Hazelcast",
    tagline: "JVM in-memory data grid",
    vs: "Redis vs Hazelcast",
    pros: ["Distributed compute + data", "Native Java objects", "Strong for JVM stacks"],
    cons: [
      "JVM-centric, heavier ops",
      "Smaller ecosystem outside Java",
      "More complex to operate",
    ],
    verdict: "Hazelcast fits deep JVM/compute-grid use. Redis is lighter, polyglot, and far more widely adopted.",
  },
  {
    id: "aerospike",
    name: "Aerospike",
    tagline: "Hybrid RAM + flash (SSD) store",
    vs: "Redis vs Aerospike",
    pros: ["Huge datasets on SSD economically", "Predictable low latency at scale", "Strong consistency options"],
    cons: [
      "Fewer data structures than Redis",
      "Heavier to run for small workloads",
      "Smaller community",
    ],
    verdict: "Aerospike wins for terabyte-scale on flash. Redis wins for rich structures and developer velocity.",
  },
  {
    id: "dax",
    name: "DynamoDB DAX",
    tagline: "Managed cache for DynamoDB",
    vs: "Redis vs DynamoDB DAX",
    pros: ["Zero-code cache for DynamoDB", "Fully managed by AWS", "Microsecond reads for DDB items"],
    cons: [
      "Only caches DynamoDB",
      "No general data structures",
      "Locked to AWS + DynamoDB",
    ],
    verdict: "DAX is perfect if your only need is caching DynamoDB. Redis is a general-purpose data layer for anything.",
  },
];

export function RedisAlternatives() {
  const [active, setActive] = useState(0);
  const alt = ALTS[active];

  return (
    <SectionWrapper
      id="alternatives"
      number={8}
      eyebrow="Landscape"
      title={
        <>
          Redis vs <span className="gradient-text">the alternatives</span>.
        </>
      }
      description="Every in-memory store makes trade-offs. Here's where the popular ones beat Redis — and where Redis pulls ahead."
    >
      <div className="flex flex-wrap gap-2">
        {ALTS.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              i === active
                ? "bg-redis-red text-white shadow-[0_0_20px_rgba(220,56,45,0.4)]"
                : "glass text-redis-muted hover:text-white"
            }`}
          >
            {a.vs}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={alt.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-2xl font-semibold">{alt.name}</h3>
              <div className="mt-1 text-sm text-redis-muted">{alt.tagline}</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                <div className="mb-3 text-xs uppercase tracking-widest text-emerald-400">
                  Where {alt.name} is strong
                </div>
                <ul className="space-y-2">
                  {alt.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-white/90">
                      <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                <div className="mb-3 text-xs uppercase tracking-widest text-amber-300">
                  Where Redis pulls ahead
                </div>
                <ul className="space-y-2">
                  {alt.cons.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-white/90">
                      <X size={14} className="mt-0.5 shrink-0 text-amber-300" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-redis-red/20 to-transparent p-px">
              <div className="rounded-2xl bg-redis-ink/60 p-5">
                <div className="text-xs uppercase tracking-widest text-redis-red">
                  Verdict
                </div>
                <p className="mt-2 text-lg">{alt.verdict}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}

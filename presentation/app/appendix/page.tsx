"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

const ECOSYSTEM = [
  {
    name: "RedisJSON",
    blurb: "Native JSON documents with JSONPath atomic updates.",
    href: "https://redis.io/docs/latest/develop/data-types/json/",
    tag: "module",
  },
  {
    name: "RediSearch",
    blurb: "Full-text + vector search engine built into Redis.",
    href: "https://redis.io/docs/latest/develop/interact/search-and-query/",
    tag: "module",
  },
  {
    name: "Redis Stack",
    blurb: "Redis + Search + JSON + Bloom + TimeSeries — one image.",
    href: "https://redis.io/about/about-stack/",
    tag: "distribution",
  },
  {
    name: "Redis Insight",
    blurb: "GUI for browsing keys, running queries, and visualizing perf.",
    href: "https://redis.io/insight/",
    tag: "tool",
  },
  {
    name: "Redis OM",
    blurb: "Object-mapping client treating hashes/JSON as typed models.",
    href: "https://redis.io/docs/latest/integrate/redisom-for-node-js/",
    tag: "client",
  },
  {
    name: "Vector Sets",
    blurb: "New native data type for compact, fast vector storage.",
    href: "https://redis.io/blog/",
    tag: "preview",
  },
  {
    name: "LangCache",
    blurb: "Managed semantic LLM cache. REST API on top of Redis Vector.",
    href: "https://redis.io/langcache/",
    tag: "managed",
  },
  {
    name: "RedisBloom",
    blurb: "Probabilistic data structures: Bloom, Cuckoo, Count-Min, Top-K.",
    href: "https://redis.io/docs/latest/develop/data-types/probabilistic/",
    tag: "module",
  },
];

export default function Appendix() {
  return (
    <main className="min-h-screen px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/#takeaways"
          className="inline-flex items-center gap-2 text-sm text-redis-muted transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to keynote
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="text-xs uppercase tracking-widest text-redis-red">
            Appendix · Ecosystem
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold md:text-5xl">
            What ships <span className="gradient-text">around Redis.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-redis-muted">
            Modules, tools, and managed services. None are mandatory — pick what your
            workload needs.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {ECOSYSTEM.map((e, i) => (
            <motion.a
              key={e.name}
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass group rounded-2xl p-6 transition-colors hover:border-redis-red/40"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-redis-red/15 px-2 py-0.5 font-mono text-[10px] uppercase text-redis-redLight">
                  {e.tag}
                </span>
                <ExternalLink size={14} className="text-redis-muted transition-colors group-hover:text-redis-red" />
              </div>
              <div className="text-xl font-semibold">{e.name}</div>
              <div className="mt-2 text-sm text-redis-muted">{e.blurb}</div>
            </motion.a>
          ))}
        </div>
      </div>
    </main>
  );
}

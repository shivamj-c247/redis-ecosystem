"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Container, Info } from "lucide-react";
import { CodeBlock } from "@/components/ui/CodeBlock";

const STEPS = [
  {
    label: "1 · Install Redis with Docker",
    code: "docker run -d --name redis-demo -p 6379:6379 redis:7.4",
  },
  {
    label: "2 · Open the Redis CLI",
    code: "docker exec -it redis-demo redis-cli",
  },
  {
    label: "3 · Verify it's alive",
    code: "PING\n# → PONG",
  },
];

export function DockerQuickStart() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-10 glass overflow-hidden rounded-2xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-redis-red/15 text-redis-red">
          <Container size={18} />
        </div>
        <div className="flex-1">
          <div className="font-semibold">Running Redis locally</div>
          <div className="mt-0.5 text-sm text-redis-muted">
            Quick start with Docker — up in 30 seconds.
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={18} className="text-redis-muted" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-4 border-t border-redis-line p-5">
              <div className="grid gap-4 md:grid-cols-3">
                {STEPS.map((s) => (
                  <div key={s.label} className="space-y-2">
                    <div className="text-xs uppercase tracking-widest text-redis-red">
                      {s.label}
                    </div>
                    <CodeBlock code={s.code} language="bash" />
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-redis-line bg-black/40 p-4 text-sm text-redis-muted">
                <Info size={16} className="mt-0.5 shrink-0 text-redis-red" />
                <span>
                  Prefer a GUI?{" "}
                  <a
                    href="https://redis.io/insight/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-redis-redLight underline-offset-2 hover:underline"
                  >
                    RedisInsight
                  </a>{" "}
                  gives you visual key browsing, query profiling, and live monitoring.
                  Use <code className="rounded bg-white/10 px-1 font-mono">redis:7.4</code>{" "}
                  or the{" "}
                  <code className="rounded bg-white/10 px-1 font-mono">redis/redis-stack</code>{" "}
                  image to get JSON, Search, TimeSeries &amp; probabilistic modules.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

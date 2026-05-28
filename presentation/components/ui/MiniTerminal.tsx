"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";

export interface TermStep {
  cmd: string;
  out: string | string[];
}

interface Props {
  steps: TermStep[];
  // Change this to replay the animation (e.g. the active structure id).
  replayKey?: string | number;
  prompt?: string;
  className?: string;
}

// Scripted terminal: types each command, then reveals its output with a stagger.
// Not a live engine (see FakeTerminal for that) — this is for canned, reliable
// keynote demos across data types the live engine doesn't implement.
export function MiniTerminal({
  steps,
  replayKey = 0,
  prompt = "127.0.0.1:6379>",
  className = "",
}: Props) {
  const [visible, setVisible] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    setVisible(0);
    const timers: NodeJS.Timeout[] = [];
    for (let i = 1; i <= steps.length; i++) {
      timers.push(setTimeout(() => setVisible(i), 350 + i * 650));
    }
    return () => timers.forEach(clearTimeout);
  }, [replayKey, steps.length]);

  async function copy(cmd: string, i: number) {
    await navigator.clipboard.writeText(cmd);
    setCopied(i);
    setTimeout(() => setCopied((c) => (c === i ? null : c)), 1400);
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-redis-line bg-black/70 ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-redis-line px-4 py-2.5">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-3 font-mono text-xs text-redis-muted">redis-cli</span>
      </div>

      <div className="min-h-[180px] space-y-2 p-4 font-mono text-[13px] leading-relaxed">
        <AnimatePresence initial={false}>
          {steps.slice(0, visible).map((step, i) => {
            const outLines = Array.isArray(step.out) ? step.out : [step.out];
            return (
              <motion.div
                key={`${replayKey}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="group"
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-redis-red">{prompt}</span>
                  <span className="text-white">{step.cmd}</span>
                  <button
                    onClick={() => copy(step.cmd, i)}
                    className="ml-auto opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
                    title="Copy command"
                  >
                    {copied === i ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} className="text-redis-muted" />
                    )}
                  </button>
                </div>
                {outLines.map((line, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.18 + j * 0.05 }}
                    className="pl-2 text-emerald-300/90"
                  >
                    {line}
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visible < steps.length && (
          <span className="inline-block h-4 w-2 animate-pulse bg-redis-red align-middle" />
        )}
      </div>
    </div>
  );
}

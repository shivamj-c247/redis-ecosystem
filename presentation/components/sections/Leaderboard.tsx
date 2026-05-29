"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, Trophy } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface Player {
  id: string;
  name: string;
  score: number;
}

const INITIAL: Player[] = [
  { id: "1", name: "alice", score: 980 },
  { id: "2", name: "bob", score: 940 },
  { id: "3", name: "carol", score: 870 },
  { id: "4", name: "dave", score: 820 },
  { id: "5", name: "eve", score: 750 },
  { id: "6", name: "frank", score: 690 },
  { id: "7", name: "grace", score: 600 },
];

export function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>(INITIAL);
  const [last, setLast] = useState<{ name: string; delta: number } | null>(null);

  function bump(id: string, delta: number) {
    setPlayers((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, score: Math.max(0, p.score + delta) } : p
      );
      next.sort((a, b) => b.score - a.score);
      const p = next.find((x) => x.id === id);
      if (p) setLast({ name: p.name, delta });
      return next;
    });
  }

  function reset() {
    setPlayers(INITIAL);
    setLast(null);
  }

  return (
    <SectionWrapper
      id="leaderboard"
      number={19}
      eyebrow="Sorted sets in action"
      title={
        <>
          Live <span className="gradient-text">leaderboard.</span>
        </>
      }
      description="Click +50 or +100 to bump a score. Watch the order rebalance via Framer's layout animation — exactly what ZADD + ZRANGE does in Redis."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-redis-line px-5 py-3 text-sm text-redis-muted">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-redis-red" />
              <span className="font-mono">ZSET leaderboard</span>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-white/5"
            >
              <RotateCcw size={12} />
              reset
            </button>
          </div>
          <ul className="divide-y divide-redis-line/50">
            <AnimatePresence>
              {players.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                  className="flex items-center gap-4 px-5 py-3"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm ${
                      i === 0
                        ? "bg-amber-500/20 text-amber-300"
                        : i === 1
                        ? "bg-zinc-400/20 text-zinc-300"
                        : i === 2
                        ? "bg-orange-600/20 text-orange-300"
                        : "bg-white/5 text-redis-muted"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 font-medium">{p.name}</div>
                  <div className="font-mono text-amber-200">{p.score}</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => bump(p.id, 50)}
                      className="rounded-md border border-redis-line bg-black/40 px-2 py-1 font-mono text-xs text-redis-muted transition-colors hover:border-redis-red/40 hover:text-white"
                    >
                      +50
                    </button>
                    <button
                      onClick={() => bump(p.id, 100)}
                      className="rounded-md border border-redis-red/40 bg-redis-red/10 px-2 py-1 font-mono text-xs text-redis-redLight transition-colors hover:bg-redis-red hover:text-white"
                    >
                      +100
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <div className="space-y-4">
          <CodeBlock
            language="bash"
            code={`# Bump a score
ZADD leaderboard ${last ? "INCR " + last.delta : "INCR 100"} ${
              last?.name ?? "alice"
            }

# Top 10 with scores
ZREVRANGE leaderboard 0 9 WITHSCORES

# Get one player's rank
ZREVRANK leaderboard alice`}
          />
          <div className="glass rounded-2xl p-5 text-sm text-redis-muted">
            <div className="mb-2 flex items-center gap-2 text-redis-red">
              <Plus size={14} />
              <span className="text-xs uppercase tracking-widest">Why this scales</span>
            </div>
            ZADD is O(log N). One Redis node holds tens of millions of players with
            sub-millisecond writes. Twitter, Discord, and most game backends use exactly
            this pattern.
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

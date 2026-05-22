"use client";

import { useState } from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FakeTerminal } from "@/components/ui/FakeTerminal";
import { Terminal } from "lucide-react";

const SUGGESTIONS = [
  "SET user:42 alice",
  "GET user:42",
  "HSET prod:1 name Widget price 9.99",
  "HGETALL prod:1",
  "LPUSH queue task-1 task-2 task-3",
  "LRANGE queue 0 -1",
  "ZADD scores 100 alice 87 bob 92 carol",
  "ZREVRANGE scores 0 -1 WITHSCORES",
  "XADD events * type login user alice",
  "XRANGE events - +",
];

export function CliSimulator() {
  const [seedKey, setSeedKey] = useState(0);

  return (
    <SectionWrapper
      id="cli"
      number={5}
      eyebrow="CLI"
      title={
        <>
          Try Redis <span className="gradient-text">right here.</span>
        </>
      }
      description="A real Redis-like engine running in your browser. Type any of the commands below, or click a suggestion to insert it."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <FakeTerminal
          key={seedKey}
          prefilled={[
            "SET user:42 alice",
            "GET user:42",
            "ZADD lb 980 alice 940 bob 870 carol",
            "ZREVRANGE lb 0 -1 WITHSCORES",
          ]}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Terminal size={14} className="text-redis-red" />
            Try these
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  navigator.clipboard.writeText(s);
                }}
                className="glass rounded-lg px-3 py-1.5 text-left font-mono text-[11px] text-redis-muted transition-colors hover:text-white"
                title="Copy"
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSeedKey((k) => k + 1)}
            className="w-full rounded-lg border border-redis-line bg-black/40 px-4 py-2 text-xs text-redis-muted transition-colors hover:border-redis-red/40 hover:text-white"
          >
            Reset terminal (FLUSHALL)
          </button>
        </div>
      </div>

      <p className="mt-6 text-sm text-redis-muted">
        💡 This is a JavaScript engine — not the real Redis CLI — but the syntax and semantics
        match. The same commands work against your Redis Cloud instance from the practicals.
      </p>
    </SectionWrapper>
  );
}

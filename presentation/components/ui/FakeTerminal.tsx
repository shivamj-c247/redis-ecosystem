"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createStore, execute, CliResult } from "@/lib/cli-engine";

interface Line {
  kind: "cmd" | "result";
  text: string;
  type?: CliResult["type"];
  id: number;
}

interface Props {
  className?: string;
  prefilled?: string[];
  prompt?: string;
}

export function FakeTerminal({
  className = "",
  prefilled = [],
  prompt = "redis>",
}: Props) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const storeRef = useRef(createStore());
  const counter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function runCommand(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    const id = counter.current++;
    const cmdLine: Line = { kind: "cmd", text: trimmed, id };
    const result = execute(storeRef.current, trimmed);
    const resultLines: Line[] = result.output
      .split("\n")
      .map((t, i) => ({ kind: "result" as const, text: t, type: result.type, id: counter.current++ + i }));
    counter.current += resultLines.length;
    setLines((prev) => [...prev, cmdLine, ...resultLines]);
  }

  useEffect(() => {
    if (prefilled.length === 0) return;
    const timeouts: NodeJS.Timeout[] = [];
    prefilled.forEach((cmd, i) => {
      timeouts.push(setTimeout(() => runCommand(cmd), 600 + i * 700));
    });
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    }
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-redis-line bg-black/70 ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-1.5 border-b border-redis-line px-4 py-2.5">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-3 font-mono text-xs text-redis-muted">
          redis-cli — 80×24
        </span>
      </div>
      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
      >
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {line.kind === "cmd" ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-redis-red">{prompt}</span>
                  <span className="text-white">{line.text}</span>
                </div>
              ) : (
                <div
                  className={
                    line.type === "error"
                      ? "text-red-400"
                      : line.type === "ok"
                      ? "text-green-400"
                      : line.type === "value"
                      ? "text-amber-200"
                      : line.type === "array"
                      ? "text-sky-200"
                      : "text-redis-muted"
                  }
                >
                  {line.text || " "}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex items-baseline gap-2">
          <span className="text-redis-red">{prompt}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            autoFocus
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="flex-1 bg-transparent text-white outline-none caret-redis-red"
          />
        </div>
      </div>
    </div>
  );
}

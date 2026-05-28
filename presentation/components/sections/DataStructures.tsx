"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ChevronDown,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  Keyboard,
} from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { MiniTerminal } from "@/components/ui/MiniTerminal";
import { DockerQuickStart } from "./DockerQuickStart";
import { STRUCTURES } from "./data-structures.data";

export function DataStructures() {
  const [active, setActive] = useState(0);
  const [showInterview, setShowInterview] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const ds = STRUCTURES[active];

  const select = useCallback((i: number) => {
    const n = STRUCTURES.length;
    setActive(((i % n) + n) % n);
    setShowInterview(false);
  }, []);

  // Keyboard nav scoped to this section only — uses [ ] and number keys so it
  // never collides with the deck's global ← → section navigation.
  useEffect(() => {
    function inView() {
      const el = sectionRef.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5;
    }
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA") return;
      if (!inView()) return;
      if (e.key === "]") {
        e.preventDefault();
        setActive((a) => (a + 1) % STRUCTURES.length);
        setShowInterview(false);
      } else if (e.key === "[") {
        e.preventDefault();
        setActive((a) => (a - 1 + STRUCTURES.length) % STRUCTURES.length);
        setShowInterview(false);
      } else if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < STRUCTURES.length) {
          e.preventDefault();
          select(idx);
        }
      } else if (e.key === "0") {
        if (STRUCTURES.length >= 10) {
          e.preventDefault();
          select(9);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  return (
    <SectionWrapper
      id="data-structures"
      number={4}
      eyebrow="Data Structures Playground"
      title={
        <>
          11 structures. <span className="gradient-text">One engine.</span>
        </>
      }
      description="Pick the right structure and most problems collapse to two commands. Tap a type to explore — or use [ ] and number keys."
    >
      <div ref={sectionRef}>
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {STRUCTURES.map((d, i) => {
            const Icon = d.icon;
            return (
              <button
                key={d.id}
                onClick={() => select(i)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-all ${
                  i === active
                    ? "bg-redis-red text-white shadow-[0_0_20px_rgba(220,56,45,0.4)]"
                    : "glass text-redis-muted hover:text-white"
                }`}
              >
                <Icon size={14} />
                {d.name}
              </button>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 gap-1">
            {STRUCTURES.map((d, i) => (
              <button
                key={d.id}
                onClick={() => select(i)}
                aria-label={d.name}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i === active ? "bg-redis-red" : "bg-white/10 hover:bg-white/25"
                }`}
              />
            ))}
          </div>
          <span className="shrink-0 font-mono text-xs text-redis-muted">
            {String(active + 1).padStart(2, "0")} / {STRUCTURES.length}
          </span>
        </div>

        {/* Active card */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={ds.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-6 lg:grid-cols-2"
            >
              {/* Left: info */}
              <div className="space-y-5">
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-redis-red">
                        <ds.icon size={14} />
                        Data type
                      </div>
                      <h3 className="mt-2 text-3xl font-semibold">{ds.name}</h3>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                      <Sparkles size={12} />
                      {ds.bestUseCase}
                    </span>
                  </div>
                  <p className="mt-4 text-redis-muted">{ds.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {ds.useCases.map((u) => (
                      <span
                        key={u}
                        className="rounded-lg border border-redis-line bg-black/40 px-2.5 py-1 text-xs text-white/80"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-redis-line bg-black/40 p-5">
                    <div className="mb-2 text-xs uppercase tracking-widest text-redis-red">
                      Example scenario
                    </div>
                    <p className="text-sm text-white/90">{ds.scenario}</p>
                  </div>
                  <div className="rounded-2xl border border-redis-line bg-black/40 p-5">
                    <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-widest text-emerald-400">
                      <CheckCircle2 size={12} />
                      When to use
                    </div>
                    <p className="text-sm text-white/90">{ds.whenToUse}</p>
                  </div>
                </div>

                <a
                  href={ds.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-redis-red/40 bg-redis-red/10 px-5 py-2.5 text-sm text-redis-redLight transition-all hover:bg-redis-red hover:text-white"
                >
                  Open official docs
                  <ExternalLink
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>

              {/* Right: visual + terminal + interview */}
              <div className="space-y-5">
                <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-redis-line bg-black/40 p-6">
                  {ds.visual}
                </div>

                <MiniTerminal steps={ds.steps} replayKey={ds.id} />

                <div className="glass overflow-hidden rounded-2xl">
                  <button
                    onClick={() => setShowInterview((s) => !s)}
                    className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    <Lightbulb size={16} className="text-amber-300" />
                    <span className="flex-1 text-sm font-medium">
                      Commonly asked interview question
                    </span>
                    <motion.div animate={{ rotate: showInterview ? 180 : 0 }}>
                      <ChevronDown size={16} className="text-redis-muted" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {showInterview && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-2 border-t border-redis-line p-4">
                          <p className="text-sm font-medium text-amber-200">
                            Q: {ds.interview.q}
                          </p>
                          <p className="text-sm text-redis-muted">
                            {ds.interview.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Keyboard hint */}
        <div className="mt-6 inline-flex items-center gap-2 text-xs text-redis-muted">
          <Keyboard size={12} />
          Navigate:
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">[</kbd>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">]</kbd>
          or
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono">1–9</kbd>
        </div>

        <DockerQuickStart />
      </div>
    </SectionWrapper>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, ArrowRight, Terminal } from "lucide-react";
import { SECTIONS } from "@/lib/sections";
import { NOTES } from "./notes";

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function PresenterOverlay() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("hero");
  const [sectionElapsed, setSectionElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);

  // Toggle on P
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.key.toLowerCase() === "p") setVisible((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
              setActive((prev) => {
                if (prev !== s.id) setSectionElapsed(0);
                return s.id;
              });
            }
          }
        },
        { threshold: [0.4, 0.6] }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Timers — section + total — only run while visible (presenter mode on)
  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => {
      setSectionElapsed((s) => s + 1);
      setTotalElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [visible]);

  const currentSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];
  const currentIndex = SECTIONS.indexOf(currentSection);
  const nextSection = SECTIONS[currentIndex + 1];
  const note = NOTES.find((n) => n.sectionId === active);
  const overBudget = sectionElapsed > currentSection.duration;

  return (
    <>
      {/* Tiny toggle dot — always visible */}
      <button
        onClick={() => setVisible((v) => !v)}
        title="Toggle presenter mode (P)"
        className="fixed bottom-4 right-4 z-50 h-3 w-3 rounded-full bg-redis-red/40 transition-all hover:scale-150 hover:bg-redis-red"
      />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-12 right-4 z-50 w-[360px] overflow-hidden rounded-2xl border border-redis-red/30 bg-black/90 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-redis-line bg-redis-red/10 px-4 py-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-redis-red">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-redis-red" />
                Presenter
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-redis-muted">
                <Clock size={12} />
                Total {fmt(totalElapsed)}
              </div>
              <button
                onClick={() => setVisible(false)}
                className="text-redis-muted hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <div className="flex items-baseline justify-between">
                  <div className="text-[10px] uppercase tracking-widest text-redis-muted">
                    Section {currentSection.number} / {SECTIONS.length}
                  </div>
                  <div
                    className={`font-mono text-xs ${
                      overBudget ? "text-amber-300" : "text-redis-muted"
                    }`}
                  >
                    {fmt(sectionElapsed)} / {fmt(currentSection.duration)}
                    {overBudget && " ⚠"}
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold">{currentSection.title}</div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full transition-all ${
                      overBudget
                        ? "bg-amber-400"
                        : "bg-gradient-to-r from-redis-red to-redis-redLight"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (sectionElapsed / currentSection.duration) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {note?.bullets && (
                <div>
                  <div className="mb-1.5 text-[10px] uppercase tracking-widest text-redis-muted">
                    Talking points
                  </div>
                  <ul className="space-y-1.5 text-sm text-white/90">
                    {note.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-redis-red" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {note?.demo && (
                <div className="rounded-lg border border-redis-red/30 bg-redis-red/10 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-redis-red">
                    <Terminal size={11} />
                    Demo reminder
                  </div>
                  <div className="font-mono text-[11px] leading-relaxed text-white/90">
                    {note.demo}
                  </div>
                </div>
              )}

              {nextSection && (
                <div className="flex items-center gap-2 border-t border-redis-line pt-3 text-sm">
                  <ArrowRight size={14} className="text-redis-muted" />
                  <span className="text-redis-muted">Next:</span>
                  <span className="font-medium">{nextSection.title}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

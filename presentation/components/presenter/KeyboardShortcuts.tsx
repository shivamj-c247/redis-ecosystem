"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SECTIONS } from "@/lib/sections";

const SHORTCUTS: { key: string; description: string }[] = [
  { key: "→", description: "Next section" },
  { key: "←", description: "Previous section" },
  { key: "Home", description: "Back to hero" },
  { key: "P", description: "Toggle presenter mode" },
  { key: "?", description: "Show this help" },
];

function findCurrentIndex(): number {
  // Best-guess by viewport center
  if (typeof window === "undefined") return 0;
  const centerY = window.scrollY + window.innerHeight / 2;
  let best = 0;
  let bestDist = Infinity;
  SECTIONS.forEach((s, i) => {
    const el = document.getElementById(s.id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const mid = top + rect.height / 2;
    const dist = Math.abs(mid - centerY);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function go(idx: number) {
      const clamped = Math.max(0, Math.min(SECTIONS.length - 1, idx));
      const el = document.getElementById(SECTIONS[clamped].id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(findCurrentIndex() + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(findCurrentIndex() - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "?") {
        setShowHelp((v) => !v);
      } else if (e.key === "Escape") {
        setShowHelp(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-sm rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-widest text-redis-red">
                Shortcuts
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="text-redis-muted hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <ul className="space-y-2.5">
              {SHORTCUTS.map((s) => (
                <li key={s.key} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/90">{s.description}</span>
                  <kbd className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-xs">
                    {s.key}
                  </kbd>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

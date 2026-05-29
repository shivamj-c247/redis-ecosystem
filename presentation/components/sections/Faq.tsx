"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Lightbulb,
  Briefcase,
  Mic,
  Sparkles,
  Search as SearchIcon,
} from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CATEGORIES, type FaqItem } from "./faq.data";
import { ModernAppArchitecture } from "./faq-visuals";
import { usePresenterMode } from "@/lib/presenter-mode";

const USE_CASES = [
  "API response caching",
  "Session storage",
  "Rate limiting",
  "Leaderboards",
  "Event streaming",
  "AI semantic caching",
  "AI memory",
  "RAG systems",
];

export function Faq() {
  const [activeCat, setActiveCat] = useState(0);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const cat = CATEGORIES[activeCat];
  const items = query
    ? CATEGORIES.flatMap((c) => c.items).filter((it) =>
        it.q.toLowerCase().includes(query.toLowerCase())
      )
    : cat.items;

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <SectionWrapper
      id="faq"
      number={20}
      eyebrow="FAQ · Q&A"
      title={
        <>
          Redis FAQ &amp; <span className="gradient-text">architecture discussions</span>.
        </>
      }
      description="The questions audiences ask after a Redis talk — short answers, deeper context, and visuals to back you up live."
    >
      {/* Search */}
      <div className="relative mb-5">
        <SearchIcon
          size={14}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-redis-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the 25 FAQs…"
          className="w-full rounded-full border border-redis-line bg-black/40 px-10 py-2.5 text-sm outline-none placeholder:text-redis-muted focus:border-redis-red/60"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-redis-muted hover:text-white"
          >
            clear
          </button>
        )}
      </div>

      {/* Category tabs */}
      {!query && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCat(i);
                  setOpenIds(new Set());
                }}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-all ${
                  i === activeCat
                    ? "bg-redis-red text-white shadow-[0_0_20px_rgba(220,56,45,0.4)]"
                    : "glass text-redis-muted hover:text-white"
                }`}
              >
                <Icon size={14} />
                {c.name}
                <span className="rounded-full bg-black/40 px-1.5 py-0.5 text-[10px] text-redis-muted">
                  {c.items.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Accordion list */}
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-redis-line bg-black/40 p-6 text-center text-sm text-redis-muted">
            No matching questions. Try a different keyword.
          </div>
        ) : (
          items.map((item, i) => (
            <FaqCard
              key={item.id}
              item={item}
              isOpen={openIds.has(item.id)}
              onToggle={() => toggle(item.id)}
              delay={i * 0.03}
            />
          ))
        )}
      </div>

      {/* "What would I use Redis for?" closing block */}
      <WhatWouldIUseRedisFor />
    </SectionWrapper>
  );
}

function FaqCard({
  item,
  isOpen,
  onToggle,
  delay,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const presenterOn = usePresenterMode();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="glass overflow-hidden rounded-2xl"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-redis-red/15 text-redis-redLight">
          <span className="text-xs font-mono">Q</span>
        </div>
        <div className="flex-1">
          <div className="font-medium">{item.q}</div>
          {!isOpen && (
            <div className="mt-1 line-clamp-1 text-sm text-redis-muted">{item.shortA}</div>
          )}
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="mt-0.5">
          <ChevronDown size={18} className="text-redis-muted" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-5 border-t border-redis-line px-5 pb-5 pt-4">
              {/* Short answer */}
              <div className="rounded-xl border border-redis-red/30 bg-redis-red/5 p-4">
                <div className="text-[10px] uppercase tracking-widest text-redis-red">
                  Short answer
                </div>
                <p className="mt-1.5 text-sm font-medium">{item.shortA}</p>
              </div>

              {/* Detailed explanation */}
              <div>
                <div className="mb-2 text-[10px] uppercase tracking-widest text-redis-muted">
                  Detailed explanation
                </div>
                {item.details}
              </div>

              {/* Visual */}
              {item.visual && (
                <div className="rounded-2xl border border-redis-line bg-black/40 p-5">
                  {item.visual}
                </div>
              )}

              {/* Callouts */}
              <div className="grid gap-3 md:grid-cols-2">
                <Callout
                  icon={Briefcase}
                  label="Interview tip"
                  tone="amber"
                  body={item.interviewTip}
                />
                <Callout
                  icon={Sparkles}
                  label="Real-world usage"
                  tone="emerald"
                  body={item.realWorld}
                />
              </div>

              {/* Speaker notes — only when presenter mode is on */}
              <AnimatePresence>
                {presenterOn && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-redis-red/40 bg-black/60 p-4">
                      <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-redis-red">
                        <Mic size={11} />
                        Speaker notes
                      </div>
                      <div className="space-y-2 text-sm text-white/90">
                        <p>
                          <span className="text-redis-muted">30s framing:</span>{" "}
                          {item.speakerNotes.lead}
                        </p>
                        <p>
                          <span className="text-redis-muted">Real example:</span>{" "}
                          {item.speakerNotes.example}
                        </p>
                        <div>
                          <span className="text-redis-muted">Follow-ups to expect:</span>
                          <ul className="mt-1 space-y-0.5">
                            {item.speakerNotes.followUps.map((f) => (
                              <li
                                key={f}
                                className="flex items-start gap-2 text-xs text-redis-muted"
                              >
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-redis-red" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Callout({
  icon: Icon,
  label,
  body,
  tone,
}: {
  icon: typeof Lightbulb;
  label: string;
  body: string;
  tone: "amber" | "emerald";
}) {
  const colors =
    tone === "amber"
      ? { ring: "border-amber-500/30 bg-amber-500/5", chip: "text-amber-300" }
      : { ring: "border-emerald-500/30 bg-emerald-500/5", chip: "text-emerald-300" };
  return (
    <div className={`rounded-xl border p-4 ${colors.ring}`}>
      <div
        className={`mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-widest ${colors.chip}`}
      >
        <Icon size={11} />
        {label}
      </div>
      <p className="text-sm text-white/90">{body}</p>
    </div>
  );
}

function WhatWouldIUseRedisFor() {
  return (
    <div className="mt-12">
      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-redis-red">
        <Lightbulb size={14} />
        What would I use Redis for?
      </div>
      <div className="glass rounded-2xl p-6">
        <p className="text-balance text-lg text-white/90">
          The honest answer for a 2026 stack: Redis sits in the middle of every layer that
          needs to be fast — between your app and the database, between your app and the
          LLM, and increasingly inside the AI loop itself.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((u) => (
            <div
              key={u}
              className="rounded-xl border border-redis-line bg-black/40 p-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-redis-red" />
                {u}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <ModernAppArchitecture />
        </div>
      </div>
    </div>
  );
}

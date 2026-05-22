"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, Keyboard } from "lucide-react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [0.7, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6"
    >
      <motion.div
        style={{ y: gridY, opacity: gridOpacity }}
        className="absolute inset-0 dot-grid"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-redis-ink" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-redis-red/20 blur-[140px]" />

      <motion.div style={{ scale: titleScale }} className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-redis-red/30 bg-redis-red/10 px-4 py-1.5 text-xs uppercase tracking-widest text-redis-redLight"
        >
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-redis-red" />
          Live Technical Session · 50 min
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-5xl font-semibold leading-[1.05] md:text-7xl lg:text-[88px]"
        >
          Scaling Modern Applications{" "}
          <span className="gradient-text">with Redis</span>{" "}
          <br className="hidden md:block" />
          <span className="text-redis-muted">&amp; Redis for AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mx-auto mt-8 max-w-2xl text-balance text-xl text-redis-muted md:text-2xl"
        >
          From caching to vector search — the practical guide to building fast, stateful,
          AI-aware systems on Redis.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <a
            href="#why-redis"
            className="group inline-flex items-center gap-2 rounded-full bg-redis-red px-6 py-3 text-sm font-medium transition-all hover:bg-redis-redLight hover:shadow-[0_0_40px_rgba(220,56,45,0.4)]"
          >
            Press → or scroll to begin
            <ChevronDown size={16} className="transition-transform group-hover:translate-y-0.5" />
          </a>
          <div className="inline-flex items-center gap-1.5 text-xs text-redis-muted">
            <Keyboard size={12} />
            Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">P</kbd> for presenter mode
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="animate-bounce text-redis-muted" size={20} />
      </motion.div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { SECTIONS } from "@/lib/sections";

export function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
              setActive(s.id);
            }
          }
        },
        { threshold: [0.4, 0.6, 0.8] }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-40">
      <motion.div
        className="h-0.5 origin-left bg-gradient-to-r from-redis-red via-redis-redLight to-redis-red"
        style={{ scaleX: width }}
      />
      <div className="pointer-events-auto mx-auto mt-2 flex w-fit gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-xl">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            title={`${s.number}. ${s.title}`}
            className={`group relative h-1.5 w-6 rounded-full transition-all ${
              active === s.id ? "w-10 bg-redis-red" : "bg-white/15 hover:bg-white/30"
            }`}
          >
            <span className="pointer-events-none absolute -bottom-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[10px] text-white group-hover:block">
              {s.short}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

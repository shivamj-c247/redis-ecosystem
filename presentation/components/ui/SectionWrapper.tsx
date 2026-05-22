"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  id: string;
  number: number;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({
  id,
  number,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`relative min-h-screen w-full px-6 py-24 md:px-12 lg:px-20 ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 text-sm text-redis-muted">
            <span className="font-mono text-redis-red">
              {String(number).padStart(2, "0")}
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-redis-red to-transparent" />
            {eyebrow && <span className="uppercase tracking-widest">{eyebrow}</span>}
          </div>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            {title}
          </h2>
          {description && (
            <p className="mt-6 max-w-3xl text-lg text-redis-muted md:text-xl">
              {description}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

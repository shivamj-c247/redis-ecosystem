"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const EVENT_TYPES = ["order.created", "user.signup", "payment.ok", "click", "view"];

export function Streams() {
  const [count, setCount] = useState(0);
  const [tokens, setTokens] = useState<{ id: number; type: string }[]>([]);

  useEffect(() => {
    const iv = setInterval(() => {
      setCount((c) => c + 1);
      const id = Math.random();
      const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
      setTokens((t) => [...t, { id, type }].slice(-12));
    }, 1100);
    return () => clearInterval(iv);
  }, []);

  return (
    <SectionWrapper
      id="streams"
      number={7}
      eyebrow="Streams"
      title={
        <>
          An append-only log <span className="gradient-text">inside Redis.</span>
        </>
      }
      description="Producers append, consumer groups process in parallel with acknowledgement and replay. Think Kafka, in two commands."
    >
      <div className="glass relative overflow-hidden rounded-2xl p-8">
        <div className="grid items-center gap-8 lg:grid-cols-[140px_1fr_180px]">
          <NodeBlock label="Producer" sub="api.serverless" pulse />

          <div className="relative h-32 rounded-xl border border-redis-line bg-black/40">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-redis-muted">
              stream:events
            </div>
            <AnimatePresence>
              {tokens.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ x: "-10%", opacity: 0 }}
                  animate={{ x: "100%", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.4, ease: "linear" }}
                  style={{ top: `${20 + (i % 5) * 14}%` }}
                  className="absolute rounded-full bg-redis-red/20 px-2 py-0.5 font-mono text-[10px] text-redis-redLight"
                >
                  {t.type}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <NodeBlock label="Consumer A" sub="group: workers" small />
            <NodeBlock label="Consumer B" sub="group: analytics" small />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <Stat label="Events seen" value={count} suffix="" />
          <Stat label="Throughput" value={1200} suffix=" /s" />
          <Stat label="Consumer lag" value={3} suffix=" msgs" />
        </div>
      </div>

      <div className="mt-6">
        <CodeBlock
          language="bash"
          code={`# Producer
XADD events * type "order.created" id 42

# Consumer (group "workers", consumer "c1")
XREADGROUP GROUP workers c1 COUNT 10 STREAMS events >
XACK events workers <message-id>`}
        />
      </div>
    </SectionWrapper>
  );
}

function NodeBlock({
  label,
  sub,
  pulse,
  small,
}: {
  label: string;
  sub: string;
  pulse?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl border border-redis-line bg-black/40 ${
        small ? "p-3" : "p-4"
      }`}
    >
      <div className={`font-medium ${small ? "text-sm" : ""}`}>{label}</div>
      <div className="mt-1 font-mono text-xs text-redis-muted">{sub}</div>
      {pulse && (
        <div className="absolute -right-1 -top-1 h-3 w-3">
          <span className="absolute inset-0 animate-ping rounded-full bg-redis-red opacity-60" />
          <span className="absolute inset-0 rounded-full bg-redis-red" />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="rounded-xl border border-redis-line bg-black/40 p-4">
      <div className="text-2xl font-semibold">
        <AnimatedCounter to={value} suffix={suffix} />
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-redis-muted">{label}</div>
    </div>
  );
}

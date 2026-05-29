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
      number={9}
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

      {/* Consumer groups explainer */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            t: "Fan-out to groups",
            b: "Each consumer GROUP gets the full stream independently — workers process jobs while analytics tallies the same events.",
          },
          {
            t: "Parallelism within a group",
            b: "Inside a group, each message goes to exactly one consumer. Add consumers to scale throughput horizontally.",
          },
          {
            t: "Acknowledge & replay",
            b: "XACK marks a message done. Unacked messages sit in the Pending Entries List (PEL) so a crashed consumer's work is reclaimed, never lost.",
          },
        ].map((c, i) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-5"
          >
            <div className="font-semibold">{c.t}</div>
            <div className="mt-1.5 text-sm text-redis-muted">{c.b}</div>
          </motion.div>
        ))}
      </div>

      {/* Event-driven architecture example */}
      <div className="mt-6 glass rounded-2xl p-6">
        <div className="mb-5 text-xs uppercase tracking-widest text-redis-red">
          Event-driven architecture — one order, many reactions
        </div>
        <div className="flex flex-col items-center gap-3 lg:flex-row lg:justify-center lg:gap-0">
          <EventNode label="Order Service" sub="XADD orders.events *" accent />
          <Connector />
          <EventNode label="stream: orders.events" sub="append-only log" />
          <Connector branch />
          <div className="flex flex-col gap-2">
            <EventNode label="Fulfillment" sub="group: warehouse" small />
            <EventNode label="Email/SMS" sub="group: notify" small />
            <EventNode label="Analytics" sub="group: bi" small />
          </div>
        </div>
        <p className="mt-5 text-sm text-redis-muted">
          The producer doesn&apos;t know or care who consumes. New reactions = a new
          consumer group, with zero changes to the producer. That decoupling is the whole
          point of event-driven design.
        </p>
      </div>
    </SectionWrapper>
  );
}

function EventNode({
  label,
  sub,
  accent,
  small,
}: {
  label: string;
  sub: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border ${small ? "p-3" : "p-4"} ${
        accent
          ? "border-redis-red/50 bg-redis-red/10"
          : "border-redis-line bg-black/40"
      }`}
    >
      <div className={`font-medium ${small ? "text-sm" : ""}`}>{label}</div>
      <div className="mt-1 font-mono text-xs text-redis-muted">{sub}</div>
    </div>
  );
}

function Connector({ branch }: { branch?: boolean }) {
  return (
    <span className="px-3 text-redis-muted">
      <span className="hidden lg:inline">{branch ? "⇒" : "→"}</span>
      <span className="lg:hidden">↓</span>
    </span>
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface DS {
  name: string;
  useCase: string;
  cmd: string;
  desc: string;
  visual: React.ReactNode;
}

function StringVisual() {
  return (
    <div className="flex items-center justify-center gap-3 font-mono text-sm">
      <Pill label="user:42" muted />
      <span className="text-redis-muted">→</span>
      <Pill label='"alice"' />
    </div>
  );
}

function HashVisual() {
  return (
    <div className="space-y-1 font-mono text-sm">
      <Row k="name" v='"alice"' />
      <Row k="email" v='"a@x.com"' />
      <Row k="plan" v='"pro"' />
    </div>
  );
}

function ListVisual() {
  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      <Pill label="msg-3" />
      <Arr />
      <Pill label="msg-2" />
      <Arr />
      <Pill label="msg-1" />
    </div>
  );
}

function SetVisual() {
  return (
    <div className="flex flex-wrap gap-1.5 font-mono text-sm">
      {["redis", "ai", "vector"].map((t) => (
        <Pill key={t} label={t} />
      ))}
    </div>
  );
}

function ZSetVisual() {
  return (
    <div className="space-y-1 font-mono text-sm">
      {[
        ["alice", 980],
        ["bob", 940],
        ["carol", 870],
      ].map(([n, s]) => (
        <div key={n} className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1">
          <span>{n}</span>
          <span className="text-amber-200">{s}</span>
        </div>
      ))}
    </div>
  );
}

function StreamVisual() {
  return (
    <div className="space-y-1 font-mono text-xs">
      <div className="rounded-md bg-white/5 px-2 py-1">
        <span className="text-redis-redLight">1730-0</span> · user.login alice
      </div>
      <div className="rounded-md bg-white/5 px-2 py-1">
        <span className="text-redis-redLight">1731-0</span> · order.created #42
      </div>
      <div className="rounded-md bg-white/5 px-2 py-1">
        <span className="text-redis-redLight">1732-0</span> · payment.ok #42
      </div>
    </div>
  );
}

const DATA: DS[] = [
  {
    name: "Strings",
    useCase: "Cache, counters, flags",
    cmd: "SET user:42 alice\nGET user:42\nINCR page_views",
    desc: "Binary-safe values up to 512 MB. The bedrock of every Redis tutorial.",
    visual: <StringVisual />,
  },
  {
    name: "Hashes",
    useCase: "Object fields, sessions",
    cmd: 'HSET user:42 name "alice" plan "pro"\nHGET user:42 name',
    desc: "Flat field → value map per key. Memory-efficient for small objects.",
    visual: <HashVisual />,
  },
  {
    name: "Lists",
    useCase: "Queues, timelines, history",
    cmd: 'LPUSH inbox:42 "hello"\nLRANGE inbox:42 0 -1',
    desc: "Linked lists. Push/pop from either end in O(1). Great for FIFO/LIFO.",
    visual: <ListVisual />,
  },
  {
    name: "Sets",
    useCase: "Unique tags, membership",
    cmd: "SADD tags:42 redis ai vector\nSISMEMBER tags:42 ai",
    desc: "Unordered collections with O(1) membership. Set algebra built-in.",
    visual: <SetVisual />,
  },
  {
    name: "Sorted Sets",
    useCase: "Leaderboards, ranges",
    cmd: "ZADD lb 980 alice 940 bob\nZRANGE lb 0 -1 WITHSCORES",
    desc: "Members ordered by score. O(log N) inserts, range scans by score or rank.",
    visual: <ZSetVisual />,
  },
  {
    name: "Streams",
    useCase: "Event log, work queues",
    cmd: 'XADD orders * type "created" id 42\nXRANGE orders - +',
    desc: "Append-only log with consumer groups. Mini-Kafka inside Redis.",
    visual: <StreamVisual />,
  },
];

export function DataStructures() {
  const [active, setActive] = useState(0);
  const ds = DATA[active];

  return (
    <SectionWrapper
      id="data-structures"
      number={4}
      eyebrow="Data Structures"
      title={
        <>
          A playground of <span className="gradient-text">primitives.</span>
        </>
      }
      description="Redis isn't just key-value. Pick the right structure and most problems collapse to two commands."
    >
      <div className="flex flex-wrap gap-2">
        {DATA.map((d, i) => (
          <button
            key={d.name}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              i === active
                ? "bg-redis-red text-white shadow-[0_0_20px_rgba(220,56,45,0.4)]"
                : "glass text-redis-muted hover:text-white"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={ds.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            <div className="glass rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-redis-red">
                {ds.useCase}
              </div>
              <h3 className="mt-2 text-3xl font-semibold">{ds.name}</h3>
              <p className="mt-4 text-redis-muted">{ds.desc}</p>
            </div>

            <div className="flex items-center justify-center rounded-2xl border border-redis-line bg-black/40 p-6">
              {ds.visual}
            </div>

            <CodeBlock code={ds.cmd} language="bash" showCopy={false} />
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}

function Pill({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span
      className={`rounded-md px-2 py-1 ${
        muted ? "bg-white/5 text-redis-muted" : "bg-redis-red/15 text-redis-redLight"
      }`}
    >
      {label}
    </span>
  );
}

function Arr() {
  return <span className="text-redis-muted">→</span>;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1">
      <span className="text-redis-muted">{k}</span>
      <span className="text-amber-200">{v}</span>
    </div>
  );
}

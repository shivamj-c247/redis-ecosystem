"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Database, Server, GitBranch, Eye, Crown, Layers, Filter, Box } from "lucide-react";
import { ReplicationDiagram } from "@/components/vis/ReplicationDiagram";

/* ---------- Mini flow (vertical node chain) ---------- */

export function MiniFlow({
  nodes,
  accentIndex,
}: {
  nodes: { label: string; sub?: string }[];
  accentIndex?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {nodes.map((n, i) => (
        <div key={n.label + i} className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={`min-w-[160px] rounded-lg border px-3 py-2 text-center ${
              i === accentIndex
                ? "border-redis-red/50 bg-redis-red/10"
                : "border-redis-line bg-black/40"
            }`}
          >
            <div className="text-sm font-medium">{n.label}</div>
            {n.sub && (
              <div className="mt-0.5 font-mono text-[10px] text-redis-muted">{n.sub}</div>
            )}
          </motion.div>
          {i < nodes.length - 1 && <ArrowDown size={14} className="text-redis-muted" />}
        </div>
      ))}
    </div>
  );
}

/* ---------- Persistence: RAM → RDB → Disk ---------- */

export function PersistenceVisual() {
  return <MiniFlow nodes={[{ label: "RAM", sub: "live data" }, { label: "RDB snapshot", sub: "every N sec" }, { label: "Disk", sub: "durable" }]} accentIndex={0} />;
}

/* ---------- RAM allocation horizontal bar ---------- */

export function RamAllocationVisual() {
  const seg = [
    { label: "Redis dataset", pct: 65, tone: "red" as const },
    { label: "Replication buffers", pct: 10, tone: "amber" as const },
    { label: "OS / overhead", pct: 15, tone: "muted" as const },
    { label: "Safety headroom", pct: 10, tone: "emerald" as const },
  ];
  return (
    <div className="space-y-3">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-white/5">
        {seg.map((s) => (
          <div
            key={s.label}
            style={{ width: `${s.pct}%` }}
            className={
              s.tone === "red"
                ? "bg-redis-red"
                : s.tone === "amber"
                ? "bg-amber-400"
                : s.tone === "emerald"
                ? "bg-emerald-400"
                : "bg-white/15"
            }
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {seg.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                s.tone === "red"
                  ? "bg-redis-red"
                  : s.tone === "amber"
                  ? "bg-amber-400"
                  : s.tone === "emerald"
                  ? "bg-emerald-400"
                  : "bg-white/30"
              }`}
            />
            <span className="text-redis-muted">{s.label}</span>
            <span className="ml-auto font-mono text-white/80">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Replica vs Shard side-by-side ---------- */

export function ReplicaVsShardVisual() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ArchMini
          title="Replica (HA)"
          icon={GitBranch}
          nodes={[
            { label: "Primary", accent: true },
            { label: "Replica 1", muted: true },
            { label: "Replica 2", muted: true },
          ]}
          horizontal
          caption="Copies of the same data"
          pros={["High availability", "Read scaling", "Auto failover"]}
        />
        <ArchMini
          title="Shard (scale)"
          icon={Layers}
          nodes={[
            { label: "Shard A", subscript: "slots 0–5461" },
            { label: "Shard B", subscript: "slots 5462–10922" },
            { label: "Shard C", subscript: "slots 10923–16383" },
          ]}
          horizontal
          caption="Different data per node"
          pros={["Horizontal scaling", "More RAM", "More throughput"]}
        />
      </div>
      <Quote text='"Replication is for reliability. Sharding is for scalability."' />
    </div>
  );
}

function ArchMini({
  title,
  icon: Icon,
  nodes,
  caption,
  pros,
  horizontal,
}: {
  title: string;
  icon: typeof GitBranch;
  nodes: { label: string; accent?: boolean; muted?: boolean; subscript?: string }[];
  caption: string;
  pros: string[];
  horizontal?: boolean;
}) {
  return (
    <div className="rounded-xl border border-redis-line bg-black/40 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Icon size={14} className="text-redis-red" />
        {title}
      </div>
      <div
        className={`flex ${horizontal ? "flex-row" : "flex-col"} flex-wrap items-center justify-center gap-2`}
      >
        {nodes.map((n) => (
          <div
            key={n.label}
            className={`rounded-md px-3 py-1.5 text-center text-xs ${
              n.accent
                ? "bg-redis-red/15 text-redis-redLight"
                : n.muted
                ? "bg-white/5 text-redis-muted"
                : "bg-white/5 text-white/90"
            }`}
          >
            <div className="font-medium">{n.label}</div>
            {n.subscript && (
              <div className="mt-0.5 font-mono text-[9px] text-redis-muted">{n.subscript}</div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 text-center text-[10px] uppercase tracking-widest text-redis-muted">
        {caption}
      </div>
      <ul className="mt-3 space-y-1 text-xs">
        {pros.map((p) => (
          <li key={p} className="flex items-start gap-1.5 text-redis-muted">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-redis-red" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-redis-red/20 to-transparent p-px">
      <div className="rounded-xl bg-redis-ink/60 p-4 text-center text-sm font-medium">
        {text}
      </div>
    </div>
  );
}

/* ---------- Cluster slots: 16384 hash slots across nodes ---------- */

export function ClusterSlotsVisual() {
  const slots = [
    { node: "Node A", from: 0, to: 5460 },
    { node: "Node B", from: 5461, to: 10922 },
    { node: "Node C", from: 10923, to: 16383 },
  ];
  return (
    <div className="space-y-2">
      <div className="flex h-8 w-full overflow-hidden rounded-md border border-redis-line">
        {slots.map((s, i) => (
          <div
            key={s.node}
            className={`flex flex-1 items-center justify-center text-xs font-medium ${
              i === 0
                ? "bg-redis-red/60"
                : i === 1
                ? "bg-redis-red/40"
                : "bg-redis-red/25"
            }`}
            title={`${s.from}-${s.to}`}
          >
            {s.node}
          </div>
        ))}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-redis-muted">
        <span>slot 0</span>
        <span>16384 hash slots · CRC16(key) mod 16384</span>
        <span>slot 16383</span>
      </div>
    </div>
  );
}

/* ---------- Sentinel — reuse existing failover diagram ---------- */

export function SentinelVisual() {
  return (
    <div>
      <ReplicationDiagram />
      <p className="mt-2 text-xs text-redis-muted">
        Sentinel watches the primary, agrees with quorum on failure, and promotes a
        healthy replica in seconds.
      </p>
    </div>
  );
}

/* ---------- Streams vs Kafka comparison ---------- */

export function StreamsVsKafka() {
  const rows = [
    { dim: "Setup", a: "One Redis", b: "Cluster + ZooKeeper / KRaft" },
    { dim: "Retention", a: "Bounded (XADD MAXLEN)", b: "Long, tiered to disk" },
    { dim: "Throughput", a: "Hundreds of K msgs/s", b: "Millions+ msgs/s" },
    { dim: "Operational weight", a: "Lightweight", b: "Heavy ops" },
    { dim: "Best at", a: "Medium workloads, sub-ms latency", b: "Massive event pipelines" },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-redis-line">
      <div className="grid grid-cols-3 border-b border-redis-line text-xs uppercase tracking-widest">
        <div className="p-3 text-redis-muted">Dimension</div>
        <div className="p-3 text-redis-red">Redis Streams</div>
        <div className="p-3 text-redis-muted">Kafka</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.dim}
          className={`grid grid-cols-3 text-sm ${
            i < rows.length - 1 ? "border-b border-redis-line/50" : ""
          }`}
        >
          <div className="p-3 font-medium">{r.dim}</div>
          <div className="p-3 text-white/90">{r.a}</div>
          <div className="p-3 text-redis-muted">{r.b}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Embedding (text → vector) ---------- */

export function EmbeddingVisual() {
  return (
    <div className="flex items-center justify-center gap-3 rounded-lg border border-redis-line bg-black/40 p-4 font-mono text-xs">
      <span className="rounded-md bg-white/5 px-3 py-1.5">
        &quot;What is Redis?&quot;
      </span>
      <span className="text-redis-muted">→</span>
      <span className="rounded-md bg-amber-500/15 px-3 py-1.5 text-amber-200">
        [0.12, -0.34, 0.81, …]
      </span>
    </div>
  );
}

/* ---------- Keyword vs Semantic search ---------- */

export function KeywordVsSemantic() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="text-xs uppercase tracking-widest text-amber-300">
          Keyword search
        </div>
        <p className="mt-2 font-mono text-xs">
          query: <span className="text-white">&quot;fast store&quot;</span>
        </p>
        <p className="mt-1 text-xs text-redis-muted">
          → misses doc &quot;low-latency database&quot;
        </p>
      </div>
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="text-xs uppercase tracking-widest text-emerald-300">
          Semantic search
        </div>
        <p className="mt-2 font-mono text-xs">
          query: <span className="text-white">&quot;fast store&quot;</span>
        </p>
        <p className="mt-1 text-xs text-redis-muted">
          → hits doc &quot;low-latency database&quot;
        </p>
      </div>
    </div>
  );
}

/* ---------- Semantic cache hit/miss flow ---------- */

export function SemanticCacheFlowVisual() {
  return (
    <MiniFlow
      accentIndex={2}
      nodes={[
        { label: "Query" },
        { label: "Embedding" },
        { label: "Vector similarity ≥ threshold?" },
        { label: "YES → cached answer · NO → call LLM + store" },
      ]}
    />
  );
}

/* ---------- App → Redis → DB ---------- */

export function AppRedisDbVisual() {
  return (
    <MiniFlow
      accentIndex={1}
      nodes={[
        { label: "Application" },
        { label: "Redis", sub: "speed layer" },
        { label: "PostgreSQL / MySQL", sub: "source of truth" },
      ]}
    />
  );
}

/* ---------- Final "Modern app" architecture ---------- */

export function ModernAppArchitecture() {
  return (
    <div className="grid items-center gap-3 lg:grid-cols-[auto_24px_auto_24px_auto_24px_auto]">
      <ArchBox icon={Server} label="Modern application" />
      <Arrow />
      <ArchBox icon={Box} label="Redis" accent />
      <Arrow />
      <ArchBox icon={Database} label="Database" />
      <Arrow />
      <ArchBox icon={Filter} label="AI systems" subtle />
    </div>
  );
}

function ArchBox({
  icon: Icon,
  label,
  accent,
  subtle,
}: {
  icon: typeof Server;
  label: string;
  accent?: boolean;
  subtle?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
        accent
          ? "border-redis-red/50 bg-redis-red/10"
          : subtle
          ? "border-white/15 bg-white/[0.02]"
          : "border-redis-line bg-black/40"
      }`}
    >
      <Icon size={18} className={accent ? "text-redis-red" : "text-redis-muted"} />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function Arrow() {
  return (
    <span className="text-center text-redis-muted">
      <span className="hidden lg:inline">→</span>
      <span className="lg:hidden">↓</span>
    </span>
  );
}

/* ---------- Self-hosted vs Cloud quick split (for the Cloud-vs-OSS Q) ---------- */

export function SelfHostedVsCloudMini() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-redis-line bg-black/40 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Server size={14} className="text-redis-muted" />
          Self-hosted
        </div>
        <ul className="mt-2 space-y-1 text-xs text-redis-muted">
          <li>· EC2 + Docker</li>
          <li>· Manual scaling</li>
          <li>· You own backups &amp; failover</li>
        </ul>
      </div>
      <div className="rounded-xl border border-redis-red/40 bg-redis-red/10 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Crown size={14} className="text-redis-red" />
          Redis Cloud
        </div>
        <ul className="mt-2 space-y-1 text-xs text-redis-muted">
          <li>· Auto failover &amp; backups</li>
          <li>· Monitoring built in</li>
          <li>· Enterprise support &amp; LangCache</li>
        </ul>
      </div>
    </div>
  );
}

/* ---------- ElastiCache vs Redis Cloud table ---------- */

export function ElastiCacheVsCloudTable() {
  const rows = [
    { dim: "Provider lock-in", a: "AWS-only", b: "AWS + GCP + Azure" },
    { dim: "Redis versions", a: "Tracks AWS releases", b: "Latest + previews" },
    { dim: "Modules", a: "Limited", b: "JSON, Search, Vector, LangCache" },
    { dim: "Vector / AI", a: "Basic", b: "First-class, with LangCache" },
    { dim: "Multi-region", a: "Global datastore (Redis)", b: "Active-Active CRDT" },
    { dim: "Support", a: "AWS support tiers", b: "Redis Inc. enterprise" },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-redis-line">
      <div className="grid grid-cols-3 border-b border-redis-line text-xs uppercase tracking-widest">
        <div className="p-3 text-redis-muted">Dimension</div>
        <div className="p-3 text-redis-muted">AWS ElastiCache</div>
        <div className="p-3 text-redis-red">Redis Cloud</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.dim}
          className={`grid grid-cols-3 text-sm ${
            i < rows.length - 1 ? "border-b border-redis-line/50" : ""
          }`}
        >
          <div className="p-3 font-medium">{r.dim}</div>
          <div className="p-3 text-redis-muted">{r.a}</div>
          <div className="p-3 text-white/90">{r.b}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Interactive savings calculator (Cat 5 Q6) ---------- */

export function FaqCostCalculator() {
  const [reqsPerDay, setReqsPerDay] = useState(50_000);
  const [llmCost, setLlmCost] = useState(0.003);
  const [hitRate, setHitRate] = useState(60);

  const dailySaved = reqsPerDay * (hitRate / 100) * llmCost;
  const monthlySaved = dailySaved * 30;

  return (
    <div className="rounded-xl border border-redis-line bg-black/40 p-5">
      <div className="mb-3 text-xs uppercase tracking-widest text-redis-red">
        Savings calculator
      </div>

      <Slider
        label="Requests / day"
        value={reqsPerDay}
        min={1_000}
        max={500_000}
        step={1_000}
        format={(v) => v.toLocaleString()}
        onChange={setReqsPerDay}
      />
      <Slider
        label="Avg LLM cost per request"
        value={llmCost * 1000}
        min={0.5}
        max={20}
        step={0.5}
        format={(v) => `$${(v / 1000).toFixed(4)}`}
        onChange={(v) => setLlmCost(v / 1000)}
      />
      <Slider
        label="Cache hit rate"
        value={hitRate}
        min={0}
        max={90}
        step={5}
        format={(v) => `${v}%`}
        onChange={setHitRate}
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Stat label="Daily savings" value={`$${dailySaved.toFixed(2)}`} />
        <Stat label="Estimated monthly" value={`$${monthlySaved.toFixed(2)}`} accent />
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-redis-muted">{label}</span>
        <span className="font-mono text-white">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-redis-red"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        accent
          ? "border-redis-red/40 bg-redis-red/10"
          : "border-redis-line bg-white/[0.02]"
      }`}
    >
      <div className="text-[10px] uppercase tracking-widest text-redis-muted">{label}</div>
      <div
        className={`mt-1 text-xl font-semibold ${accent ? "gradient-text" : "text-white"}`}
      >
        {value}
      </div>
    </div>
  );
}

/* ---------- Streams vs Kafka pros/cons pair ---------- */

export function StreamsVsKafkaCards() {
  return (
    <div className="space-y-3">
      <StreamsVsKafka />
      <div className="grid gap-3 md:grid-cols-2">
        <ProsCard
          title="Redis Streams"
          accent
          items={["Simpler ops", "Lightweight", "Great for medium workloads"]}
        />
        <ProsCard
          title="Kafka"
          items={["Massive event pipelines", "Long retention", "Enterprise-scale streaming"]}
        />
      </div>
    </div>
  );
}

function ProsCard({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? "border-redis-red/40 bg-redis-red/10"
          : "border-redis-line bg-black/40"
      }`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-2 space-y-1 text-xs text-redis-muted">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-1.5">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-redis-red" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* unused icons swallowed to keep import list stable */
void Eye;

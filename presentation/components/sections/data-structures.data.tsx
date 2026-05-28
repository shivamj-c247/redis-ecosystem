"use client";

import {
  Type,
  Hash,
  List,
  Boxes,
  Trophy,
  Activity,
  Braces,
  MapPin,
  LineChart,
  Filter,
  ListOrdered,
  type LucideIcon,
} from "lucide-react";
import type { TermStep } from "@/components/ui/MiniTerminal";

export interface DataStructure {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  useCases: string[];
  scenario: string;
  steps: TermStep[];
  whenToUse: string;
  bestUseCase: string;
  docsUrl: string;
  interview: { q: string; a: string };
  visual: React.ReactNode;
}

/* ----------------------------- visuals ----------------------------- */

function Pill({ label, tone = "red" }: { label: string; tone?: "red" | "muted" | "amber" }) {
  const cls =
    tone === "muted"
      ? "bg-white/5 text-redis-muted"
      : tone === "amber"
      ? "bg-amber-500/15 text-amber-200"
      : "bg-redis-red/15 text-redis-redLight";
  return <span className={`rounded-md px-2 py-1 font-mono text-xs ${cls}`}>{label}</span>;
}

function KVVisual() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Pill label="user:42" tone="muted" />
      <span className="text-redis-muted">→</span>
      <Pill label='"alice"' />
    </div>
  );
}

function HashVisual() {
  return (
    <div className="w-full max-w-[220px] space-y-1">
      {[
        ["name", '"alice"'],
        ["email", '"a@x.com"'],
        ["plan", '"pro"'],
      ].map(([k, v]) => (
        <div
          key={k}
          className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1 font-mono text-xs"
        >
          <span className="text-redis-muted">{k}</span>
          <span className="text-amber-200">{v}</span>
        </div>
      ))}
    </div>
  );
}

function ListVisual() {
  return (
    <div className="flex items-center gap-1">
      <Pill label="job-3" />
      <span className="text-redis-muted">→</span>
      <Pill label="job-2" />
      <span className="text-redis-muted">→</span>
      <Pill label="job-1" />
    </div>
  );
}

function SetVisual() {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {["redis", "ai", "vector", "redis"].map((t, i) => (
        <Pill key={i} label={t} tone={i === 3 ? "muted" : "red"} />
      ))}
    </div>
  );
}

function ZSetVisual() {
  return (
    <div className="w-full max-w-[220px] space-y-1">
      {[
        ["alice", 980],
        ["bob", 940],
        ["carol", 870],
      ].map(([n, s], i) => (
        <div
          key={n}
          className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1 font-mono text-xs"
        >
          <span>
            <span className="text-redis-muted">#{i + 1}</span> {n}
          </span>
          <span className="text-amber-200">{s}</span>
        </div>
      ))}
    </div>
  );
}

function StreamVisual() {
  return (
    <div className="w-full max-w-[240px] space-y-1 font-mono text-[11px]">
      {[
        ["1730-0", "order.created #42"],
        ["1731-0", "payment.ok #42"],
        ["1732-0", "shipped #42"],
      ].map(([id, ev]) => (
        <div key={id} className="rounded-md bg-white/5 px-2 py-1">
          <span className="text-redis-redLight">{id}</span> · {ev}
        </div>
      ))}
    </div>
  );
}

function JsonVisual() {
  return (
    <pre className="rounded-md bg-white/5 px-3 py-2 font-mono text-[11px] leading-relaxed text-amber-200">
{`{
  "name": "alice",
  "cart": [ 7, 12 ],
  "vip": true
}`}
    </pre>
  );
}

function GeoVisual() {
  return (
    <div className="relative h-28 w-44 rounded-lg border border-redis-line bg-white/[0.02]">
      {[
        [20, 30],
        [70, 50],
        [45, 75],
      ].map(([x, y], i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <MapPin size={16} className="text-redis-red" />
        </div>
      ))}
      <span className="absolute bottom-1 right-2 font-mono text-[10px] text-redis-muted">
        2.3 km
      </span>
    </div>
  );
}

function TimeSeriesVisual() {
  const pts = [12, 18, 9, 22, 16, 28, 20, 31];
  const max = Math.max(...pts);
  return (
    <div className="flex h-24 items-end gap-1.5">
      {pts.map((p, i) => (
        <div
          key={i}
          className="w-3 rounded-t bg-gradient-to-t from-redis-red/40 to-redis-red"
          style={{ height: `${(p / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function ProbabilisticVisual() {
  return (
    <div className="space-y-2 text-center">
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-sm ${
              [2, 5, 7, 10, 13].includes(i) ? "bg-redis-red" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] text-redis-muted">
        Bloom filter · ~12 bytes
      </span>
    </div>
  );
}

function ArrayVisual() {
  return (
    <div className="flex items-end gap-1">
      {["a", "b", "c", "d"].map((v, i) => (
        <div key={i} className="text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-redis-red/15 font-mono text-sm text-redis-redLight">
            {v}
          </div>
          <div className="mt-1 font-mono text-[10px] text-redis-muted">[{i}]</div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- data ----------------------------- */

export const STRUCTURES: DataStructure[] = [
  {
    id: "strings",
    name: "Strings",
    icon: Type,
    description: "The simplest type — a key mapped to a binary-safe value up to 512 MB.",
    useCases: ["API caching", "Session tokens", "Page-view counters"],
    scenario: "Cache a rendered user profile so the next request skips the database.",
    steps: [
      { cmd: "SET user:1 alice", out: "OK" },
      { cmd: "GET user:1", out: '"alice"' },
      { cmd: "INCR page_views", out: "(integer) 1" },
    ],
    whenToUse: "Storing simple values, flags, or atomic counters.",
    bestUseCase: "Caching & counters",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/strings/",
    interview: {
      q: "How do you make an atomic counter in Redis?",
      a: "Use INCR / INCRBY on a string key — it's atomic, so concurrent clients never lose increments. Pair with EXPIRE for rate-limit windows.",
    },
    visual: <KVVisual />,
  },
  {
    id: "hashes",
    name: "Hashes",
    icon: Hash,
    description: "A field → value map stored under one key. Like a tiny object.",
    useCases: ["User profiles", "Sessions", "Product metadata"],
    scenario: "Store a user object with editable fields without re-writing the whole blob.",
    steps: [
      { cmd: 'HSET user:1 name "alice" plan "pro"', out: "(integer) 2" },
      { cmd: "HGET user:1 name", out: '"alice"' },
      { cmd: "HGETALL user:1", out: ['1) "name"', '2) "alice"', '3) "plan"', '4) "pro"'] },
    ],
    whenToUse: "Grouping related fields under one key, updating one field at a time.",
    bestUseCase: "Objects & sessions",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/hashes/",
    interview: {
      q: "Hash vs serialized JSON string for an object?",
      a: "A Hash lets you read/update single fields (HGET/HSET) without deserializing the whole object, and is memory-efficient for small objects. Use JSON when you need nested structures or path queries.",
    },
    visual: <HashVisual />,
  },
  {
    id: "lists",
    name: "Lists",
    icon: List,
    description: "Ordered linked lists. O(1) push/pop from either end.",
    useCases: ["Job queues", "Activity timelines", "Chat history"],
    scenario: "A producer LPUSHes jobs; workers BRPOP them as a simple queue.",
    steps: [
      { cmd: "LPUSH queue job-1 job-2", out: "(integer) 2" },
      { cmd: "LRANGE queue 0 -1", out: ['1) "job-2"', '2) "job-1"'] },
      { cmd: "RPOP queue", out: '"job-1"' },
    ],
    whenToUse: "FIFO/LIFO queues, recent-items timelines, bounded history (with LTRIM).",
    bestUseCase: "Queues & timelines",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/lists/",
    interview: {
      q: "How do you build a reliable queue with Lists?",
      a: "Use LPUSH to enqueue and BRPOPLPUSH (or LMOVE) to atomically move a job to a processing list, so a crash mid-work doesn't lose the message.",
    },
    visual: <ListVisual />,
  },
  {
    id: "sets",
    name: "Sets",
    icon: Boxes,
    description: "Unordered collections of unique members. O(1) membership tests.",
    useCases: ["Unique tags", "Online users", "De-duplication"],
    scenario: "Track unique visitors today; duplicates are ignored automatically.",
    steps: [
      { cmd: "SADD tags redis ai vector", out: "(integer) 3" },
      { cmd: "SADD tags redis", out: "(integer) 0" },
      { cmd: "SISMEMBER tags ai", out: "(integer) 1" },
    ],
    whenToUse: "Uniqueness, membership checks, set algebra (union/intersection).",
    bestUseCase: "Uniqueness & tags",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/sets/",
    interview: {
      q: "How would you find mutual friends?",
      a: "Store each user's friends in a Set and use SINTER to intersect two users' friend sets — computed server-side in one command.",
    },
    visual: <SetVisual />,
  },
  {
    id: "sorted-sets",
    name: "Sorted Sets",
    icon: Trophy,
    description: "Unique members ordered by a numeric score. O(log N) operations.",
    useCases: ["Leaderboards", "Priority queues", "Rate limiting (sliding window)"],
    scenario: "A game leaderboard that re-ranks instantly as scores change.",
    steps: [
      { cmd: "ZADD lb 980 alice 940 bob", out: "(integer) 2" },
      { cmd: "ZREVRANGE lb 0 -1 WITHSCORES", out: ['1) "alice"', '2) "980"', '3) "bob"', '4) "940"'] },
      { cmd: "ZREVRANK lb alice", out: "(integer) 0" },
    ],
    whenToUse: "Anything ranked by a number: scores, timestamps, priorities.",
    bestUseCase: "Leaderboards",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/sorted-sets/",
    interview: {
      q: "How do you build a sliding-window rate limiter?",
      a: "Use a Sorted Set keyed per user with timestamps as scores. ZADD the now, ZREMRANGEBYSCORE old entries, then ZCARD to count requests in the window.",
    },
    visual: <ZSetVisual />,
  },
  {
    id: "streams",
    name: "Streams",
    icon: Activity,
    description: "Append-only log with consumer groups, acknowledgement, and replay.",
    useCases: ["Event sourcing", "Work queues at scale", "Audit trails"],
    scenario: "Order events fanned out to a worker group and an analytics group.",
    steps: [
      { cmd: "XADD orders * type created id 42", out: '"1730-0"' },
      { cmd: "XLEN orders", out: "(integer) 1" },
      { cmd: "XREADGROUP GROUP w c1 COUNT 1 STREAMS orders >", out: "1) orders → created #42" },
    ],
    whenToUse: "Durable event logs needing parallel consumers, replay, or acks.",
    bestUseCase: "Event streaming",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/streams/",
    interview: {
      q: "Streams vs Pub/Sub?",
      a: "Pub/Sub is fire-and-forget — offline subscribers miss messages. Streams persist, support consumer groups, acknowledgement, and replay from any ID — like a mini Kafka.",
    },
    visual: <StreamVisual />,
  },
  {
    id: "json",
    name: "JSON",
    icon: Braces,
    description: "Native JSON documents (RedisJSON) with path-based atomic updates.",
    useCases: ["Document store", "Config", "Nested API payloads"],
    scenario: "Store a user document and update one nested field via JSONPath.",
    steps: [
      { cmd: 'JSON.SET user:1 $ \'{"name":"alice","vip":true}\'', out: "OK" },
      { cmd: "JSON.GET user:1 $.name", out: '"[\\"alice\\"]"' },
      { cmd: "JSON.SET user:1 $.vip false", out: "OK" },
    ],
    whenToUse: "Nested documents you need to query/update by path, not as a blob.",
    bestUseCase: "Document store",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/json/",
    interview: {
      q: "Why RedisJSON over a string of JSON?",
      a: "RedisJSON updates nested fields atomically with JSONPath (JSON.SET path) and reads sub-trees without transferring the whole document — no read-modify-write round trips.",
    },
    visual: <JsonVisual />,
  },
  {
    id: "geospatial",
    name: "Geospatial",
    icon: MapPin,
    description: "Store coordinates and query by radius — built on Sorted Sets.",
    useCases: ["Nearby search", "Ride matching", "Store locators"],
    scenario: "Find all drivers within 5 km of a rider's location.",
    steps: [
      { cmd: "GEOADD drivers 77.59 12.97 d1", out: "(integer) 1" },
      { cmd: "GEOSEARCH drivers FROMLONLAT 77.6 12.98 BYRADIUS 5 km ASC", out: '1) "d1"' },
      { cmd: "GEODIST drivers d1 d2 km", out: '"2.3"' },
    ],
    whenToUse: "Location-aware features: proximity, radius, distance.",
    bestUseCase: "Nearby search",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/geospatial/",
    interview: {
      q: "How does Redis do geo queries?",
      a: "Coordinates are geohash-encoded into a Sorted Set score, so radius queries become efficient score-range scans — no separate spatial DB needed.",
    },
    visual: <GeoVisual />,
  },
  {
    id: "time-series",
    name: "Time Series",
    icon: LineChart,
    description: "Optimized append-only metrics with downsampling and retention.",
    useCases: ["IoT sensors", "App metrics", "Monitoring dashboards"],
    scenario: "Ingest temperature samples and auto-aggregate to per-minute averages.",
    steps: [
      { cmd: "TS.CREATE temp:room1 RETENTION 86400000", out: "OK" },
      { cmd: "TS.ADD temp:room1 * 21.5", out: '"1730000000000"' },
      { cmd: "TS.RANGE temp:room1 - + AGGREGATION avg 60000", out: "1) [ts, 21.5]" },
    ],
    whenToUse: "High-volume time-stamped numeric data with retention/rollups.",
    bestUseCase: "Metrics & IoT",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/timeseries/",
    interview: {
      q: "Why TimeSeries over a Sorted Set of timestamps?",
      a: "TimeSeries adds retention policies, compaction rules (auto-downsampling), and labels for multi-series queries — purpose-built for metrics that a Sorted Set would handle clumsily.",
    },
    visual: <TimeSeriesVisual />,
  },
  {
    id: "probabilistic",
    name: "Probabilistic",
    icon: Filter,
    description: "Tiny approximate structures: Bloom, Cuckoo, HyperLogLog, Top-K.",
    useCases: ["Seen-before checks", "Unique counts", "Trending items"],
    scenario: "Check if a username was likely seen before using a few KB instead of a full set.",
    steps: [
      { cmd: "BF.ADD seen alice", out: "(integer) 1" },
      { cmd: "BF.EXISTS seen alice", out: "(integer) 1" },
      { cmd: "PFADD visitors u1 u2 u3", out: "(integer) 1" },
    ],
    whenToUse: "Massive cardinality where approximate answers in tiny memory are fine.",
    bestUseCase: "Massive-scale counting",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/probabilistic/",
    interview: {
      q: "When is an approximate answer acceptable?",
      a: "When the cost of exactness is huge memory. A Bloom filter answers 'definitely not / probably yes' in ~KB; HyperLogLog counts billions of uniques in 12 KB with ~0.8% error.",
    },
    visual: <ProbabilisticVisual />,
  },
  {
    id: "arrays",
    name: "Arrays",
    icon: ListOrdered,
    description: "Index-addressable sequences via Lists (LINDEX/LSET) or JSON arrays.",
    useCases: ["Ordered slots", "Fixed-size buffers", "Positional data"],
    scenario: "Maintain a top-N recent-items buffer with direct index access.",
    steps: [
      { cmd: "RPUSH recent a b c d", out: "(integer) 4" },
      { cmd: "LINDEX recent 0", out: '"a"' },
      { cmd: "LSET recent 1 B", out: "OK" },
    ],
    whenToUse: "When you need positional (index) access, not just ends of a list.",
    bestUseCase: "Indexed sequences",
    docsUrl: "https://redis.io/docs/latest/develop/data-types/lists/",
    interview: {
      q: "Does Redis have a native array type?",
      a: "Not a distinct one — Lists provide index access (LINDEX/LSET/LRANGE) and RedisJSON supports true JSON arrays (JSON.ARRAPPEND). Choose Lists for simple sequences, JSON for nested arrays.",
    },
    visual: <ArrayVisual />,
  },
];

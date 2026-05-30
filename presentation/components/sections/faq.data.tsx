"use client";

import {
  Zap,
  HardDrive,
  Network,
  Layers,
  BrainCircuit,
  Cloud,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import {
  AppRedisDbVisual,
  ClusterSlotsVisual,
  ElastiCacheVsCloudTable,
  EmbeddingVisual,
  FaqCostCalculator,
  KeywordVsSemantic,
  PersistenceVisual,
  RamAllocationVisual,
  ReplicaVsShardVisual,
  SelfHostedVsCloudMini,
  SemanticCacheFlowVisual,
  SentinelVisual,
  StreamsVsKafkaCards,
} from "./faq-visuals";

export interface FaqSpeakerNotes {
  lead: string; // 30-second framing
  example: string; // real-world anchor
  followUps: string[]; // probable next-question prompts
}

export interface FaqItem {
  id: string;
  q: string;
  shortA: string;
  details: React.ReactNode;
  visual?: React.ReactNode;
  interviewTip: string;
  realWorld: string;
  speakerNotes: FaqSpeakerNotes;
}

export interface FaqCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  items: FaqItem[];
}

const P = (...lines: string[]) => (
  <div className="space-y-2 text-sm text-white/90">
    {lines.map((l, i) => (
      <p key={i}>{l}</p>
    ))}
  </div>
);

const UL = (items: string[]) => (
  <ul className="space-y-1.5 text-sm text-white/90">
    {items.map((it) => (
      <li key={it} className="flex items-start gap-2">
        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-redis-red" />
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

export const CATEGORIES: FaqCategory[] = [
  /* ----------------------------- 1. FUNDAMENTALS ----------------------------- */
  {
    id: "fundamentals",
    name: "Fundamentals",
    icon: Zap,
    items: [
      {
        id: "why-fast",
        q: "Why is Redis so fast?",
        shortA: "RAM, O(1) ops, a single-threaded event loop — no disk I/O, no locks on the hot path.",
        details: UL([
          "Working set lives in RAM — reads are memory accesses, not disk seeks.",
          "Most commands are O(1) (GET/SET, HGET, SADD) or O(log N) (ZADD).",
          "Single-threaded event loop processes commands sequentially — no thread contention or locks.",
          "Pipelining + batching let one connection push 100k+ ops/sec.",
        ]),
        interviewTip:
          "Don't say 'because it's in memory' alone — that's table stakes. Mention the event-loop model and O(1) data structures.",
        realWorld:
          "Twitter's home timeline, GitHub session lookups, Stripe rate limits — all rely on sub-ms p99 from this exact combination.",
        speakerNotes: {
          lead: "Three reasons, in order of importance: RAM, O(1) data structures, single-threaded event loop with no locks.",
          example: "A SQL indexed read is ~15ms; a Redis GET is ~0.5ms. Same key, 30× faster.",
          followUps: ["But isn't single-threaded a bottleneck?", "What about persistence?"],
        },
      },
      {
        id: "db-or-cache",
        q: "Is Redis a database or a cache?",
        shortA: "Both — and a stream broker, vector DB, and message bus. Redis is a multi-model engine.",
        details: P(
          "It started as a cache, but the modern Redis ships strings, hashes, lists, sets, sorted sets, streams, JSON, geospatial, time-series, probabilistic structures, and vectors.",
          "Pick the structure to fit the use case — leaderboards (ZSET), queues (List + Streams), sessions (Hash), AI memory (Vectors). One process, many shapes."
        ),
        interviewTip:
          "Frame Redis as a 'multi-model in-memory engine' — that's how Redis Labs markets it and avoids the false binary.",
        realWorld:
          "Pinterest uses Redis as a primary store for pin feeds; Discord uses it as a real-time message broker; OpenAI ecosystem uses it as a vector DB.",
        speakerNotes: {
          lead: "Wrong framing. Redis is a multi-model data engine — cache is just one of its modes.",
          example: "Same Redis instance can hold leaderboards (ZSET), sessions (HASH), and a vector index — atomically.",
          followUps: ["So can it replace Postgres?", "Where does it not fit?"],
        },
      },
      {
        id: "replace-postgres",
        q: "Can Redis replace PostgreSQL or MySQL?",
        shortA: "Rarely — and that's fine. Most architectures keep Redis in front of a relational DB.",
        details: P(
          "Redis is weak where SQL shines: complex ad-hoc queries, multi-table joins, ACID transactions across many rows, and very large datasets that don't fit affordable RAM.",
          "The common shape is: SQL as source of truth, Redis as the speed layer. Reads serve from Redis; writes flow to SQL with cache invalidation."
        ),
        visual: <AppRedisDbVisual />,
        interviewTip:
          "Answer 'no' for general OLTP, but mention MemoryDB on AWS — durable Redis-compatible primary DB for specific use cases.",
        realWorld:
          "Shopify, Stripe, Airbnb — all run Redis next to (not replacing) Postgres/MySQL.",
        speakerNotes: {
          lead: "Not for joins, not for ad-hoc analytics, not for huge cold datasets. Use both — Redis fronts the DB.",
          example: "Stripe: Postgres = ledger truth, Redis = idempotency + rate limits.",
          followUps: ["When is MemoryDB the right choice?", "How do you handle cache invalidation?"],
        },
      },
    ],
  },

  /* ----------------------------- 2. MEMORY & PERSISTENCE ----------------------------- */
  {
    id: "memory",
    name: "Memory & Persistence",
    icon: HardDrive,
    items: [
      {
        id: "data-loss",
        q: "If Redis stores data in RAM, won't I lose it on a crash?",
        shortA: "Not if you enable persistence — RDB snapshots, AOF append-log, or both.",
        details: P(
          "RDB: periodic point-in-time snapshots — small files, fast restart, but you may lose seconds of writes.",
          "AOF: append-only log of every write — durable down to the second (or every command), bigger files, slower restart.",
          "Hybrid: AOF for durability + RDB for fast warm restart. This is the default on Redis 7."
        ),
        visual: <PersistenceVisual />,
        interviewTip:
          "Know the three modes by name (RDB / AOF / Hybrid) and the trade-off: durability vs restart speed vs disk write amplification.",
        realWorld:
          "Most production Redis runs hybrid (AOF every second + RDB snapshot every 15 min) — the same default used by ElastiCache & MemoryDB.",
        speakerNotes: {
          lead: "Redis isn't a volatile cache by default — RDB snapshots and AOF append-logs make it durable.",
          example: "A 16 GB Redis with AOF-everysec recovers all but the last 1 second of writes after a crash.",
          followUps: ["What about replication for durability?", "Doesn't AOF kill performance?"],
        },
      },
      {
        id: "max-memory",
        q: "Can Redis consume all available RAM?",
        shortA: "Yes — and it will. Always set maxmemory + an eviction policy in production.",
        details: P(
          "maxmemory caps the dataset size. When hit, Redis evicts keys according to the policy — LRU, LFU, or TTL-based.",
          "Leave ~30% headroom for replication buffers, fork-on-write during RDB, and the OS. A common rule: maxmemory = 70% of node RAM."
        ),
        visual: <RamAllocationVisual />,
        interviewTip:
          "Memorize 'allkeys-lru' for caches and 'volatile-ttl' for sessions — interviewers love this question.",
        realWorld:
          "ElastiCache defaults maxmemory to ~75% of node RAM with allkeys-lru — sane defaults that work for most caches.",
        speakerNotes: {
          lead: "Yes, and that's why every production Redis sets maxmemory plus an eviction policy.",
          example: "70/30 rule: 70% to the dataset, 30% for replication buffers, fork-on-write, and the OS.",
          followUps: ["Which eviction policy is best for sessions?", "What happens when memory is full?"],
        },
      },
      {
        id: "why-ram",
        q: "Why use Redis if RAM is expensive?",
        shortA: "Because RAM is cheap *per request* — at sub-ms latency, you serve far more traffic per dollar.",
        details: P(
          "Disk-based DBs cost less per GB but cost more per query (CPU, IOPS, contention).",
          "Redis trades GB cost for latency and throughput — fewer servers, lower DB load, happier users. The break-even is much lower than people expect."
        ),
        interviewTip:
          "Talk in cost-per-request, not cost-per-GB. A $50/mo Redis can save thousands in over-provisioned DB nodes.",
        realWorld:
          "Twitter's home timeline ran on disk-based stores originally; moving the read path to Redis cut server count by ~10× at the same QPS.",
        speakerNotes: {
          lead: "Wrong unit. Don't compare $/GB — compare $/request at p99 latency.",
          example: "A 4 GB Redis at $50/mo can absorb 100k req/s — replacing a row of DB read replicas at 10× the cost.",
          followUps: ["When does RAM cost become prohibitive?", "Could SSD-tiered options like Aerospike fit?"],
        },
      },
    ],
  },

  /* ----------------------------- 3. SCALING & HA ----------------------------- */
  {
    id: "scaling",
    name: "Scaling & HA",
    icon: Network,
    items: [
      {
        id: "replica-vs-shard",
        q: "What's the difference between a replica and a shard?",
        shortA: "Replicas copy data for reliability. Shards split data for scalability.",
        details: P(
          "Replication: same data, more copies. Used for high availability, read scaling, and failover.",
          "Sharding (cluster): different data per node. Used to scale writes, storage, and total throughput beyond one box."
        ),
        visual: <ReplicaVsShardVisual />,
        interviewTip:
          "Two-line answer: 'replication = reliability, sharding = scalability'. Then ask which problem the team is actually solving.",
        realWorld:
          "Most apps need replication first; sharding only kicks in past tens of GB or hundreds of K ops/sec.",
        speakerNotes: {
          lead: "Replica copies the same data; shard splits the data. Reliability vs scalability.",
          example: "Reads slow? Add replicas. Writes maxed out? Shard.",
          followUps: ["Can you do both?", "How does the client route requests?"],
        },
      },
      {
        id: "cluster",
        q: "How does Redis Cluster work?",
        shortA: "Keys hash to one of 16384 slots; each shard owns a slot range. Clients route directly.",
        details: P(
          "Every key is hashed (CRC16 mod 16384) to a slot. Each shard advertises which slots it owns.",
          "Clients cache the slot map and connect directly to the right shard — no proxy hop. Reslotting moves slots between shards online."
        ),
        visual: <ClusterSlotsVisual />,
        interviewTip:
          "Remember the magic number 16384 and the CRC16 routing — common Redis trivia interview question.",
        realWorld:
          "Twitter, Snap, and most Redis-as-primary deployments shard across 10s–100s of nodes using this scheme.",
        speakerNotes: {
          lead: "CRC16(key) mod 16384 → slot → shard. Clients learn the slot map; no proxy in the hot path.",
          example: "A 3-shard cluster carves slots roughly into 0-5460 / 5461-10922 / 10923-16383.",
          followUps: ["What's a hash tag and when do you need one?", "How does resharding affect live traffic?"],
        },
      },
      {
        id: "sentinel",
        q: "What does Sentinel do?",
        shortA: "It monitors the topology and promotes a replica to primary when the primary dies — automatically, with quorum.",
        details: P(
          "Sentinel is a separate small process group (usually 3 or 5 nodes) that watches Redis primaries and replicas.",
          "When enough Sentinels agree the primary is down, they elect a leader, promote a healthy replica, and reconfigure the rest. Failover usually completes in seconds."
        ),
        visual: <SentinelVisual />,
        interviewTip:
          "Mention quorum (you need >50% of Sentinels to agree) — and that Sentinel is for non-clustered setups; Cluster handles its own failover.",
        realWorld:
          "Used by ElastiCache and most self-managed Redis HA setups. Cluster mode has equivalent logic built in.",
        speakerNotes: {
          lead: "Sentinel = health monitor + failover coordinator. Quorum agrees, replica promoted, clients reconnect — seconds, not minutes.",
          example: "Click 'Trigger failover' on the diagram — that's exactly what Sentinel automates.",
          followUps: ["Cluster vs Sentinel — when to pick which?", "What's split-brain and can it happen?"],
        },
      },
    ],
  },

  /* ----------------------------- 4. DATA STRUCTURES ----------------------------- */
  {
    id: "data-structures",
    name: "Data Structures",
    icon: Layers,
    items: [
      {
        id: "hash-vs-string",
        q: "When should I use Hash instead of String?",
        shortA: "When you'd otherwise store a serialized object and need to update one field cheaply.",
        details: P(
          "String holding JSON: every update is read → parse → modify → serialize → write. Locks two round trips.",
          "Hash: HSET one field — no parsing, no round trip. And smaller in memory for small objects (ziplist encoding)."
        ),
        interviewTip:
          "If the interviewer asks 'JSON string or Hash?', say Hash for small, frequently-edited objects; RedisJSON for nested ones.",
        realWorld:
          "User sessions: name, csrf, last_seen — perfect Hash. Update last_seen on every request with one HSET.",
        speakerNotes: {
          lead: "Hash when you'd otherwise serialize-update-deserialize a small object — one HSET vs a full round trip.",
          example: "Session storage: HSET sess:abc last_seen <now> updates one field; a JSON string would rewrite the whole blob.",
          followUps: ["Why not just use RedisJSON?", "When does a Hash get too big?"],
        },
      },
      {
        id: "when-zset",
        q: "When should I use Sorted Sets?",
        shortA: "Anywhere you need 'ordered by a number' — leaderboards, priority queues, time-windowed counters.",
        details: P(
          "ZSETs keep members unique and ordered by a score. O(log N) inserts, O(log N + M) range scans.",
          "Use score as: rank (game leaderboard), timestamp (sliding-window rate limit), priority (job queue), TTL (cleanup scans)."
        ),
        interviewTip:
          "Bonus points for naming three uses: leaderboards, sliding-window rate limiter, time-priority queue.",
        realWorld:
          "Every game backend's leaderboard; Stripe's distributed rate limiter; Discord's recent-channels list.",
        speakerNotes: {
          lead: "If the answer involves 'ordered by some number', it's probably a Sorted Set.",
          example: "Sliding-window rate limit: ZADD ts ts, ZREMRANGEBYSCORE -inf (now-60s), ZCARD = requests in last minute.",
          followUps: ["Why not a List?", "Memory cost vs a Set?"],
        },
      },
      {
        id: "streams-vs-pubsub",
        q: "Why use Streams instead of Pub/Sub?",
        shortA: "Streams persist, support consumer groups, acks, and replay. Pub/Sub is fire-and-forget.",
        details: P(
          "Pub/Sub delivers a message to whoever is online at that instant. Offline subscribers miss it forever.",
          "Streams append to a log. Consumers read at their own pace, acknowledge, and can replay from any ID. Add groups for parallelism."
        ),
        interviewTip:
          "Say 'Pub/Sub for ephemeral notifications, Streams for durable event flows' — the cleanest one-liner.",
        realWorld:
          "Cache invalidation broadcasts → Pub/Sub. Order events processed by workers → Streams.",
        speakerNotes: {
          lead: "Pub/Sub: at-most-once, no replay, no offline catchup. Streams: durable log with consumer groups + acks.",
          example: "Order event missed because a worker was restarting? Pub/Sub loses it. Streams replays it.",
          followUps: ["So Streams replaces Kafka?", "What's the Pending Entries List?"],
        },
      },
      {
        id: "streams-vs-kafka",
        q: "Can Redis Streams replace Kafka?",
        shortA: "For lightweight to medium event flows, yes. For massive, long-retention pipelines, Kafka wins.",
        details: P(
          "Streams give you the Kafka model in two commands and one process. Great for sub-million msg/s with limited retention.",
          "Kafka adds tiered disk storage, long retention, mature ecosystem tooling, and easier cross-team scaling — at the cost of operational weight."
        ),
        visual: <StreamsVsKafkaCards />,
        interviewTip:
          "Don't say 'Streams replace Kafka' — that's wrong at scale. Say 'they overlap in the small-to-medium range'.",
        realWorld:
          "Smaller startups often start on Streams to avoid Kafka ops, then migrate as event volume grows past Redis comfort zone.",
        speakerNotes: {
          lead: "Same mental model: producer → log → consumer groups. Different scales.",
          example: "Order events at 50k/s with 24h retention? Streams. 5M events/s with 30-day retention? Kafka.",
          followUps: ["Cost comparison?", "Migration path from Streams to Kafka?"],
        },
      },
    ],
  },

  /* ----------------------------- 5. AI & VECTOR ----------------------------- */
  {
    id: "ai",
    name: "AI & Vector",
    icon: BrainCircuit,
    items: [
      {
        id: "why-vector-db",
        q: "Why use Redis as a vector database?",
        shortA: "Because your team already runs Redis — and a unified platform means one less moving part.",
        details: P(
          "Most AI apps already use Redis for cache, sessions, or queues. Adding RediSearch + HNSW gives you a vector DB in the same process.",
          "One system to operate, monitor, back up, and pay for. Lower complexity, lower latency (no network hop to a separate vector store)."
        ),
        interviewTip:
          "Frame it as 'unified data layer'. Mention HNSW + FLAT indexes and cosine/L2 distance to show depth.",
        realWorld:
          "OpenAI ecosystem, LangChain, LlamaIndex all support Redis as a first-class vector store.",
        speakerNotes: {
          lead: "If you already have Redis, you already have a vector DB — RediSearch with HNSW. One platform, one ops surface.",
          example: "Practical 4 in this session — embed query, KNN search, LLM call, all in the same Redis instance.",
          followUps: ["How does it compare to Pinecone?", "What about Postgres pgvector?"],
        },
      },
      {
        id: "what-embedding",
        q: "What is an embedding?",
        shortA: "A vector of floats that captures the meaning of text (or images, audio) in a high-dimensional space.",
        details: P(
          "Embedding models map text → 768d (Gemini) or 1536d (OpenAI) vectors. Similar meanings → nearby vectors.",
          "Once embedded, 'compare meaning' becomes 'compare vectors' — a math operation that's fast and well-understood."
        ),
        visual: <EmbeddingVisual />,
        interviewTip:
          "Always mention the dimension count and the model — gemini-embedding-001 (configurable 768/1536/3072) vs text-embedding-3-small (1536d).",
        realWorld:
          "Every modern AI feature uses embeddings — search, recommendations, semantic cache, RAG.",
        speakerNotes: {
          lead: "Text becomes a vector. Similar text → nearby vectors. That's the whole magic.",
          example: "'What is Redis?' and 'Explain Redis' map to nearby points in 768d space — that's semantic similarity.",
          followUps: ["How are embedding models trained?", "Do different models produce comparable vectors? (No.)"],
        },
      },
      {
        id: "what-semantic-search",
        q: "What is semantic search?",
        shortA: "Search by meaning, not by keyword overlap.",
        details: P(
          "Keyword search needs the exact word; 'low-latency database' won't match a query for 'fast store'.",
          "Semantic search embeds both query and documents, then finds the closest vectors — meaning matches even when the words don't."
        ),
        visual: <KeywordVsSemantic />,
        interviewTip:
          "Bonus: mention hybrid search — combining BM25 (keyword) and vector — is what production systems usually do.",
        realWorld:
          "Notion, Linear, Slack search now all use semantic search underneath their keyword layer.",
        speakerNotes: {
          lead: "Keyword search compares strings; semantic search compares meaning via embeddings.",
          example: "'Fast store' vs 'low-latency database' — keyword misses, vector hits.",
          followUps: ["What's hybrid search?", "How do you rank semantic results?"],
        },
      },
      {
        id: "what-semantic-cache",
        q: "What is semantic caching?",
        shortA: "Caching LLM answers by meaning — rephrased questions hit the same cache entry.",
        details: P(
          "Exact-match cache: 'What is Redis?' and 'Explain Redis' are different keys → miss + double API spend.",
          "Semantic cache: both queries embed to nearby vectors → cache hit → no LLM call, no token charge."
        ),
        visual: <SemanticCacheFlowVisual />,
        interviewTip:
          "Know the threshold lever — typically cosine distance ≤ 0.15. Tighter = stricter match, looser = more hits but more drift.",
        realWorld:
          "ChatGPT-style assistants, AI agents, RAG endpoints — anywhere users ask similar things many ways.",
        speakerNotes: {
          lead: "Same intent → same cached answer, even with different words. Embed, vector-search, return.",
          example: "'How fast is Redis?' and 'What's Redis's latency?' — same answer, served from cache.",
          followUps: ["What threshold do you tune to?", "What if the answer is stale?"],
        },
      },
      {
        id: "what-langcache",
        q: "What is Redis LangCache?",
        shortA: "A managed semantic-cache service from Redis — the Practical 2 pattern, without the index ops.",
        details: P(
          "LangCache wraps semantic caching behind a REST API: send a query, get a cached answer or a miss.",
          "Embeddings, vector index, and tuning are managed for you. Pay for cache hits saved, not for infrastructure."
        ),
        interviewTip:
          "Mention 'managed semantic cache' as the category — it's the same shape as observability vendors that wrap Prometheus.",
        realWorld:
          "Production AI apps that don't want to operate a vector index just to cache — LangCache fills that gap.",
        speakerNotes: {
          lead: "Same pattern as Practical 2 — but a managed service, so you don't run the vector index yourself.",
          example: "If Practical 2 took you 90 minutes to set up; LangCache is a 10-line API call.",
          followUps: ["What's the pricing model?", "Can I bring my own embedding model?"],
        },
      },
      {
        id: "how-much-saved",
        q: "How much can semantic caching actually save?",
        shortA: "Anywhere from 30% to 70% of LLM spend, depending on how repetitive your traffic is.",
        details: P(
          "Public-facing chatbots see hit rates of 50–70% — many users ask the same things differently.",
          "Internal tools (devs, ops) tend to see 30–50%. The math is simple: every hit is a request you don't pay for."
        ),
        visual: <FaqCostCalculator />,
        interviewTip:
          "Always quote in monthly dollars, not percentages — execs care about $ not %.",
        realWorld:
          "AI customer-support bots see the highest savings: a few hundred FAQs cover ~70% of incoming questions.",
        speakerNotes: {
          lead: "30–70% of LLM spend, depending on traffic shape. Public-facing bots: high. Internal tools: medium.",
          example: "Demo the slider live — 50k reqs/day × 60% hit × $0.003/req = $2.7k/month saved.",
          followUps: ["How do I measure hit rate honestly?", "What about latency wins?"],
        },
      },
    ],
  },

  /* ----------------------------- 6. CLOUD vs SELF-HOSTED ----------------------------- */
  {
    id: "cloud",
    name: "Cloud vs Self-hosted",
    icon: Cloud,
    items: [
      {
        id: "why-pay-cloud",
        q: "Why pay for Redis Cloud if Redis is open source?",
        shortA: "You're not paying for the engine — you're paying for the ops, HA, and enterprise features around it.",
        details: P(
          "The Redis engine is OSS and always will be. Redis Cloud bundles managed infrastructure: backups, monitoring, auto failover, security, scaling, and enterprise modules like LangCache and Active-Active CRDTs.",
          "Calculate cost as 'engineer hours saved' + 'incidents avoided', not 'cost of Redis Inc. license'."
        ),
        visual: <SelfHostedVsCloudMini />,
        interviewTip:
          "The cleanest answer: 'Open source for software, paid for operations'. Same model as Confluent for Kafka.",
        realWorld:
          "Mid-size teams pay because one ops engineer's salary outweighs the cloud bill for the first year.",
        speakerNotes: {
          lead: "Same engine, different ops burden. Cloud takes the ops; you take the bill.",
          example: "Same logic as Confluent for Kafka — open core, paid operations.",
          followUps: ["Can I mix self-hosted + Cloud?", "What if I just run on Kubernetes?"],
        },
      },
      {
        id: "why-not-ec2",
        q: "Why not just run Redis on EC2?",
        shortA: "It works for learning and small apps. At scale, the operational burden hurts.",
        details: P(
          "You own: package upgrades, AOF rewrites, RDB cron, replication setup, Sentinel quorum, slowlog watching, fork-on-write tuning, security patches, multi-AZ failover.",
          "Each is solvable. Together they consume an SRE's week every month."
        ),
        interviewTip:
          "Be honest — say EC2-hosted Redis is perfectly fine for early-stage. The break-even is at maybe 100 GB / 50k qps / 99.9% SLA.",
        realWorld:
          "Most YC startups run Redis on EC2 for 18+ months. They migrate to managed when an outage takes them down for hours.",
        speakerNotes: {
          lead: "Fine for learning and small. Painful at scale — the ops list is long.",
          example: "Once you hit your first 2am failover with no Sentinel quorum, you start pricing managed.",
          followUps: ["What's the break-even point?", "Hybrid — primary on Cloud, replicas on EC2?"],
        },
      },
      {
        id: "elasticache-vs-redis-cloud",
        q: "Redis Cloud vs AWS ElastiCache?",
        shortA: "ElastiCache: cheaper, AWS-native, basic. Redis Cloud: latest engine, all modules, multi-cloud.",
        details: P(
          "ElastiCache tracks AWS releases and integrates tightly with VPC/IAM. Strong choice if you're all-in on AWS.",
          "Redis Cloud ships the latest engine, all modules (JSON, Search, Vector, LangCache), and runs on AWS + GCP + Azure with Active-Active multi-region. Choose by feature set, not just cost."
        ),
        visual: <ElastiCacheVsCloudTable />,
        interviewTip:
          "Don't pick on cost alone — pick on modules. If you need LangCache or Active-Active, that's Redis Cloud territory.",
        realWorld:
          "AWS-only shops on cache → ElastiCache. AI / multi-cloud / advanced modules → Redis Cloud.",
        speakerNotes: {
          lead: "Both managed. Different vendors, different feature ceilings.",
          example: "Need vector + JSON + multi-region active-active? Redis Cloud. Plain cache in one AWS region? ElastiCache.",
          followUps: ["MemoryDB vs both of those?", "What about Upstash?"],
        },
      },
    ],
  },

  /* ----------------------------- 7. ADVANCED ----------------------------- */
  {
    id: "advanced",
    name: "Advanced",
    icon: GraduationCap,
    items: [
      {
        id: "why-single-threaded",
        q: "Why is Redis single-threaded?",
        shortA: "Because the cost of locks would outweigh the gain from parallelism. The event loop is fast enough.",
        details: P(
          "Threads sharing data structures need locks. Locks are slow, deadlock-prone, and CPU-eating under contention.",
          "Single-threaded means no contention. Redis 6+ added I/O threads for network read/write but commands still execute serially — keeping the simplicity intact."
        ),
        interviewTip:
          "Mention I/O threads (Redis 6+) — shows you know the engine has evolved without abandoning the model.",
        realWorld:
          "Memcached is multi-threaded but only handles strings. Redis stays single-threaded because rich data structures + locks would be a nightmare.",
        speakerNotes: {
          lead: "Locks are the enemy. Single thread = no contention = simple + fast.",
          example: "Redis 6 added I/O threads for socket I/O — but commands still run one at a time. Best of both.",
          followUps: ["Doesn't a long ZRANGE block everything?", "When do you need multiple Redis processes?"],
        },
      },
      {
        id: "limitations",
        q: "What are Redis's limitations?",
        shortA: "RAM cost at huge scale, no SQL joins, weak ad-hoc analytics, async replication can lose writes.",
        details: UL([
          "RAM cost grows linearly with dataset — TB-scale gets expensive fast.",
          "No SQL joins — modeling many-to-many relations is awkward.",
          "Not built for analytical scans across the whole dataset.",
          "Async replication: a few writes can be lost on failover.",
          "Cluster has operational complexity (resharding, hash tags, multi-key ops constraints).",
        ]),
        interviewTip:
          "Listing limits honestly earns trust. Add: 'so we keep Redis for the hot path and use the right tool for the rest'.",
        realWorld:
          "Analytics pipelines pair Redis (real-time counters) with ClickHouse / BigQuery (historical analysis).",
        speakerNotes: {
          lead: "Honesty wins points: RAM cost, no joins, weak analytics, async replication, cluster ops.",
          example: "Real-time counters in Redis, historical roll-ups in ClickHouse — purpose-built layers.",
          followUps: ["When do these limits actually bite?", "How do other teams work around them?"],
        },
      },
      {
        id: "how-large",
        q: "How large can Redis scale?",
        shortA: "Single nodes hit hundreds of GB and ~100k ops/sec. Clusters reach TB-scale and millions of ops/sec.",
        details: P(
          "Single-node practical ceiling: ~500 GB RAM, 100k–200k ops/sec on commodity hardware.",
          "Cluster with dozens of shards: multi-TB datasets, millions of ops/sec. Twitter, Snap, and Robinhood all run Redis at that scale."
        ),
        interviewTip:
          "Quote the cluster scale numbers — most people underestimate Redis by a factor of 100.",
        realWorld:
          "Twitter's Redis cluster reportedly handles ~10M ops/sec across the fleet.",
        speakerNotes: {
          lead: "Single node: hundreds of GB, ~100k qps. Cluster: TB-scale, millions of qps.",
          example: "Twitter's cluster reportedly serves ~10M ops/sec across many shards.",
          followUps: ["At what scale do you outgrow Redis?", "Latency at the top end?"],
        },
      },
    ],
  },
];

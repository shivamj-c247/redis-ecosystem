export interface PresenterNote {
  sectionId: string;
  bullets: string[];
  demo?: string;
}

export const NOTES: PresenterNote[] = [
  {
    sectionId: "hero",
    bullets: [
      "Welcome the room. Confirm everyone can see the screen.",
      "Show of hands: who's used Redis? Who's shipped LLMs? Who's combined both?",
      "Set expectations: keynote + live demos. Repo link at the end.",
    ],
  },
  {
    sectionId: "why-redis",
    bullets: [
      "Reframe Redis as more than a cache — it's a multi-model DB.",
      "Click each card. Tie each to a real brand they recognize.",
      "Lead-in question: 'If 100 users ask the same question, what does it cost?'",
    ],
  },
  {
    sectionId: "architecture",
    bullets: [
      "5 pillars: in-memory, persistence, replication, sentinel, cluster.",
      "Demo: trigger failover button. Note how state propagates in seconds.",
      "Pro tip card: 1 primary + 2 replicas + Sentinel is the production default.",
    ],
  },
  {
    sectionId: "data-structures",
    bullets: [
      "Tap through the core 6 (Strings → Streams), then show JSON / Geo / TimeSeries as 'Redis is more than KV'.",
      "Use [ ] or number keys to jump — the mini-terminal auto-runs each command.",
      "Open one 'interview question' to engage the room. Click 'Open official docs' once to show it's real.",
      "Mention the Docker quick-start at the bottom for anyone following along.",
    ],
    demo: "Optional: expand 'Running Redis locally' to show the docker run one-liner.",
  },
  {
    sectionId: "cli",
    bullets: [
      "Type live: SET, GET, ZADD, ZREVRANGE. Show the colored output.",
      "Mention: same syntax works against the real Redis in the practicals.",
    ],
    demo: "Switch to terminal: cd practicals/practical-1-basic-cache && npx serverless offline",
  },
  {
    sectionId: "scaling",
    bullets: [
      "Open Caching → set up motivation for Practical 1.",
      "Open Rate Limit → INCR + EXPIRE pattern.",
      "Open Distributed Lock → SET NX EX. Bridge to Practical 5 idempotency.",
    ],
    demo: "Optional: switch to Practical 5 to show real idempotency.",
  },
  {
    sectionId: "db-vs-redis",
    bullets: [
      "Frame it: not rivals — layers. DB = source of truth, Redis = speed layer.",
      "Point at the latency bars: Redis ~1ms vs uncached join ~120ms.",
      "Walk the decision tree: read-heavy / sub-ms / real-time → Redis; ACID + joins → DB.",
    ],
  },
  {
    sectionId: "alternatives",
    bullets: [
      "Click each tab. Be fair — name where the competitor genuinely wins.",
      "Memcached: simpler but strings-only. DAX: only caches DynamoDB.",
      "Land the verdict line each time — Redis wins on breadth + ecosystem.",
    ],
  },
  {
    sectionId: "streams",
    bullets: [
      "Animation runs continuously — let it run while you talk.",
      "Streams = log + consumer groups + replay. Mini-Kafka in Redis.",
      "Consumer groups: fan-out across groups, parallelism within a group, XACK + PEL for reliability.",
      "Event-driven example: producer doesn't know its consumers — add a group, change nothing upstream.",
    ],
  },
  {
    sectionId: "redis-ai",
    bullets: [
      "Headline section — slow down here.",
      "Walk the embedding flow: text → vector → KNN search.",
      "Click the vector space — explain why 'near' means 'semantically similar'.",
      "Show the RAG diagram. Tie each box to Practical 4.",
    ],
    demo: "Switch to terminal: cd practicals/practical-4-rag-vector && npx serverless offline",
  },
  {
    sectionId: "semantic-cache",
    bullets: [
      "Type 'What is Redis?' → MISS.",
      "Type 'Explain Redis to me' → semantic HIT.",
      "Compare 4ms (Redis) vs 850ms (Gemini). Cost savings argument.",
    ],
    demo: "Switch to Practical 2 to show the real KNN cache in action.",
  },
  {
    sectionId: "cache-vs-semantic",
    bullets: [
      "Core idea: traditional cache matches EXACT text; semantic cache matches MEANING.",
      "Walk the two cards — same Q2 reworded gives MISS on the left, HIT on the right.",
      "Land the takeaway line: 'matches text' vs 'matches intent'.",
    ],
  },
  {
    sectionId: "ai-cost",
    bullets: [
      "Frame it: every cache hit is an LLM call you never pay for.",
      "Drag the hit-rate slider live — watch LLM calls and $/mo savings drop.",
      "Reduced token spend AND lower latency — two wins from one technique.",
    ],
  },
  {
    sectionId: "langcache",
    bullets: [
      "LangCache = the Practical 2 pattern, but managed — no vector index to run.",
      "Walk the hit/miss decision flow: embed → vector search → return or call LLM + store.",
      "'Why LangCache': no infra, built on Redis Vector DB, cheaper + faster AI.",
    ],
  },
  {
    sectionId: "ai-architecture",
    bullets: [
      "This is the RAG loop — point at Redis Vector DB as the center of gravity.",
      "Query → embed → retrieve context → LLM → grounded answer.",
      "Redis is vector store + memory + cache, not just one of them.",
    ],
  },
  {
    sectionId: "cloud-pricing",
    bullets: [
      "Free = learning/this session, Essentials = small apps, Pro = production + AI + HA.",
      "Stress: the engine is open source — you pay for managed infra, not features.",
    ],
  },
  {
    sectionId: "self-hosted-vs-cloud",
    bullets: [
      "Self-hosted: cheapest, full control, but YOU own backups/failover/scaling/monitoring.",
      "Cloud: subscription cost buys away the operational burden + enterprise AI features.",
      "Conclusion box: you're paying for managed operations, not the software.",
    ],
  },
  {
    sectionId: "redis-aws",
    bullets: [
      "Three options: ElastiCache (cache), MemoryDB (durable primary), self-managed (EC2/EKS).",
      "Point at the cost meters — durability/HA costs more, self-managed is cheapest raw compute.",
      "Rule of thumb: cache → ElastiCache, Redis-as-database → MemoryDB, full control → self-managed.",
    ],
  },
  {
    sectionId: "leaderboard",
    bullets: [
      "Click +100 a few times. Watch items reorder via layout animation.",
      "Tie to ZADD/ZREVRANGE in the code panel. Real-world: every game backend.",
    ],
  },
  {
    sectionId: "faq",
    bullets: [
      "Open the floor — search box up top filters all 25 Qs across all 7 categories.",
      "Speaker notes embed inside each FAQ card while presenter mode is on (you're in it now).",
      "Suggested live picks: 'Why so fast?', 'Replica vs shard', 'Streams vs Kafka', 'How much can semantic caching save?' (interactive calculator).",
      "End on the 'What would I use Redis for?' closing block to bridge into the wrap.",
    ],
  },
  {
    sectionId: "takeaways",
    bullets: [
      "Slow read of each takeaway. Let them land.",
      "Share the GitHub repo URL. Mention the appendix page for ecosystem deep-dive.",
      "Open the floor for questions.",
    ],
  },
];

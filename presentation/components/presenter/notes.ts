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
      "Walk through each tab — Strings → Streams. Don't dwell.",
      "Highlight: 'pick the right structure and most problems shrink to two commands'.",
      "Bridge: 'let's actually run these'.",
    ],
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
    sectionId: "streams",
    bullets: [
      "Animation runs continuously — let it run while you talk.",
      "Streams = log + consumer groups + replay. Mini-Kafka in Redis.",
      "Use case: order events fanned to workers + analytics.",
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
    sectionId: "leaderboard",
    bullets: [
      "Click +100 a few times. Watch items reorder via layout animation.",
      "Tie to ZADD/ZREVRANGE in the code panel. Real-world: every game backend.",
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

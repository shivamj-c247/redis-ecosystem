export interface SectionMeta {
  id: string;
  number: number;
  title: string;
  short: string;
  duration: number; // seconds budgeted
}

export const SECTIONS: SectionMeta[] = [
  { id: "hero", number: 1, title: "Hero", short: "Open", duration: 180 },
  { id: "why-redis", number: 2, title: "Why Redis", short: "Why", duration: 300 },
  { id: "architecture", number: 3, title: "Architecture", short: "Arch", duration: 300 },
  { id: "data-structures", number: 4, title: "Data Structures Playground", short: "Structs", duration: 360 },
  { id: "cli", number: 5, title: "CLI Simulator", short: "CLI", duration: 240 },
  { id: "scaling", number: 6, title: "Scaling Patterns", short: "Scale", duration: 360 },
  { id: "streams", number: 7, title: "Streams", short: "Streams", duration: 180 },
  { id: "redis-ai", number: 8, title: "Redis for AI", short: "AI", duration: 420 },
  { id: "semantic-cache", number: 9, title: "Semantic Cache Demo", short: "Cache", duration: 240 },
  { id: "cache-vs-semantic", number: 10, title: "Traditional vs Semantic Caching", short: "Vs", duration: 240 },
  { id: "ai-cost", number: 11, title: "Reducing AI Costs", short: "Cost", duration: 240 },
  { id: "langcache", number: 12, title: "Redis LangCache", short: "LangCache", duration: 240 },
  { id: "ai-architecture", number: 13, title: "Redis in Modern AI", short: "RAG", duration: 240 },
  { id: "cloud-pricing", number: 14, title: "Redis Cloud Pricing", short: "Pricing", duration: 180 },
  { id: "self-hosted-vs-cloud", number: 15, title: "Self-Hosted vs Cloud", short: "Host", duration: 240 },
  { id: "leaderboard", number: 16, title: "Leaderboard", short: "Board", duration: 180 },
  { id: "takeaways", number: 17, title: "Takeaways", short: "Wrap", duration: 180 },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

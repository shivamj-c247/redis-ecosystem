export interface CorpusDoc {
  id: string;
  title: string;
  body: string;
  tags: string;
}

// Same corpus as ../shared-corpus.json — kept in sync manually.
// (Imported here as a TS module so it bundles into the client without fetch.)
export const corpus: CorpusDoc[] = [
  {
    id: "1",
    title: "What is Redis?",
    body: "Redis is an in-memory data structure store used as a database, cache, message broker, and streaming engine.",
    tags: "intro,database,cache",
  },
  {
    id: "2",
    title: "Why Redis is fast",
    body: "Redis keeps the working set in RAM and uses single-threaded event-loop I/O, avoiding lock contention.",
    tags: "performance,architecture",
  },
  {
    id: "3",
    title: "Caching LLM responses",
    body: "Caching responses by an input hash turns a 800ms Gemini request into a 4ms Redis GET.",
    tags: "ai,cache,llm",
  },
  {
    id: "4",
    title: "Semantic caching with vectors",
    body: "Embedding the query and searching Redis for the nearest cached vector lets paraphrases hit the same cached answer.",
    tags: "ai,cache,vector,llm",
  },
  {
    id: "5",
    title: "Vector search in Redis",
    body: "RediSearch supports HNSW and FLAT vector indexes for KNN queries by cosine or L2 distance.",
    tags: "ai,vector,search",
  },
  {
    id: "6",
    title: "Retrieval Augmented Generation",
    body: "RAG embeds a user question, retrieves top-k similar documents, and stuffs them into the LLM prompt as context.",
    tags: "ai,rag,vector,llm",
  },
  {
    id: "7",
    title: "Embeddings explained",
    body: "Embeddings map text to high-dimensional vectors where semantically similar text lands close together.",
    tags: "ai,embeddings,vector",
  },
  {
    id: "8",
    title: "Rate limiting with Redis",
    body: "INCR + EXPIRE per user-key gives accurate per-window counting at millions of requests per second.",
    tags: "scaling,rate-limit,patterns",
  },
  {
    id: "9",
    title: "Distributed locks",
    body: "SET key value NX EX is the canonical Redis distributed lock primitive.",
    tags: "scaling,locks,patterns",
  },
  {
    id: "10",
    title: "Pub Sub messaging",
    body: "Redis PUBSUB delivers fire-and-forget messages to all subscribers of a channel.",
    tags: "scaling,pubsub,realtime",
  },
  {
    id: "11",
    title: "Redis Streams",
    body: "Streams are append-only logs with consumer groups, acknowledgement, and replay — a mini Kafka inside Redis.",
    tags: "scaling,streams,realtime",
  },
  {
    id: "12",
    title: "Session storage",
    body: "Web sessions stored in Redis support sliding TTL expiry and global access across stateless app servers.",
    tags: "scaling,sessions,patterns",
  },
  {
    id: "13",
    title: "Idempotency keys",
    body: "An idempotency key stored in Redis with SET NX returns the prior response instead of reprocessing.",
    tags: "scaling,patterns,reliability",
  },
  {
    id: "14",
    title: "Persistence",
    body: "Redis offers RDB snapshots and AOF append-only logs for durability.",
    tags: "architecture,persistence",
  },
  {
    id: "15",
    title: "Replication and Sentinel",
    body: "Sentinel monitors the topology and promotes a replica to primary on failure within seconds.",
    tags: "architecture,replication,ha",
  },
  {
    id: "16",
    title: "Redis Cluster",
    body: "Cluster mode shards keys across multiple primaries using 16384 hash slots.",
    tags: "architecture,cluster,scaling",
  },
  {
    id: "17",
    title: "Sorted sets for leaderboards",
    body: "ZADD plus ZRANGE WITHSCORES makes Redis the canonical real-time leaderboard store.",
    tags: "patterns,sorted-set,realtime",
  },
  {
    id: "18",
    title: "RedisJSON",
    body: "RedisJSON stores native JSON documents with path-based atomic updates via JSONPath.",
    tags: "ecosystem,json",
  },
  {
    id: "19",
    title: "Redis OM and Stack",
    body: "Redis Stack bundles RediSearch, RedisJSON, RedisBloom, RedisTimeSeries, and RedisGraph.",
    tags: "ecosystem,stack,om",
  },
  {
    id: "20",
    title: "AI memory and chat history",
    body: "Stateful AI agents store conversation history in Redis Lists or Streams keyed by session id.",
    tags: "ai,memory,chat,llm",
  },
];

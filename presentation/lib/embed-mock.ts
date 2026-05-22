// Deterministic 2D "embeddings" used purely for visualization in the keynote.
// NOT a real embedding model — just a stable mapping from text → (x, y) so we
// can show vector-space scatter plots and similarity matches without calling
// OpenAI from the browser.
//
// The mapping uses character frequencies hashed into two axes. Texts that share
// vocabulary land near each other, which is enough to *demonstrate* the idea.

import { corpus } from "./mock-corpus";

const VOCAB_AXIS_X = [
  "redis",
  "cache",
  "vector",
  "search",
  "embedding",
  "llm",
  "ai",
  "store",
  "memory",
  "semantic",
  "rag",
  "query",
];

const VOCAB_AXIS_Y = [
  "session",
  "rate",
  "lock",
  "stream",
  "replica",
  "cluster",
  "leaderboard",
  "json",
  "ttl",
  "pubsub",
  "scale",
  "production",
];

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z]+/g) ?? [];
}

export function embed2D(text: string): [number, number] {
  const tokens = tokenize(text);
  if (tokens.length === 0) return [0.5, 0.5];

  let x = 0;
  let y = 0;
  let hits = 0;

  for (const t of tokens) {
    const ix = VOCAB_AXIS_X.findIndex((v) => t.includes(v) || v.includes(t));
    if (ix >= 0) {
      x += (ix + 1) / VOCAB_AXIS_X.length;
      hits++;
    }
    const iy = VOCAB_AXIS_Y.findIndex((v) => t.includes(v) || v.includes(t));
    if (iy >= 0) {
      y += (iy + 1) / VOCAB_AXIS_Y.length;
      hits++;
    }
  }

  if (hits === 0) {
    // Fallback: hash the text into a stable pseudo-random point.
    let h = 0;
    for (const c of text) h = (h * 31 + c.charCodeAt(0)) | 0;
    return [
      0.15 + (Math.abs(h % 1000) / 1000) * 0.7,
      0.15 + (Math.abs((h >> 10) % 1000) / 1000) * 0.7,
    ];
  }

  return [
    Math.max(0.05, Math.min(0.95, x / Math.max(1, hits))),
    Math.max(0.05, Math.min(0.95, y / Math.max(1, hits))),
  ];
}

export function cosineLike(
  a: [number, number],
  b: [number, number]
): number {
  // For a 2D toy space, just use 1 - euclidean / max so it behaves like a
  // similarity score in [0, 1]. Good enough for the visualization.
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, 1 - dist / Math.SQRT2);
}

export interface CorpusPoint {
  id: string;
  title: string;
  body: string;
  tags: string;
  pos: [number, number];
}

export const corpusPoints: CorpusPoint[] = corpus.map((d) => ({
  ...d,
  pos: embed2D(`${d.title} ${d.body} ${d.tags}`),
}));

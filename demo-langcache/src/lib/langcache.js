// Thin wrapper around the official @redis-ai/langcache SDK.
//
// Responsibilities:
//   1. Create a singleton LangCache client.
//   2. Expose `lookup(prompt)` → cached response or null.
//   3. Expose `store(prompt, response)` → persist a new (prompt, response) pair.
//
// LangCache handles embedding generation + vector storage + similarity search
// server-side, so the demo never touches a vector index directly.

import { LangCache } from "@redis-ai/langcache";
import { config } from "../config.js";

const langCache = new LangCache({
  serverURL: `https://${config.langcache.host}`,
  cacheId: config.langcache.cacheId,
  apiKey: config.langcache.apiKey,
});

/**
 * Look up a cached response semantically similar to `prompt`.
 *
 * @param {string} prompt
 * @returns {Promise<{response: string, similarity: number, entryId?: string} | null>}
 */
export async function lookup(prompt) {
  const result = await langCache.search({
    prompt,
    // Higher = stricter. The SDK returns matches with similarity >= threshold.
    similarityThreshold: config.langcache.similarityThreshold,
  });

  // The SDK returns an array of matching entries (highest similarity first).
  // Different SDK versions surface this as `result.data` or as the array
  // directly — normalize for both.
  const matches = Array.isArray(result) ? result : result?.data ?? [];
  if (!matches.length) return null;

  const top = matches[0];
  return {
    response: top.response,
    similarity: top.similarity ?? top.score ?? null,
    entryId: top.entryId ?? top.id ?? null,
  };
}

/**
 * Store a new (prompt, response) pair in LangCache.
 *
 * @param {string} prompt
 * @param {string} response
 * @returns {Promise<{entryId?: string} | null>}
 */
export async function store(prompt, response) {
  try {
    const result = await langCache.set({ prompt, response });
    return { entryId: result?.entryId ?? result?.id ?? null };
  } catch (err) {
    // Storage failure shouldn't break the user-facing response.
    console.error("[langcache] store failed:", err.message);
    return null;
  }
}

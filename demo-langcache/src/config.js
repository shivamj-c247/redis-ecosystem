// Centralized config — load once at boot, fail fast if anything required is missing.
import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`\n[config] Missing required env var: ${name}`);
    console.error("        Copy .env.example to .env and fill it in.\n");
    process.exit(1);
  }
  return v;
}

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),

  langcache: {
    host: required("LANGCACHE_HOST"),
    cacheId: required("LANGCACHE_CACHE_ID"),
    apiKey: required("LANGCACHE_API_KEY"),
    similarityThreshold: parseFloat(
      process.env.LANGCACHE_SIMILARITY_THRESHOLD || "0.9"
    ),
  },

  gemini: {
    apiKey: required("GEMINI_API_KEY"),
    chatModel: process.env.GEMINI_CHAT_MODEL || "gemini-flash-latest",
  },

  // Used only for the displayed "savings" metric — not for real billing.
  estimatedCostPerLlmCallUsd: parseFloat(
    process.env.ESTIMATED_COST_PER_LLM_CALL_USD || "0.0001"
  ),
};

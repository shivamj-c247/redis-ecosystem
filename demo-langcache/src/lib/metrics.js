// Lightweight session counters — purely cosmetic, drives the dashboard.
//
// In-memory only: resets when the server restarts. That's exactly what we want
// for a live demo (reproducible numbers each run).

import { config } from "../config.js";

const state = {
  totalRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  msSavedTotal: 0,
  usdSavedTotal: 0,
  startedAt: Date.now(),
};

// Used to estimate the "ms saved" metric on a hit — we compare the hit's
// actual latency to a rolling average of recent miss latencies.
let recentMissAvgMs = 800;
const MISS_EMA_ALPHA = 0.3;

export function recordHit(ms) {
  state.totalRequests++;
  state.cacheHits++;
  state.msSavedTotal += Math.max(0, recentMissAvgMs - ms);
  state.usdSavedTotal += config.estimatedCostPerLlmCallUsd;
}

export function recordMiss(ms) {
  state.totalRequests++;
  state.cacheMisses++;
  recentMissAvgMs = recentMissAvgMs * (1 - MISS_EMA_ALPHA) + ms * MISS_EMA_ALPHA;
}

export function snapshot() {
  const hitRate =
    state.totalRequests === 0
      ? 0
      : state.cacheHits / state.totalRequests;
  return {
    totalRequests: state.totalRequests,
    cacheHits: state.cacheHits,
    cacheMisses: state.cacheMisses,
    hitRate,
    msSavedTotal: Math.round(state.msSavedTotal),
    usdSavedTotal: Number(state.usdSavedTotal.toFixed(4)),
    recentMissAvgMs: Math.round(recentMissAvgMs),
    uptimeSec: Math.floor((Date.now() - state.startedAt) / 1000),
  };
}

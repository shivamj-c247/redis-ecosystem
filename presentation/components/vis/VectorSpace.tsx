"use client";

import { motion } from "framer-motion";
import { corpusPoints, embed2D, cosineLike } from "@/lib/embed-mock";

interface Props {
  query?: string;
  hitThreshold?: number;
  className?: string;
}

const SIZE = 360;
const PADDING = 24;
const PLOT = SIZE - PADDING * 2;

function toPx([x, y]: [number, number]): [number, number] {
  return [PADDING + x * PLOT, PADDING + (1 - y) * PLOT];
}

export function VectorSpace({ query, hitThreshold = 0.85, className = "" }: Props) {
  const queryPos = query ? embed2D(query) : null;
  const queryPx = queryPos ? toPx(queryPos) : null;

  let nearest: typeof corpusPoints[number] | null = null;
  let nearestSim = 0;
  if (queryPos) {
    for (const p of corpusPoints) {
      const sim = cosineLike(p.pos, queryPos);
      if (sim > nearestSim) {
        nearestSim = sim;
        nearest = p;
      }
    }
  }
  const isHit = nearest && nearestSim >= hitThreshold;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full"
        aria-label="vector space scatter"
      >
        <defs>
          <radialGradient id="point-glow">
            <stop offset="0%" stopColor="#dc382d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#dc382d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="query-glow">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* grid */}
        <g stroke="#1f2025" strokeWidth="1">
          {[0.25, 0.5, 0.75].map((t) => (
            <g key={t}>
              <line
                x1={PADDING}
                y1={PADDING + t * PLOT}
                x2={SIZE - PADDING}
                y2={PADDING + t * PLOT}
              />
              <line
                x1={PADDING + t * PLOT}
                y1={PADDING}
                x2={PADDING + t * PLOT}
                y2={SIZE - PADDING}
              />
            </g>
          ))}
        </g>
        <rect
          x={PADDING}
          y={PADDING}
          width={PLOT}
          height={PLOT}
          fill="none"
          stroke="#1f2025"
          strokeWidth="1"
        />

        {/* corpus points */}
        {corpusPoints.map((p) => {
          const [cx, cy] = toPx(p.pos);
          const isNearest = nearest?.id === p.id;
          return (
            <g key={p.id}>
              <circle
                cx={cx}
                cy={cy}
                r={isNearest ? 7 : 4}
                fill={isNearest ? (isHit ? "#22c55e" : "#fbbf24") : "#dc382d"}
                opacity={isNearest ? 1 : 0.65}
              />
              {isNearest && (
                <motion.circle
                  initial={{ r: 4, opacity: 0.8 }}
                  animate={{ r: 22, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  cx={cx}
                  cy={cy}
                  fill="none"
                  stroke={isHit ? "#22c55e" : "#fbbf24"}
                  strokeWidth="1.5"
                />
              )}
            </g>
          );
        })}

        {/* query point */}
        {queryPx && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${queryPx[0]}px ${queryPx[1]}px` }}
          >
            <circle cx={queryPx[0]} cy={queryPx[1]} r={18} fill="url(#query-glow)" />
            <circle
              cx={queryPx[0]}
              cy={queryPx[1]}
              r={5}
              fill="#fff"
              stroke="#dc382d"
              strokeWidth="2"
            />
            {nearest && (
              <line
                x1={queryPx[0]}
                y1={queryPx[1]}
                x2={toPx(nearest.pos)[0]}
                y2={toPx(nearest.pos)[1]}
                stroke={isHit ? "#22c55e" : "#fbbf24"}
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )}
          </motion.g>
        )}
      </svg>

      <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] text-redis-muted backdrop-blur-sm">
        2D projection · 20 corpus vectors
      </div>

      {nearest && (
        <motion.div
          key={nearest.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 rounded-lg border border-redis-line bg-black/70 p-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-xs">
            <span
              className={`rounded-full px-2 py-0.5 font-medium ${
                isHit
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {isHit ? "Cache HIT" : "Cache MISS"}
            </span>
            <span className="font-mono text-redis-muted">
              similarity: {nearestSim.toFixed(3)}
            </span>
          </div>
          <div className="mt-2 text-sm">{nearest.title}</div>
        </motion.div>
      )}
    </div>
  );
}

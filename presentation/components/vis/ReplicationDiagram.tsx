"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Eye, Crown } from "lucide-react";

type State = "normal" | "failover";

export function ReplicationDiagram() {
  const [state, setState] = useState<State>("normal");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-redis-line bg-black/40 p-6">
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#dc382d" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#dc382d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#dc382d" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative flex flex-col items-center gap-12">
        <Node
          label="Sentinel"
          icon={<Eye size={18} />}
          color="muted"
          subtitle="Monitors topology"
        />

        <div className="flex w-full items-start justify-around gap-8">
          <Node
            label={state === "normal" ? "Primary" : "Replica"}
            icon={state === "normal" ? <Crown size={18} /> : <Server size={18} />}
            color={state === "normal" ? "red" : "muted"}
            subtitle="node-1"
            fading={state === "failover"}
          />
          <Node
            label={state === "normal" ? "Replica" : "Primary"}
            icon={state === "normal" ? <Server size={18} /> : <Crown size={18} />}
            color={state === "normal" ? "muted" : "red"}
            subtitle="node-2"
            promoted={state === "failover"}
          />
          <Node
            label="Replica"
            icon={<Server size={18} />}
            color="muted"
            subtitle="node-3"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-xs text-redis-muted">
          Replication: <span className="font-mono text-amber-200">async</span>
          {"  ·  "}
          State: <span className="font-mono text-white">{state}</span>
        </div>
        <button
          onClick={() => setState(state === "normal" ? "failover" : "normal")}
          className="rounded-full border border-redis-red/40 bg-redis-red/10 px-4 py-2 text-sm text-redis-redLight transition-colors hover:bg-redis-red hover:text-white"
        >
          {state === "normal" ? "Trigger failover →" : "← Reset"}
        </button>
      </div>
    </div>
  );
}

function Node({
  label,
  icon,
  color,
  subtitle,
  promoted,
  fading,
}: {
  label: string;
  icon: React.ReactNode;
  color: "red" | "muted";
  subtitle: string;
  promoted?: boolean;
  fading?: boolean;
}) {
  return (
    <motion.div
      layout
      animate={{
        opacity: fading ? 0.4 : 1,
        scale: promoted ? 1.05 : 1,
      }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex w-32 flex-col items-center gap-2 rounded-xl border p-4 ${
        color === "red"
          ? "border-redis-red/60 bg-redis-red/10"
          : "border-redis-line bg-black/40"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          color === "red" ? "bg-redis-red text-white" : "bg-white/5 text-redis-muted"
        }`}
      >
        {icon}
      </div>
      <div className="text-sm font-medium">{label}</div>
      <div className="font-mono text-xs text-redis-muted">{subtitle}</div>
      {promoted && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-3 rounded-full bg-redis-red px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
        >
          promoted
        </motion.div>
      )}
    </motion.div>
  );
}

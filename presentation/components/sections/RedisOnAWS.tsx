"use client";

import { motion } from "framer-motion";
import { Server, Cloud, Database, Info } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

interface Option {
  id: string;
  name: string;
  icon: typeof Cloud;
  tagline: string;
  durability: string;
  ha: string;
  ops: string;
  cost: string;
  costLevel: number; // 1-3 relative
  bestFor: string;
  highlight?: boolean;
}

const OPTIONS: Option[] = [
  {
    id: "elasticache",
    name: "ElastiCache",
    icon: Cloud,
    tagline: "Managed Redis OSS cache",
    durability: "In-memory (cache-first)",
    ha: "Multi-AZ with replicas",
    ops: "AWS-managed patching & failover",
    cost: "$$ — pay per node-hour",
    costLevel: 2,
    bestFor: "Caching & sessions in front of RDS/DynamoDB",
  },
  {
    id: "memorydb",
    name: "MemoryDB",
    icon: Database,
    tagline: "Durable, Redis-compatible primary DB",
    durability: "Multi-AZ transaction log (durable)",
    ha: "99.99% with automatic failover",
    ops: "Fully managed, durable by design",
    cost: "$$$ — durability premium",
    costLevel: 3,
    bestFor: "Redis as a primary database (not just cache)",
    highlight: true,
  },
  {
    id: "self-managed",
    name: "Self-managed",
    icon: Server,
    tagline: "Redis on EC2 / EKS yourself",
    durability: "Whatever you configure (RDB/AOF)",
    ha: "DIY: Sentinel / Cluster",
    ops: "You own patching, backups, failover",
    cost: "$ — just compute",
    costLevel: 1,
    bestFor: "Cost control, full tuning, learning",
  },
];

const ROWS: { key: keyof Option; label: string }[] = [
  { key: "durability", label: "Durability" },
  { key: "ha", label: "High availability" },
  { key: "ops", label: "Operations" },
  { key: "cost", label: "Cost" },
  { key: "bestFor", label: "Best for" },
];

export function RedisOnAWS() {
  return (
    <SectionWrapper
      id="redis-aws"
      number={18}
      eyebrow="Cloud"
      title={
        <>
          Redis on <span className="gradient-text">AWS</span>.
        </>
      }
      description="Three ways to run Redis on AWS — trading operational effort and cost against durability and availability."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {OPTIONS.map((o, i) => {
          const Icon = o.icon;
          return (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`glass relative overflow-hidden rounded-2xl p-6 ${
                o.highlight ? "border-redis-red/50" : ""
              }`}
            >
              {o.highlight && (
                <div className="absolute right-0 top-0 rounded-bl-xl bg-redis-red px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                  Durable
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-redis-red/15 text-redis-red">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{o.name}</h3>
                  <div className="text-xs text-redis-muted">{o.tagline}</div>
                </div>
              </div>

              {/* relative cost meter */}
              <div className="mt-4 flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-widest text-redis-muted">
                  Cost
                </span>
                {[1, 2, 3].map((lvl) => (
                  <span
                    key={lvl}
                    className={`h-1.5 w-6 rounded-full ${
                      lvl <= o.costLevel ? "bg-redis-red" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {ROWS.map((r) => (
                  <div key={r.key} className="border-t border-redis-line pt-3">
                    <div className="text-[10px] uppercase tracking-widest text-redis-muted">
                      {r.label}
                    </div>
                    <div className="mt-0.5 text-sm text-white/90">{o[r.key as keyof Option] as string}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-redis-line bg-black/40 p-5 text-sm text-redis-muted">
        <Info size={16} className="mt-0.5 shrink-0 text-redis-red" />
        <span>
          Rule of thumb: <span className="text-white/90">ElastiCache</span> when Redis is a
          cache in front of a database, <span className="text-white/90">MemoryDB</span> when
          Redis <em>is</em> the database (you need durability), and{" "}
          <span className="text-white/90">self-managed</span> when you want full control or
          the lowest raw cost and can own the operations.
        </span>
      </div>
    </SectionWrapper>
  );
}

"use client";

import { motion } from "framer-motion";
import { Cpu, HardDrive, GitBranch, Eye, Network } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ReplicationDiagram } from "@/components/vis/ReplicationDiagram";

const PILLARS = [
  {
    icon: Cpu,
    title: "In-memory engine",
    body: "Working set in RAM. Single-threaded event loop avoids locks. Most commands O(1).",
  },
  {
    icon: HardDrive,
    title: "Persistence",
    body: "RDB snapshots for fast restart. AOF append-only log for durability. Mix both.",
  },
  {
    icon: GitBranch,
    title: "Replication",
    body: "Async replication primary → replicas. Read scaling, regional failover, near-zero RPO.",
  },
  {
    icon: Eye,
    title: "Sentinel",
    body: "Monitors the topology. Promotes a healthy replica when the primary dies. Seconds.",
  },
  {
    icon: Network,
    title: "Cluster",
    body: "Shards across 16384 hash slots. Horizontal write scaling. Linear throughput.",
  },
];

export function Architecture() {
  return (
    <SectionWrapper
      id="architecture"
      number={3}
      eyebrow="Architecture"
      title={
        <>
          Five pieces. <span className="gradient-text">One mental model.</span>
        </>
      }
      description="The deeper you go with Redis the more it pays off. Understand these five primitives and you've understood Redis at scale."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass flex items-start gap-4 rounded-xl p-5"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-redis-red/15 text-redis-red">
                <p.icon size={18} />
              </div>
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="mt-1 text-sm text-redis-muted">{p.body}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <ReplicationDiagram />
          <div className="rounded-2xl border border-redis-line bg-black/40 p-5 text-sm text-redis-muted">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-redis-red">
              Pro tip
            </div>
            For production: 1 primary + 2 replicas + Sentinel quorum. Add Cluster mode once
            a single shard's write throughput becomes the bottleneck (usually well past
            100k ops/sec).
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

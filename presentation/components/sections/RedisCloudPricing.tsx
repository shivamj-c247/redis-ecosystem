"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

interface Plan {
  name: string;
  badge: string;
  highlight?: boolean;
  bestFor: string;
  deployment: string;
  storage: string;
  availability: string;
  scaling: string;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    badge: "Learning & demos",
    bestFor: "Trying Redis, this session's practicals",
    deployment: "Shared, single zone",
    storage: "~30 MB",
    availability: "Best effort",
    scaling: "Fixed",
  },
  {
    name: "Essentials",
    badge: "Small applications",
    bestFor: "Hobby & small production apps",
    deployment: "Shared / dedicated",
    storage: "250 MB – 12 GB",
    availability: "Single or multi-zone",
    scaling: "Manual tiers",
  },
  {
    name: "Pro",
    badge: "Production · AI · HA",
    highlight: true,
    bestFor: "Production systems & AI workloads",
    deployment: "Dedicated, multi-AZ",
    storage: "Configurable, large",
    availability: "99.999% HA + auto failover",
    scaling: "Auto / on-demand",
  },
];

const ROWS: { key: keyof Plan; label: string }[] = [
  { key: "bestFor", label: "Best for" },
  { key: "deployment", label: "Deployment type" },
  { key: "storage", label: "Storage" },
  { key: "availability", label: "Availability" },
  { key: "scaling", label: "Scaling" },
];

export function RedisCloudPricing() {
  return (
    <SectionWrapper
      id="cloud-pricing"
      number={16}
      eyebrow="Pricing"
      title={
        <>
          Redis Cloud <span className="gradient-text">pricing</span> overview.
        </>
      }
      description="Three tiers, one mental model: pick by availability and scale needs, not by feature gating."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`glass relative overflow-hidden rounded-2xl p-6 ${
              p.highlight ? "border-redis-red/50" : ""
            }`}
          >
            {p.highlight && (
              <div className="absolute right-0 top-0 rounded-bl-xl bg-redis-red px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                Recommended
              </div>
            )}
            <h3 className="text-2xl font-semibold">{p.name}</h3>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${
                p.highlight
                  ? "bg-redis-red/15 text-redis-redLight"
                  : "bg-white/5 text-redis-muted"
              }`}
            >
              {p.badge}
            </span>

            <div className="mt-5 space-y-3">
              {ROWS.map((r) => (
                <div key={r.key} className="border-t border-redis-line pt-3">
                  <div className="text-[10px] uppercase tracking-widest text-redis-muted">
                    {r.label}
                  </div>
                  <div className="mt-0.5 text-sm text-white/90">{p[r.key]}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-redis-line bg-black/40 p-5 text-sm text-redis-muted">
        <Info size={16} className="mt-0.5 shrink-0 text-redis-red" />
        <span>
          Redis itself is <span className="text-white/90">open source</span>. Redis Cloud
          pricing is primarily for managed infrastructure: scalability, monitoring,
          backups, and enterprise features — not the database engine.
        </span>
      </div>
    </SectionWrapper>
  );
}

"use client";

import { motion } from "framer-motion";
import { Server, Cloud, Check, X, ArrowDown } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const SELF = {
  stack: ["EC2", "Docker", "Redis"],
  pros: ["Lowest cost", "Full control", "Great for learning", "Good for small projects"],
  cons: [
    "Manage backups yourself",
    "Manage failover yourself",
    "Manual scaling",
    "Monitoring setup required",
    "Operational overhead",
  ],
};

const CLOUD = {
  stack: ["Redis Cloud", "Managed service"],
  pros: [
    "Automatic backups",
    "Monitoring built in",
    "High availability",
    "Replication",
    "Auto failover",
    "Managed scaling",
    "Enterprise support",
    "LangCache support",
    "Vector search support",
  ],
  cons: ["Subscription cost"],
};

export function SelfHostedVsCloud() {
  return (
    <SectionWrapper
      id="self-hosted-vs-cloud"
      number={15}
      eyebrow="Operations"
      title={
        <>
          Self-hosted vs <span className="gradient-text">Redis Cloud</span>.
        </>
      }
      description="The engine is identical. What differs is who carries the operational weight."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Column
          icon={Server}
          title="Self-hosted"
          stack={SELF.stack}
          pros={SELF.pros}
          cons={SELF.cons}
        />
        <Column
          icon={Cloud}
          title="Redis Cloud"
          stack={CLOUD.stack}
          pros={CLOUD.pros}
          cons={CLOUD.cons}
          accent
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-redis-red/20 to-transparent p-px"
      >
        <div className="rounded-2xl bg-redis-ink/60 p-6 text-center">
          <p className="text-balance text-xl font-medium md:text-2xl">
            You&apos;re not paying for Redis <span className="text-redis-muted">software</span>.
            You&apos;re paying for{" "}
            <span className="gradient-text">
              managed operations, HA, monitoring, security, and enterprise AI capabilities
            </span>
            .
          </p>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}

function Column({
  icon: Icon,
  title,
  stack,
  pros,
  cons,
  accent,
}: {
  icon: typeof Server;
  title: string;
  stack: string[];
  pros: string[];
  cons: string[];
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass rounded-2xl p-6 ${accent ? "border-redis-red/40" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            accent ? "bg-redis-red text-white" : "bg-white/5 text-redis-muted"
          }`}
        >
          <Icon size={18} />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>

      {/* mini architecture stack */}
      <div className="mt-5 flex flex-col items-center gap-2 rounded-xl border border-redis-line bg-black/40 py-5">
        {stack.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <span
              className={`rounded-lg px-4 py-1.5 text-sm ${
                accent && i === 0
                  ? "bg-redis-red/15 text-redis-redLight"
                  : "bg-white/5 text-white/90"
              }`}
            >
              {s}
            </span>
            {i < stack.length - 1 && <ArrowDown size={14} className="text-redis-muted" />}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-xs uppercase tracking-widest text-emerald-400">Pros</div>
          <ul className="space-y-1.5">
            {pros.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-white/90">
                <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 text-xs uppercase tracking-widest text-amber-300">Cons</div>
          <ul className="space-y-1.5">
            {cons.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-redis-muted">
                <X size={14} className="mt-0.5 shrink-0 text-amber-300" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

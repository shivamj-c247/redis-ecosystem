"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Zap, DollarSign, Server } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function AICostOptimization() {
  const [spend, setSpend] = useState(200);
  const [outputCost, setOutputCost] = useState(120);
  const [hitRate, setHitRate] = useState(50);

  const savings = Math.round(outputCost * (hitRate / 100));
  const requests = 1000;
  const llmCalls = Math.round(requests * (1 - hitRate / 100));
  const cacheHits = requests - llmCalls;

  return (
    <SectionWrapper
      id="ai-cost"
      number={13}
      eyebrow="Cost"
      title={
        <>
          Cut LLM spend with <span className="gradient-text">semantic caching.</span>
        </>
      }
      description="Every cache hit is an LLM call you never pay for. At realistic hit rates, the savings compound fast."
    >
      {/* Before / after */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ScenarioCard
          tone="bad"
          label="Without semantic cache"
          rows={[
            { k: "User requests / day", v: requests },
            { k: "LLM calls", v: requests },
            { k: "Token charges", v: requests },
          ]}
          footer="High cost · high latency"
        />
        <ScenarioCard
          tone="good"
          label="With semantic cache"
          rows={[
            { k: "User requests / day", v: requests },
            { k: "Cache hits", v: cacheHits },
            { k: "LLM calls", v: llmCalls },
          ]}
          footer={`${hitRate}% fewer LLM requests`}
        />
      </div>

      {/* Headline metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Metric icon={TrendingDown} value={hitRate} suffix="%" label="Fewer LLM requests" />
        <Metric icon={Zap} value={Math.round(hitRate * 0.9)} suffix="%" label="Lower p95 latency" />
        <Metric icon={DollarSign} value={savings} prefix="$" label="Est. monthly savings" />
      </div>

      {/* Interactive savings calculator */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-redis-red">
            <Server size={14} />
            Savings calculator
          </div>

          <Slider
            label="Monthly AI spend"
            value={spend}
            min={50}
            max={2000}
            step={10}
            prefix="$"
            onChange={(v) => {
              setSpend(v);
              // keep output cost a sensible share of spend
              setOutputCost(Math.min(outputCost, v));
            }}
          />
          <Slider
            label="Output token cost (of spend)"
            value={outputCost}
            min={10}
            max={spend}
            step={10}
            prefix="$"
            onChange={setOutputCost}
          />
          <Slider
            label="Cache hit rate"
            value={hitRate}
            min={0}
            max={90}
            step={5}
            suffix="%"
            onChange={setHitRate}
          />
        </div>

        {/* Formula card */}
        <div className="glass flex flex-col justify-center rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-redis-red">
            Monthly savings
          </div>
          <div className="mt-3 font-mono text-sm text-redis-muted">
            Output token cost × cache hit rate
          </div>
          <div className="mt-2 font-mono text-sm text-white/80">
            ${outputCost} × {hitRate}% =
          </div>
          <div className="mt-3 text-5xl font-semibold gradient-text">
            <AnimatedCounter to={savings} prefix="$" /> <span className="text-2xl text-redis-muted">/mo</span>
          </div>
          <div className="mt-4 rounded-xl border border-redis-line bg-black/40 p-4 text-sm text-redis-muted">
            Semantic caching is one of the most effective techniques for reducing LLM
            costs in production systems — the answer is already paid for once.
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function ScenarioCard({
  tone,
  label,
  rows,
  footer,
}: {
  tone: "good" | "bad";
  label: string;
  rows: { k: string; v: number }[];
  footer: string;
}) {
  const good = tone === "good";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass rounded-2xl p-6 ${good ? "border-emerald-500/20" : "border-amber-500/20"}`}
    >
      <div
        className={`text-xs uppercase tracking-widest ${
          good ? "text-emerald-400" : "text-amber-400"
        }`}
      >
        {label}
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div
            key={r.k}
            className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2"
          >
            <span className="text-sm text-redis-muted">{r.k}</span>
            <span className="font-mono text-lg font-semibold">
              <AnimatedCounter to={r.v} />
            </span>
          </div>
        ))}
      </div>
      <div
        className={`mt-4 text-center text-sm font-medium ${
          good ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        {footer}
      </div>
    </motion.div>
  );
}

function Metric({
  icon: Icon,
  value,
  prefix = "",
  suffix = "",
  label,
}: {
  icon: typeof Zap;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 text-center">
      <Icon size={18} className="mx-auto text-redis-red" />
      <div className="mt-2 text-3xl font-semibold">
        <AnimatedCounter to={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-redis-muted">{label}</div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  prefix = "",
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-redis-muted">{label}</span>
        <span className="font-mono text-white">
          {prefix}
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-redis-red"
      />
    </div>
  );
}

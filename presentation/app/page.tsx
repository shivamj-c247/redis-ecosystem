import { Hero } from "@/components/sections/Hero";
import { WhyRedis } from "@/components/sections/WhyRedis";
import { Architecture } from "@/components/sections/Architecture";
import { DataStructures } from "@/components/sections/DataStructures";
import { CliSimulator } from "@/components/sections/CliSimulator";
import { ScalingPatterns } from "@/components/sections/ScalingPatterns";
import { Streams } from "@/components/sections/Streams";
import { RedisForAI } from "@/components/sections/RedisForAI";
import { SemanticCacheDemo } from "@/components/sections/SemanticCacheDemo";
import { Leaderboard } from "@/components/sections/Leaderboard";
import { Takeaways } from "@/components/sections/Takeaways";

export default function Page() {
  return (
    <main>
      <Hero />
      <WhyRedis />
      <Architecture />
      <DataStructures />
      <CliSimulator />
      <ScalingPatterns />
      <Streams />
      <RedisForAI />
      <SemanticCacheDemo />
      <Leaderboard />
      <Takeaways />
    </main>
  );
}

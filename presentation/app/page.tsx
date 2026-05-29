import { Hero } from "@/components/sections/Hero";
import { WhyRedis } from "@/components/sections/WhyRedis";
import { Architecture } from "@/components/sections/Architecture";
import { DataStructures } from "@/components/sections/DataStructures";
import { CliSimulator } from "@/components/sections/CliSimulator";
import { ScalingPatterns } from "@/components/sections/ScalingPatterns";
import { TraditionalDbVsRedis } from "@/components/sections/TraditionalDbVsRedis";
import { RedisAlternatives } from "@/components/sections/RedisAlternatives";
import { Streams } from "@/components/sections/Streams";
import { RedisForAI } from "@/components/sections/RedisForAI";
import { SemanticCacheDemo } from "@/components/sections/SemanticCacheDemo";
import { TraditionalVsSemantic } from "@/components/sections/TraditionalVsSemantic";
import { AICostOptimization } from "@/components/sections/AICostOptimization";
import { LangCache } from "@/components/sections/LangCache";
import { ModernAIArchitecture } from "@/components/sections/ModernAIArchitecture";
import { RedisCloudPricing } from "@/components/sections/RedisCloudPricing";
import { SelfHostedVsCloud } from "@/components/sections/SelfHostedVsCloud";
import { RedisOnAWS } from "@/components/sections/RedisOnAWS";
import { Leaderboard } from "@/components/sections/Leaderboard";
import { Faq } from "@/components/sections/Faq";
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
      <TraditionalDbVsRedis />
      <RedisAlternatives />
      <Streams />
      <RedisForAI />
      <SemanticCacheDemo />
      <TraditionalVsSemantic />
      <AICostOptimization />
      <LangCache />
      <ModernAIArchitecture />
      <RedisCloudPricing />
      <SelfHostedVsCloud />
      <RedisOnAWS />
      <Leaderboard />
      <Faq />
      <Takeaways />
    </main>
  );
}

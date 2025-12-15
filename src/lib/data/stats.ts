import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { StatsCache } from "@/types";

const STATS_PATH = join(homedir(), ".claude", "stats-cache.json");

// API Pricing (per million tokens)
const PRICING = {
  sonnet: {
    input: 3,        // $3/MTok
    output: 15,      // $15/MTok
    cacheRead: 0.30, // 10% of input
    cacheWrite: 3.75 // 125% of input
  },
  opus: {
    input: 15,       // $15/MTok
    output: 75,      // $75/MTok
    cacheRead: 1.50, // 10% of input
    cacheWrite: 18.75 // 125% of input
  }
} as const;

type ModelPricing = { input: number; output: number; cacheRead: number; cacheWrite: number };

function getModelPricing(modelName: string): ModelPricing {
  const lowerName = modelName.toLowerCase();
  if (lowerName.includes('opus')) {
    return PRICING.opus;
  }
  return PRICING.sonnet; // Default to sonnet pricing
}

function calculateModelCost(usage: {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadInputTokens?: number;
  cacheCreationInputTokens?: number;
}, modelName: string): number {
  const pricing = getModelPricing(modelName);
  const toMTok = (tokens: number) => tokens / 1_000_000;

  const inputCost = toMTok(usage.inputTokens || 0) * pricing.input;
  const outputCost = toMTok(usage.outputTokens || 0) * pricing.output;
  const cacheReadCost = toMTok(usage.cacheReadInputTokens || 0) * pricing.cacheRead;
  const cacheWriteCost = toMTok(usage.cacheCreationInputTokens || 0) * pricing.cacheWrite;

  return inputCost + outputCost + cacheReadCost + cacheWriteCost;
}

export function getStatsCache(): StatsCache | null {
  if (!existsSync(STATS_PATH)) {
    return null;
  }

  try {
    const content = readFileSync(STATS_PATH, "utf-8");
    return JSON.parse(content) as StatsCache;
  } catch (error) {
    console.error("Failed to read stats cache:", error);
    return null;
  }
}

export function getDailyActivity(days: number = 30) {
  const stats = getStatsCache();
  if (!stats?.dailyActivity) return [];

  return stats.dailyActivity.slice(-days);
}

export function getModelUsage() {
  const stats = getStatsCache();
  if (!stats?.modelUsage) return {};

  // Add calculated costs to each model
  const usageWithCosts: Record<string, typeof stats.modelUsage[string] & { calculatedCost: number }> = {};
  for (const [model, usage] of Object.entries(stats.modelUsage)) {
    usageWithCosts[model] = {
      ...usage,
      calculatedCost: calculateModelCost(usage, model)
    };
  }

  return usageWithCosts;
}

export function getTotalStats() {
  const stats = getStatsCache();
  if (!stats) {
    return {
      totalSessions: 0,
      totalMessages: 0,
      firstSessionDate: null,
      totalCost: 0,
    };
  }

  // Calculate total cost from token counts using actual API pricing
  let totalCost = 0;
  if (stats.modelUsage) {
    for (const [model, usage] of Object.entries(stats.modelUsage)) {
      totalCost += calculateModelCost(usage, model);
    }
  }

  return {
    totalSessions: stats.totalSessions || 0,
    totalMessages: stats.totalMessages || 0,
    firstSessionDate: stats.firstSessionDate || null,
    totalCost,
  };
}

export function getHourlyDistribution() {
  const stats = getStatsCache();
  if (!stats?.hourCounts) return [];

  return Object.entries(stats.hourCounts)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
    }))
    .sort((a, b) => a.hour - b.hour);
}

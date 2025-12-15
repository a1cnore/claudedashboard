"use client";

import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface CostDistributionChartProps {
  data: Record<string, {
    inputTokens?: number;
    outputTokens?: number;
    cacheReadInputTokens?: number;
    cacheCreationInputTokens?: number;
    calculatedCost?: number;
  }>;
}

const chartConfig = {
  cost: {
    label: "Cost",
  },
} satisfies ChartConfig;

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Pricing constants
const PRICING = {
  sonnet: { input: 3, output: 15, cacheRead: 0.30, cacheWrite: 3.75 },
  opus: { input: 15, output: 75, cacheRead: 1.50, cacheWrite: 18.75 },
};

function isOpus(model: string): boolean {
  return model.toLowerCase().includes('opus');
}

export function CostDistributionChart({ data }: CostDistributionChartProps) {
  // Aggregate costs by category across all models
  let inputCost = 0;
  let outputCost = 0;
  let cacheReadCost = 0;
  let cacheWriteCost = 0;

  for (const [model, usage] of Object.entries(data)) {
    const pricing = isOpus(model) ? PRICING.opus : PRICING.sonnet;
    const toMTok = (t: number) => t / 1_000_000;

    inputCost += toMTok(usage.inputTokens || 0) * pricing.input;
    outputCost += toMTok(usage.outputTokens || 0) * pricing.output;
    cacheReadCost += toMTok(usage.cacheReadInputTokens || 0) * pricing.cacheRead;
    cacheWriteCost += toMTok(usage.cacheCreationInputTokens || 0) * pricing.cacheWrite;
  }

  const chartData = [
    { name: "Cache Write", value: cacheWriteCost, color: COLORS[0] },
    { name: "Cache Read", value: cacheReadCost, color: COLORS[1] },
    { name: "Output", value: outputCost, color: COLORS[2] },
    { name: "Input", value: inputCost, color: COLORS[3] },
  ].filter(d => d.value > 0);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  if (chartData.length === 0 || total === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
        No cost data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const percentage = ((d.value / total) * 100).toFixed(1);
    return (
      <div className="rounded-lg border bg-background px-3 py-2 shadow-sm text-sm">
        <p className="font-medium">{d.name}</p>
        <p className="text-muted-foreground">${d.value.toFixed(2)} ({percentage}%)</p>
      </div>
    );
  };

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value: string, entry: { payload?: { value?: number } }) => {
              const item = entry.payload;
              return (
                <span className="text-xs">
                  {value}: ${(item?.value || 0).toFixed(0)}
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ModelUsage } from "@/types";

interface ModelUsageChartProps {
  data: Record<string, ModelUsage & { calculatedCost?: number }>;
}

const chartConfig = {
  cost: {
    label: "Cost ($)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function formatModelName(model: string): string {
  // Extract key parts: e.g., "claude-opus-4-5-20251101" -> "opus-4.5"
  const match = model.match(/(sonnet|opus)-(\d+)-?(\d+)?/i);
  if (match) {
    const [, variant, major, minor] = match;
    return minor ? `${variant}-${major}.${minor}` : `${variant}-${major}`;
  }
  return model.split("-").slice(1, 3).join("-") || model;
}

export function ModelUsageChart({ data }: ModelUsageChartProps) {
  const chartData = Object.entries(data)
    .map(([model, usage]) => ({
      model: formatModelName(model),
      fullModel: model,
      cost: usage.calculatedCost || 0,
      inputTokens: usage.inputTokens || 0,
      outputTokens: usage.outputTokens || 0,
      cacheRead: usage.cacheReadInputTokens || 0,
      cacheWrite: usage.cacheCreationInputTokens || 0,
    }))
    .sort((a, b) => b.cost - a.cost);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No model usage data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const fmt = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(0)}K` : n.toString();
    return (
      <div className="rounded-lg border bg-background p-3 shadow-sm text-sm">
        <p className="font-medium mb-2">{d.fullModel}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">Cost:</span>
          <span className="font-medium">${d.cost.toFixed(2)}</span>
          <span className="text-muted-foreground">Input:</span>
          <span>{fmt(d.inputTokens)}</span>
          <span className="text-muted-foreground">Output:</span>
          <span>{fmt(d.outputTokens)}</span>
          <span className="text-muted-foreground">Cache Read:</span>
          <span>{fmt(d.cacheRead)}</span>
          <span className="text-muted-foreground">Cache Write:</span>
          <span>{fmt(d.cacheWrite)}</span>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <YAxis
          type="category"
          dataKey="model"
          tickLine={false}
          axisLine={false}
          width={80}
          className="text-xs"
        />
        <ChartTooltip content={<CustomTooltip />} />
        <Bar
          dataKey="cost"
          fill="var(--chart-1)"
          radius={[0, 4, 4, 0]}
          name="Cost ($)"
        >
          <LabelList
            dataKey="cost"
            position="right"
            className="text-xs fill-foreground"
            formatter={(v: number) => `$${v.toFixed(2)}`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface CostBreakdownChartProps {
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
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function formatModelName(model: string): string {
  const match = model.match(/(sonnet|opus)-(\d+)-?(\d+)?/i);
  if (match) {
    const [, variant, major, minor] = match;
    return minor ? `${variant}-${major}.${minor}` : `${variant}-${major}`;
  }
  return model.split("-").slice(1, 3).join("-") || model;
}

export function CostBreakdownChart({ data }: CostBreakdownChartProps) {
  const chartData = Object.entries(data)
    .map(([model, usage]) => ({
      model: formatModelName(model),
      fullModel: model,
      cost: usage.calculatedCost || 0,
    }))
    .filter(d => d.cost > 0)
    .sort((a, b) => b.cost - a.cost);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
        No cost data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[0] }> }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background px-3 py-2 shadow-sm text-sm">
        <p className="font-medium">{d.fullModel}</p>
        <p className="text-muted-foreground">${d.cost.toFixed(2)}</p>
      </div>
    );
  };

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 50 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
          fontSize={12}
        />
        <YAxis
          type="category"
          dataKey="model"
          tickLine={false}
          axisLine={false}
          width={70}
          fontSize={12}
        />
        <ChartTooltip content={<CustomTooltip />} />
        <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList
            dataKey="cost"
            position="right"
            className="text-xs fill-foreground"
            formatter={(v: number) => `$${v.toFixed(0)}`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

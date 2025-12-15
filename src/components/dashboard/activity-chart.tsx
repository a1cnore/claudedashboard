"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { DailyActivity } from "@/types";

interface ActivityChartProps {
  data: DailyActivity[];
}

const chartConfig = {
  messageCount: {
    label: "Messages",
    color: "var(--chart-1)",
  },
  sessionCount: {
    label: "Sessions",
    color: "var(--chart-2)",
  },
  toolCallCount: {
    label: "Tool Calls",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ActivityChart({ data }: ActivityChartProps) {
  // Format data for chart
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No activity data available
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-1)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-1)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-2)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-2)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="messageCount"
          stroke="var(--chart-1)"
          fill="url(#fillMessages)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="sessionCount"
          stroke="var(--chart-2)"
          fill="url(#fillSessions)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

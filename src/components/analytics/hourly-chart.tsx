"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface HourlyChartProps {
  data: { hour: number; count: number }[];
}

const chartConfig = {
  count: {
    label: "Activity",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function HourlyChart({ data }: HourlyChartProps) {
  // Ensure we have all 24 hours
  const fullData = Array.from({ length: 24 }, (_, i) => {
    const existing = data.find((d) => d.hour === i);
    return {
      hour: i.toString().padStart(2, "0") + ":00",
      count: existing?.count || 0,
    };
  });

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No hourly data available
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={fullData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="hour"
          tickLine={false}
          axisLine={false}
          className="text-xs"
          interval={3}
        />
        <YAxis tickLine={false} axisLine={false} className="text-xs" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

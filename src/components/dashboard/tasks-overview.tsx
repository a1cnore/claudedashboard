"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TasksOverviewProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

const chartConfig = {
  pending: {
    label: "Pending",
    color: "var(--chart-4)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--chart-1)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function TasksOverview({ stats }: TasksOverviewProps) {
  const data = [
    { name: "Pending", value: stats.pending, fill: "var(--chart-4)" },
    { name: "In Progress", value: stats.inProgress, fill: "var(--chart-1)" },
    { name: "Completed", value: stats.completed, fill: "var(--chart-2)" },
  ].filter((item) => item.value > 0);

  if (stats.total === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-muted-foreground">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: "var(--chart-4)" }}
            />
            <span className="text-muted-foreground">Pending</span>
          </div>
          <span className="font-medium">{stats.pending}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: "var(--chart-1)" }}
            />
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <span className="font-medium">{stats.inProgress}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: "var(--chart-2)" }}
            />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <span className="font-medium">{stats.completed}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  MessageSquare,
  MessagesSquare,
  DollarSign,
  FolderOpen,
  Rocket,
  CheckSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalConversations: number;
    totalMessages: number;
    totalCost: number;
    avgResponseTime: number;
    totalProjects: number;
    totalStarts: number;
    todoStats: {
      total: number;
      pending: number;
      inProgress: number;
      completed: number;
    };
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Conversations",
      value: stats.totalConversations.toLocaleString(),
      icon: MessageSquare,
      description: `${stats.totalMessages.toLocaleString()} messages`,
    },
    {
      title: "Total Projects",
      value: stats.totalProjects.toLocaleString(),
      icon: FolderOpen,
      description: "Tracked projects",
    },
    {
      title: "API Cost",
      value: `$${stats.totalCost.toFixed(2)}`,
      icon: DollarSign,
      description: "Total spend",
    },
    {
      title: "Starts",
      value: stats.totalStarts.toLocaleString(),
      icon: Rocket,
      description: "Application launches",
    },
    {
      title: "Active Tasks",
      value: stats.todoStats.inProgress.toLocaleString(),
      icon: CheckSquare,
      description: `${stats.todoStats.pending} pending`,
    },
    {
      title: "Avg Response",
      value: `${(stats.avgResponseTime / 1000).toFixed(1)}s`,
      icon: MessagesSquare,
      description: "Response time",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

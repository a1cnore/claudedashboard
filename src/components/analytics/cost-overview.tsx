"use client";

import { DollarSign, MessageSquare, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface CostOverviewProps {
  totalStats: {
    totalSessions: number;
    totalMessages: number;
    firstSessionDate: string | null;
    totalCost: number;
  };
  dbStats: {
    total_sessions: number;
    total_messages: number;
    total_cost: number;
    avg_response_time: number;
  };
}

export function CostOverview({ totalStats, dbStats }: CostOverviewProps) {
  const cards = [
    {
      title: "Total Cost",
      value: `$${(totalStats.totalCost || dbStats.total_cost).toFixed(2)}`,
      icon: DollarSign,
      description: "All-time API spend",
    },
    {
      title: "Total Messages",
      value: (totalStats.totalMessages || dbStats.total_messages).toLocaleString(),
      icon: MessageSquare,
      description: "User & assistant messages",
    },
    {
      title: "First Session",
      value: totalStats.firstSessionDate
        ? format(new Date(totalStats.firstSessionDate), "MMM d, yyyy")
        : "N/A",
      icon: Calendar,
      description: "When you started using Claude Code",
    },
    {
      title: "Avg Response Time",
      value: `${(dbStats.avg_response_time / 1000).toFixed(1)}s`,
      icon: Clock,
      description: "Average API response time",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

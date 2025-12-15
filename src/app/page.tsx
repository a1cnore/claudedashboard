import { Suspense } from "react";
import { getSessionStats } from "@/lib/db/sqlite";
import { getTotalStats, getDailyActivity, getModelUsage } from "@/lib/data/stats";
import { getAllProjects, getNumStarts } from "@/lib/data/projects";
import { getTodoStats } from "@/lib/data/todos";
import { getRecentSessions } from "@/lib/db/sqlite";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentSessions } from "@/components/dashboard/recent-sessions";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { CostBreakdownChart } from "@/components/dashboard/cost-breakdown-chart";
import { CostDistributionChart } from "@/components/dashboard/cost-distribution-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Force dynamic rendering - don't prerender at build time
export const dynamic = "force-dynamic";

async function DashboardContent() {
  // Fetch all data in parallel
  const [dbStats, totalStats, dailyActivity, projects, todoStats, recentSessions, numStarts, modelUsage] = await Promise.all([
    getSessionStats(),
    getTotalStats(),
    getDailyActivity(30),
    getAllProjects(),
    getTodoStats(),
    getRecentSessions(10),
    getNumStarts(),
    getModelUsage(),
  ]);

  const stats = {
    totalConversations: dbStats.total_sessions,
    totalMessages: dbStats.total_messages,
    totalCost: totalStats.totalCost || dbStats.total_cost,
    avgResponseTime: dbStats.avg_response_time,
    totalProjects: projects.length,
    totalStarts: numStarts,
    todoStats,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your Claude Code usage and performance
        </p>
      </header>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Cost Analysis Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Cost by Model</CardTitle>
            <CardDescription>API spend breakdown by Claude model</CardDescription>
          </CardHeader>
          <CardContent>
            <CostBreakdownChart data={modelUsage} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Cost Distribution</CardTitle>
            <CardDescription>Spend by token type</CardDescription>
          </CardHeader>
          <CardContent>
            <CostDistributionChart data={modelUsage} />
          </CardContent>
        </Card>
      </div>

      {/* Activity Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Activity Over Time</CardTitle>
            <CardDescription>Messages and sessions over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={dailyActivity} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Tasks Overview</CardTitle>
            <CardDescription>Todo status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <TasksOverview stats={todoStats} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Recent Sessions</CardTitle>
          <CardDescription>Latest Claude Code conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSessions sessions={recentSessions} />
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

import { getDailyActivity, getModelUsage, getTotalStats, getHourlyDistribution } from "@/lib/data/stats";
import { getSessionStats } from "@/lib/db/sqlite";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { ModelUsageChart } from "@/components/analytics/model-usage-chart";
import { HourlyChart } from "@/components/analytics/hourly-chart";
import { CostOverview } from "@/components/analytics/cost-overview";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [dailyActivity, modelUsage, totalStats, hourlyDistribution, dbStats] = await Promise.all([
    getDailyActivity(90),
    getModelUsage(),
    getTotalStats(),
    getHourlyDistribution(),
    getSessionStats(),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Deep dive into your Claude Code usage patterns
        </p>
      </header>

      {/* Cost Overview */}
      <CostOverview totalStats={totalStats} dbStats={dbStats} />

      {/* Activity Over Time (90 days) */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Activity Over Time</CardTitle>
          <CardDescription>Last 90 days of usage</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityChart data={dailyActivity} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Model Usage */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Model Usage</CardTitle>
            <CardDescription>Token consumption by model</CardDescription>
          </CardHeader>
          <CardContent>
            <ModelUsageChart data={modelUsage} />
          </CardContent>
        </Card>

        {/* Hourly Distribution */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Usage by Hour</CardTitle>
            <CardDescription>Activity distribution throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <HourlyChart data={hourlyDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

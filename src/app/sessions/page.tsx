import { getAllSessionEnvs, getSessionCount, getRecentShellSnapshots } from "@/lib/data/sessions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Radio, Terminal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const [sessionEnvs, sessionCount, shellSnapshots] = await Promise.all([
    getAllSessionEnvs(),
    getSessionCount(),
    getRecentShellSnapshots(10),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <p className="text-sm text-muted-foreground">
          {sessionCount} active session environments tracked
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Session Environments
            </CardTitle>
            <Radio className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{sessionCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Saved environment snapshots
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Shell Snapshots
            </CardTitle>
            <Terminal className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{shellSnapshots.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Recent shell state captures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Session Environments Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Session Environments</CardTitle>
          <CardDescription>Environment variables captured per session</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Environment Variables</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionEnvs.slice(0, 20).map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-mono text-xs">
                    {session.id.slice(0, 12)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {Object.keys(session.envVars).length} vars
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {sessionEnvs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No session environments found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Shell Snapshots */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Shell Snapshots</CardTitle>
          <CardDescription>Shell environment captures</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Snapshot</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shellSnapshots.map((snapshot) => (
                <TableRow key={snapshot.id}>
                  <TableCell className="font-mono text-xs">
                    {snapshot.filename}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {Math.round(snapshot.content.length / 1024)}KB
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatDistanceToNow(snapshot.timestamp, { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {shellSnapshots.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No shell snapshots found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

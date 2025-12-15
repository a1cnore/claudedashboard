import { getAllDebugLogs, getDebugLogContent } from "@/lib/data/debug";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bug, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const logs = await getAllDebugLogs();

  // Get content of the most recent log
  const recentLog = logs[0];
  const recentLogContent = recentLog ? await getDebugLogContent(recentLog.id) : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Debug</h1>
        <p className="text-sm text-muted-foreground">
          {logs.length} debug log files available
        </p>
      </header>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Debug Logs
            </CardTitle>
            <Bug className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{logs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Log files in ~/.claude/debug/
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Size
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {(logs.reduce((sum, l) => sum + l.size, 0) / 1024 / 1024).toFixed(2)} MB
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined log size
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Log Files List */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Debug Log Files</CardTitle>
            <CardDescription>
              Click to view log content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Log ID</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Modified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.slice(0, 30).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {log.id.slice(0, 12)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {(log.size / 1024).toFixed(1)} KB
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {formatDistanceToNow(log.modifiedAt, { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            {logs.length > 30 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing 30 of {logs.length} logs
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Log Content */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Most Recent Log</CardTitle>
            <CardDescription>
              {recentLog
                ? `${recentLog.filename} (${(recentLog.size / 1024).toFixed(1)} KB)`
                : "No logs available"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {recentLogContent ? (
                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                  {recentLogContent.slice(0, 50000)}
                  {recentLogContent.length > 50000 && "\n\n... (truncated)"}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No log content available
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

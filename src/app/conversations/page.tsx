import Link from "next/link";
import { getAllSessions } from "@/lib/db/sqlite";
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
import { MessageSquare, Clock, DollarSign, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const sessions = await getAllSessions();

  const totalMessages = sessions.reduce((sum, s) => sum + s.message_count, 0);
  const totalCost = sessions.reduce((sum, s) => sum + s.total_cost, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Conversations</h1>
        <p className="text-sm text-muted-foreground">
          {sessions.length} conversations with {totalMessages.toLocaleString()} total messages
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Conversations
            </CardTitle>
            <MessageSquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{sessions.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Messages
            </CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalMessages.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Conversations</CardTitle>
          <CardDescription>Click a conversation to view messages</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.slice(0, 100).map((session) => {
                const projectName = session.project_path
                  ? session.project_path.split("/").pop() || "Unknown"
                  : "Unknown";
                const duration = session.end_time - session.start_time;
                const durationMinutes = Math.round(duration / 60000);

                return (
                  <TableRow key={session.session_id}>
                    <TableCell>
                      <Link
                        href={`/conversations/${session.session_id}`}
                        className="flex items-center gap-2 font-medium hover:underline"
                      >
                        <FolderOpen className="size-4 text-muted-foreground" />
                        {projectName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{session.message_count}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {durationMinutes > 60
                        ? `${Math.round(durationMinutes / 60)}h ${durationMinutes % 60}m`
                        : `${durationMinutes}m`}
                    </TableCell>
                    <TableCell>
                      {session.total_cost > 0 ? (
                        <span className="text-muted-foreground">
                          ${session.total_cost.toFixed(4)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDistanceToNow(new Date(session.end_time), {
                        addSuffix: true,
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {sessions.length > 100 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Showing 100 of {sessions.length} conversations
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

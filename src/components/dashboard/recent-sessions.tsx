"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FolderOpen, Clock, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/types";

interface RecentSessionsProps {
  sessions: Session[];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        No sessions found
      </div>
    );
  }

  return (
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
        {sessions.map((session) => {
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
                  className="flex items-center gap-2 hover:underline"
                >
                  <FolderOpen className="size-4 text-muted-foreground" />
                  <span className="font-medium">{projectName}</span>
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{session.message_count}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3" />
                  <span>
                    {durationMinutes > 60
                      ? `${Math.round(durationMinutes / 60)}h ${durationMinutes % 60}m`
                      : `${durationMinutes}m`}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {session.total_cost > 0 ? (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="size-3" />
                    <span>{session.total_cost.toFixed(4)}</span>
                  </div>
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
  );
}

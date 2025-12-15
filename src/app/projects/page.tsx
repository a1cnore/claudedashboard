import Link from "next/link";
import { getAllProjects, getProjectStats } from "@/lib/data/projects";
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
import { FolderOpen, DollarSign, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, stats] = await Promise.all([
    getAllProjects(),
    getProjectStats(),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-sm text-muted-foreground">
          {stats.totalProjects} projects tracked with ${stats.totalCost.toFixed(2)} total cost
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
            <FolderOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.totalProjects}</div>
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
            <div className="text-2xl font-semibold">${stats.totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Cost / Project
            </CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${stats.avgCostPerProject.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Projects</CardTitle>
          <CardDescription>Sorted by cost (highest first)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>API Duration</TableHead>
                <TableHead className="text-right">Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.slice(0, 50).map((project) => (
                <TableRow key={project.path}>
                  <TableCell>
                    <Link
                      href={`/projects/${encodeURIComponent(project.path)}`}
                      className="flex items-center gap-2 font-medium hover:underline"
                    >
                      <FolderOpen className="size-4 text-muted-foreground" />
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs max-w-xs truncate">
                    {project.path}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      ${(project.config.lastCost || 0).toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {project.config.lastAPIDuration
                      ? `${Math.round(project.config.lastAPIDuration / 1000)}s`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {project.lastUsed
                      ? formatDistanceToNow(new Date(project.lastUsed), { addSuffix: true })
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {projects.length > 50 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Showing 50 of {projects.length} projects
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

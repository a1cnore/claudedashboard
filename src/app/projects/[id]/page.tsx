import { getProjectByPath } from "@/lib/data/projects";
import { getMessagesByProject } from "@/lib/db/sqlite";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, DollarSign, Clock, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectPath = decodeURIComponent(id);
  const project = await getProjectByPath(projectPath);
  const messages = await getMessagesByProject(projectPath);

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Card className="shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Project not found: {projectPath}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FolderOpen className="size-6" />
          {project.name}
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          {project.path}
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cost
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              ${(project.config.lastCost || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              API Duration
            </CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {project.config.lastAPIDuration
                ? `${Math.round(project.config.lastAPIDuration / 1000)}s`
                : "-"}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages
            </CardTitle>
            <MessageSquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{messages.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Web Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {project.config.lastTotalWebSearchRequests || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Config Details */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Configuration</CardTitle>
          <CardDescription>Project-specific settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-2">MCP Servers</h3>
              {Object.keys(project.config.mcpServers || {}).length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {Object.keys(project.config.mcpServers || {}).map((server) => (
                    <Badge key={server} variant="secondary">
                      {server}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No MCP servers configured</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Allowed Tools</h3>
              {(project.config.allowedTools || []).length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {project.config.allowedTools.slice(0, 5).map((tool) => (
                    <Badge key={tool} variant="outline">
                      {tool}
                    </Badge>
                  ))}
                  {project.config.allowedTools.length > 5 && (
                    <Badge variant="secondary">
                      +{project.config.allowedTools.length - 5}
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">All tools allowed</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Trust Dialog</h3>
              <Badge variant={project.config.hasTrustDialogAccepted ? "default" : "secondary"}>
                {project.config.hasTrustDialogAccepted ? "Accepted" : "Not accepted"}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Ignore Patterns</h3>
              {(project.config.ignorePatterns || []).length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {project.config.ignorePatterns.map((pattern) => (
                    <Badge key={pattern} variant="outline" className="font-mono text-xs">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No ignore patterns</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

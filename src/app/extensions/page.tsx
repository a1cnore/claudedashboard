import { getAllCommands, getAllAgents, getAllSkills } from "@/lib/data/commands";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Bot, Sparkles, Puzzle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExtensionsPage() {
  const [commands, agents, skills] = await Promise.all([
    getAllCommands(),
    getAllAgents(),
    getAllSkills(),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Extensions</h1>
        <p className="text-sm text-muted-foreground">
          {commands.length} commands · {agents.length} agents · {skills.length} skills
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custom Commands
            </CardTitle>
            <Terminal className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{commands.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Slash commands (/{"{command}"})
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custom Agents
            </CardTitle>
            <Bot className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{agents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Specialized task agents
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skills
            </CardTitle>
            <Sparkles className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{skills.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Skill plugins installed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="commands" className="space-y-4">
        <TabsList>
          <TabsTrigger value="commands">
            <Terminal className="size-4 mr-2" />
            Commands ({commands.length})
          </TabsTrigger>
          <TabsTrigger value="agents">
            <Bot className="size-4 mr-2" />
            Agents ({agents.length})
          </TabsTrigger>
          <TabsTrigger value="skills">
            <Sparkles className="size-4 mr-2" />
            Skills ({skills.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commands">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Custom Commands</CardTitle>
              <CardDescription>
                Slash commands defined in ~/.claude/commands/
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Command</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Allowed Tools</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commands.map((cmd) => (
                    <TableRow key={cmd.id}>
                      <TableCell className="font-mono">/{cmd.id}</TableCell>
                      <TableCell className="text-muted-foreground max-w-md truncate">
                        {cmd.description || "(No description)"}
                      </TableCell>
                      <TableCell>
                        {cmd.allowedTools && cmd.allowedTools.length > 0 ? (
                          <div className="flex gap-1 flex-wrap">
                            {cmd.allowedTools.slice(0, 3).map((tool) => (
                              <Badge key={tool} variant="outline" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                            {cmd.allowedTools.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{cmd.allowedTools.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">All</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {commands.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No custom commands found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Custom Agents</CardTitle>
              <CardDescription>
                Agent definitions in ~/.claude/agents/
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Tools</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name || agent.id}</TableCell>
                      <TableCell className="text-muted-foreground max-w-md truncate">
                        {agent.description || "(No description)"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{agent.model}</Badge>
                      </TableCell>
                      <TableCell>
                        {agent.tools.length > 0 ? (
                          <Badge variant="secondary">{agent.tools.length} tools</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {agents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No custom agents found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Installed Skills</CardTitle>
              <CardDescription>
                Skill plugins in ~/.claude/skills/
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill</TableHead>
                    <TableHead>Path</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium capitalize">{skill.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {skill.path}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No skills installed
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

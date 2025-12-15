import { getSettings, getPermissions } from "@/lib/data/settings";
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
import { Settings, Shield, Check, X } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, permissions] = await Promise.all([
    getSettings(),
    getPermissions(),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Global Claude Code configuration
        </p>
      </header>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="size-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="size-4 mr-2" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">General Settings</CardTitle>
              <CardDescription>
                Configuration from ~/.claude/settings.json
              </CardDescription>
            </CardHeader>
            <CardContent>
              {settings ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Setting</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings.cleanupPeriodDays !== undefined && (
                      <TableRow>
                        <TableCell className="font-medium">Cleanup Period</TableCell>
                        <TableCell>{settings.cleanupPeriodDays} days</TableCell>
                      </TableRow>
                    )}
                    {settings.thinkingMode !== undefined && (
                      <TableRow>
                        <TableCell className="font-medium">Thinking Mode</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{settings.thinkingMode}</Badge>
                        </TableCell>
                      </TableRow>
                    )}
                    {settings.statusLine !== undefined && (
                      <TableRow>
                        <TableCell className="font-medium">Status Line</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {typeof settings.statusLine === "string"
                              ? settings.statusLine
                              : "configured"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )}
                    {settings.env && Object.keys(settings.env).length > 0 && (
                      <TableRow>
                        <TableCell className="font-medium">Environment Variables</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {Object.keys(settings.env).length} vars
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No settings file found
                </p>
              )}

              {settings && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Raw Settings</h3>
                  <ScrollArea className="h-[200px]">
                    <pre className="text-xs bg-muted rounded-lg p-4 overflow-x-auto">
                      {JSON.stringify(settings, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Check className="size-4 text-green-500" />
                  Allowed
                </CardTitle>
                <CardDescription>
                  Tools and actions permitted to run
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {permissions.allow.length > 0 ? (
                    <div className="space-y-2">
                      {permissions.allow.map((perm, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="size-4 text-green-500 shrink-0" />
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {perm}
                          </code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No explicit allow rules
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <X className="size-4 text-red-500" />
                  Denied
                </CardTitle>
                <CardDescription>
                  Tools and actions blocked from running
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {permissions.deny.length > 0 ? (
                    <div className="space-y-2">
                      {permissions.deny.map((perm, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <X className="size-4 text-red-500 shrink-0" />
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {perm}
                          </code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No explicit deny rules
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

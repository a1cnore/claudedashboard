import { getSessionMessages } from "@/lib/db/sqlite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot, Wrench } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface ConversationPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { id } = await params;
  const messages = await getSessionMessages(id);

  if (messages.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card className="shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No messages found for this conversation</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectPath = messages[0]?.cwd || "Unknown";
  const projectName = projectPath.split("/").pop() || "Unknown";
  const totalCost = messages.reduce((sum, m) => sum + (m.cost_usd || 0), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{projectName}</h1>
        <p className="text-sm text-muted-foreground">
          {messages.length} messages · ${totalCost.toFixed(4)} total cost
        </p>
      </header>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Conversation Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.uuid || index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {message.role === "user" ? "You" : "Claude"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.timestamp), "HH:mm:ss")}
                      </span>
                      {message.model && (
                        <Badge variant="outline" className="text-xs">
                          {message.model.split("/").pop()}
                        </Badge>
                      )}
                      {message.cost_usd && message.cost_usd > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          ${message.cost_usd.toFixed(4)}
                        </Badge>
                      )}
                    </div>

                    <div className="text-sm text-foreground whitespace-pre-wrap bg-muted/50 rounded-lg p-3">
                      {message.content?.slice(0, 2000) || "(No content)"}
                      {message.content && message.content.length > 2000 && (
                        <span className="text-muted-foreground">... (truncated)</span>
                      )}
                    </div>

                    {message.tool_use_result && (
                      <div className="flex items-start gap-2 mt-2">
                        <Wrench className="size-4 text-muted-foreground mt-0.5" />
                        <pre className="text-xs bg-muted rounded p-2 overflow-x-auto max-w-full">
                          {message.tool_use_result.slice(0, 500)}
                          {message.tool_use_result.length > 500 && "..."}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

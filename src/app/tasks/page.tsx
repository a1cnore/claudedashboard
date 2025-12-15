import { getAllTodoItems, getTodoStats } from "@/lib/data/todos";
import { getAllPlans } from "@/lib/data/plans";
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
import { CheckSquare, FileText, Circle, CircleDot, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [todoItems, todoStats, plans] = await Promise.all([
    getAllTodoItems(),
    getTodoStats(),
    getAllPlans(),
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Circle className="size-4 text-muted-foreground" />;
      case "in_progress":
        return <CircleDot className="size-4 text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="size-4 text-green-500" />;
      default:
        return <Circle className="size-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "default";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          {todoStats.total} tasks across {todoStats.todoFiles} files · {plans.length} plans
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
            <CheckSquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{todoStats.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Circle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-amber-500">{todoStats.pending}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
            <CircleDot className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-500">{todoStats.inProgress}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle2 className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-500">{todoStats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">
            <CheckSquare className="size-4 mr-2" />
            Todos ({todoStats.total})
          </TabsTrigger>
          <TabsTrigger value="plans">
            <FileText className="size-4 mr-2" />
            Plans ({plans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">All Tasks</CardTitle>
              <CardDescription>Tasks from all todo files</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todoItems.slice(0, 100).map((item, index) => (
                      <TableRow key={`${item.fileId}-${index}`}>
                        <TableCell>{getStatusIcon(item.status)}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {item.content}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(item.status) as "default" | "secondary" | "outline"}>
                            {item.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              {todoItems.length > 100 && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Showing 100 of {todoItems.length} tasks
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">All Plans</CardTitle>
              <CardDescription>Implementation plans and designs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead className="text-right">Modified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.title}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {plan.filename}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDistanceToNow(plan.modifiedAt, { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {plans.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No plans found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

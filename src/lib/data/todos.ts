import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { TodoItem, TodoFile } from "@/types";

const TODOS_DIR = join(homedir(), ".claude", "todos");

export function getAllTodos(): TodoFile[] {
  if (!existsSync(TODOS_DIR)) return [];

  try {
    const files = readdirSync(TODOS_DIR);

    return files
      .filter((f) => f.endsWith(".json"))
      .map((filename) => {
        const filepath = join(TODOS_DIR, filename);
        try {
          const content = readFileSync(filepath, "utf-8");
          const parsed = JSON.parse(content);
          const items: TodoItem[] = Array.isArray(parsed) ? parsed : [];
          const stats = statSync(filepath);

          // Extract ID from filename pattern: [uuid]-agent-[uuid].json
          const id = filename.replace(".json", "").split("-agent-")[0];

          return {
            id,
            filename,
            items,
            modifiedAt: stats.mtime,
          };
        } catch {
          return null;
        }
      })
      .filter((todo): todo is TodoFile => todo !== null && todo.items.length > 0);
  } catch (error) {
    console.error("Failed to read todos:", error);
    return [];
  }
}

export function getTodoStats() {
  const todos = getAllTodos();

  let pending = 0;
  let inProgress = 0;
  let completed = 0;

  for (const todo of todos) {
    for (const item of todo.items) {
      switch (item.status) {
        case "pending":
          pending++;
          break;
        case "in_progress":
          inProgress++;
          break;
        case "completed":
          completed++;
          break;
      }
    }
  }

  return {
    total: pending + inProgress + completed,
    pending,
    inProgress,
    completed,
    todoFiles: todos.length,
  };
}

export function getAllTodoItems(): (TodoItem & { fileId: string })[] {
  const todos = getAllTodos();
  const items: (TodoItem & { fileId: string })[] = [];

  for (const todo of todos) {
    for (const item of todo.items) {
      items.push({
        ...item,
        fileId: todo.id,
      });
    }
  }

  return items;
}

export function getRecentTodos(limit: number = 20): TodoFile[] {
  const todos = getAllTodos();
  return todos.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime()).slice(0, limit);
}

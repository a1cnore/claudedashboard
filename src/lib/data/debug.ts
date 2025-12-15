import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { DebugLog } from "@/types";

const DEBUG_DIR = join(homedir(), ".claude", "debug");

export function getAllDebugLogs(): DebugLog[] {
  if (!existsSync(DEBUG_DIR)) return [];

  try {
    const files = readdirSync(DEBUG_DIR);

    return files
      .filter((f) => f.endsWith(".txt"))
      .map((filename) => {
        const filepath = join(DEBUG_DIR, filename);
        try {
          const stats = statSync(filepath);
          return {
            id: filename.replace(".txt", ""),
            filename,
            size: stats.size,
            modifiedAt: stats.mtime,
          };
        } catch {
          return null;
        }
      })
      .filter((log): log is DebugLog => log !== null)
      .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
  } catch (error) {
    console.error("Failed to read debug logs:", error);
    return [];
  }
}

export function getDebugLogContent(id: string): string | null {
  const filepath = join(DEBUG_DIR, `${id}.txt`);

  if (!existsSync(filepath)) {
    return null;
  }

  try {
    return readFileSync(filepath, "utf-8");
  } catch (error) {
    console.error("Failed to read debug log:", error);
    return null;
  }
}

export function getRecentDebugLogs(limit: number = 10): DebugLog[] {
  const logs = getAllDebugLogs();
  return logs.slice(0, limit);
}

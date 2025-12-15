import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const SESSION_ENV_DIR = join(homedir(), ".claude", "session-env");
const SHELL_SNAPSHOTS_DIR = join(homedir(), ".claude", "shell-snapshots");

export interface SessionEnv {
  id: string;
  envVars: Record<string, string>;
}

export function getAllSessionEnvs(): SessionEnv[] {
  if (!existsSync(SESSION_ENV_DIR)) return [];

  try {
    const dirs = readdirSync(SESSION_ENV_DIR);

    return dirs
      .map((dirname) => {
        const dirPath = join(SESSION_ENV_DIR, dirname);
        try {
          const files = readdirSync(dirPath);
          const envFile = files.find((f) => f.endsWith(".env") || f.includes("env"));

          if (!envFile) {
            return { id: dirname, envVars: {} };
          }

          const content = readFileSync(join(dirPath, envFile), "utf-8");
          const envVars: Record<string, string> = {};

          for (const line of content.split("\n")) {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
              envVars[match[1]] = match[2];
            }
          }

          return { id: dirname, envVars };
        } catch {
          return { id: dirname, envVars: {} };
        }
      })
      .filter((session) => session !== null);
  } catch (error) {
    console.error("Failed to read session envs:", error);
    return [];
  }
}

export interface ShellSnapshot {
  id: string;
  filename: string;
  timestamp: Date;
  content: string;
}

export function getRecentShellSnapshots(limit: number = 10): ShellSnapshot[] {
  if (!existsSync(SHELL_SNAPSHOTS_DIR)) return [];

  try {
    const files = readdirSync(SHELL_SNAPSHOTS_DIR)
      .filter((f) => f.endsWith(".sh"))
      .slice(0, limit);

    return files.map((filename) => {
      const filepath = join(SHELL_SNAPSHOTS_DIR, filename);
      const content = readFileSync(filepath, "utf-8");

      // Extract timestamp from filename: snapshot-zsh-[timestamp]-[random].sh
      const timestampMatch = filename.match(/snapshot-\w+-(\d+)-/);
      const timestamp = timestampMatch ? new Date(parseInt(timestampMatch[1])) : new Date();

      return {
        id: filename.replace(".sh", ""),
        filename,
        timestamp,
        content: content.slice(0, 5000), // Limit content size
      };
    });
  } catch (error) {
    console.error("Failed to read shell snapshots:", error);
    return [];
  }
}

export function getSessionCount(): number {
  if (!existsSync(SESSION_ENV_DIR)) return 0;

  try {
    return readdirSync(SESSION_ENV_DIR).length;
  } catch {
    return 0;
  }
}

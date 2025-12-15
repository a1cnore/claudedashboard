import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";
import { homedir } from "os";
import type { Project, ProjectConfig } from "@/types";

const CLAUDE_JSON_PATH = join(homedir(), ".claude.json");
const PROJECTS_DIR = join(homedir(), ".claude", "projects");

interface ClaudeJsonData {
  projects?: Record<string, ProjectConfig>;
  numStartups?: number;
  [key: string]: unknown;
}

export function getClaudeConfig(): ClaudeJsonData | null {
  if (!existsSync(CLAUDE_JSON_PATH)) {
    return null;
  }

  try {
    const content = readFileSync(CLAUDE_JSON_PATH, "utf-8");
    return JSON.parse(content) as ClaudeJsonData;
  } catch (error) {
    console.error("Failed to read .claude.json:", error);
    return null;
  }
}

export function getAllProjects(): Project[] {
  const config = getClaudeConfig();
  if (!config?.projects) return [];

  const projects: Project[] = [];

  for (const [path, projectConfig] of Object.entries(config.projects)) {
    // Skip entries without valid config
    if (!projectConfig) continue;

    projects.push({
      path,
      config: projectConfig,
      name: basename(path),
      lastUsed: getProjectLastUsed(path),
    });
  }

  // Sort by last cost (most active first)
  return projects.sort((a, b) => (b.config?.lastCost || 0) - (a.config?.lastCost || 0));
}

function getProjectLastUsed(projectPath: string): number | undefined {
  // Try to get last modified time from project conversation files
  const encodedPath = encodeProjectPath(projectPath);
  const projectDir = join(PROJECTS_DIR, encodedPath);

  if (!existsSync(projectDir)) return undefined;

  try {
    const files = readdirSync(projectDir);
    let latestTime = 0;

    for (const file of files) {
      const filePath = join(projectDir, file);
      const stats = statSync(filePath);
      if (stats.mtimeMs > latestTime) {
        latestTime = stats.mtimeMs;
      }
    }

    return latestTime > 0 ? latestTime : undefined;
  } catch {
    return undefined;
  }
}

function encodeProjectPath(path: string): string {
  // Claude encodes paths by replacing / with -
  return path.replace(/\//g, "-");
}

export function getProjectStats() {
  const projects = getAllProjects();

  const totalCost = projects.reduce((sum, p) => sum + (p.config.lastCost || 0), 0);
  const totalDuration = projects.reduce((sum, p) => sum + (p.config.lastAPIDuration || 0), 0);

  return {
    totalProjects: projects.length,
    totalCost,
    totalDuration,
    avgCostPerProject: projects.length > 0 ? totalCost / projects.length : 0,
  };
}

export function getProjectByPath(path: string): Project | null {
  const config = getClaudeConfig();
  if (!config?.projects?.[path]) return null;

  return {
    path,
    config: config.projects[path],
    name: basename(path),
    lastUsed: getProjectLastUsed(path),
  };
}

export function getNumStarts(): number {
  const config = getClaudeConfig();
  return config?.numStartups || 0;
}

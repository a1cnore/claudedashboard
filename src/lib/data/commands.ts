import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import matter from "gray-matter";
import type { Command, Agent } from "@/types";

const COMMANDS_DIR = join(homedir(), ".claude", "commands");
const AGENTS_DIR = join(homedir(), ".claude", "agents");
const SKILLS_DIR = join(homedir(), ".claude", "skills");

export function getAllCommands(): Command[] {
  if (!existsSync(COMMANDS_DIR)) return [];

  try {
    const files = readdirSync(COMMANDS_DIR);
    const commands: Command[] = [];

    for (const filename of files) {
      if (!filename.endsWith(".md")) continue;

      const filepath = join(COMMANDS_DIR, filename);
      try {
        const raw = readFileSync(filepath, "utf-8");
        const { data, content } = matter(raw);

        commands.push({
          id: filename.replace(".md", ""),
          filename,
          name: (data.name as string) || filename.replace(".md", ""),
          description: (data.description as string) || "",
          allowedTools: data["allowed-tools"] as string[] | undefined,
          content,
        });
      } catch {
        // Skip invalid files
      }
    }

    return commands;
  } catch (error) {
    console.error("Failed to read commands:", error);
    return [];
  }
}

export function getAllAgents(): Agent[] {
  if (!existsSync(AGENTS_DIR)) return [];

  try {
    const files = readdirSync(AGENTS_DIR);
    const agents: Agent[] = [];

    for (const filename of files) {
      if (!filename.endsWith(".md")) continue;

      const filepath = join(AGENTS_DIR, filename);
      try {
        const raw = readFileSync(filepath, "utf-8");
        const { data, content } = matter(raw);

        agents.push({
          id: filename.replace(".md", ""),
          filename,
          name: (data.name as string) || filename.replace(".md", ""),
          description: (data.description as string) || "",
          tools: ((data.tools as string) || "").split(",").map((t) => t.trim()).filter(Boolean),
          model: (data.model as string) || "sonnet",
          color: (data.color as string) || "blue",
          content,
        });
      } catch {
        // Skip invalid files
      }
    }

    return agents;
  } catch (error) {
    console.error("Failed to read agents:", error);
    return [];
  }
}

export interface Skill {
  id: string;
  name: string;
  path: string;
}

export function getAllSkills(): Skill[] {
  if (!existsSync(SKILLS_DIR)) return [];

  try {
    const items = readdirSync(SKILLS_DIR);

    return items
      .filter((item) => {
        const itemPath = join(SKILLS_DIR, item);
        try {
          const stat = require("fs").statSync(itemPath);
          return stat.isDirectory();
        } catch {
          return false;
        }
      })
      .map((dirname) => ({
        id: dirname,
        name: dirname.replace(/-/g, " "),
        path: join(SKILLS_DIR, dirname),
      }));
  } catch (error) {
    console.error("Failed to read skills:", error);
    return [];
  }
}

export function getCommandById(id: string): Command | null {
  const commands = getAllCommands();
  return commands.find((c) => c.id === id) || null;
}

export function getAgentById(id: string): Agent | null {
  const agents = getAllAgents();
  return agents.find((a) => a.id === id) || null;
}

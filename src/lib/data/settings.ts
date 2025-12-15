import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { ClaudeSettings } from "@/types";

const SETTINGS_PATH = join(homedir(), ".claude", "settings.json");

// Strip JavaScript-style comments from JSON (settings.json may have them)
function stripJsonComments(json: string): string {
  // Remove single-line comments (// ...)
  return json.replace(/^\s*\/\/.*$/gm, "")
    // Remove empty lines that might cause issues
    .replace(/,(\s*[}\]])/g, "$1");
}

export function getSettings(): ClaudeSettings | null {
  if (!existsSync(SETTINGS_PATH)) {
    return null;
  }

  try {
    const content = readFileSync(SETTINGS_PATH, "utf-8");
    const cleanedContent = stripJsonComments(content);
    return JSON.parse(cleanedContent) as ClaudeSettings;
  } catch (error) {
    console.error("Failed to read settings:", error);
    return null;
  }
}

export function getPermissions(): { allow: string[]; deny: string[] } {
  const settings = getSettings();
  return {
    allow: settings?.permissions?.allow || [],
    deny: settings?.permissions?.deny || [],
  };
}

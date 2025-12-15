import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import matter from "gray-matter";
import type { Plan } from "@/types";

const PLANS_DIR = join(homedir(), ".claude", "plans");

export function getAllPlans(): Plan[] {
  if (!existsSync(PLANS_DIR)) return [];

  try {
    const files = readdirSync(PLANS_DIR);

    return files
      .filter((f) => f.endsWith(".md"))
      .map((filename) => {
        const filepath = join(PLANS_DIR, filename);
        try {
          const raw = readFileSync(filepath, "utf-8");
          const { data, content } = matter(raw);
          const stats = statSync(filepath);

          // Extract title from first H1 or filename
          const titleMatch = content.match(/^#\s+(.+)$/m);
          const title = titleMatch?.[1] || filename.replace(".md", "").replace(/-/g, " ");

          return {
            id: filename.replace(".md", ""),
            filename,
            title,
            content,
            frontmatter: data,
            modifiedAt: stats.mtime,
          };
        } catch {
          return null;
        }
      })
      .filter((plan): plan is Plan => plan !== null);
  } catch (error) {
    console.error("Failed to read plans:", error);
    return [];
  }
}

export function getPlanById(id: string): Plan | null {
  const plans = getAllPlans();
  return plans.find((p) => p.id === id) || null;
}

export function getRecentPlans(limit: number = 10): Plan[] {
  const plans = getAllPlans();
  return plans.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime()).slice(0, limit);
}

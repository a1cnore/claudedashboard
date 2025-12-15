import Database from "better-sqlite3";
import { homedir } from "os";
import { join } from "path";
import type { FullMessage, Session } from "@/types";

const CLAUDE_DB_PATH = join(homedir(), ".claude", "__store.db");

// Singleton database connection
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    try {
      db = new Database(CLAUDE_DB_PATH, { readonly: true, fileMustExist: true });
      // Don't set WAL mode on readonly database
    } catch (error) {
      console.error("Failed to open database:", error);
      throw error;
    }
  }
  return db;
}

export function getSessionMessages(sessionId: string): FullMessage[] {
  const db = getDatabase();

  const rows = db
    .prepare(
      `
    SELECT
      b.*,
      COALESCE(u.message, a.message) as content,
      a.cost_usd,
      a.duration_ms,
      a.model,
      u.tool_use_result,
      CASE WHEN u.uuid IS NOT NULL THEN 'user' ELSE 'assistant' END as role
    FROM base_messages b
    LEFT JOIN user_messages u ON b.uuid = u.uuid
    LEFT JOIN assistant_messages a ON b.uuid = a.uuid
    WHERE b.session_id = ?
    ORDER BY b.timestamp ASC
  `
    )
    .all(sessionId) as FullMessage[];

  return rows;
}

export function getRecentSessions(limit: number = 50): Session[] {
  const db = getDatabase();

  const rows = db
    .prepare(
      `
    SELECT
      b.session_id,
      MIN(b.timestamp) as start_time,
      MAX(b.timestamp) as end_time,
      COUNT(*) as message_count,
      b.cwd as project_path,
      COALESCE(SUM(a.cost_usd), 0) as total_cost
    FROM base_messages b
    LEFT JOIN assistant_messages a ON b.uuid = a.uuid
    GROUP BY b.session_id
    ORDER BY MAX(b.timestamp) DESC
    LIMIT ?
  `
    )
    .all(limit) as Session[];

  return rows;
}

export function getAllSessions(): Session[] {
  const db = getDatabase();

  const rows = db
    .prepare(
      `
    SELECT
      b.session_id,
      MIN(b.timestamp) as start_time,
      MAX(b.timestamp) as end_time,
      COUNT(*) as message_count,
      b.cwd as project_path,
      COALESCE(SUM(a.cost_usd), 0) as total_cost
    FROM base_messages b
    LEFT JOIN assistant_messages a ON b.uuid = a.uuid
    GROUP BY b.session_id
    ORDER BY MAX(b.timestamp) DESC
  `
    )
    .all() as Session[];

  return rows;
}

export function getSessionStats(): {
  total_sessions: number;
  total_messages: number;
  total_cost: number;
  avg_response_time: number;
} {
  const db = getDatabase();

  const result = db
    .prepare(
      `
    SELECT
      COUNT(DISTINCT b.session_id) as total_sessions,
      COUNT(*) as total_messages,
      COALESCE(SUM(a.cost_usd), 0) as total_cost,
      COALESCE(AVG(a.duration_ms), 0) as avg_response_time
    FROM base_messages b
    LEFT JOIN assistant_messages a ON b.uuid = a.uuid
  `
    )
    .get() as {
    total_sessions: number;
    total_messages: number;
    total_cost: number;
    avg_response_time: number;
  };

  return result;
}

export function getMessagesByProject(projectPath: string): FullMessage[] {
  const db = getDatabase();

  const rows = db
    .prepare(
      `
    SELECT
      b.*,
      COALESCE(u.message, a.message) as content,
      a.cost_usd,
      a.duration_ms,
      a.model,
      u.tool_use_result,
      CASE WHEN u.uuid IS NOT NULL THEN 'user' ELSE 'assistant' END as role
    FROM base_messages b
    LEFT JOIN user_messages u ON b.uuid = u.uuid
    LEFT JOIN assistant_messages a ON b.uuid = a.uuid
    WHERE b.cwd LIKE ?
    ORDER BY b.timestamp DESC
  `
    )
    .all(`%${projectPath}%`) as FullMessage[];

  return rows;
}

export function searchMessages(query: string, limit: number = 100): FullMessage[] {
  const db = getDatabase();

  const rows = db
    .prepare(
      `
    SELECT
      b.*,
      COALESCE(u.message, a.message) as content,
      a.cost_usd,
      a.duration_ms,
      a.model,
      u.tool_use_result,
      CASE WHEN u.uuid IS NOT NULL THEN 'user' ELSE 'assistant' END as role
    FROM base_messages b
    LEFT JOIN user_messages u ON b.uuid = u.uuid
    LEFT JOIN assistant_messages a ON b.uuid = a.uuid
    WHERE u.message LIKE ? OR a.message LIKE ?
    ORDER BY b.timestamp DESC
    LIMIT ?
  `
    )
    .all(`%${query}%`, `%${query}%`, limit) as FullMessage[];

  return rows;
}

export function getConversationSummaries(): { leaf_uuid: string; summary: string; updated_at: number }[] {
  const db = getDatabase();

  try {
    const rows = db
      .prepare(
        `
      SELECT leaf_uuid, summary, updated_at
      FROM conversation_summaries
      ORDER BY updated_at DESC
    `
      )
      .all() as { leaf_uuid: string; summary: string; updated_at: number }[];

    return rows;
  } catch {
    return [];
  }
}

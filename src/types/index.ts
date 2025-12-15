// Database types (from SQLite __store.db)
export interface BaseMessage {
  uuid: string;
  parent_uuid: string | null;
  session_id: string;
  timestamp: number;
  message_type: string;
  cwd: string;
  original_cwd: string;
  user_type: string;
  version: string;
  isSidechain: number;
}

export interface AssistantMessage {
  uuid: string;
  cost_usd: number | null;
  duration_ms: number | null;
  message: string;
  is_api_error_message: number;
  timestamp: number;
  model: string | null;
}

export interface UserMessage {
  uuid: string;
  message: string;
  tool_use_result: string | null;
  timestamp: number;
  is_at_mention_read: number | null;
  is_meta: number | null;
}

export interface ConversationSummary {
  leaf_uuid: string;
  summary: string;
  updated_at: number;
}

export interface FullMessage extends BaseMessage {
  content: string;
  cost_usd?: number | null;
  duration_ms?: number | null;
  model?: string | null;
  tool_use_result?: string | null;
  role: "user" | "assistant";
}

export interface Session {
  session_id: string;
  start_time: number;
  end_time: number;
  message_count: number;
  project_path: string;
  total_cost: number;
}

// Stats cache types
export interface DailyActivity {
  date: string;
  messageCount: number;
  sessionCount: number;
  toolCallCount: number;
}

export interface ModelUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  webSearchRequests: number;
  costUSD: number;
}

export interface StatsCache {
  version: number;
  lastComputedDate: string;
  dailyActivity: DailyActivity[];
  dailyModelTokens: Array<{
    date: string;
    tokensByModel: Record<string, number>;
  }>;
  modelUsage: Record<string, ModelUsage>;
  totalSessions: number;
  totalMessages: number;
  longestSession?: {
    sessionId: string;
    duration: number;
    messageCount: number;
    timestamp: string;
  };
  firstSessionDate: string;
  hourCounts: Record<string, number>;
}

// History types
export interface HistoryEntry {
  display: string;
  pastedContents: Record<string, unknown>;
  timestamp: number;
  project: string;
}

// Project types
export interface ProjectConfig {
  allowedTools: string[];
  mcpContextUris: string[];
  mcpServers: Record<string, unknown>;
  enabledMcpjsonServers: string[];
  disabledMcpjsonServers: string[];
  hasTrustDialogAccepted: boolean;
  projectOnboardingSeenCount: number;
  hasClaudeMdExternalIncludesApproved: boolean;
  hasClaudeMdExternalIncludesWarningShown: boolean;
  ignorePatterns: string[];
  lastTotalWebSearchRequests: number;
  lastCost: number;
  lastAPIDuration: number;
}

export interface Project {
  path: string;
  config: ProjectConfig;
  name: string;
  lastUsed?: number;
}

// Todo types
export interface TodoItem {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm?: string;
  priority?: "high" | "medium" | "low";
  id?: string;
}

export interface TodoFile {
  id: string;
  filename: string;
  items: TodoItem[];
  modifiedAt: Date;
}

// Plan types
export interface Plan {
  id: string;
  filename: string;
  title: string;
  content: string;
  frontmatter: Record<string, unknown>;
  modifiedAt: Date;
}

// Command types
export interface Command {
  id: string;
  filename: string;
  name: string;
  description: string;
  allowedTools?: string[];
  content: string;
}

// Agent types
export interface Agent {
  id: string;
  filename: string;
  name: string;
  description: string;
  tools: string[];
  model: string;
  color: string;
  content: string;
}

// Settings types
export interface ClaudeSettings {
  $schema?: string;
  cleanupPeriodDays?: number;
  env?: Record<string, string>;
  permissions?: {
    allow?: string[];
    deny?: string[];
  };
  statusLine?: string;
  thinkingMode?: string;
}

// Debug log types
export interface DebugLog {
  id: string;
  filename: string;
  size: number;
  modifiedAt: Date;
}

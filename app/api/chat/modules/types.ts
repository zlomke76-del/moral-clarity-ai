// modules/types.ts
// Shared types across the chat system

export type ChatRole = "system" | "user" | "assistant" | "tool";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  name?: string;
}

export interface StreamEvent {
  type: "response" | "error" | "done";
  content?: string;
}

export interface SolaceContextBlock {
  persona: string;
  userKey: string;
  workspaceId: string | null;
  memoryPack?: any;
  newsDigest?: any;
  researchContext?: any;
}

export interface MemoryPackOptions {
  factsLimit: number;
  episodesLimit: number;
}

export interface MemoryInsertRequest {
  user_key: string;
  content: string;
  title?: string | null;
  purpose?: string | null;
  workspace_id?: string | null;
}

export interface ModelCallOptions {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: any;
  tools?: any[];
}

export interface StreamableModelResponse {
  stream: AsyncGenerator<StreamEvent>;
}

export type ToolCall = {
  toolName: string;
  arguments: Record<string, any>;
};

/**
 * Core types for QNClawdian.
 * Adapted from Clawdian, tailored for the QNClawdian plugin.
 */

// =========================================================================
// View
// =========================================================================

export const VIEW_TYPE_QNCLAWDIAN = 'qnclawdian-view';

// =========================================================================
// Settings
// =========================================================================

export interface QNClawdianSettings {
  // Connection
  gatewayUrl: string;
  ollamaUrl: string;
  useGateway: boolean;

  // Model
  model: string;
  temperature: number;
  maxTokens: number;

  // Memory (M3 — future)
  enableAutoWikilinks: boolean;
  enableMemorySearch: boolean;

  // UI
  userName: string;
  systemPrompt: string;
  openInMainTab: boolean;
}

// =========================================================================
// Chat
// =========================================================================

export type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

export interface ImageAttachment {
  id: string;
  name: string;
  mediaType: ImageMediaType;
  data: string; // base64
  size: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  images?: ImageAttachment[];
}

export type StreamChunk =
  | { type: 'text'; content: string }
  | { type: 'thinking'; content: string }
  | { type: 'error'; content: string }
  | { type: 'done' }
  | { type: 'usage'; usage: UsageInfo };

export interface UsageInfo {
  model?: string;
  inputTokens: number;
  contextTokens: number;
}

// =========================================================================
// Provider Types (OpenAI-compatible + Ollama)
// =========================================================================

export interface OpenAIChatRequest {
  model: string;
  messages: OpenAIMessage[];
  stream: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | OpenAIContentPart[];
}

export type OpenAIContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export interface OpenAIStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: { role?: string; content?: string };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[];
}

export interface OllamaStreamChunk {
  model: string;
  created_at: string;
  message: { role: string; content: string };
  done: boolean;
  total_duration?: number;
  eval_count?: number;
  prompt_eval_count?: number;
}

// =========================================================================
// Model Options
// =========================================================================

export interface ModelOption {
  value: string;
  label: string;
  description: string;
  group: 'local' | 'cloud';
  contextWindow: number;
}

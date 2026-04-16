/**
 * OpenClawProvider — AI backend provider for QNClawdian.
 *
 * Supports two connection modes:
 * 1. OpenClaw Gateway (localhost:8899) — OpenAI-compatible API
 * 2. Ollama direct (localhost:11434) — Ollama native API
 *
 * Both modes support streaming responses.
 */

import type {
  ChatMessage,
  OllamaChatRequest,
  OllamaMessage,
  OllamaStreamChunk,
  OpenAIChatRequest,
  OpenAIContentPart,
  OpenAIMessage,
  OpenAIStreamChunk,
  QNClawdianSettings,
  StreamChunk,
} from '../types';

export class OpenClawProvider {
  private settings: QNClawdianSettings;
  private systemPrompt: string;
  private abortController: AbortController | null = null;

  constructor(settings: QNClawdianSettings, systemPrompt: string) {
    this.settings = settings;
    this.systemPrompt = systemPrompt;
  }

  // =========================================================================
  // Connection
  // =========================================================================

  /**
   * Test connectivity to the configured backend.
   * Returns true if reachable.
   */
  async testConnection(): Promise<boolean> {
    try {
      const endpoint = this.isGateway()
        ? `${this.settings.gatewayUrl}/v1/models`
        : `${this.settings.ollamaUrl}/api/tags`;

      const response = await fetch(endpoint, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetch available models from the backend.
   */
  async fetchModels(): Promise<string[]> {
    try {
      if (this.isGateway()) {
        const resp = await fetch(`${this.settings.gatewayUrl}/v1/models`, {
          signal: AbortSignal.timeout(5000),
        });
        if (!resp.ok) return [];
        const data = await resp.json();
        return (data.data || []).map((m: { id: string }) => m.id);
      } else {
        const resp = await fetch(`${this.settings.ollamaUrl}/api/tags`, {
          signal: AbortSignal.timeout(5000),
        });
        if (!resp.ok) return [];
        const data = await resp.json();
        return (data.models || []).map((m: { name: string }) => m.name);
      }
    } catch {
      return [];
    }
  }

  // =========================================================================
  // Streaming Query
  // =========================================================================

  /**
   * Send a chat query and stream back response chunks.
   *
   * @param noteContext — If present, the current note's content is injected
   *   into the system prompt (not the user message) so the AI can reference
   *   it without polluting the chat history.
   */
  async *query(
    userText: string,
    history: ChatMessage[],
    noteContext?: { path: string; content: string; truncated: boolean },
  ): AsyncGenerator<StreamChunk> {
    this.abortController = new AbortController();

    try {
      if (this.isGateway()) {
        yield* this.queryOpenAI(userText, history, noteContext);
      } else {
        yield* this.queryOllama(userText, history, noteContext);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        yield { type: 'done' };
        return;
      }
      yield { type: 'error', content: String(error) };
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Cancel the current streaming request.
   */
  cancel(): void {
    this.abortController?.abort();
    this.abortController = null;
  }

  // =========================================================================
  // System Prompt with Note Context
  // =========================================================================

  /**
   * Build the effective system prompt, optionally appending the current
   * note's content. The note is injected here (system prompt) so it does
   * NOT appear in the user-visible chat.
   */
  private buildEffectiveSystemPrompt(
    noteContext?: { path: string; content: string; truncated: boolean },
  ): string {
    let prompt = this.systemPrompt;

    if (noteContext) {
      const truncationNote = noteContext.truncated
        ? '\n\n> ⚠️ Note was truncated to 4 000 characters. The user may ask about parts you cannot see.'
        : '';

      prompt += `\n\n## Current Note Context

The user currently has the following note open: **${noteContext.path}**

<current_note_content>
${noteContext.content}
</current_note_content>${truncationNote}

Use this note's content to inform your answers when relevant. If the user asks about this note, reference specific parts of it.`;
    }

    return prompt;
  }

  // =========================================================================
  // OpenAI-Compatible API (Gateway)
  // =========================================================================

  private async *queryOpenAI(
    prompt: string,
    history: ChatMessage[],
    noteContext?: { path: string; content: string; truncated: boolean },
  ): AsyncGenerator<StreamChunk> {
    const messages: OpenAIMessage[] = [];

    // System prompt (with note context injected)
    const effectiveSystemPrompt = this.buildEffectiveSystemPrompt(noteContext);
    if (effectiveSystemPrompt) {
      messages.push({ role: 'system', content: effectiveSystemPrompt });
    }

    // History
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }

    // Current user message
    messages.push({ role: 'user', content: prompt });

    const body: OpenAIChatRequest = {
      model: this.settings.model,
      messages,
      stream: true,
      temperature: this.settings.temperature,
      max_tokens: this.settings.maxTokens,
    };

    const timeoutSignal = AbortSignal.timeout(120_000);
    const combinedSignal = AbortSignal.any([this.abortController!.signal, timeoutSignal]);

    const response = await fetch(
      `${this.settings.gatewayUrl}/v1/chat/completions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: combinedSignal,
      },
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      yield { type: 'error', content: `Gateway error ${response.status}: ${errText}` };
      return;
    }

    if (!response.body) {
      yield { type: 'error', content: 'No response body from gateway' };
      return;
    }

    // Parse SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === ':') continue;
        if (trimmed === 'data: [DONE]') return;

        if (trimmed.startsWith('data: ')) {
          try {
            const chunk: OpenAIStreamChunk = JSON.parse(trimmed.slice(6));
            const delta = chunk.choices?.[0]?.delta;

            if (delta?.content) {
              yield { type: 'text', content: delta.content };
            }

            if (chunk.usage) {
              yield {
                type: 'usage',
                usage: {
                  model: chunk.model,
                  inputTokens: chunk.usage.prompt_tokens,
                  contextTokens: chunk.usage.total_tokens,
                },
              };
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }
  }

  // =========================================================================
  // Ollama Native API
  // =========================================================================

  private async *queryOllama(
    prompt: string,
    history: ChatMessage[],
    noteContext?: { path: string; content: string; truncated: boolean },
  ): AsyncGenerator<StreamChunk> {
    const messages: OllamaMessage[] = [];

    // System prompt (with note context injected)
    const effectiveSystemPrompt = this.buildEffectiveSystemPrompt(noteContext);
    if (effectiveSystemPrompt) {
      messages.push({ role: 'system', content: effectiveSystemPrompt });
    }

    // History
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }

    // Current user message
    messages.push({ role: 'user', content: prompt });

    const body: OllamaChatRequest = {
      model: this.settings.model,
      messages,
      stream: true,
      options: {
        temperature: this.settings.temperature,
        num_predict: this.settings.maxTokens,
      },
    };

    const timeoutSignal = AbortSignal.timeout(120_000);
    const combinedSignal = AbortSignal.any([this.abortController!.signal, timeoutSignal]);

    const response = await fetch(`${this.settings.ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: combinedSignal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      yield { type: 'error', content: `Ollama error ${response.status}: ${errText}` };
      return;
    }

    if (!response.body) {
      yield { type: 'error', content: 'No response body from Ollama' };
      return;
    }

    // Parse NDJSON stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const chunk: OllamaStreamChunk = JSON.parse(trimmed);

          if (chunk.message?.thinking) {
            yield { type: 'thinking', content: chunk.message.thinking };
          }

          if (chunk.message?.content) {
            yield { type: 'text', content: chunk.message.content };
          }

          if (chunk.done && chunk.eval_count) {
            const promptTokens = chunk.prompt_eval_count || 0;
            yield {
              type: 'usage',
              usage: {
                model: chunk.model,
                inputTokens: promptTokens,
                contextTokens: promptTokens + chunk.eval_count,
              },
            };
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }

  // =========================================================================
  // Helpers
  // =========================================================================

  private isGateway(): boolean {
    return this.settings.useGateway;
  }

  updateSettings(settings: QNClawdianSettings): void {
    this.settings = settings;
  }

  updateSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }
}

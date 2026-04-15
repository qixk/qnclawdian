/**
 * Model configuration for QNClawdian.
 */

import type { ModelOption } from '../types';

/**
 * Default model options available through OpenClaw Gateway / Ollama.
 */
export const DEFAULT_MODEL_OPTIONS: ModelOption[] = [
  // Local models (Ollama)
  {
    value: 'gemma4:27b',
    label: 'Gemma 4 27B',
    description: 'Google Gemma 4, strong all-around',
    group: 'local',
    contextWindow: 128000,
  },
  {
    value: 'qwen2.5-coder:14b',
    label: 'Qwen 2.5 Coder 14B',
    description: 'Code-specialized, fast',
    group: 'local',
    contextWindow: 32768,
  },
  {
    value: 'qwen2.5:32b',
    label: 'Qwen 2.5 32B',
    description: 'Strong general-purpose',
    group: 'local',
    contextWindow: 32768,
  },
  {
    value: 'llama3.1:8b',
    label: 'Llama 3.1 8B',
    description: 'Lightweight, fast responses',
    group: 'local',
    contextWindow: 131072,
  },
  {
    value: 'deepseek-coder:6.7b',
    label: 'DeepSeek Coder 6.7B',
    description: 'Code-focused, compact',
    group: 'local',
    contextWindow: 16384,
  },
  // Cloud models (via Gateway)
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    description: 'OpenAI GPT-4o (cloud)',
    group: 'cloud',
    contextWindow: 128000,
  },
  {
    value: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    description: 'OpenAI GPT-4o Mini (cloud)',
    group: 'cloud',
    contextWindow: 128000,
  },
  {
    value: 'claude-sonnet-4-20250514',
    label: 'Claude Sonnet 4',
    description: 'Anthropic Claude (cloud)',
    group: 'cloud',
    contextWindow: 200000,
  },
];

/**
 * Get model display label.
 */
export function getModelLabel(model: string): string {
  const option = DEFAULT_MODEL_OPTIONS.find((o) => o.value === model);
  return option?.label ?? model;
}

/**
 * Check if a model is local (Ollama).
 */
export function isLocalModel(model: string): boolean {
  const option = DEFAULT_MODEL_OPTIONS.find((o) => o.value === model);
  return option ? option.group === 'local' : model.includes(':');
}

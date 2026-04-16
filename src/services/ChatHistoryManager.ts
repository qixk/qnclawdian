/**
 * ChatHistoryManager — Persists chat conversations to the Obsidian vault.
 *
 * Storage layout:
 *   .qnclawdian/history/<conversation-id>.json
 *
 * Each file contains a serialised Conversation object.
 * When the total number of history files exceeds MAX_HISTORY_FILES (50),
 * the oldest files are automatically deleted.
 *
 * Part of S002: 对话历史本地持久化
 */

import type { Vault } from 'obsidian';
import type { ChatMessage, Conversation } from '../types';

const HISTORY_DIR = '.qnclawdian/history';
const MAX_HISTORY_FILES = 50;

export class ChatHistoryManager {
  private vault: Vault;

  constructor(vault: Vault) {
    this.vault = vault;
  }

  // =========================================================================
  // Public API
  // =========================================================================

  /**
   * Create a new conversation and persist it.
   */
  async createConversation(): Promise<Conversation> {
    const now = Date.now();
    const conv: Conversation = {
      id: `conv-${now}`,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    await this.save(conv);
    return conv;
  }

  /**
   * Append a message to a conversation and persist.
   */
  async addMessage(conv: Conversation, msg: ChatMessage): Promise<void> {
    conv.messages.push(msg);
    conv.updatedAt = Date.now();
    await this.save(conv);
  }

  /**
   * Load the most recently updated conversation, or null if none exist.
   */
  async loadLatest(): Promise<Conversation | null> {
    const files = await this.listHistoryFiles();
    if (files.length === 0) return null;

    // Sort descending by filename (which contains timestamp)
    files.sort((a, b) => b.localeCompare(a));

    // Try loading the most recent file; skip corrupt ones
    for (const fileName of files) {
      const conv = await this.loadFile(fileName);
      if (conv) return conv;
    }

    return null;
  }

  /**
   * Enforce the MAX_HISTORY_FILES limit — delete oldest files.
   */
  async pruneHistory(): Promise<number> {
    const files = await this.listHistoryFiles();
    if (files.length <= MAX_HISTORY_FILES) return 0;

    // Sort ascending (oldest first)
    files.sort((a, b) => a.localeCompare(b));

    const toDelete = files.slice(0, files.length - MAX_HISTORY_FILES);
    let deleted = 0;

    for (const fileName of toDelete) {
      try {
        const path = `${HISTORY_DIR}/${fileName}`;
        const file = this.vault.getAbstractFileByPath(path);
        if (file) {
          await this.vault.delete(file);
          deleted++;
        }
      } catch {
        // Best-effort deletion
      }
    }

    return deleted;
  }

  // =========================================================================
  // Internal
  // =========================================================================

  /**
   * Persist a conversation to its JSON file.
   */
  private async save(conv: Conversation): Promise<void> {
    await this.ensureDir();
    const path = `${HISTORY_DIR}/${conv.id}.json`;
    const data = JSON.stringify(conv, null, 2);

    const existing = this.vault.getAbstractFileByPath(path);
    if (existing) {
      await this.vault.modify(existing as any, data);
    } else {
      await this.vault.create(path, data);
    }
  }

  /**
   * Load a single conversation file by name.
   */
  private async loadFile(fileName: string): Promise<Conversation | null> {
    try {
      const path = `${HISTORY_DIR}/${fileName}`;
      const file = this.vault.getAbstractFileByPath(path);
      if (!file) return null;

      const raw = await this.vault.cachedRead(file as any);
      const conv: Conversation = JSON.parse(raw);

      // Basic validation
      if (!conv.id || !Array.isArray(conv.messages)) return null;

      return conv;
    } catch {
      return null;
    }
  }

  /**
   * List all .json files in the history directory.
   */
  private async listHistoryFiles(): Promise<string[]> {
    await this.ensureDir();

    const folder = this.vault.getAbstractFileByPath(HISTORY_DIR);
    if (!folder || !(folder as any).children) return [];

    return (folder as any).children
      .filter((f: any) => f.name?.endsWith('.json'))
      .map((f: any) => f.name as string);
  }

  /**
   * Ensure the .qnclawdian/history/ directory exists.
   */
  private async ensureDir(): Promise<void> {
    // Check parent
    if (!this.vault.getAbstractFileByPath('.qnclawdian')) {
      await this.vault.createFolder('.qnclawdian');
    }
    // Check history dir
    if (!this.vault.getAbstractFileByPath(HISTORY_DIR)) {
      await this.vault.createFolder(HISTORY_DIR);
    }
  }
}

/**
 * QNClawdian — Brain-inspired Obsidian plugin for OpenClaw AI agents.
 *
 * Plugin entry point. Registers the sidebar view, commands, and settings.
 * By Q & N.
 */

import { Notice, Plugin } from 'obsidian';

import type { QNClawdianSettings } from './types';
import { VIEW_TYPE_QNCLAWDIAN } from './types';
import { ChatView } from './views/ChatView';
import { SettingTab } from './settings/SettingTab';

/** Default settings */
const DEFAULT_SETTINGS: QNClawdianSettings = {
  // Connection
  gatewayUrl: 'http://localhost:8899',
  ollamaUrl: 'http://localhost:11434',
  useGateway: true,

  // Model
  model: 'gemma4:26b',
  temperature: 0.7,
  maxTokens: 4096,

  // Memory (M3)
  enableAutoWikilinks: false,
  enableMemorySearch: false,

  // UI
  userName: '',
  systemPrompt: '',
  openInMainTab: false,
};

export default class QNClawdianPlugin extends Plugin {
  settings!: QNClawdianSettings;

  async onload() {
    await this.loadSettings();

    // Register sidebar view
    this.registerView(
      VIEW_TYPE_QNCLAWDIAN,
      (leaf) => new ChatView(leaf, this),
    );

    // Ribbon icon
    this.addRibbonIcon('brain-cog', 'Open QNClawdian', () => {
      this.activateView();
    });

    // Commands
    this.addCommand({
      id: 'open-view',
      name: 'Open chat view',
      callback: () => this.activateView(),
    });

    this.addCommand({
      id: 'new-conversation',
      name: 'New conversation',
      callback: () => {
        new Notice('New QNClawdian conversation');
        this.activateView();
      },
    });

    // Settings tab
    this.addSettingTab(new SettingTab(this.app, this));
  }

  async onunload() {
    // Cleanup handled by view's onClose
  }

  // =========================================================================
  // View Management
  // =========================================================================

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_QNCLAWDIAN)[0];

    if (!leaf) {
      const newLeaf = this.settings.openInMainTab
        ? workspace.getLeaf('tab')
        : workspace.getRightLeaf(false);
      if (newLeaf) {
        await newLeaf.setViewState({
          type: VIEW_TYPE_QNCLAWDIAN,
          active: true,
        });
        leaf = newLeaf;
      }
    }

    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }

  // =========================================================================
  // Settings
  // =========================================================================

  async loadSettings() {
    const data = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...(data || {}) };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // =========================================================================
  // System Prompt
  // =========================================================================

  buildSystemPrompt(): string {
    const vaultPath = (this.app.vault.adapter as any).basePath || '';
    const today = new Date().toISOString().split('T')[0];
    const userName = this.settings.userName?.trim();

    let prompt = '';

    if (userName) {
      prompt += `## User Context\n\nYou are collaborating with **${userName}**.\n\n`;
    }

    prompt += `## Time Context\n\n- **Current Date**: ${today}\n\n`;

    prompt += `## Identity & Role

You are **QNClawdian**, a brain-inspired AI assistant embedded in an Obsidian vault. You are powered by OpenClaw.

**Core Principles:**
1. **Obsidian Native**: You understand Markdown, YAML frontmatter, Wiki-links, and the "second brain" philosophy.
2. **Safety First**: You never overwrite data without understanding context.
3. **Proactive Thinking**: You plan and verify before executing.
4. **Clarity**: Your changes are precise, minimizing noise in the user's notes.

The current working directory is the user's vault root.
Vault path: ${vaultPath}

## Obsidian Context

- **Structure**: Files are Markdown (.md). Folders organize content.
- **Frontmatter**: YAML at the top of files (metadata). Respect existing fields.
- **Links**: Internal Wiki-links \`[[note-name]]\`. External links \`[text](url)\`.
- **Tags**: #tag-name for categorization.

When mentioning vault files, use wikilink format: \`[[folder/note.md]]\`.`;

    if (this.settings.systemPrompt?.trim()) {
      prompt += `\n\n## Custom Instructions\n\n${this.settings.systemPrompt.trim()}`;
    }

    return prompt;
  }
}

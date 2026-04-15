/**
 * ChatView — Main sidebar view for QNClawdian.
 *
 * Provides the chat interface: message list, input box, send button,
 * and streaming response display.
 */

import type { WorkspaceLeaf } from 'obsidian';
import { ItemView, MarkdownRenderer, setIcon } from 'obsidian';

import type { ChatMessage, ModelOption, StreamChunk } from '../types';
import { VIEW_TYPE_QNCLAWDIAN } from '../types';
import type QNClawdianPlugin from '../main';
import { OpenClawProvider } from '../providers/OpenClawProvider';
import { DEFAULT_MODEL_OPTIONS, getModelLabel } from '../settings/models';

export class ChatView extends ItemView {
  private plugin: QNClawdianPlugin;
  private provider: OpenClawProvider | null = null;

  // DOM
  private viewContainerEl: HTMLElement | null = null;
  private messagesEl: HTMLElement | null = null;
  private inputEl: HTMLTextAreaElement | null = null;
  private statusEl: HTMLElement | null = null;
  private modelLabelEl: HTMLElement | null = null;

  // State
  private messages: ChatMessage[] = [];
  private isStreaming = false;
  private currentStreamContent = '';

  constructor(leaf: WorkspaceLeaf, plugin: QNClawdianPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_QNCLAWDIAN;
  }

  getDisplayText(): string {
    return 'QNClawdian';
  }

  getIcon(): string {
    return 'brain-cog';
  }

  async onOpen() {
    if (!this.containerEl) return;

    const container = this.contentEl ?? this.containerEl;
    this.viewContainerEl = container;
    this.viewContainerEl.empty();
    this.viewContainerEl.addClass('qnclawdian-container');

    this.buildHeader();
    this.buildMessagesArea();
    this.buildInputArea();

    await this.initProvider();
  }

  async onClose() {
    this.provider?.cancel();
    this.provider = null;
  }

  // =========================================================================
  // UI Building
  // =========================================================================

  private buildHeader(): void {
    if (!this.viewContainerEl) return;

    const header = this.viewContainerEl.createDiv({ cls: 'qnclawdian-header' });

    // Logo + title
    const titleSlot = header.createDiv({ cls: 'qnclawdian-title-slot' });
    const logo = titleSlot.createSpan({ cls: 'qnclawdian-logo' });
    setIcon(logo, 'brain-cog');
    titleSlot.createEl('h4', { text: 'QNClawdian', cls: 'qnclawdian-title-text' });

    // Model status
    this.statusEl = header.createDiv({ cls: 'qnclawdian-status' });
    this.updateStatus();

    // Actions
    const actions = header.createDiv({ cls: 'qnclawdian-header-actions' });

    const newBtn = actions.createDiv({ cls: 'qnclawdian-header-btn' });
    setIcon(newBtn, 'square-pen');
    newBtn.setAttribute('aria-label', 'New conversation');
    newBtn.addEventListener('click', () => this.handleNewConversation());
  }

  private buildMessagesArea(): void {
    if (!this.viewContainerEl) return;

    this.messagesEl = this.viewContainerEl.createDiv({
      cls: 'qnclawdian-messages',
    });

    this.renderWelcome();
  }

  private buildInputArea(): void {
    if (!this.viewContainerEl) return;

    const inputArea = this.viewContainerEl.createDiv({ cls: 'qnclawdian-input-area' });

    // Toolbar with model label
    const toolbar = inputArea.createDiv({ cls: 'qnclawdian-toolbar' });
    this.modelLabelEl = toolbar.createSpan({ cls: 'qnclawdian-model-label' });
    this.modelLabelEl.textContent = getModelLabel(this.plugin.settings.model);

    // Input wrapper
    const inputWrapper = inputArea.createDiv({ cls: 'qnclawdian-input-wrapper' });
    this.inputEl = inputWrapper.createEl('textarea', {
      cls: 'qnclawdian-input',
      attr: { placeholder: 'Ask anything... (Enter to send, Shift+Enter for newline)' },
    });

    // Auto-resize
    this.inputEl.addEventListener('input', () => {
      if (!this.inputEl) return;
      this.inputEl.style.height = 'auto';
      this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 200) + 'px';
    });

    // Submit on Enter (Shift+Enter for newline)
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    // Send button
    const sendBtn = inputWrapper.createDiv({ cls: 'qnclawdian-send-btn' });
    setIcon(sendBtn, 'send');
    sendBtn.addEventListener('click', () => this.handleSubmit());
  }

  // =========================================================================
  // Provider
  // =========================================================================

  private async initProvider(): Promise<void> {
    const systemPrompt = this.plugin.buildSystemPrompt();

    this.provider = new OpenClawProvider(this.plugin.settings, systemPrompt);

    const ready = await this.provider.testConnection();
    if (!ready) {
      this.renderSystemMessage(
        '⚠️ Cannot connect to AI backend. Check that OpenClaw Gateway or Ollama is running.',
      );
    }
  }

  // =========================================================================
  // Message Handling
  // =========================================================================

  private async handleSubmit(): Promise<void> {
    if (!this.inputEl || !this.provider || this.isStreaming) return;

    const text = this.inputEl.value.trim();
    if (!text) return;

    // Clear input
    this.inputEl.value = '';
    this.inputEl.style.height = 'auto';

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    this.messages.push(userMsg);
    this.renderMessage(userMsg);

    // Get current note context
    const activeFile = this.app.workspace.getActiveFile();

    // Stream response
    this.isStreaming = true;
    this.currentStreamContent = '';
    const assistantMsgEl = this.renderStreamingMessage();

    try {
      for await (const chunk of this.provider.query(
        text,
        this.messages.slice(0, -1),
        activeFile?.path,
      )) {
        this.handleStreamChunk(chunk, assistantMsgEl);
      }
    } catch (error) {
      this.handleStreamChunk(
        { type: 'error', content: String(error) },
        assistantMsgEl,
      );
    }

    // Finalize
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: this.currentStreamContent,
      timestamp: Date.now(),
    };
    this.messages.push(assistantMsg);
    this.isStreaming = false;

    // Remove streaming indicator
    assistantMsgEl.removeClass('qnclawdian-streaming');

    this.scrollToBottom();
  }

  private handleStreamChunk(chunk: StreamChunk, msgEl: HTMLElement): void {
    switch (chunk.type) {
      case 'text':
        this.currentStreamContent += chunk.content;
        this.updateStreamingMessage(msgEl, this.currentStreamContent);
        break;
      case 'error':
        this.currentStreamContent += `\n\n❌ Error: ${chunk.content}`;
        this.updateStreamingMessage(msgEl, this.currentStreamContent);
        break;
      case 'usage':
        this.updateStatus(chunk.usage.model);
        break;
      case 'done':
        break;
    }
  }

  private handleNewConversation(): void {
    this.messages = [];
    if (this.messagesEl) {
      this.messagesEl.empty();
      this.renderWelcome();
    }
    this.provider?.cancel();
  }

  // =========================================================================
  // Rendering
  // =========================================================================

  private renderWelcome(): void {
    if (!this.messagesEl) return;
    const welcome = this.messagesEl.createDiv({ cls: 'qnclawdian-welcome' });
    welcome.createEl('h3', { text: '🧠 QNClawdian' });
    welcome.createEl('p', {
      text: 'Brain-inspired AI assistant in your Obsidian vault. Powered by OpenClaw.',
    });
    welcome.createEl('p', {
      text: `Model: ${getModelLabel(this.plugin.settings.model)}`,
      cls: 'qnclawdian-welcome-model',
    });
    welcome.createEl('p', {
      text: 'By Q & N',
      cls: 'qnclawdian-welcome-author',
    });
  }

  private renderMessage(msg: ChatMessage): void {
    if (!this.messagesEl) return;

    // Remove welcome if present
    const welcome = this.messagesEl.querySelector('.qnclawdian-welcome');
    if (welcome) welcome.remove();

    const msgEl = this.messagesEl.createDiv({
      cls: `qnclawdian-message qnclawdian-message-${msg.role}`,
    });

    const roleLabel = msgEl.createDiv({ cls: 'qnclawdian-message-role' });
    roleLabel.textContent = msg.role === 'user' ? '👤 You' : '🧠 QNClawdian';

    const contentEl = msgEl.createDiv({ cls: 'qnclawdian-message-content' });
    contentEl.textContent = msg.content;

    this.scrollToBottom();
  }

  private renderStreamingMessage(): HTMLElement {
    if (!this.messagesEl) {
      throw new Error('Messages container not initialized');
    }

    const welcome = this.messagesEl.querySelector('.qnclawdian-welcome');
    if (welcome) welcome.remove();

    const msgEl = this.messagesEl.createDiv({
      cls: 'qnclawdian-message qnclawdian-message-assistant qnclawdian-streaming',
    });

    const roleLabel = msgEl.createDiv({ cls: 'qnclawdian-message-role' });
    roleLabel.textContent = '🧠 QNClawdian';

    msgEl.createDiv({ cls: 'qnclawdian-message-content' });

    return msgEl;
  }

  private updateStreamingMessage(msgEl: HTMLElement, content: string): void {
    const contentEl = msgEl.querySelector('.qnclawdian-message-content');
    if (contentEl) {
      contentEl.textContent = content;
    }
    this.scrollToBottom();
  }

  private renderSystemMessage(text: string): void {
    if (!this.messagesEl) return;
    const msgEl = this.messagesEl.createDiv({
      cls: 'qnclawdian-message qnclawdian-message-system',
    });
    msgEl.textContent = text;
  }

  private updateStatus(model?: string): void {
    if (!this.statusEl) return;
    const displayModel = model || this.plugin.settings.model;
    this.statusEl.textContent = getModelLabel(displayModel);
  }

  private scrollToBottom(): void {
    if (this.messagesEl) {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }
  }
}

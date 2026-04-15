/**
 * SettingTab — Settings panel for QNClawdian.
 *
 * Provides configuration for:
 * - Connection (Gateway URL, Ollama URL)
 * - Model selection
 * - Temperature / max tokens
 * - User preferences
 */

import type { App } from 'obsidian';
import { Notice, PluginSettingTab, Setting } from 'obsidian';

import type QNClawdianPlugin from '../main';
import { DEFAULT_MODEL_OPTIONS } from './models';

export class SettingTab extends PluginSettingTab {
  plugin: QNClawdianPlugin;

  constructor(app: App, plugin: QNClawdianPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'QNClawdian Settings' });
    containerEl.createEl('p', {
      text: 'Brain-inspired AI assistant for Obsidian. By Q & N.',
      cls: 'setting-item-description',
    });

    // =====================================================================
    // Connection
    // =====================================================================

    containerEl.createEl('h3', { text: '🔗 Connection' });

    new Setting(containerEl)
      .setName('Use OpenClaw Gateway')
      .setDesc('Route requests through OpenClaw Proxy Gateway (recommended)')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useGateway)
          .onChange(async (value) => {
            this.plugin.settings.useGateway = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Gateway URL')
      .setDesc('OpenClaw Proxy Gateway endpoint')
      .addText((text) =>
        text
          .setPlaceholder('http://localhost:8899')
          .setValue(this.plugin.settings.gatewayUrl)
          .onChange(async (value) => {
            this.plugin.settings.gatewayUrl = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Ollama URL')
      .setDesc('Direct Ollama server endpoint (used when Gateway is disabled)')
      .addText((text) =>
        text
          .setPlaceholder('http://localhost:11434')
          .setValue(this.plugin.settings.ollamaUrl)
          .onChange(async (value) => {
            this.plugin.settings.ollamaUrl = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Test connection')
      .setDesc('Verify connectivity to the AI backend')
      .addButton((btn) =>
        btn.setButtonText('Test').onClick(async () => {
          btn.setButtonText('Testing...');
          btn.setDisabled(true);

          try {
            const { OpenClawProvider } = await import(
              '../providers/OpenClawProvider'
            );
            const provider = new OpenClawProvider(
              this.plugin.settings,
              '',
            );
            const ok = await provider.testConnection();

            if (ok) {
              new Notice('✅ Connection successful!');
            } else {
              new Notice('❌ Connection failed. Check your settings.');
            }
          } catch (error) {
            new Notice(`❌ Connection error: ${error}`);
          } finally {
            btn.setButtonText('Test');
            btn.setDisabled(false);
          }
        }),
      );

    // =====================================================================
    // Model
    // =====================================================================

    containerEl.createEl('h3', { text: '🤖 Model' });

    new Setting(containerEl)
      .setName('Default model')
      .setDesc('Model to use for chat')
      .addDropdown((dropdown) => {
        // Local models
        dropdown.addOption('', '── Local Models ──');
        for (const opt of DEFAULT_MODEL_OPTIONS.filter(
          (o) => o.group === 'local',
        )) {
          dropdown.addOption(opt.value, `${opt.label} — ${opt.description}`);
        }
        // Cloud models
        dropdown.addOption('', '── Cloud Models ──');
        for (const opt of DEFAULT_MODEL_OPTIONS.filter(
          (o) => o.group === 'cloud',
        )) {
          dropdown.addOption(opt.value, `${opt.label} — ${opt.description}`);
        }

        dropdown.setValue(this.plugin.settings.model);
        dropdown.onChange(async (value) => {
          if (value) {
            this.plugin.settings.model = value;
            await this.plugin.saveSettings();
          }
        });
      });

    new Setting(containerEl)
      .setName('Temperature')
      .setDesc('Controls randomness (0.0 = deterministic, 1.0 = creative)')
      .addSlider((slider) =>
        slider
          .setLimits(0, 1, 0.1)
          .setValue(this.plugin.settings.temperature)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.temperature = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Max tokens')
      .setDesc('Maximum number of tokens in the response')
      .addText((text) =>
        text
          .setPlaceholder('4096')
          .setValue(String(this.plugin.settings.maxTokens))
          .onChange(async (value) => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.maxTokens = num;
              await this.plugin.saveSettings();
            }
          }),
      );

    // =====================================================================
    // Memory (M3 — future, show toggles now)
    // =====================================================================

    containerEl.createEl('h3', { text: '🧠 Memory (coming soon)' });

    new Setting(containerEl)
      .setName('Auto-generate wikilinks')
      .setDesc('Automatically create [[wikilinks]] in AI responses (M3)')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableAutoWikilinks)
          .onChange(async (value) => {
            this.plugin.settings.enableAutoWikilinks = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Enable memory search')
      .setDesc('Search your vault during conversations (M3)')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableMemorySearch)
          .onChange(async (value) => {
            this.plugin.settings.enableMemorySearch = value;
            await this.plugin.saveSettings();
          }),
      );

    // =====================================================================
    // User
    // =====================================================================

    containerEl.createEl('h3', { text: '👤 User' });

    new Setting(containerEl)
      .setName('Your name')
      .setDesc('Name used in system prompt context')
      .addText((text) =>
        text
          .setPlaceholder('Enter your name')
          .setValue(this.plugin.settings.userName)
          .onChange(async (value) => {
            this.plugin.settings.userName = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Custom system prompt')
      .setDesc('Additional instructions appended to the system prompt')
      .addTextArea((text) =>
        text
          .setPlaceholder('Add custom instructions...')
          .setValue(this.plugin.settings.systemPrompt)
          .onChange(async (value) => {
            this.plugin.settings.systemPrompt = value;
            await this.plugin.saveSettings();
          }),
      );

    // =====================================================================
    // UI
    // =====================================================================

    containerEl.createEl('h3', { text: '🎨 Interface' });

    new Setting(containerEl)
      .setName('Open in main tab')
      .setDesc('Open chat view as a main tab instead of sidebar')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.openInMainTab)
          .onChange(async (value) => {
            this.plugin.settings.openInMainTab = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}

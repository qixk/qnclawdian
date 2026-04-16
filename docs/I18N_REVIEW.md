# QNClawdian i18n 国际化审查报告（v2 深度版）

**审查人**: 小秘（行政秘书）  
**审查时间**: 2026-04-16 00:37  
**审查范围**: 全部 `src/` 目录 `.ts` 文件  
**请求来源**: 凯哥直接指令 🔴  
**审查版本**: v2（含硬编码字符串扫描）

---

## 📊 总览

| 项目 | 状态 | 说明 |
|------|------|------|
| i18n/index.ts 完整性 | ✅ 通过 | 38 个 key × 4 语言 = 152/152 |
| 中文翻译质量 | ⭐⭐⭐⭐⭐ | 本土化程度最高 |
| 日文翻译质量 | ⭐⭐⭐⭐ | 2 处可优化 |
| 韩文翻译质量 | ⭐⭐⭐⭐ | 1 处不自然 |
| detectLocale() 逻辑 | ✅ 正确 | 但有改进空间 |
| 硬编码英文字符串 | 🔴🔴🔴 严重 | **50+ 处硬编码，2 个文件完全未国际化** |

### 🔴 核心发现
**i18n/index.ts 本身没问题，但项目中存在大量未国际化的硬编码英文字符串！**

---

## 1. i18n/index.ts 完整性检查（38 个 key）

### ✅ 全部通过

TypeScript `I18nStrings` 接口定义了 38 个 key，4 种语言对象（en/zh/ja/ko）全部实现。编译期即可捕获缺失。

<details>
<summary>完整 Key 清单（点击展开）</summary>

| # | Key | en | zh | ja | ko |
|---|-----|----|----|----|----|
| 1 | pluginName | ✅ | ✅ | ✅ | ✅ |
| 2 | openChat | ✅ | ✅ | ✅ | ✅ |
| 3 | newConversation | ✅ | ✅ | ✅ | ✅ |
| 4 | chatTitle | ✅ | ✅ | ✅ | ✅ |
| 5 | welcomeTitle | ✅ | ✅ | ✅ | ✅ |
| 6 | welcomeDesc | ✅ | ✅ | ✅ | ✅ |
| 7 | welcomeFeature1 | ✅ | ✅ | ✅ | ✅ |
| 8 | welcomeFeature2 | ✅ | ✅ | ✅ | ✅ |
| 9 | welcomeFeature3 | ✅ | ✅ | ✅ | ✅ |
| 10 | welcomeFeature4 | ✅ | ✅ | ✅ | ✅ |
| 11 | inputPlaceholder | ✅ | ✅ | ✅ | ✅ |
| 12 | send | ✅ | ✅ | ✅ | ✅ |
| 13 | thinking | ✅ | ✅ | ✅ | ✅ |
| 14 | clearChat | ✅ | ✅ | ✅ | ✅ |
| 15 | copyMessage | ✅ | ✅ | ✅ | ✅ |
| 16 | copied | ✅ | ✅ | ✅ | ✅ |
| 17 | settings | ✅ | ✅ | ✅ | ✅ |
| 18 | connection | ✅ | ✅ | ✅ | ✅ |
| 19 | connectionMode | ✅ | ✅ | ✅ | ✅ |
| 20 | gatewayUrl | ✅ | ✅ | ✅ | ✅ |
| 21 | ollamaUrl | ✅ | ✅ | ✅ | ✅ |
| 22 | modelSelection | ✅ | ✅ | ✅ | ✅ |
| 23 | model | ✅ | ✅ | ✅ | ✅ |
| 24 | temperature | ✅ | ✅ | ✅ | ✅ |
| 25 | testConnection | ✅ | ✅ | ✅ | ✅ |
| 26 | testing | ✅ | ✅ | ✅ | ✅ |
| 27 | connectionSuccess | ✅ | ✅ | ✅ | ✅ |
| 28 | connectionFailed | ✅ | ✅ | ✅ | ✅ |
| 29 | connectionError | ✅ | ✅ | ✅ | ✅ |
| 30 | memoryEnabled | ✅ | ✅ | ✅ | ✅ |
| 31 | memoryEnabledDesc | ✅ | ✅ | ✅ | ✅ |
| 32 | autoLinks | ✅ | ✅ | ✅ | ✅ |
| 33 | autoLinksDesc | ✅ | ✅ | ✅ | ✅ |
| 34 | selectAgent | ✅ | ✅ | ✅ | ✅ |
| 35 | agentDefault | ✅ | ✅ | ✅ | ✅ |
| 36 | errorNoConnection | ✅ | ✅ | ✅ | ✅ |
| 37 | errorTimeout | ✅ | ✅ | ✅ | ✅ |
| 38 | errorUnknown | ✅ | ✅ | ✅ | ✅ |

</details>

---

## 2. 翻译质量评估

### 🇨🇳 中文 (zh) — ⭐⭐⭐⭐⭐ 优秀

- 本土化程度最高，用语地道无翻译腔
- `inputPlaceholder` 最完整（含 Shift+Enter 换行提示，其他 3 语言缺失）
- `welcomeFeature3` 带脑区示例（海马体/前额叶/杏仁核），信息量最丰富
- **无需修改**

### 🇯🇵 日文 (ja) — ⭐⭐⭐⭐ 良好

整体质量好，敬语使用恰当。2 处可优化：

| Key | 当前翻译 | 建议改进 | 原因 |
|-----|---------|---------|------|
| welcomeDesc | `ボールトに組み込まれた脳型AIアシスタント` | `ボールト内蔵の脳型AIアシスタント` | 更简洁自然，减少被动语态 |
| memoryEnabledDesc | `ボールトの記憶を会話に読み込む` | `ボールトのメモリを会話に読み込む` | 软件语境下「メモリ」比「記憶」更准确 |

### 🇰🇷 韩文 (ko) — ⭐⭐⭐⭐ 良好

整体流畅，敬语体使用正确。1 处需修改：

| Key | 当前翻译 | 建议改进 | 原因 |
|-----|---------|---------|------|
| welcomeDesc | `볼트에 내장된 **뇌 영감** AI 어시스턴트` | `볼트에 내장된 **뇌 모방형** AI 어시스턴트` | "뇌 영감"(brain inspiration) 语义不通，"뇌 모방형"(brain-inspired type) 更准确自然 |

### 跨语言一致性问题

| 问题 | 影响 | 建议 |
|------|------|------|
| `inputPlaceholder` 中文有 Shift+Enter 提示，其他 3 语言没有 | 低 | 统一添加或去掉 |
| `welcomeFeature3` 中文有脑区示例，其他 3 语言没有 | 低 | 建议统一添加 |

---

## 3. detectLocale() 函数分析

```typescript
export function detectLocale(): Locale {
  const obsLang: string = window?.localStorage?.getItem('language') || navigator?.language || 'en';
  if (obsLang.startsWith('zh')) return 'zh';
  if (obsLang.startsWith('ja')) return 'ja';
  if (obsLang.startsWith('ko')) return 'ko';
  return 'en';
}
```

### ✅ 逻辑正确

- 优先读 Obsidian 设置 → fallback 到浏览器语言 → 默认英文
- `startsWith('zh')` 正确覆盖 `zh-CN`、`zh-TW`、`zh-Hans` 等变体

### ⚠️ 改进建议

| 问题 | 严重性 | 建议 |
|------|--------|------|
| `@ts-ignore` 注释 | 低 | Obsidian API 变更可能导致静默失败，但 `navigator.language` fallback 兜底 |
| 无法区分 `zh-TW`（繁体） | 低 | 当前仅有简体中文，如未来需繁体可扩展 |
| 无用户手动切换接口 | 中 | 建议在设置页添加语言选择下拉框 |

---

## 4. 🔴🔴🔴 硬编码英文字符串扫描（重大发现）

### 严重程度：高

**i18n/index.ts 定义了 38 个翻译字符串，但项目中有 50+ 处用户可见的英文字符串直接硬编码，完全未调用 `t()` 函数。**

---

### 4.1 SettingTab.ts — 🔴 完全未国际化

**未 import `t` 函数**，所有 30+ 处 `.setName()` / `.setDesc()` / `.setButtonText()` 全部硬编码英文。

| 行号 | 硬编码内容 | 应使用的 i18n key |
|------|-----------|------------------|
| 30 | `'QNClawdian Settings'` | `t('settings')` ✅ 已有 |
| 31-33 | `'Brain-inspired AI assistant...'` | 需新增 key |
| 39 | `'🔗 Connection'` | `t('connection')` ✅ 已有 |
| 42 | `'Use OpenClaw Gateway'` | `t('connectionMode')` 或新增 |
| 43 | `'Route requests through...'` | 需新增 key |
| 54 | `'Gateway URL'` | `t('gatewayUrl')` ✅ 已有 |
| 55 | `'OpenClaw Proxy Gateway endpoint'` | 需新增 key |
| 67 | `'Ollama URL'` | `t('ollamaUrl')` ✅ 已有 |
| 68 | `'Direct Ollama server...'` | 需新增 key |
| 80 | `'Test connection'` | `t('testConnection')` ✅ 已有 |
| 81 | `'Verify connectivity...'` | 需新增 key |
| 83 | `'Test'` button | `t('testConnection')` ✅ 已有 |
| 84 | `'Testing...'` | `t('testing')` ✅ 已有 |
| 93 | `'✅ Connection successful!'` | `t('connectionSuccess')` ✅ 已有 |
| 95 | `'❌ Connection failed...'` | `t('connectionFailed')` ✅ 已有 |
| 98 | `'❌ Connection error: ...'` | `t('connectionError')` ✅ 已有 |
| 105 | `'Test'` button reset | `t('testConnection')` ✅ 已有 |
| 113 | `'🤖 Model'` | `t('modelSelection')` ✅ 已有 |
| 118 | `'Default model'` | `t('model')` ✅ 已有 |
| 119 | `'Model to use for chat'` | 需新增 key |
| 122 | `'── Local Models ──'` | 需新增 key: `localModelsGroup` |
| 131 | `'── Cloud Models ──'` | 需新增 key: `cloudModelsGroup` |
| 156 | `'Temperature'` | `t('temperature')` ✅ 已有 |
| 157 | `'Controls randomness...'` | 需新增 key |
| 170 | `'Max tokens'` | 需新增 key: `maxTokens` |
| 171 | `'Maximum number of...'` | 需新增 key: `maxTokensDesc` |
| 188 | `'🧠 Memory (coming soon)'` | 需新增 key |
| 192 | `'Auto-generate wikilinks'` | `t('autoLinks')` ✅ 已有 |
| 193 | `'Automatically create...'` | `t('autoLinksDesc')` ✅ 已有 |
| 204 | `'Enable memory search'` | `t('memoryEnabled')` ✅ 已有 |
| 205 | `'Search your vault...'` | `t('memoryEnabledDesc')` ✅ 已有 |
| 218 | `'👤 User'` | 需新增 key |
| 222 | `'Your name'` | 需新增 key: `userName` |
| 223 | `'Name used in system...'` | 需新增 key |
| 226 | `'Enter your name'` | 需新增 key |
| 235 | `'Custom system prompt'` | 需新增 key |
| 236 | `'Additional instructions...'` | 需新增 key |
| 239 | `'Add custom instructions...'` | 需新增 key |
| 250 | `'🎨 Interface'` | 需新增 key |
| 254 | `'Open in main tab'` | 需新增 key |
| 255 | `'Open chat view...'` | 需新增 key |

**统计**: 约 35 处硬编码，其中 ~15 处已有对应 i18n key 但未使用，~20 处需新增 key。

---

### 4.2 ChatView.ts — 🟡 部分国际化

**已 import `t` 函数**，欢迎页和输入框使用了 `t()`，但仍有 ~10 处遗漏：

| 行号 | 硬编码内容 | 建议 |
|------|-----------|------|
| 98 | `'New conversation'` (aria-label) | `t('newConversation')` ✅ 已有 |
| 165 | `'⚠️ Cannot connect to AI backend...'` | `t('errorNoConnection')` 或新增 |
| 173 | `'Input not ready'` (Notice) | 需新增 key |
| 178 | `'Not connected. Check settings.'` (Notice) | `t('errorNoConnection')` ✅ 已有 |
| 182 | `'Waiting for response...'` (Notice) | 需新增 key |
| 282 | `` `Model: ${...}` `` (welcome model) | 需新增 key: `welcomeModel` |
| 285 | `'By Q & N'` (welcome author) | 可保留不翻译（品牌名） |
| 327 | `'👤 You'` / `'🧠 QNClawdian'` | 需新增 key: `roleUser` / `roleAssistant` |
| 354 | `'🧠 QNClawdian'` (streaming) | 需新增 key: `roleAssistant` |
| 393 | `'Failed to copy'` (Notice) | 需新增 key |

---

### 4.3 main.ts — 🔴 完全未国际化

**未 import `t` 函数**。

| 行号 | 硬编码内容 | 建议 |
|------|-----------|------|
| 57 | `'Open QNClawdian'` (ribbon tooltip) | `t('openChat')` ✅ 已有 |
| 62 | `'Open chat view'` (command name) | `t('openChat')` ✅ 已有 |
| 67 | `'New conversation'` (command name) | `t('newConversation')` ✅ 已有 |
| 69 | `'New QNClawdian conversation'` (Notice) | `t('newConversation')` ✅ 已有 |

**这 4 处全部已有对应 i18n key，只是没调用！**

---

### 4.4 OpenClawProvider.ts — 🟢 可接受

错误消息为技术性内容（`Gateway error 500: ...`），不翻译是合理的，因为用户需要原始错误信息来排查问题。

---

### 4.5 models.ts — 🟡 待定

模型描述（`'Google Gemma 4, strong all-around (18GB)'`）和分组标签（`'── Local Models ──'`）为英文。这属于技术性内容，是否翻译取决于产品定位：
- 如面向开发者 → 保持英文可接受
- 如面向普通用户 → 应翻译

---

## 5. 需新增的 i18n key 汇总

以下 key 需要添加到 `I18nStrings` 接口和 4 个语言对象中：

```typescript
// Settings - descriptions
settingsSubtitle: string;        // 'Brain-inspired AI assistant for Obsidian. By Q & N.'
gatewayUrlDesc: string;          // 'OpenClaw Proxy Gateway endpoint'
useGateway: string;              // 'Use OpenClaw Gateway'
useGatewayDesc: string;          // 'Route requests through OpenClaw Proxy Gateway (recommended)'
ollamaUrlDesc: string;           // 'Direct Ollama server endpoint...'
testConnectionDesc: string;      // 'Verify connectivity to the AI backend'
testButton: string;              // 'Test'
modelDesc: string;               // 'Model to use for chat'
localModelsGroup: string;        // '── Local Models ──'
cloudModelsGroup: string;        // '── Cloud Models ──'
temperatureDesc: string;         // 'Controls randomness...'
maxTokens: string;               // 'Max tokens'
maxTokensDesc: string;           // 'Maximum number of tokens in the response'
memorySectionTitle: string;      // '🧠 Memory (coming soon)'
autoLinksDescFull: string;       // 'Automatically create [[wikilinks]] in AI responses (M3)'
memoryEnabledDescFull: string;   // 'Search your vault during conversations (M3)'
userSection: string;             // '👤 User'
userName: string;                // 'Your name'
userNameDesc: string;            // 'Name used in system prompt context'
userNamePlaceholder: string;     // 'Enter your name'
customSystemPrompt: string;      // 'Custom system prompt'
customSystemPromptDesc: string;  // 'Additional instructions...'
customSystemPromptPlaceholder: string; // 'Add custom instructions...'
interfaceSection: string;        // '🎨 Interface'
openInMainTab: string;           // 'Open in main tab'
openInMainTabDesc: string;       // 'Open chat view as a main tab...'

// ChatView
roleUser: string;                // '👤 You'
roleAssistant: string;           // '🧠 QNClawdian'
waitingForResponse: string;      // 'Waiting for response...'
inputNotReady: string;           // 'Input not ready'
cannotConnect: string;           // '⚠️ Cannot connect to AI backend...'
failedToCopy: string;            // 'Failed to copy'
welcomeModel: string;            // 'Model: '
```

**新增 key 数量**: 约 30 个

---

## 6. 修复优先级建议

| 优先级 | 文件 | 工作量 | 说明 |
|--------|------|--------|------|
| 🔴 P0 | `main.ts` | 小（4 处） | 已有 key，只需 import + 替换 |
| 🔴 P0 | `ChatView.ts` 遗漏 | 小（10 处） | 部分已有 key |
| 🟡 P1 | `SettingTab.ts` | 中（35 处） | 需新增 ~20 个 key + 4 语言翻译 |
| 🟢 P2 | `models.ts` | 小 | 模型描述翻译，非必须 |
| 🟢 P2 | 语言切换设置项 | 小 | 在设置页添加手动切换 |

---

## 7. 总结

### ✅ 通过项
- [x] i18n/index.ts 38 个 key × 4 语言 = 152/152 全部完整
- [x] TypeScript 接口强制保障编译期完整性
- [x] detectLocale() 逻辑正确
- [x] Fallback 机制健全（当前语言 → en → key 本身）
- [x] 中文翻译优秀
- [x] 日文/韩文翻译可用

### 🔴 阻塞项
1. **SettingTab.ts 完全未国际化** — 35 处硬编码英文，日/韩/中文用户看到全英文设置页
2. **main.ts 未国际化** — 4 处硬编码，已有对应 key 但未调用
3. **ChatView.ts 部分遗漏** — 10 处硬编码，包括 `'👤 You'` 角色标签

### 🟡 非阻塞改进
1. 韩文 `welcomeDesc`：`뇌 영감` → `뇌 모방형`
2. 日文 `welcomeDesc`：`組み込まれた` → `内蔵の`
3. `inputPlaceholder` Shift+Enter 提示跨语言不一致
4. 建议在设置页添加语言手动切换下拉框

---

*审查完成 · 2026-04-16 00:37 · 小秘（行政秘书）*  
*凯哥直接指令 · 全量扫描完成*

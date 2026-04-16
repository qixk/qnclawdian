# 经验日志 (Lessons Learned)

> 每轮执行后自动追加踩坑记录。新一轮会读取此文件避免重复犯错。

---

## S001: 当前笔记内容注入对话 (2026-04-16)

### 踩坑点
1. **原有代码只传了文件路径（`activeFile?.path`）到 provider**，然后把路径追加到用户消息里（`prompt += \`\n\n<current_note>\n${currentNotePath}\n</current_note>\``）。这是错误做法：(a) AI 只看到路径没有内容，(b) 路径出现在用户消息中，污染聊天记录。
2. **注入点必须是 system prompt**，不是 user message。如果加到 user message，会显示在聊天界面里。

### 正确方案
- `ChatView.ts`：用 `this.app.vault.cachedRead(activeFile)` 读取内容 → 构造 `noteContext` 对象 → 传给 provider
- `OpenClawProvider.ts`：新增 `buildEffectiveSystemPrompt(noteContext?)` 方法，把笔记内容拼到 system prompt 末尾
- 截断逻辑放在 `ChatView`（读取侧），因为那里能弹 `Notice` 通知用户
- 只处理 `.md` 文件（`activeFile.extension === 'md'`），其他类型文件跳过

### 要点
- `vault.cachedRead()` 比 `vault.read()` 快，用缓存版本即可
- `queryOpenAI` 和 `queryOllama` 都需要传 `noteContext`，不能只改一个
- `tsc --noEmit` 零错误 + `npm run build` 成功 = 可信

# 📚 QNClawdian 经验日志 (lessons.md)

> **Roo 框架核心文件**：每轮循环开始前必须读取，避免重复踩坑
> **规则**：只记教训，不记成功。格式：坑 → 原因 → 解决方案

---

## M1 阶段踩坑记录（来自 TEST_REPORT.md）

### L001: 编辑 TS 后必须 tsc
- **坑**: 改了代码不跑 `tsc --noEmit`，构建时才发现类型错误
- **原因**: 偷懒跳过验证步骤
- **方案**: 每次改代码后**立即** `npx tsc --noEmit`，不要等到最后

### L002: textContent vs MarkdownRenderer
- **坑**: 导入了 MarkdownRenderer 但用 textContent 显示，AI 回复全是纯文本
- **原因**: 安全考虑用了 textContent（防 XSS），但忘了 AI 回复需要富文本
- **方案**: AI 回复用 `MarkdownRenderer.render()`，用户消息用 `textContent`

### L003: Ollama thinking 字段
- **坑**: gemma4:26b 返回 `thinking` 字段，类型定义没写，内容被丢弃
- **原因**: 只看了 Ollama 文档的基础字段，没测试实际返回
- **方案**: `OllamaStreamChunk.message` 必须包含 `thinking?: string`

### L004: 模型下拉空值选项
- **坑**: 用空字符串 `''` 做分组标题，用户可以选中它导致 model 变空
- **原因**: Obsidian dropdown API 没有 optgroup 概念
- **方案**: 使用 HTML `<optgroup>` 标签，或在 onChange 中过滤空值

### L005: 流式请求无超时
- **坑**: testConnection 有 5s 超时，但 streaming fetch 没有超时保护
- **原因**: 觉得流式请求"会一直有数据回来"，忽略了网络中断场景
- **方案**: `AbortSignal.any([controller.signal, AbortSignal.timeout(120_000)])`

### L006: CSS 硬编码颜色
- **坑**: 在 CSS 中写死 `color: #333`，暗色主题下看不见
- **原因**: 不了解 Obsidian 的主题系统
- **方案**: 全部使用 `--text-normal`, `--background-primary` 等 CSS 变量

### L007: 中文输入法
- **坑**: 按 Enter 发送时，中文输入法正在输入的拼音也会被发出去
- **原因**: 没处理 IME composition 事件
- **方案**: `compositionstart` 设标记，`compositionend` 清标记，Enter 检查标记

### L008: 死代码不清理
- **坑**: query() 方法构建了 messages 数组但没用，两个子方法各自重建
- **原因**: 重构时改了子方法但忘了清理父方法
- **方案**: 每次重构后检查调用链，删除不再使用的代码

### L009: 双重事件
- **坑**: generator 自然结束后，外层又 yield 了一个 `done` 事件
- **原因**: 不确定 generator 会不会自动发 done，保险加了一个
- **方案**: generator `return` 就是结束，不需要额外 yield done

### L010: 构建产物位置
- **坑**: `npm run build` 输出到项目根目录，不是 dist/
- **原因**: esbuild 配置的 outfile 指向根目录
- **方案**: 确认 `esbuild.config.mjs` 中 outfile 路径正确

---

## 执行规则

### 每轮开始前
1. 读取本文件
2. 读取 prd.json 找到当前任务
3. 检查依赖任务是否完成

### 每轮结束后
1. 踩到新坑 → 追加到本文件
2. `tsc --noEmit` + `npm run build` 必须通过
3. 更新 prd.json 状态

---

*创建: 2026-04-16 09:35*
*最后更新: 2026-04-16 09:35*
*条目数: 10*

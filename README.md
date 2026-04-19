# QNClawdian — Brain-inspired AI Assistant for Obsidian

> An intelligent AI assistant plugin that lives inside your Obsidian vault.
> 
> 一款驻留在 Obsidian 知识库中的智能 AI 助手插件。

---

## ✨ Features / 核心功能

### 💬 Conversational AI / 对话式 AI
- Chat with AI directly inside Obsidian / 在 Obsidian 内直接与 AI 对话
- Multi-model support (local Ollama + cloud) / 多模型支持（本地 Ollama + 云端）
- Streaming responses with real-time display / 流式输出实时显示

### 🧠 Smart Memory / 智能记忆
- Auto-save conversation history / 自动保存对话历史
- Session switching and review / 会话切换和回顾
- Bi-directional links with Obsidian notes / 与 Obsidian 笔记双向链接

### 📋 Enhanced Copy / 复制增强
- Copy button on each message / 每条消息复制按钮
- **Mouse text selection + Ctrl/Cmd+C** / **鼠标框选文本直接复制**
- One-click copy all conversations / 全部对话一键复制

---

## 📦 Installation / 安装

### Manual Install / 手动安装

1. Download `main.js`, `styles.css`, `manifest.json`
   
   下载 `main.js`、`styles.css`、`manifest.json`

2. Place them in `.obsidian/plugins/qnclawdian/`
   
   放入 Obsidian 仓库的 `.obsidian/plugins/qnclawdian/` 目录

3. Enable in Obsidian Settings → Community Plugins
   
   在 Obsidian 设置 → 第三方插件中启用

---

## 🚀 Usage / 使用方法

### Open the Plugin / 打开插件
- Click the QNClawdian icon in the sidebar / 点击侧边栏 QNClawdian 图标
- Or use Command Palette (Ctrl/Cmd+P) → "QNClawdian: Open Chat" / 或使用命令面板

### Start Chatting / 开始对话
- Type your question in the input box / 在输入框输入问题
- Press Enter to send (Shift+Enter for newline) / 按 Enter 发送（Shift+Enter 换行）

### Copy Content / 复制内容
- **Single message**: Hover → click "Copy" button / **单条复制**：悬停 → 点击复制按钮
- **Select text**: Mouse select → Ctrl/Cmd+C / **框选复制**：鼠标选中 → Ctrl/Cmd+C
- **Copy all**: Click "Copy All" in header / **全部复制**：点击右上角"复制全部"

---

## 🏗️ Architecture / 技术架构

```
QNClawdian/
├── main.ts              # Plugin entry / 插件入口
├── src/
│   ├── views/
│   │   └── ChatView.ts  # Chat view / 聊天视图
│   ├── services/        # Service layer / 服务层
│   ├── providers/       # Data providers / 数据提供
│   └── settings/        # Settings / 设置管理
├── styles.css           # Styles / 样式文件
└── manifest.json        # Plugin manifest / 插件清单
```

**Tech Stack / 技术栈**:
- TypeScript with full type hints / TypeScript 完整类型提示
- Native Obsidian API / 原生 Obsidian API
- Responsive design adapting to Obsidian themes / 响应式设计适配 Obsidian 主题
- Streaming output / 流式输出

---

## 📝 Changelog / 更新日志

### v0.1.1 (2026-04-19)
- ✅ **Mouse text selection for copy** / **鼠标框选文本直接复制**
- ✅ Text selection highlight style / 选中文本高亮样式优化
- ✅ Force override Obsidian global styles / 强制覆盖 Obsidian 全局样式

### v0.1.0 (2026-04-16)
- ✅ Basic chat functionality / 基础对话功能
- ✅ Session history management / 历史会话管理
- ✅ Single message copy button / 单条消息复制按钮
- ✅ Copy all functionality / 全部复制功能

---

## 🗺️ Roadmap / 开发计划

### P1 — In Progress / 进行中
- [ ] Note references with [[wikilinks]] / 笔记引用（[[双向链接]]）
- [ ] Export conversation as note / 对话导出为笔记
- [ ] Custom prompt templates / 自定义提示词模板

### P2 — Planned / 计划中
- [ ] Parallel sessions / 多会话并行
- [ ] Voice input / 语音输入
- [ ] Image recognition / 图片识别

---

## 🤝 Contributing / 贡献与反馈

- **GitHub**: https://github.com/qixk/qnclawdian
- **Issues**: Feel free to submit issues and PRs / 欢迎提交 Issue 和 PR
- **Authors**: Q & N

---

## 📄 License

MIT

---

*Made with ❤️ by Q & N*

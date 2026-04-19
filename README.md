# QNClawdian — Obsidian AI 助手插件

> 版本：0.1.0  
> 作者：Q & N  
> 开发：大拿马（OpenClaw 天团）  
> 定位：Brain-inspired AI assistant for Obsidian

---

## 一、核心功能

### 1. 对话式 AI 助手
- 💬 与 AI 自然对话，直接在 Obsidian 内完成
- 🧠 支持多种模型（本地 Ollama + 云端）
- 📝 对话内容自动保存到 Obsidian

### 2. 智能记忆系统
- 📚 自动记录对话历史
- 🔍 支持会话切换和回顾
- 🔗 与 Obsidian 笔记双向链接

### 3. 复制增强功能（2026-04-19 更新）
- 📋 单条消息复制按钮
- 🖱️ **鼠标框选文本直接复制**（Ctrl+C）
- 📄 全部对话内容一键复制

---

## 二、安装方法

### 方式 1：手动安装
1. 下载插件文件（`main.js`, `styles.css`, `manifest.json`）
2. 放入 Obsidian 仓库的 `.obsidian/plugins/qnclawdian/` 目录
3. 在 Obsidian 设置 → 第三方插件 中启用

### 方式 2：Git 克隆
```bash
cd ~/your-obsidian-vault/.obsidian/plugins/
git clone https://github.com/your-repo/qnclawdian.git
```

---

## 三、使用方法

### 3.1 打开插件
1. Obsidian 左侧边栏 → 点击 QNClawdian 图标
2. 或使用命令面板（Ctrl/Cmd+P）→ "QNClawdian: Open Chat"

### 3.2 开始对话
1. 在底部输入框输入问题
2. 按 Enter 发送（Shift+Enter 换行）
3. AI 回复会显示在对话区域

### 3.3 复制内容
- **单条复制**：鼠标悬停消息 → 点击"复制"按钮
- **框选复制**：用鼠标选中任意文本 → Ctrl/Cmd+C
- **全部复制**：点击右上角"复制全部"按钮

### 3.4 切换模型
- 点击顶部模型选择器
- 选择本地模型（Ollama）或云端模型

---

## 四、技术架构

### 4.1 组件结构
```
QNClawdian/
├── main.ts              # 插件入口
├── src/
│   ├── views/
│   │   └── ChatView.ts  # 聊天视图
│   ├── services/        # 服务层
│   ├── providers/       # 数据提供
│   └── settings/        # 设置管理
├── styles.css           # 样式文件
└── manifest.json        # 插件清单
```

### 4.2 核心特性
- **TypeScript**：完整类型提示
- **Obsidian API**：原生插件开发
- **响应式设计**：适配 Obsidian 主题
- **流式输出**：实时显示 AI 回复

---

## 五、更新日志

### v0.1.0（2026-04-19）
- ✅ 基础对话功能
- ✅ 历史会话管理
- ✅ 单条消息复制按钮
- ✅ 全部复制功能

### v0.1.1（2026-04-19 更新）
- ✅ **鼠标框选文本直接复制**
- ✅ 选中文本高亮样式优化
- ✅ 强制覆盖 Obsidian 全局样式（!important）

---

## 六、常见问题

### Q: 为什么文本无法选中？
A: v0.1.1 已修复。使用 `user-select: text !important` 强制启用文本选择。

### Q: 复制按钮不显示？
A: 鼠标悬停在消息上才会显示。v0.1.0 后改为悬停显示，避免界面杂乱。

### Q: 支持哪些模型？
A: 支持所有 OpenClaw 配置的模型，包括：
- 本地 Ollama（qwen2.5-coder:14b, llama3.1:8b, 等）
- 云端模型（百炼 qwen3.5-plus, 等）

---

## 七、开发计划

### P0（已完成）
- [x] 基础对话
- [x] 历史管理
- [x] 复制功能

### P1（进行中）
- [ ] 笔记引用（[[双向链接]]）
- [ ] 对话导出为笔记
- [ ] 自定义提示词模板

### P2（计划中）
- [ ] 多会话并行
- [ ] 语音输入
- [ ] 图片识别

---

## 八、贡献与反馈

- GitHub: [待添加]
- 问题反馈：飞书 @大拿马
- 贡献者：Q & N & 大拿马

---

*最后更新：2026-04-19 02:45*

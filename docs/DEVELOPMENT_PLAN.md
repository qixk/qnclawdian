# QNClawdian 开发计划

> **QNClawdian** = Obsidian + OpenClaw + 仿生记忆
> By Q & N

## 1. 项目概述

QNClawdian 是一款 Obsidian 插件，将 OpenClaw AI Agent 深度嵌入 Obsidian 知识库。
它不仅仅是一个聊天窗口，更是一个仿生记忆系统——模仿人脑的记忆区域分类、自动建立知识链接、与 Obsidian 图谱联动，帮助用户构建真正的"第二大脑"。

### 核心定位

| 维度 | 说明 |
|------|------|
| **用户** | Obsidian 重度用户、知识管理爱好者 |
| **痛点** | AI 对话与笔记割裂，缺乏上下文感知 |
| **方案** | 侧边栏聊天 + 自动 wikilink + 记忆区域分类 + 图谱联动 |
| **技术** | TypeScript + Obsidian API + OpenClaw Gateway + Ollama |

---

## 2. 里程碑计划

### M1: 基础聊天功能 🎯 当前阶段

**目标**: 在 Obsidian 侧边栏实现与本地模型的流式聊天

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 侧边栏视图 | 注册 ItemView，Ribbon 图标打开 | P0 |
| OpenClaw Gateway 连接 | HTTP 流式请求 localhost:8899 | P0 |
| Ollama 直连 | 备选连接 localhost:11434 | P0 |
| 流式响应 | SSE (OpenAI) + NDJSON (Ollama) 解析 | P0 |
| 消息渲染 | 用户/助手消息列表 | P0 |
| 设置面板 | Gateway URL、模型选择、连接测试 | P0 |
| 输入框 | 文本输入 + Enter 发送 + Shift+Enter 换行 | P0 |

**验收标准**: 插件加载 → 打开侧边栏 → 输入消息 → 收到流式 AI 回复

### M2: 多 Agent 支持

**目标**: 支持多个 Agent 身份切换，不同 Agent 使用不同模型/提示词

| 功能 | 说明 |
|------|------|
| Agent Tab 切换 | 顶部 Tab 栏切换不同 Agent |
| Agent 配置 | 每个 Agent 独立的模型/系统提示词 |
| 会话隔离 | 每个 Agent 独立会话历史 |
| Agent 列表管理 | 添加/删除/编辑 Agent |

### M3: 记忆增强（仿生记忆）

**目标**: 模仿人脑记忆区域，自动建立知识链接

| 功能 | 说明 |
|------|------|
| 自动 [[]] 链接 | AI 回复自动识别并生成 wikilink |
| 仿生区域分类 | 海马体(短期)→ 前额叶(工作)→ 皮层(长期) |
| 记忆搜索 | 基于 vault 内容的语义搜索 |
| 上下文注入 | 当前笔记内容自动注入对话 |

### M4: 图谱联动

**目标**: AI 对话与 Obsidian 知识图谱深度联动

| 功能 | 说明 |
|------|------|
| REST API 集成 | 通过 Obsidian REST API 操作 vault |
| resolvedLinks | 读取并利用 Obsidian 的链接关系图 |
| 搜索定位 | 从聊天中直接跳转到相关笔记 |
| 图谱高亮 | 对话涉及的笔记在图谱中高亮 |

### M5: 发布准备

**目标**: 完成文档、测试、发布到 Obsidian 社区插件市场

| 功能 | 说明 |
|------|------|
| 完整文档 | README + 使用指南 + API 文档 |
| 单元测试 | 核心逻辑 80%+ 覆盖率 |
| E2E 测试 | 关键流程自动化测试 |
| npm 发布 | 提交到 Obsidian 社区插件仓库 |

---

## 3. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **TypeScript** | ^5.7.0 | 主要开发语言 |
| **Obsidian API** | latest | 插件接口 |
| **esbuild** | ^0.25.0 | 构建打包 |
| **Jest** | ^29.0.0 | 单元测试 |
| **ts-jest** | ^29.0.0 | TypeScript 测试支持 |
| **Node.js** | ^22.0.0 | 运行时 |

---

## 4. 开发环境

### 前置条件

- Node.js >= 22.x
- npm >= 10.x
- Obsidian >= 1.4.5
- OpenClaw Gateway (localhost:8899) 或 Ollama (localhost:11434)

### 目录结构

```
qnclawdian/
├── docs/                          # 文档
│   ├── DEVELOPMENT_PLAN.md        # 开发计划
│   └── TEST_CASES.md              # 测试用例
├── src/                           # 源码
│   ├── main.ts                    # 插件入口
│   ├── views/
│   │   └── ChatView.ts            # 聊天视图
│   ├── providers/
│   │   └── OpenClawProvider.ts    # AI Provider
│   ├── settings/
│   │   └── SettingTab.ts          # 设置面板
│   └── styles.css                 # 样式
├── manifest.json                  # Obsidian 插件清单
├── package.json                   # npm 配置
├── tsconfig.json                  # TypeScript 配置
├── esbuild.config.mjs             # 构建配置
└── .gitignore                     # Git 忽略
```

### 开发流程

```bash
# 开发模式（自动监听变更）
npm run dev

# 生产构建
npm run build

# 运行测试
npm test

# 安装到测试 Vault
cp main.js styles.css manifest.json ~/obsidian-agent-memory/.obsidian/plugins/qnclawdian/
```

---

## 5. 测试策略

### 单元测试

- 框架: Jest + ts-jest
- 覆盖: Provider 逻辑、消息构建、流解析
- 目标: 核心模块 80%+ 覆盖率

### 集成测试

- Provider 连接测试 (mock HTTP)
- 流式响应端到端解析
- 设置读写一致性

### 手动验证

- Obsidian 中加载插件
- 侧边栏交互
- 模型切换
- 连接状态检测

---

## 6. 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |

### 示例

```
feat(chat): add streaming response display
fix(provider): handle SSE parse errors gracefully
docs(readme): add installation instructions
chore(build): update esbuild to 0.25.0
```

---

## 时间线

| 阶段 | 预计周期 | 状态 |
|------|----------|------|
| M1 基础聊天 | 1 周 | 🔨 进行中 |
| M2 多 Agent | 1 周 | ⏳ 待开始 |
| M3 记忆增强 | 2 周 | ⏳ 待开始 |
| M4 图谱联动 | 2 周 | ⏳ 待开始 |
| M5 发布准备 | 1 周 | ⏳ 待开始 |

---

*Created: 2026-04-15*
*Authors: Q & N*

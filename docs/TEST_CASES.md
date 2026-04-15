# QNClawdian M1 测试用例

> M1 基础聊天功能验收测试

## 测试环境

- **Obsidian**: >= 1.4.5
- **Node.js**: >= 22.x
- **后端**: OpenClaw Gateway (localhost:8899) 或 Ollama (localhost:11434)
- **测试 Vault**: ~/obsidian-agent-memory

## 测试用例

| TC | 测试项 | 步骤 | 预期结果 | 状态 |
|----|--------|------|---------|------|
| TC-001 | 插件加载 | 1. 打开 Obsidian<br>2. 进入 Settings → Community Plugins | QNClawdian 出现在已安装插件列表中 | ⏳ |
| TC-002 | 侧边栏打开 | 1. 点击左侧 Ribbon 的 🧠 图标<br>2. 或使用命令面板: QNClawdian: Open chat view | 右侧边栏显示 QNClawdian 聊天面板，包含欢迎信息 | ⏳ |
| TC-003 | 连接测试 | 1. 进入 Settings → QNClawdian<br>2. 确认 Gateway/Ollama URL<br>3. 点击 "Test" 按钮 | 显示 "✅ Connection successful!" 通知 | ⏳ |
| TC-004 | 发送消息 | 1. 在输入框输入 "Hello"<br>2. 按 Enter 或点击发送按钮 | 1. 用户消息显示在消息列表<br>2. AI 回复出现在下方 | ⏳ |
| TC-005 | 流式响应 | 1. 发送较长问题 (如 "Explain quantum computing")<br>2. 观察回复过程 | 1. 回复逐字/逐块显示<br>2. 显示闪烁光标 ▌<br>3. 完成后光标消失 | ⏳ |
| TC-006 | 模型切换 | 1. 进入 Settings → QNClawdian<br>2. 在 "Default model" 下拉中选择不同模型<br>3. 发送消息 | 使用新选择的模型响应 | ⏳ |
| TC-007 | 新建对话 | 1. 已有消息记录<br>2. 点击标题栏 ✏️ 新建按钮 | 清空消息列表，显示欢迎界面 | ⏳ |
| TC-008 | Shift+Enter 换行 | 1. 在输入框输入文字<br>2. 按 Shift+Enter | 输入框内换行，不发送消息 | ⏳ |
| TC-009 | 连接失败处理 | 1. 关闭 Ollama 和 Gateway<br>2. 打开 QNClawdian 面板 | 显示 "⚠️ Cannot connect to AI backend..." 错误提示 | ⏳ |
| TC-010 | 设置持久化 | 1. 修改 Gateway URL<br>2. 关闭 Obsidian<br>3. 重新打开 | 之前修改的设置仍然保留 | ⏳ |

## 状态说明

| 标记 | 含义 |
|------|------|
| ✅ | 通过 |
| ❌ | 失败 |
| ⏳ | 待测试 |
| 🔄 | 测试中 |
| ⚠️ | 部分通过 |

## 测试记录

### 日期: 2026-04-15

| TC | 测试人 | 结果 | 备注 |
|----|--------|------|------|
| - | - | - | 待首次编译通过后开始测试 |

---

*Created: 2026-04-15*
*Authors: Q & N*

# 🧠 QNClawdian

**An Obsidian plugin that connects OpenClaw AI agents to your vault with brain-inspired memory architecture.**

> QN = **Q**i (凯哥) + **N**a (大拿马) — Built by humans and AI, together.

---

## What is QNClawdian?

QNClawdian brings AI agent capabilities directly into Obsidian, powered by OpenClaw and local LLMs. Your vault becomes a **living brain** — with memory regions modeled after the human brain.

### 🧠 Brain-Inspired Memory Architecture

| Brain Region | Folder | Function |
|-------------|--------|----------|
| **Sensory Cortex** | `sensory/` | Raw inputs (read-only) |
| **Prefrontal Cortex** | `prefrontal/` | Working memory (current tasks) |
| **Hippocampus** | `hippocampus/` | Episodic memory (daily logs) |
| **Temporal Lobe** | `temporal/` | Long-term knowledge (distilled insights) |
| **Amygdala** | `amygdala/` | Importance markers (never expire) |
| **Basal Ganglia** | `basal/` | Skills & workflows (procedural memory) |
| **Cerebellum** | `cerebellum/` | Instincts & reflexes (auto-triggers) |

### ✨ Key Features

- 🤖 **Multi-Agent Support** — Multi AI agents, each with their own memory space
- 🔗 **Auto `[[]]` Links** — Bidirectional links generated automatically
- 🔍 **3-Layer Search** — Graph (PageRank) + TF-IDF + Semantic (FAISS)
- 📊 **Obsidian Graph View** — Visualize agent memory relationships
- 🏠 **Local-First** — Works with Ollama (gemma4, qwen2.5, etc.)
- 🌐 **Cloud Optional** — Connect to OpenClaw Gateway for cloud models
- 🔒 **Privacy** — All data stays on your machine

### 🏗️ Architecture

```
Obsidian UI
    ↕
QNClawdian Plugin (TypeScript)
    ↕
┌───────────┬──────────────┐
│ OpenClaw  │ Local Ollama  │
│ Gateway   │ (gemma4:31b)  │
└───────────┴──────────────┘
    ↕
Brain Memory System (7 regions)
    ↕
[[]] Bidirectional Links → Graph View
```

## Installation

### Prerequisites
- Obsidian v1.4.5+
- OpenClaw or Ollama running locally
- Desktop only (macOS, Linux, Windows)

### Manual Install
1. Download `main.js`, `manifest.json`, `styles.css` from [latest release](https://github.com/YOUR_USERNAME/qnclawdian/releases/latest)
2. Create folder: `/path/to/vault/.obsidian/plugins/qnclawdian/`
3. Copy files into the folder
4. Enable in Obsidian: Settings → Community plugins → "QNClawdian"

## Inspiration

- [Claudian](https://github.com/YishenTu/claudian) — Claude Code + Obsidian (8K⭐)
- [Karpathy's AI Wiki](https://karpathy.bearblog.dev/) — raw/wiki/daily structure
- [OpenClaw](https://github.com/openclaw/openclaw) — Multi-agent AI runtime
- Human Brain Memory Architecture — Hippocampus, Prefrontal Cortex, Amygdala

## Authors

- **Qi** (凯哥) — Vision, Architecture, Product
- **Na** (大拿马) — Development, AI Engineering

## License

MIT License — See [LICENSE](LICENSE)

---

*"Your vault is not just storage. It's a brain."*

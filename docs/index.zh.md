---
hide:
  - navigation
  - toc
---

<div class="hero" markdown>

# Riverse

<p class="hero-subtitle">
为个人终端设计的 AI Agent — 持久记忆，离线认知，越用越懂你。所有数据存在本地。<br>
<span style="font-size:0.8rem; opacity:0.55;">v1.0 Beta · 推荐单用户使用</span>
</p>

<div class="hero-actions">
<a href="getting-started/installation/" class="btn-primary">开始使用</a>
<a href="getting-started/docker/" class="btn-secondary">Docker 快速体验</a>
<a href="https://github.com/wangjiake/JKRiver" class="btn-secondary">GitHub</a>
</div>

</div>

<div class="section-header" markdown>

## RAG 记忆 vs. 河流算法

为什么相似度检索不够用。

</div>

<div class="compare-container" markdown>

<div class="compare-card old" markdown>
<span class="compare-label">RAG / 现有 AI 记忆</span>

#### 检索然后遗忘

- **关键词 / 向量相似度检索** — 找到"看起来像"的文本，不理解什么对*你*重要
- **没有时间线** — 3 年前的事实和昨天的一样权重
- **没有因果推理** — "你提到头痛"和"你换了工作"是孤立的碎片，永远不会被关联
- **同等权重召回** — 你随口提到的一部电影和你的核心价值观排在同一级别
- **依赖云端** — 每条消息都发到远程模型；你的数据存在别人的服务器上

</div>

<div class="compare-card new" markdown>
<span class="compare-label">Riverse / 河流算法</span>

#### 理解然后演化

- **个人画像权重** — 信息按与*你*的相关性排序，而非文本相似度
- **时间推移** — 近期事件携带势能；旧的模式随时间自然固化或消退
- **因果推断** — 将"换新工作 → 压力 → 头痛 → 睡眠问题"关联成完整的因果链
- **置信度分级** — 观察从猜测 → 确认 → 稳固，通过多轮验证逐步升级
- **本地驱动** — 记忆存在你的设备上；远程大模型*只在*本地认知解决不了问题时才调用一次

</div>

</div>

<div class="scenario" markdown>
<div class="scenario-header">场景：你说"最近老是头痛" — 两个月前你提到过换了工作</div>
<div class="scenario-body">
<div class="scenario-side rag">
<span class="side-label">RAG 方式</span>
<div class="chat-bubble user">最近老是头痛</div>
<div class="chat-bubble ai">很抱歉听到这个。头痛的常见原因包括：脱水、用眼过度、压力大……需要一些缓解建议吗？</div>
<p style="font-size:0.8rem; opacity:0.6; margin-top:0.5rem;">向量搜索在医疗问答库中匹配了"头痛"。和你的生活毫无关联。</p>
</div>
<div class="scenario-side river">
<span class="side-label">河流算法</span>
<div class="chat-bubble user">最近老是头痛</div>
<div class="chat-bubble ai">你大概两个月前开始带团队了，差不多同一时间睡眠变差了——你好几次提到凌晨一点多才睡。头痛可能和这些有关。最近工作压力怎么样？要不要我把这个记录成一个健康趋势持续追踪？</div>
<p style="font-size:0.8rem; opacity:0.6; margin-top:0.5rem;">因果链：换工作 → 睡眠变差 → 头痛。有时间线意识，个人权重驱动。</p>
</div>
</div>
</div>

<div class="vision-box" markdown>

### 未来：你的设备，你的智能

今天的 AI 以云为中心 — 每一个想法都经过别人的服务器。Riverse 把这个倒过来。你的个人设备掌握记忆、画像、上下文，在本地理解你。只有遇到本地处理不了的问题时，才把问题精确描述好，调用一次远程大模型 — 像咨询专家，而不是把大脑外包。

<div class="vision-flow">
<span class="vf-step vf-local">本地记忆 & 画像</span>
<span class="vf-arrow">→</span>
<span class="vf-step vf-local">本地认知处理</span>
<span class="vf-arrow">→</span>
<span class="vf-step vf-local">本地能解决？</span>
<span class="vf-arrow">→</span>
<span class="vf-step vf-cloud">不能 → 描述问题 → 调用一次远程</span>
</div>

这是未来在手机、手表等个人终端上运行真正个人 AI 的基础 — 你掌握自己的数据、画像和智能。

</div>

<div class="section-header" markdown>

## 河流算法

让 Riverse 与众不同的核心认知模型。

</div>

对话像水流，关键信息像河床泥沙一样沉淀，经过多轮验证逐步从"猜测"升级为"确认"再到"稳固"。离线整理（Sleep）则是河流的自净过程。

<div class="river-diagram" markdown>

```
对话流入 ──→ 冲刷 ──→ 沉淀 ──→ 塑造认知 ──→ 继续流动
              │         │         │
              │         │         └─ 确认的认知 → 稳固的河床
              │         └─ 重要信息 → 观察记录、假设、画像
              └─ 矛盾的旧认知被冲走，新的洞察取而代之
```

</div>

<div class="metaphor-grid" markdown>

<div class="metaphor-card flow" markdown>
<span class="metaphor-icon">:material-waves:</span>

#### 水流（Flow）

每次对话都是流经的水。河流永不停歇，对你的理解持续演化，从不重置。

</div>

<div class="metaphor-card sediment" markdown>
<span class="metaphor-icon">:material-layers:</span>

#### 沉淀（Sediment）

关键信息像泥沙一样沉淀：事实沉入画像，情绪沉入观察，规律沉入假设。反复确认的认知越沉越深。

</div>

<div class="metaphor-card purify" markdown>
<span class="metaphor-icon">:material-water-check:</span>

#### 自净（Purify）

Sleep 像河流的自净能力 — 冲走过时的信息，解决矛盾的认知，将碎片整合为完整的理解。

</div>

</div>

<div class="section-header" markdown>

## 特性

打造真正个人 AI 所需的一切。

</div>

<div class="feature-grid" markdown>

<div class="feature-card" markdown>
<span class="feature-icon">:material-brain:</span>

### 持久记忆

跨会话记忆，构建随你演化的用户画像。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-sleep:</span>

### 离线整理（Sleep）

对话结束后自动整理记忆、提炼认知、解决矛盾。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-image-text:</span>

### 多模态输入

文本、语音、图片、文件 — 通过 Whisper、GPT-4 Vision、LLaVA 原生理解。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-wrench:</span>

### 可插拔工具

网页搜索、财务追踪、健康同步（Withings）、TTS 等。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-file-code:</span>

### YAML 技能

用简单的 YAML 创建自定义行为，按关键词或 cron 定时触发。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-connection:</span>

### 外部 Agent

通过配置文件接入 Home Assistant、n8n、Dify 等。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-forum:</span>

### 多渠道

Telegram、Discord、REST API、WebSocket、CLI、Web 仪表盘。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-server:</span>

### 本地优先

默认 Ollama，质量不足时自动升级到 OpenAI / DeepSeek。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-bell-ring:</span>

### 主动关怀

跟进重要事件、空闲问候、策略提醒，尊重静默时段。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-magnify:</span>

### 语义搜索

BGE-M3 向量嵌入，按语义而非关键词检索相关记忆。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-protocol:</span>

### MCP 协议

支持 Model Context Protocol，接入 Gmail 等 MCP Server。

</div>

</div>

<div class="section-header" markdown>

## 技术栈

</div>

| 层 | 技术 |
|---|---|
| 运行时 | Python 3.10+, PostgreSQL 16+ |
| 本地 LLM | Ollama（任意兼容模型） |
| 云端 LLM | OpenAI GPT-4o / DeepSeek（兜底） |
| 向量嵌入 | Ollama + BGE-M3 |
| REST API | FastAPI + Uvicorn |
| Web 仪表盘 | Flask |
| Telegram | python-telegram-bot (async) |
| Discord | discord.py (async) |
| 语音 / 图像 | Whisper-1, GPT-4 Vision, LLaVA |
| TTS | Edge TTS |

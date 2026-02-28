---
hide:
  - navigation
  - toc
---

<div class="hero" markdown>

# Riverse

<p class="hero-subtitle">
A personal AI agent that runs on your own machine — persistent memory, offline cognition, grows with every conversation. All data stays local.<br>
<span style="font-size:0.8rem; opacity:0.55;">v1.0 Beta · Single-user recommended</span>
</p>

<div class="hero-actions">
<a href="getting-started/installation/" class="btn-primary">Get Started</a>
<a href="getting-started/docker/" class="btn-secondary">Docker Quick Start</a>
<a href="https://github.com/wangjiake/JKRiver" class="btn-secondary">GitHub</a>
</div>

</div>

<div class="section-header" markdown>

## RAG Memory vs. River Algorithm

Why similarity search isn't enough for a personal AI.

</div>

<div class="compare-container" markdown>

<div class="compare-card old" markdown>
<span class="compare-label">RAG / Existing AI Memory</span>

#### Retrieve then Forget

- **Keyword / vector similarity retrieval** — finds text that "looks similar", no understanding of what matters to *you*
- **No timeline** — a fact from 3 years ago and yesterday are weighted equally
- **No causal reasoning** — "you mentioned headaches" and "you started a new job" stay as isolated fragments, never connected
- **Equal weight recall** — your passing comment about a movie ranks the same as your core life values
- **Cloud-dependent** — every message round-trips to a remote model; your data lives on someone else's server

</div>

<div class="compare-card new" markdown>
<span class="compare-label">Riverse / River Algorithm</span>

#### Understand then Evolve

- **Personal profile weighting** — information is ranked by relevance *to you*, not by text similarity
- **Temporal evolution** — recent events carry momentum; old patterns solidify or fade naturally over time
- **Causal inference** — connects "started new job → stress → headaches → sleep problems" into a coherent chain
- **Confidence levels** — observations progress from suspected → confirmed → established through multi-turn verification
- **Local-first** — memory lives on your device; remote LLM is called *only* when local cognition can't solve the problem

</div>

</div>

<div class="scenario" markdown>
<div class="scenario-header">Scenario: You said "I've been having headaches lately" — two months after mentioning a job change</div>
<div class="scenario-body">
<div class="scenario-side rag">
<span class="side-label">RAG Approach</span>
<div class="chat-bubble user">I've been having headaches lately</div>
<div class="chat-bubble ai">I'm sorry to hear that. Here are some common causes of headaches: dehydration, screen time, stress... Would you like some tips?</div>
<p style="font-size:0.8rem; opacity:0.6; margin-top:0.5rem;">Vector search found "headache" in medical Q&A corpus. No connection to your life context.</p>
</div>
<div class="scenario-side river">
<span class="side-label">River Algorithm</span>
<div class="chat-bubble user">I've been having headaches lately</div>
<div class="chat-bubble ai">You started the new management role about two months ago, and around the same time your sleep got worse — you mentioned staying up past 1am several times. The headaches might be linked. How's the work pressure been? Want me to track this as a health pattern?</div>
<p style="font-size:0.8rem; opacity:0.6; margin-top:0.5rem;">Causal chain: job change → sleep disruption → headaches. Timeline-aware, personally weighted.</p>
</div>
</div>
</div>

<div class="vision-box" markdown>

### The Future: Your Device, Your Intelligence

Today's AI is cloud-centered — every thought goes through someone else's server. Riverse inverts this. Your personal device holds the memory, the profile, the context. It understands you locally. Only when it encounters a problem beyond local capacity does it formulate a precise question and make a single call to a remote LLM — like consulting a specialist, not outsourcing your brain.

<div class="vision-flow">
<span class="vf-step vf-local">Local Memory & Profile</span>
<span class="vf-arrow">→</span>
<span class="vf-step vf-local">Local Cognition</span>
<span class="vf-arrow">→</span>
<span class="vf-step vf-local">Can solve locally?</span>
<span class="vf-arrow">→</span>
<span class="vf-step vf-cloud">If not → describe problem → one remote call</span>
</div>

This is the foundation for running a truly personal AI on phones, watches, and personal devices — where you own your data, your profile, and your intelligence.

</div>

<div class="section-header" markdown>

## River Algorithm

The core cognition model that makes Riverse different.

</div>

Conversations flow like water, key information settles like riverbed sediment, progressively upgrading from "suspected" to "confirmed" to "established" through multi-turn verification. Offline consolidation (Sleep) acts as the river's self-purification.

<div class="river-diagram" markdown>

```
Conversation flows in ──→ Erosion ──→ Sedimentation ──→ Shapes cognition ──→ Keeps flowing
                           │              │                   │
                           │              │                   └─ Confirmed knowledge → stable bedrock
                           │              └─ Key info → observations, hypotheses, profiles
                           └─ Outdated beliefs washed away, replaced by new insights
```

</div>

<div class="metaphor-grid" markdown>

<div class="metaphor-card flow" markdown>
<span class="metaphor-icon">:material-waves:</span>

#### Flow

Every conversation is water flowing through. The river never stops — understanding of you evolves continuously and never resets.

</div>

<div class="metaphor-card sediment" markdown>
<span class="metaphor-icon">:material-layers:</span>

#### Sediment

Key information settles like silt: facts sink into profiles, emotions into observations, patterns into hypotheses. Confirmed knowledge sinks deeper.

</div>

<div class="metaphor-card purify" markdown>
<span class="metaphor-icon">:material-water-check:</span>

#### Purify

Sleep is the river's self-purification — washing away outdated info, resolving contradictions, integrating fragments into coherent understanding.

</div>

</div>

<div class="section-header" markdown>

## Features

Everything you need for a truly personal AI.

</div>

<div class="feature-grid" markdown>

<div class="feature-card" markdown>
<span class="feature-icon">:material-brain:</span>

### Persistent Memory

Remembers across sessions. Builds a timeline-based profile that evolves with you.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-sleep:</span>

### Offline Consolidation

Processes conversations after they end — extracts insights, resolves contradictions, strengthens confirmed knowledge.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-image-text:</span>

### Multi-Modal Input

Text, voice, images, files — all understood natively via Whisper, GPT-4 Vision, and LLaVA.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-wrench:</span>

### Pluggable Tools

Finance tracking, health sync (Withings), web search, vision, TTS, and more.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-file-code:</span>

### YAML Skills

Create custom behaviors with simple YAML — trigger by keyword or cron schedule.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-connection:</span>

### External Agents

Connect Home Assistant, n8n, Dify and more via agent configs.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-forum:</span>

### Multi-Channel

Telegram, Discord, REST API, WebSocket, CLI, and Web Dashboard.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-server:</span>

### Local-First

Ollama by default. Auto-escalates to OpenAI / DeepSeek when needed.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-bell-ring:</span>

### Proactive Outreach

Follows up on events, checks in when idle, respects quiet hours.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-magnify:</span>

### Semantic Search

BGE-M3 embeddings — retrieves relevant memories by meaning, not just keywords.

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-protocol:</span>

### MCP Protocol

Model Context Protocol support for Gmail and other MCP servers.

</div>

</div>

<div class="section-header" markdown>

## Tech Stack

</div>

| Layer | Technology |
|---|---|
| Runtime | Python 3.10+, PostgreSQL 16+ |
| Local LLM | Ollama (any compatible model) |
| Cloud LLM | OpenAI GPT-4o / DeepSeek (fallback) |
| Embeddings | Ollama + BGE-M3 |
| REST API | FastAPI + Uvicorn |
| Web Dashboard | Flask |
| Telegram | python-telegram-bot (async) |
| Discord | discord.py (async) |
| Voice / Vision | Whisper-1, GPT-4 Vision, LLaVA |
| TTS | Edge TTS |

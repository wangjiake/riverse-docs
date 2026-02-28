# Python SDK (riverse)

Integrate River Algorithm memory into your own Python application.

## Installation

```bash
pip install riverse
```

PyPI: [pypi.org/project/riverse](https://pypi.org/project/riverse/) · GitHub: [github.com/wangjiake/riverse](https://github.com/wangjiake/riverse)

## Quick Start

```python
from riverse import Riverse

r = Riverse(
    api_key="sk-...",
    api_base="https://api.deepseek.com",
    model="deepseek-chat",
    language="en",           # "en" | "zh" | "ja"
)

# 1. Store conversations
r.add(messages=[
    {"role": "user", "content": "I just moved to Tokyo for a new job at Google."},
    {"role": "assistant", "content": "That's exciting! How's the transition going?"},
], user_id="alex")

# 2. Run Sleep consolidation (River Algorithm core)
result = r.sleep(user_id="alex")
print(result)
# {'status': 'ok', 'processed': 2, 'new_facts': 3, 'contradictions': 0, ...}

# 3. Get user profile
profile = r.get_profile(user_id="alex")
for fact in profile:
    print(f"[{fact['layer']}] {fact['category']}/{fact['subject']}: {fact['value']}")

# 4. Search memory
results = r.search("Where does he live?", user_id="alex")

# 5. Get user model (personality + trajectory)
model = r.get_user_model(user_id="alex")
```

## Configuration

```python
r = Riverse(
    api_key="sk-...",                        # API key
    api_base="https://api.openai.com",       # Or DeepSeek/Ollama/Groq URL
    model="gpt-4o-mini",                     # Model name
    language="en",                           # Prompt language: "en" | "zh" | "ja"
    db_path="~/.riverse/memory.db",          # SQLite path
    temperature=0.7,
    max_tokens=4096,
)
```

### Supported Providers

| Provider | `api_base` | `model` |
|----------|-----------|---------|
| **OpenAI** | `https://api.openai.com` | `gpt-4o-mini` |
| **DeepSeek** | `https://api.deepseek.com` | `deepseek-chat` |
| **Groq** | `https://api.groq.com` | `llama-3.3-70b-versatile` |
| **Ollama** | `http://localhost:11434` | `llama3.1` |

## API Reference

### `r.add(messages, user_id, session_id=None)`

Store conversation messages for later consolidation.

- `messages` — List of `{"role": "user"|"assistant", "content": "..."}`
- `user_id` — User identifier
- `session_id` — Optional session grouping (auto-generated if omitted)

### `r.sleep(user_id)`

Run the full River Algorithm consolidation pipeline:

1. Extract observations, events, and relationships
2. Classify against existing profile
3. Create new facts, detect contradictions
4. Cross-verify suspected facts for promotion
5. Resolve disputed fact pairs
6. Update maturity decay and user model
7. Generate trajectory summary

Returns a summary dict with counts.

### `r.get_profile(user_id)`

Returns all active profile facts as a list of dicts.

Each fact contains: `category`, `subject`, `value`, `layer` (`suspected`/`confirmed`/`closed`), `evidence`, `created_at`, etc.

### `r.get_user_model(user_id)`

Returns `{"dimensions": [...], "trajectory": {...}}`.

- **dimensions** — Personality analysis (communication style, trust level, sensitivity, etc.)
- **trajectory** — Life phase, direction, key anchors, volatile areas

### `r.search(query, user_id, top_k=10)`

Keyword search across profile facts, events, and observations.

## Language Parameter

The `language` parameter controls all internal LLM prompts during consolidation.

| Value | Language |
|-------|----------|
| `"en"` | English (default) |
| `"zh"` | Chinese |
| `"ja"` | Japanese |

Choose the language that matches your users' conversations for best extraction quality.

## Contradiction Detection

When conflicting information is detected across conversations, the River Algorithm:

1. Creates a new fact with the updated value
2. Marks the old fact as superseded
3. Records the contradiction evidence chain
4. Generates verification strategies for follow-up

```python
# Session 1
r.add([{"role": "user", "content": "I work at Google."}], user_id="alex", session_id="s1")
r.sleep(user_id="alex")

# Session 2 — contradicts session 1
r.add([{"role": "user", "content": "I just switched to Microsoft."}], user_id="alex", session_id="s2")
r.sleep(user_id="alex")

# Profile now shows Microsoft, Google fact is superseded
profile = r.get_profile(user_id="alex")
```

## Three-Layer Confidence Model

Facts progress through confidence layers:

- **`suspected`** — Initial extraction, unverified
- **`confirmed`** — Cross-verified through multiple mentions or corroboration
- **`closed`** — Superseded by newer information or expired

## Difference from JKRiver

| | riverse (Python SDK) | JKRiver (Full App) |
|---|---|---|
| **What** | Library for your own app | Complete AI assistant |
| **Install** | `pip install riverse` | Docker or manual setup |
| **Storage** | SQLite (zero config) | PostgreSQL |
| **Channels** | Your code decides | Telegram, Discord, CLI, Web |
| **Use case** | Integrate memory into your product | Use as your personal AI |

Full version: [github.com/wangjiake/JKRiver](https://github.com/wangjiake/JKRiver)

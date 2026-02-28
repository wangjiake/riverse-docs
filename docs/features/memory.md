# Memory & Sleep

## Persistent Memory

Riverse remembers across sessions and builds a timeline-based profile that evolves with you. Every conversation contributes to a growing understanding of your personality, preferences, experiences, and relationships.

This is powered by the **River Algorithm** — conversations flow like water, key information settles like riverbed sediment, progressively upgrading from "suspected" to "confirmed" to "established" through multi-turn verification.

## Sleep — Offline Memory Consolidation

Sleep is the process where Riverse digests conversations and updates your profile. It is triggered automatically or on demand:

| Trigger | How |
|---|---|
| **Telegram** | Send `/new` — resets the session and runs Sleep in the background |
| **CLI** | Runs automatically when you exit (`quit` or Ctrl+C) |
| **REST API** | `POST /sleep` |
| **Cron (recommended)** | Schedule a nightly job to consolidate the day's conversations |

### Cron Example

Run Sleep every day at midnight:

```bash
# crontab -e
0 0 * * * cd /path/to/JKRiver && /path/to/python -c "from agent.sleep import run; run()"
```

## Semantic Search

With embeddings enabled (BGE-M3), Riverse retrieves relevant memories by meaning rather than keyword matching.

```yaml
embedding:
  enabled: true
  model: "bge-m3"
  api_base: "http://localhost:11434"
```

## Memory Accuracy

!!! info
    No LLM today is specifically trained for personal profile extraction, so results may occasionally be off. When you spot something inaccurate, you can **reject** incorrect memories or **close** outdated ones in the Web Dashboard. Riverse intentionally does not allow manual editing of memory content — wrong memories are like sediment in a river, meant to be washed away by the current, not sculpted by hand. As conversations accumulate, the River Algorithm continuously self-corrects through multi-turn verification and contradiction detection — profiles become more accurate over time.

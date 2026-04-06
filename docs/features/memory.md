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

## Knowledge Network

Sleep also builds a **knowledge network** — typed edges connecting related profile facts (e.g. `causes`, `related_to`, `contradicts`, `supports`). This lets the AI see structural relationships between facts, not just isolated entries.

When facts are closed or superseded, their edges are automatically cleaned up.

## Memory Clustering

With embeddings enabled, Sleep can optionally cluster memory vectors using KMeans and generate theme labels for each cluster. This gives a bird's-eye view of what the AI knows about you.

```yaml
embedding:
  clustering:
    enabled: true
    show_themes: true
```

## Semantic Search

With embeddings enabled (BGE-M3), Riverse retrieves relevant memories by meaning rather than keyword matching.

```yaml
embedding:
  enabled: true
  model: "bge-m3"
  api_base: "http://localhost:11434"
```

## Session Memory

Session Memory manages context within a single conversation using three layers:

1. **Sliding Summary** — Old turns are compressed into a running summary by the LLM, keeping conversation history without exceeding token limits
2. **Vector Recall** — When embeddings are enabled, relevant earlier turns are recalled by semantic similarity to the current message
3. **Recent Turns** — The most recent turns are kept verbatim for immediate context

This three-layer system lets conversations go indefinitely without losing important context. Configure in `settings.yaml`:

```yaml
session_memory:
    char_budget: 3000        # Total character budget for session context
    keep_recent: 5           # Recent turns to keep verbatim
    summary_ratio: 0.4       # Fraction of budget allocated to summary
    recall_max: 3            # Max recalled turns via vector search
    recall_min_score: 0.45   # Min similarity for recall
```

## pgvector Acceleration

By default, embeddings are stored as JSONB and cosine similarity is computed in Python. For better performance with large datasets, install the [pgvector](https://github.com/pgvector/pgvector) extension:

```bash
# macOS
brew install pgvector

# Debian/Ubuntu
apt install postgresql-16-pgvector
```

Then run the migration:

```bash
psql -h localhost -U YOUR_USERNAME -d Riverse -f migrations/001_pgvector.sql
```

This creates a native `vector(1024)` column and an IVFFlat index for fast approximate nearest neighbor search. The application auto-detects pgvector and uses it when available; no config change needed.

## Memory Accuracy

!!! info
    No LLM today is specifically trained for personal profile extraction, so results may occasionally be off. You can **mark incorrect memories as error** or **manually close outdated ones** in the Web Dashboard — but memories cannot be deleted or edited directly. This is by design: the River Algorithm treats your memory as an audit trail. Wrong memories are like sediment in a river, meant to be washed away by the current, not sculpted by hand.

    If you see too many extraction errors, the likely cause is your LLM's understanding capability, not a bug. Try switching to a stronger model — the memory pipeline is also a practical benchmark for evaluating how well your LLM understands natural language. As conversations accumulate, the algorithm continuously self-corrects through multi-turn verification and contradiction detection.

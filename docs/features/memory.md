# Memory & Sleep

## Memory Engine

Riverse is not a RAG system. It doesn't store raw conversation chunks and retrieve similar text. Instead, it runs a structured extraction pipeline (Sleep) after each conversation to build a living, self-correcting profile of you.

### What Gets Extracted

Every conversation is processed into three separate data structures, each with its own lifecycle:

| Type | What it captures | Lifecycle |
|------|-----------------|-----------|
| **Profile facts** | Persistent attributes: job, city, preferences, health patterns, etc. | Confidence-based, time-decayed, superseded when updated |
| **Relationships** | People you mention: name, relation, details, mention count | Updated on each mention, status tracked |
| **Events** | Time-bounded occurrences: started a new job, moved cities, had surgery | Expires automatically via `decay_days` |

### Fact Lifecycle

Each profile fact goes through a defined lifecycle:

```
Observation (raw statement from conversation)
    ↓
suspected  →  confirmed  →  established
    ↓               ↓
  rejected       closed (superseded by new fact)
```

- **suspected** — extracted but not yet verified across multiple conversations
- **confirmed** — seen consistently across 2+ sessions; LLM has cross-verified it
- **established** — long-standing, high-evidence fact; resistant to casual contradiction
- **rejected** — marked as incorrect (manually or by LLM arbitration)
- **closed** — fact changed; old record preserved with `end_time`, new one takes over

### Time Decay

Each fact carries a `decay_days` value — the estimated lifetime of that type of information. Facts approaching expiry get lower weight in context injection. Expired facts are removed from the active profile but kept in the timeline for historical accuracy.

### Contradiction Resolution

When Sleep detects conflicting facts (e.g. "lives in Tokyo" vs. "moved to Osaka"), it:

1. Flags both as a disputed pair
2. Runs LLM arbitration with full context (trajectory, timeline, recent conversations)
3. Either accepts the new fact and closes the old one, or rejects the new claim

### Evidence Chains

Every fact stores the evidence that produced it — a list of observations from specific conversations. This means:

- You can trace any fact back to the conversation that created it
- LLM arbitration has full context when resolving contradictions
- Confidence scores reflect the number and quality of supporting observations

### Knowledge Graph

Sleep extracts typed edges between facts, building a personal knowledge graph:

- `causes` — "stress" causes "sleep problems"
- `related_to` — "job change" related to "relocation"
- `supports` / `contradicts` — evidence relationships between facts

This graph is used during context injection to surface causally connected facts when a relevant topic comes up.

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

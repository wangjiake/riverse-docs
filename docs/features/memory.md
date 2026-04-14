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

### The 14-Step Pipeline

The entire pipeline runs atomically inside a single database transaction. If any step fails, everything rolls back — the same conversations will be re-processed on the next run (at-least-once semantics).

#### Phase 1: Extract

**Step 1 — Load initial data**
Load the existing user profile (excluding superseded facts) and the latest life trajectory summary. These provide context for all subsequent steps.

**Step 2 — Extract sessions**
For each unprocessed conversation session, the LLM extracts:

- **Observations** — factual statements, contradictions, preferences, and behavioral signals. Each observation is tagged with its type and subject. Third-party observations (about people the user mentions) are stored separately.
- **Tags** — session-level topic tags
- **Relationships** — people mentioned, their relation to the user, and details. Existing relationships are merged (mention count incremented, details updated).
- **Events** — time-bounded occurrences (new job, relocation, surgery, etc.) with importance and decay days

Sessions with only tool/outsource intents are skipped — they contain no personal information.

#### Phase 2: Analyze

**Step 3 — Analyze behavior**
The LLM examines all observations alongside the current profile and trajectory to infer behavioral patterns. For example, multiple late-night messages may suggest the user is a night owl. Inferred facts are saved with `source_type=inferred`. When evidence count reaches 3+, a `clarify` strategy is generated to proactively verify the inference in a future conversation.

**Step 4 — Classify & integrate**
The core step. The LLM classifies each observation against the existing profile:

- `support` — reinforces an existing fact → evidence is appended, mention count incremented
- `contradict` — conflicts with an existing fact → a new fact is created with a `supersedes` link to the old one, forming a dispute pair
- `evidence_against` — weakens an existing fact without asserting a replacement
- `new` — no matching fact exists → a new profile fact is created

Unclassified statement/contradiction observations are auto-assigned as `new`. After integration, change-driven strategies (type `probe`) are generated for newly created or contradicted facts.

**Step 5 — Cross-verify**
Suspected facts undergo verification:

- **Rule-based fast path**: facts with `source_type=stated` and `mention_count ≥ 2` are auto-confirmed
- **LLM verification**: remaining suspected facts (up to 80, sorted by mention count) are cross-verified using timeline history, related conversation summaries (last 3 months), and trajectory context

Facts that pass verification are promoted from `suspected` to `confirmed`.

**Step 6 — Resolve disputes**
Disputed fact pairs (where a new fact `supersedes` an old one but neither is closed) are sent to LLM arbitration with full context. The LLM decides `accept_new` or `reject_new`. The losing fact is closed (`end_time` set), and its knowledge graph edges are cleaned up.

#### Phase 3: Maintain

**Step 7 — Extract edges**
For all facts affected in this run, the LLM extracts typed edges (causal, temporal, hierarchical) to build the personal knowledge graph.

**Step 8 — Expire facts**
Facts past their `expires_at` date are closed. For each expired fact, a `verify` strategy is generated so the AI will naturally ask about it in the next relevant conversation.

**Step 9 — Maturity decay**
Long-standing, well-evidenced facts earn longer lifespans. The decay tiers:

| Fact age | Evidence count | New decay_days |
|----------|---------------|----------------|
| ≥ 730 days | ≥ 10 | 730 (2 years) |
| ≥ 365 days | ≥ 6 | 365 (1 year) |
| ≥ 90 days | ≥ 3 | 180 (6 months) |

Facts identified as **key anchors** in the trajectory (e.g. native language, long-term career) get a 40% threshold reduction — they mature faster.

#### Phase 4: Output

**Step 10 — User model**
The LLM analyzes communication style dimensions from the conversations (e.g. direct vs. indirect, formal vs. casual, humor style). Results are stored in the `user_model` table and used to shape response tone.

**Step 11 — Trajectory**
When significant changes are detected (fact confirmations, dispute resolutions, contradictions in important categories) and at least 2 sessions have passed since the last update, the life trajectory is regenerated. It captures: life phase, direction, stability, key anchors, volatile areas, and recent momentum.

**Step 12 — Consolidate**
Deduplicate the profile to clean up any redundancies created during extraction and integration.

**Step 13 — Snapshot**
Pre-compile a complete memory snapshot: profile facts + user model + active events + relationships + knowledge graph edges. This snapshot is served directly during the next conversation, avoiding the cost of re-assembling context from multiple tables.

**Step 14 — Finalize**
Mark all processed conversations. This is the last step — if the pipeline crashed before this point, the transaction rolls back and the same conversations will be re-processed.

#### Post-transaction

After the atomic transaction completes, two non-critical tasks run outside the transaction:

- **Vector embedding** — embed all memories for semantic search
- **Memory clustering** — KMeans clustering with theme label generation

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

### Algorithm-First Design

Riverse's memory pipeline is architecturally designed beyond what current general-purpose LLMs can fully deliver. The 14-step Sleep consolidation requires precise structured judgment at each stage — observation extraction, fact classification, cross-verification, contradiction resolution — where each step feeds into the next. Today's accuracy bottleneck is the precision of LLM outputs at each stage, not the algorithm itself.

Consider the cascade: if each LLM step achieves 90% accuracy (already optimistic for some tasks), six serial steps yield roughly 53% end-to-end accuracy. With a purpose-trained model achieving 99% per step, the same pipeline reaches 94% — a qualitative leap from the same code.

No LLM today is purpose-trained for personal memory consolidation. The ideal path would be a dedicated memory LLM optimized for:

- **Observation extraction precision** — distinguishing "I live in Tokyo" (statement) from "I wish I were in Tokyo" (hypothetical)
- **Multi-fact joint reasoning** — evaluating a new observation against 30+ existing profile facts (a constrained NLI task with large fine-tuning potential)
- **Calibrated confidence** — outputting reliable probability scores so the pipeline can threshold decisions, rather than binary yes/no classifications

The author has a clear design for what this model should look like, but training it requires compute and data resources beyond what an individual can access.

If your company is building a memory-focused model or working on personal AI and you have a role that fits — I'd love to hear from you: [mailwangjk@gmail.com](mailto:mailwangjk@gmail.com)

Until then, the algorithm rides on general-purpose models and improves automatically with each stronger generation, requiring zero code changes. The pipeline's context inputs (timeline, trajectory, conversation summaries, evidence chains) are already structured to give future models the richest possible signal.

This is a deliberate design choice: build the architecture right and let the models catch up, rather than simplify the architecture to match today's model limitations.

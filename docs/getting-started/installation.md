# Installation

## Prerequisites

| Dependency | Description |
|---|---|
| Python 3.10+ | Runtime |
| PostgreSQL 16+ | Data storage |
| Ollama | Local LLM inference (optional, can use cloud-only) |

## Clone & Install

```bash
git clone https://github.com/wangjiake/JKRiver.git
cd JKRiver
python3 -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

## Setup PostgreSQL

```bash
createdb -h localhost -U your_username Riverse
psql -h localhost -U your_username -d Riverse -f agent/schema.sql
```

!!! note
    Riverse and [River Algorithm — AI Chat History Edition](https://github.com/wangjiake/RiverHistory) share the same database. Running the schema setup from either project creates all tables needed for both. If you have already run the other project's database setup, you can skip this step.

Verify tables were created:

```bash
psql -h localhost -U your_username -d Riverse -c "\dt"
```

You should see `conversation_turns`, `user_profile`, `observations`, `fact_edges`, `memory_clusters` and about fifteen other tables.

!!! tip
    If you need scheduled skills support (Telegram Job Queue):
    ```bash
    pip install "python-telegram-bot[job-queue]"
    ```

## Pull Ollama Models (optional)

If using local LLM:

```bash
ollama pull <your-model>         # e.g. qwen2.5:14b, llama3, mistral
ollama pull bge-m3              # Embedding model (optional)
```

## Run

**Web Dashboard (recommended)** — starts FastAPI backend + Flask frontend together:

```bash
python scripts/start_local.py
```

Or start individually:

```bash
uvicorn agent.api:app --host 127.0.0.1 --port 8400    # FastAPI backend (required for web dashboard)
python web.py                                           # Flask frontend (http://localhost:1234)
python -m agent.main                                    # CLI
python -m agent.telegram_bot                            # Telegram Bot
python -m agent.discord_bot                             # Discord Bot
```

> The web dashboard needs both services running. `start_local.py` handles this automatically.

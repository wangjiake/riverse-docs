# Docker

Don't want to install Python or PostgreSQL? Run the complete Riverse AI system using Docker — just configure your AI model API key and run one command.

**Two services start automatically:**

| Service | URL | What it does |
|---------|-----|--------------|
| **RiverHistory** | http://localhost:2345 | Web profile viewer — see the extracted personality, preferences, experiences, and life timeline |
| **JKRiver** | http://localhost:8400/docs | AI core engine — REST API, chat bots, memory consolidation scheduler |

## How to Chat

JKRiver provides **three ways** to chat with the AI. All conversations are analyzed by the River Algorithm and contribute to your personal profile:

| Method | Setup | Best for |
|--------|-------|----------|
| **Telegram Bot** | Set `TELEGRAM_BOT_TOKEN` in `.env`, get token from [@BotFather](https://t.me/BotFather) | Daily mobile use, most convenient |
| **Discord Bot** | Set `DISCORD_BOT_TOKEN` in `.env`, get token from [Developer Portal](https://discord.com/developers/applications) | Community / group use |
| **Command Line** | No extra setup needed | Quick test, no bot token required |

**Telegram Bot** — Create a bot via @BotFather, copy the token to `.env`. To restrict access, set `TELEGRAM_ALLOWED_USERS` to your user ID (send any message to [@userinfobot](https://t.me/userinfobot) to get it). **Do not add brackets** — just the number, e.g. `TELEGRAM_ALLOWED_USERS=123456789`. After `docker compose up`, message your bot directly.

**Discord Bot** — Create an application in Discord Developer Portal, add a bot, copy the token to `.env`. Invite the bot to your server. After `docker compose up`, mention the bot or DM it.

**Command Line** — Open a terminal and run:
```bash
docker compose exec jkriver bash -c "cd /app_work && python -m agent.main"
```
Type your message at the `>` prompt, type `quit` to exit. Memory consolidation runs automatically on exit.

> REST API is also available at `http://localhost:8400/docs` for developers who want to integrate programmatically.

## Requirements

- [Docker Desktop](https://docs.docker.com/get-docker/) (includes Docker Compose)

## Quick Start

```bash
# 1. Get the files
git clone https://github.com/wangjiake/JKRiver.git
cd JKRiver/docker

# 2. Create your config file
cp .env.example .env

# 3. Edit .env — add your API key (see "Supported AI Models" below)
#    At minimum, set: OPENAI_API_KEY=sk-your-key-here
#    Set LANGUAGE=zh/en/ja — controls the language of LLM prompts (not the web UI)
#    For chat: set TELEGRAM_BOT_TOKEN or DISCORD_BOT_TOKEN (or use command line)

# 4. Start everything
docker compose up
```

Open http://localhost:2345 to view profiles. Chat via Telegram / Discord / command line.

## Security Notice

!!! warning "Read this before deploying to a server"

    JKRiver is designed for **single-user local use**. The API and web interface have **no built-in authentication**. If you deploy on a remote server, follow these rules to protect your data:

    **1. Set `TELEGRAM_ALLOWED_USERS` / Discord allowed users (required)**

    If you don't set this, **anyone** who finds your bot can chat with it — consuming your LLM API credits and writing to your personal profile.

    ```bash
    # .env — restrict to your own user ID
    TELEGRAM_ALLOWED_USERS=123456789
    ```

    Get your Telegram user ID: send any message to [@userinfobot](https://t.me/userinfobot).

    **2. Do NOT expose HTTP ports to the public internet**

    Ports `8400` (JKRiver API) and `2345` (RiverHistory web) have no login. Anyone who can reach them can read your full profile, health data, finance records, and trigger LLM calls.

    - **Local use:** No problem — ports are only accessible on your machine.
    - **Remote server:** Bind ports to `127.0.0.1` and use a reverse proxy (Nginx/Caddy) with authentication, or only access via SSH tunnel.

    ```yaml
    # docker-compose.yml — bind to localhost only
    ports:
      - "127.0.0.1:8400:8400"   # instead of "8400:8400"
      - "127.0.0.1:2345:2345"   # instead of "2345:2345"
    ```

    **3. Do NOT expose PostgreSQL port 5432**

    The default Docker Compose maps port `5432` to the host with no password (`trust` auth). On a remote server, remove the `ports` section for postgres or bind to localhost:

    ```yaml
    # docker-compose.yml — postgres section
    ports:
      - "127.0.0.1:5432:5432"   # or remove this line entirely
    ```

## Supported AI Models

Works with any OpenAI-compatible API. Edit `.env` to switch providers:

| Provider | `OPENAI_API_BASE` | `OPENAI_MODEL` | Notes |
|----------|-------------------|----------------|-------|
| **OpenAI** | `https://api.openai.com` | `gpt-4o-mini` | Default, good quality |
| **DeepSeek** | `https://api.deepseek.com` | `deepseek-chat` | Cheapest, fast for Chinese |
| **Groq** | `https://api.groq.com` | `llama-3.3-70b-versatile` | Free tier available |
| **Ollama** (local) | — | — | Set `LLM_PROVIDER=local`, no API key needed |

For Ollama, install it on your computer first (`https://ollama.ai`), then run `ollama pull qwen2.5:14b`.

## Try the Demo

Demo conversations are loaded automatically. To process them with the River Algorithm and see the extracted profile:

```bash
docker compose exec riverhistory bash -c "cd /app_work && python run.py demo max"
```

This takes a few minutes (calls your AI model). Then open http://localhost:2345 to see the result — a complete personality profile extracted from 20 conversations.

After processing, the AI **takes on the demo character's identity**. When you chat (via command line, Telegram, or Discord), the AI already knows the character — their career changes, relationships, personality, and life timeline. You can ask "What's my job?" or "Tell me about my ex" and get answers based on the extracted profile.

Through follow-up conversations in command line or Telegram/Discord, you can experience the real-time perception and memory features — the AI will continuously update the profile as you chat. If you want to test more memory capabilities, you can edit the demo JSON to add more life events and extend the timeline.

## Import Your Own Data

You can import your real conversation history from ChatGPT, Claude, or Gemini.

> **Recommended:** Try the demo first to experience the speed and quality. Processing large amounts of real data can take hours depending on how many conversations you have. After trying the demo, run `docker compose down -v` to clear the database, then start importing your own data.
>
> **Cost warning (remote LLM API):** Each conversation consumes tokens. Conversations with lots of code or very long messages use significantly more tokens. Smarter models (e.g. GPT-4o) produce better profiles but cost more; cheaper models (e.g. GPT-4o-mini, DeepSeek) are faster and cheaper but may miss nuances. You can also use local Ollama models to process for free, just slower. Review your export data before processing — remove conversations you don't need (e.g. pure coding sessions). **Monitor your API billing.**

**Step 1: Export your data**

| Platform | How to export |
|----------|---------------|
| **ChatGPT** | Settings → Data controls → Export data → unzip to get `conversations.json` |
| **Claude** | Settings → Account → Export Data → unzip to get `conversations.json` |
| **Gemini** | [Google Takeout](https://takeout.google.com/) → select Gemini Apps → unzip |

**Step 2: Place files in the `data/` folder**

Create a `data/` folder next to your `docker-compose.yml` and put the exported files inside:

```
JKRiver/docker/
├── docker-compose.yml
├── .env
└── data/                      ← already included
    ├── ChatGPT/               ← put conversations.json here
    ├── Claude/                ← put conversations.json here
    └── Gemini/                ← put Takeout files here
```

**Step 3: Import and process**

```bash
# Import (choose one or more)
docker compose exec riverhistory bash -c "cd /app_work && python import_data.py --chatgpt data/ChatGPT/conversations.json"
docker compose exec riverhistory bash -c "cd /app_work && python import_data.py --claude data/Claude/conversations.json"
docker compose exec riverhistory bash -c "cd /app_work && python import_data.py --gemini 'data/Gemini/My Activity.html'"

# Process all imported data
docker compose exec riverhistory bash -c "cd /app_work && python run.py all max"
```

Open http://localhost:2345 to see your extracted profile.

## Configuration Reference

| Variable | Default | What it does |
|----------|---------|--------------|
| `LANGUAGE` | `en` | LLM prompt language: `zh` Chinese / `en` English / `ja` Japanese (does not affect web UI) |
| `LLM_PROVIDER` | `openai` | `openai` = remote API / `local` = Ollama on your machine |
| `OPENAI_API_KEY` | | Your API key (required for remote API) |
| `OPENAI_API_BASE` | `https://api.openai.com` | API endpoint URL (change for DeepSeek, Groq, etc.) |
| `OPENAI_MODEL` | `gpt-4o-mini` | Which AI model to use |
| `OLLAMA_MODEL` | `qwen2.5:14b` | Which Ollama model (when `LLM_PROVIDER=local`) |
| `DEMO_MODE` | `true` | Load demo conversations on startup |
| `DEMO_PROCESS` | `false` | Auto-process demo on startup (uses AI, takes minutes) |
| `SLEEP_MODE` | `cron` | Memory consolidation: `cron` = daily / `auto` = after each chat / `off` = manual |
| `SLEEP_CRON_HOUR` | `0` | What hour to run daily consolidation (0-23) |
| `TELEGRAM_BOT_TOKEN` | | Telegram bot token (get from [@BotFather](https://t.me/BotFather)) |
| `TELEGRAM_ALLOWED_USERS` | | Telegram user IDs, comma-separated, **no brackets** (empty = everyone). Get ID: message [@userinfobot](https://t.me/userinfobot) |
| `DISCORD_BOT_TOKEN` | | Discord bot token (get from [Developer Portal](https://discord.com/developers/applications)) |

## Common Commands

```bash
# Start / Stop
docker compose up                  # Start (foreground, see logs)
docker compose up -d               # Start (background)
docker compose down                # Stop (data preserved)
docker compose down -v             # Stop and DELETE all data

# Chat (command line)
docker compose exec jkriver bash -c "cd /app_work && python -m agent.main"

# Process data: run.py <source> <count>
#   source: demo / chatgpt / claude / gemini / all (all = chatgpt+claude+gemini, excludes demo)
#   count:  max = process all, or a number like 50 = process oldest 50 first (good for testing cost)
#   Safe to interrupt — next run automatically skips already processed conversations
docker compose exec riverhistory bash -c "cd /app_work && python run.py demo max"
docker compose exec riverhistory bash -c "cd /app_work && python run.py all max"
docker compose exec riverhistory bash -c "cd /app_work && python run.py chatgpt 50"

# Manually trigger Sleep (organizes and consolidates memories from conversations)
curl -X POST http://localhost:8400/sleep

# Clear all extracted profiles and memories, keep original conversations (including demo)
docker compose exec riverhistory bash -c "cd /app_work && python reset_db.py"

# Logs
docker compose logs -f             # All services
docker compose logs -f jkriver     # One service

# Update to latest version
docker compose pull && docker compose up -d

# Full reset (delete everything including database)
docker compose down -v && docker compose up
```

## What Does the Demo Show?

The demo character has a contradictory life trajectory that tests the River Algorithm:

| Challenge | Standard RAG | River Algorithm |
|-----------|-------------|-----------------|
| Says "senior engineer", later admits "QA tester" | Stores both | Supersedes lie with truth |
| 4 different cities, 4 different jobs | Returns all equally | Tracks timeline, knows current state |
| Lies differently to parents, girlfriend, coworkers | Treats lies as facts | Distinguishes real vs stated |
| Ex-girlfriend → breakup → new girlfriend | Mixes up both | Marks ex as ended, tracks current |
| "Delivery is embarrassing" → "it was the best thing" | Contradictory | Tracks attitude evolution |

## Architecture

```
docker compose up
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────┐  ┌────────────────┐  ┌───────────────────┐│
│  │ postgres │  │  riverhistory  │  │     jkriver       ││
│  │  :5432   │←─│  :2345 (web)   │  │  :8400 (api)      ││
│  │          │  │  init schema   │  │  telegram bot      ││
│  │ Riverse  │←─│  load demo     │←─│  discord bot       ││
│  │   (DB)   │  │  process data  │  │  sleep scheduler   ││
│  └──────────┘  └────────────────┘  └───────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

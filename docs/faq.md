# FAQ

## PostgreSQL connection failed

Check that PostgreSQL is running:

```bash
pg_isready -h localhost
```

If your username is not `postgres`, update `database.user` in `settings.yaml`. If your PostgreSQL requires a password, add `database.password`.

## Ollama model not found

```bash
ollama list
ollama pull <your-model>    # e.g. qwen2.5:14b, llama3, mistral
ollama pull bge-m3          # Embedding model (optional)
```

## Telegram Bot not responding

1. Check `bot_token` is correct
2. Check `allowed_user_ids` includes your Telegram user ID
3. Check terminal log output
4. Make sure the bot is not already running in another process

## Cloud-only without Ollama

Set `llm_provider: "openai"`, fill in API key, set `embedding.enabled: false`.

## How to configure timezone?

Set `timezone` in `settings.yaml` using IANA format:

```yaml
timezone: "Asia/Shanghai"    # or America/New_York, Asia/Tokyo, etc.
```

This affects quiet hours and proactive messaging schedules.

## How to enable TTS (Text-to-Speech)?

```yaml
tts:
    enabled: true
    voices:
        zh: "zh-CN-XiaoxiaoNeural"
        en: "en-US-AriaNeural"
    max_chars: 500
```

Requires the Edge TTS library (`pip install edge-tts`).

## How to speed up embedding search with pgvector?

Install the pgvector extension and run the migration:

```bash
# Install pgvector (macOS)
brew install pgvector

# Run migration
psql -h localhost -U YOUR_USERNAME -d Riverse -f migrations/001_pgvector.sql
```

The application auto-detects pgvector and uses it when available.

## How to tune Session Memory?

Adjust `session_memory` in `settings.yaml`:

```yaml
session_memory:
    char_budget: 3000        # Increase for longer context
    keep_recent: 5           # More recent turns = more immediate context
    recall_max: 3            # More recalled turns from earlier in conversation
```

See [Memory & Sleep](features/memory.md#session-memory) for details.

## How to check if the API is healthy?

```bash
curl http://localhost:8400/health
# {"status": "ok", "db": true, "llm": true}
```

Returns `"degraded"` if only one service is reachable, `"error"` if both are down.

## Proactive messages not working?

1. Check `proactive.enabled: true` in `settings.yaml`
2. Check `timezone` is set correctly
3. Check current time is not within `quiet_hours`
4. Check `max_messages_per_day` hasn't been reached
5. Review logs for proactive scan output

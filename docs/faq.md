# FAQ

## PostgreSQL connection failed

Check that PostgreSQL is running:

```bash
pg_isready -h localhost
```

If your username is not `postgres`, update `database.user` in `settings.yaml`.

## Ollama model not found

```bash
ollama list
ollama pull <your-model>    # e.g. qwen2.5:14b, llama3, mistral
ollama pull bge-m3
```

## Telegram Bot not responding

1. Check `bot_token` is correct
2. Check `allowed_user_ids` includes your Telegram user ID
3. Check terminal log output

## Cloud-only without Ollama

Set `llm_provider: "openai"`, fill in API key, set `embedding.enabled: false`.

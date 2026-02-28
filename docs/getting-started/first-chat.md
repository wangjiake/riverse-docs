# First Chat

After installation and configuration, here's how to start your first conversation with Riverse.

## CLI Mode

The simplest way to get started:

```bash
source .venv/bin/activate
python -m agent.main
```

Type your messages directly in the terminal. Type `quit` or press `Ctrl+C` to exit — Sleep will automatically run to consolidate the conversation into memory.

## Telegram Bot

```bash
python -m agent.telegram_bot
```

Open your Telegram bot and start chatting. Supports:

- Text messages
- Voice messages (transcribed via Whisper)
- Images (analyzed via GPT-4 Vision / LLaVA)
- Files

Send `/new` to start a new session and trigger Sleep. Send `/sleep` to manually trigger memory consolidation without starting a new session.

## Discord Bot

```bash
python -m agent.discord_bot
```

## REST API

```bash
uvicorn agent.api:app --host 0.0.0.0 --port 8400
```

Send a message:

```bash
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, nice to meet you!"}'
```

## Web Dashboard

```bash
python web.py                          # Default port 1234
python web.py --port 8401              # Custom port
```

Visit `http://localhost:1234` to view:

- Profile overview (categories, timeline, confirmed/pending status)
- Relationship graph
- Trajectory analysis
- Observations
- Memory review (confirm, reject, resolve contradictions)
- Finance and health data

## Tips

!!! tip "Recommended: Telegram Bot"
    Since Riverse handles images, voice, and files, Telegram Bot is the recommended primary interface. Set your unique Telegram User ID in `settings.yaml`.

!!! info "On accuracy"
    No LLM today is specifically trained for personal profile extraction, so results may occasionally be off. When you spot something inaccurate, you can **reject** incorrect memories or **close** outdated ones in the Web Dashboard. Riverse intentionally does not allow manual editing — wrong memories are like sediment in a river, meant to be washed away by the current, not sculpted by hand. As conversations accumulate, the River Algorithm continuously self-corrects.

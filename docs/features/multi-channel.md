# Multi-Channel Access

Riverse supports multiple communication channels. All channels share the same memory and profile.

## Supported Channels

| Channel | Command | Description |
|---|---|---|
| CLI | `python -m agent.main` | Terminal-based interactive mode |
| Telegram Bot | `python -m agent.telegram_bot` | Supports text, voice, images |
| Discord Bot | `python -m agent.discord_bot` | Supports text, voice, images |
| REST API | `uvicorn agent.api:app --host 0.0.0.0 --port 8400` | HTTP endpoints |
| WebSocket | Included with REST API | Real-time bidirectional chat |
| Web Dashboard | `python web.py` | Profile viewer and memory management |

## Telegram Bot

The recommended primary interface — supports multi-modal input (text, voice, images).

Setup:

1. Create a bot via [@BotFather](https://t.me/BotFather) (`/newbot`)
2. Get your User ID from [@userinfobot](https://t.me/userinfobot)
3. Configure in `settings.yaml`:

```yaml
telegram:
  bot_token: "123456:ABC-DEF..."
  temp_dir: "tmp/telegram"
  allowed_user_ids: [your_user_id]
```

## Discord Bot

1. Create an application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Enable Message Content Intent on the Bot page
3. Invite bot to your server via OAuth2

```yaml
discord:
  bot_token: "your-discord-bot-token"
  allowed_user_ids: []           # Empty = allow all
```

## Web Dashboard

```bash
python web.py                          # Default port 1234
python web.py --port 8401              # Custom port
```

The dashboard shows:

- Profile overview (categories, timeline, confirmed/pending status)
- Relationship graph
- Trajectory analysis
- Observations
- Memory review (confirm, reject, resolve contradictions)
- Finance and health data

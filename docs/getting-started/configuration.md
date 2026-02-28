# Configuration

All settings are in one file — `settings.yaml` in the project root.

## Database

```yaml
database:
    name: "Riverse"
    user: "your_username"     # your PostgreSQL username
    host: "localhost"
```

!!! tip
    macOS Homebrew PostgreSQL typically uses your system username (run `whoami` to check). Linux/Windows installations usually default to `postgres`.

## Language

```yaml
language: "en"                  # en / zh / ja
```

## LLM Provider

=== "Local (Ollama)"

    ```bash
    ollama pull <your-model>         # e.g. qwen2.5:14b, llama3, mistral
    ollama pull bge-m3              # Embedding model (optional)
    ```

    ```yaml
    llm_provider: "local"

    local:
      model: "your-model"            # e.g. qwen2.5:14b, llama3, mistral
      api_base: "http://localhost:11434"
      temperature: 0.7              # Response randomness 0-1
      max_tokens: 2048              # Max response length
    ```

=== "Cloud-only (no Ollama)"

    ```yaml
    llm_provider: "openai"

    openai:
      model: "gpt-4o-mini"
      api_base: "https://api.openai.com"
      api_key: "sk-your-openai-api-key"
      temperature: 0.7
      max_tokens: 2048
    ```

!!! tip
    The `openai` config works with any OpenAI-compatible API: OpenAI / DeepSeek / Groq / local vLLM / etc. Just change `api_base` and `api_key`.

## Cloud LLM Fallback

Auto-escalates to cloud when local model quality is insufficient. Recommended even when using local models:

```yaml
cloud_llm:
  enabled: true
  providers:
    - name: "openai"
      model: "gpt-4o"
      api_base: "https://api.openai.com"
      api_key: "sk-your-openai-api-key"
      search: true              # Enable web search
      priority: 1
    - name: "deepseek"
      model: "deepseek-chat"
      api_base: "https://api.deepseek.com"
      api_key: "sk-your-deepseek-key"
      priority: 2
  escalation:
    auto: true                    # Auto-escalate on low quality
    feedback: true                # Notify user after escalation
    min_response_length: 20       # Replies shorter than this are low quality
    failure_keywords:             # Replies containing these trigger escalation
      - "I'm not sure"
      - "I cannot"
```

## Telegram Bot

1. Find [@BotFather](https://t.me/BotFather) on Telegram, send `/newbot` to create a bot and get the token
2. Get your user ID (pick one):
    - Send any message to [@userinfobot](https://t.me/userinfobot), it will reply with your ID
    - Or send a message to your bot, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Edit `settings.yaml`:

```yaml
telegram:
  bot_token: "123456:ABC-DEF..."
  temp_dir: "tmp/telegram"
  allowed_user_ids: [your_user_id]  # Only allow yourself
```

## Discord Bot (optional)

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) and create an application
2. Get the token on the Bot page, enable Message Content Intent
3. Invite the bot to your server via OAuth2 URL

```yaml
discord:
  bot_token: "your-discord-bot-token"
  allowed_user_ids: []           # Empty = allow all; fill IDs to restrict
```

## Embedding / Semantic Search (optional)

Enables searching memories by meaning instead of keywords. Requires Ollama with bge-m3:

```bash
ollama pull bge-m3
```

```yaml
embedding:
  enabled: true
  model: "bge-m3"
  api_base: "http://localhost:11434"
```

## Other Settings

```yaml
# Tools
tools:
  enabled: true
  shell_exec:
    enabled: false               # Disabled by default for safety

# TTS
tts:
  enabled: false

# MCP Protocol
mcp:
  enabled: false
  servers: []

# Proactive Outreach
proactive:
  enabled: true
  quiet_hours:
    start: "23:00"
    end: "08:00"
```

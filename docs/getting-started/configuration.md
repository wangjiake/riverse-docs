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

## Timezone

```yaml
timezone: "Asia/Tokyo"          # IANA format: Asia/Shanghai, America/New_York, etc.
```

Used for quiet hours and proactive messaging schedules.

## Database (Advanced)

```yaml
database:
    name: "Riverse"
    user: "your_username"
    host: "localhost"
    password: ""                # If your PostgreSQL requires a password
    port: 5432                  # Default PostgreSQL port
```

## Session Memory

Controls how the AI manages context within a single conversation:

```yaml
session_memory:
    char_budget: 3000           # Total character budget for context
    keep_recent: 5              # Recent turns kept verbatim
    summary_ratio: 0.4          # Budget fraction for summary
    recall_max: 3               # Max vector-recalled turns
    recall_min_score: 0.45      # Min similarity for recall
```

See [Memory & Sleep](../features/memory.md#session-memory) for details.

## Tools

```yaml
tools:
    enabled: true

    voice_transcribe:
        model: "whisper-1"
        language: "en"          # Voice language for transcription

    image_describe:
        provider: "openai"      # "openai" or "local" (Ollama LLaVA)
        model: "gpt-4o"

    file_read:
        enabled: true
        max_file_size: 1048576  # Max 1MB
        allowed_dirs: []        # Empty = no restriction

    shell_exec:
        enabled: false          # Disabled by default for security
        timeout: 30
        whitelist:
            - "ls"
            - "date"
            - "git status"

    web_search:                 # Auto-picks search-enabled model from cloud_llm
```

## Text-to-Speech

```yaml
tts:
    enabled: false
    voices:
        zh: "zh-CN-XiaoxiaoNeural"
        en: "en-US-AriaNeural"
    temp_dir: "tmp/tts"
    max_chars: 500              # Truncate if longer
```

## Embedding Search (Advanced)

```yaml
embedding:
    enabled: true
    model: "bge-m3"
    api_base: "http://localhost:11434"
    search:
        top_k: 5               # Number of top results
        min_score: 0.40         # Minimum similarity threshold
    clustering:
        enabled: false          # KMeans clustering of memory vectors
        show_themes: false      # Show cluster themes in context
```

## MCP Protocol

```yaml
mcp:
    enabled: false
    servers: []
```

## Proactive Outreach

```yaml
proactive:
    enabled: true
    scan_interval_minutes: 30
    quiet_hours:
        start: "23:00"
        end: "08:00"
    max_messages_per_day: 3
    min_gap_minutes: 120
    triggers:
        event_followup:
            enabled: true
            min_importance: 0.6
            followup_after_hours: 24
            max_age_days: 7
        strategy:
            enabled: true
        idle_checkin:
            enabled: true
            idle_hours: 48
```

# Built-in Tools

Riverse includes a pluggable tool system. The LLM automatically decides when to invoke tools based on the conversation context.

## Available Tools

| Tool | Description |
|---|---|
| Web Search | Search the web for current information (uses cloud LLM with `search: true`) |
| Vision | Image analysis via GPT-4 Vision / Ollama LLaVA |
| Voice | Speech-to-text via OpenAI Whisper-1 |
| File Read | Read local text files (.txt, .py, .yaml, .json, .md) |
| Shell Exec | Execute safe shell commands (whitelist-based, disabled by default) |
| Finance Tracking | Track and analyze financial data |
| Health Sync | Sync health data from Withings devices |

Additionally, **Text-to-Speech (TTS)** via Edge TTS is available in Telegram and Discord bots. TTS is not a registry tool — it is integrated directly into the bot response pipeline. Enable it in `settings.yaml`:

```yaml
tts:
  enabled: true
```

## Configuration

```yaml
tools:
  enabled: true
  shell_exec:
    enabled: false               # Disabled by default for safety
```

## Managing Tools from the Dashboard

Open the **System page → Tools** section to:

- **Toggle (ON/OFF)**: Click the ON/OFF badge on any tool card — takes effect after restart
- **Delete**: Click ✕ to remove a tool from the `tools.yaml` registry

No Python code changes needed.

## How Tools Work

1. On startup, `ToolRegistry` reads the tool list from `agent/tools/tools.yaml`
2. Each module is imported in order; `is_available()` is called on every `BaseTool` subclass found
3. Available tools are registered by their `manifest().name`
4. When the user sends a message, the LLM sees all tool manifests and decides which (if any) to call
5. The tool's `execute()` result is injected into the LLM's context for generating the final response

## Custom Tools

You can create your own tools by adding `.py` files to `agent/tools/`. See the [Custom Tool Development](../development/custom-tool.md) guide.

# Built-in Tools

Riverse includes a pluggable tool system. The LLM automatically decides when to invoke tools based on the conversation context.

## Available Tools

| Tool | Description |
|---|---|
| Web Search | Search the web for current information (uses cloud LLM with `search: true`) |
| Vision | Image analysis via GPT-4 Vision / Ollama LLaVA |
| Voice | Speech-to-text via OpenAI Whisper-1 |
| TTS | Text-to-speech via Edge TTS |
| File Read | Read local text files (.txt, .py, .yaml, .json, .md) |
| Shell Exec | Execute safe shell commands (whitelist-based, disabled by default) |
| Finance Tracking | Track and analyze financial data |
| Health Sync | Sync health data from Withings devices |

## Configuration

```yaml
tools:
  enabled: true
  shell_exec:
    enabled: false               # Disabled by default for safety
```

## How Tools Work

1. On startup, `ToolRegistry` scans every `.py` file in `agent/tools/` (skips files starting with `_`)
2. For each `BaseTool` subclass found, it calls `is_available()`
3. Available tools are registered by their `manifest().name`
4. When the user sends a message, the LLM sees all tool manifests and decides which (if any) to call
5. The tool's `execute()` result is injected into the LLM's context for generating the final response

## Custom Tools

You can create your own tools by adding `.py` files to `agent/tools/`. See the [Custom Tool Development](../development/custom-tool.md) guide.

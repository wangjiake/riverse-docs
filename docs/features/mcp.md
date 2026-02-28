# MCP Protocol

Riverse supports the **Model Context Protocol (MCP)** for connecting to external MCP servers like Gmail.

## Configuration

Enable MCP and configure servers in `settings.yaml`:

```yaml
mcp:
  enabled: true
  servers:
    - name: "gmail"
      command: "npx"
      args: ["-y", "@anthropic/mcp-gmail"]
```

## What is MCP?

The Model Context Protocol is a standard for connecting AI models to external data sources and tools. It allows Riverse to interact with services like:

- Gmail — read and send emails
- Other MCP-compatible servers

## How It Works

When MCP is enabled, Riverse connects to the configured MCP servers at startup. The LLM can then use the tools provided by these servers during conversations, just like built-in tools.

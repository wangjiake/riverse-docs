# MCP 协议

Riverse 支持 **Model Context Protocol (MCP)**，可连接 Gmail 等外部 MCP Server。

## 配置

在 `settings.yaml` 中启用 MCP 并配置服务器：

```yaml
mcp:
  enabled: true
  servers:
    - name: "gmail"
      command: "npx"
      args: ["-y", "@anthropic/mcp-gmail"]
```

## 什么是 MCP？

Model Context Protocol 是一种将 AI 模型连接到外部数据源和工具的标准协议。它允许 Riverse 与以下服务交互：

- Gmail — 阅读和发送邮件
- 其他 MCP 兼容服务

## 工作原理

启用 MCP 后，Riverse 在启动时连接到配置的 MCP 服务器。LLM 在对话中可以使用这些服务器提供的工具，就像使用内置工具一样。

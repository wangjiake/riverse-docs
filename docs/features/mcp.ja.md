# MCP プロトコル

Riverse は **Model Context Protocol (MCP)** をサポートしており、Gmail などの外部 MCP Server に接続できます。

## 設定

`settings.yaml` で MCP を有効化しサーバーを設定：

```yaml
mcp:
  enabled: true
  servers:
    - name: "gmail"
      command: "npx"
      args: ["-y", "@anthropic/mcp-gmail"]
```

## MCP とは？

Model Context Protocol は AI モデルを外部データソースやツールに接続するための標準プロトコルです。Riverse が以下のサービスと連携できるようになります：

- Gmail — メールの読み取りと送信
- その他の MCP 互換サービス

## 仕組み

MCP を有効にすると、Riverse は起動時に設定された MCP サーバーに接続します。LLM は会話中にこれらのサーバーが提供するツールをビルトインツールと同様に使用できます。

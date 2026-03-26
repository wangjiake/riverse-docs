# REST API リファレンス

API サーバーの起動：

```bash
uvicorn agent.api:app --host 127.0.0.1 --port 8400
```

## エンドポイント

| エンドポイント | メソッド | 説明 |
|---|---|---|
| `/chat` | POST | メッセージ送信、返信取得 |
| `/session/new` | POST | 新規セッション作成 |
| `/sleep` | POST | 記憶整理をトリガー |
| `/health` | GET | サービスの健全性チェック |
| `/profile` | GET | 現在のプロファイル取得 |
| `/hypotheses` | GET | 全仮説取得 |
| `/sessions` | GET | アクティブセッション一覧 |
| `/ws/chat` | WebSocket | リアルタイムチャット |

## POST /chat

メッセージを送信して返信を受け取る。

**リクエストボディ：**

| フィールド | 型 | デフォルト | 説明 |
|-----------|------|-----------|------|
| `message` | string | `""` | ユーザーのメッセージテキスト |
| `session_id` | string \| null | `null` | セッション ID（省略時は自動作成） |
| `input_type` | string | `"text"` | 入力タイプ：`"text"`、`"voice"`、`"image"`、`"file"` |
| `file_path` | string \| null | `null` | 添付ファイルのパス（音声/画像/ファイルタイプ用） |

**レスポンス：**

| フィールド | 型 | 説明 |
|-----------|------|------|
| `response` | string | AI の返信 |
| `session_id` | string | 使用されたセッション ID |
| `category` | string | 検出されたカテゴリ（例：`"chat"`、`"personal"`） |
| `intent` | string | 検出されたインテント |

```bash
# テキストメッセージ
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "こんにちは、初めまして！"}'

# セッション ID 指定
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "もっと教えて", "session_id": "abc-123"}'
```

## POST /session/new

新しい会話セッションを作成。

```bash
curl -X POST http://localhost:8400/session/new
# {"session_id": "...", "created_at": "2024-01-01T00:00:00"}
```

## POST /sleep

オフライン記憶統合（Sleep）をトリガー。

```bash
curl -X POST http://localhost:8400/sleep
# {"status": "ok", "message": "Memory consolidation complete"}
```

## GET /health

データベース接続と LLM API の到達性をチェック。

**レスポンス：**

| フィールド | 型 | 説明 |
|-----------|------|------|
| `status` | string | `"ok"`、`"degraded"`、または `"error"` |
| `db` | boolean | データベースが到達可能か |
| `llm` | boolean | LLM API が到達可能か |

正常時は HTTP 200、劣化またはエラー時は 503 を返します。

```bash
curl http://localhost:8400/health
# {"status": "ok", "db": true, "llm": true}
```

## GET /profile

会話から構築されたユーザープロファイルを取得。

```bash
curl http://localhost:8400/profile
```

## GET /hypotheses

システムがユーザーについて形成した全仮説をリスト。

```bash
curl http://localhost:8400/hypotheses
```

## GET /sessions

アクティブな会話セッションの一覧。

```bash
curl http://localhost:8400/sessions
```

## WebSocket /ws/chat

リアルタイム双方向チャットに接続。

**サーバーからのイベント：**

| イベント | フィールド | タイミング |
|---------|-----------|-----------|
| `session_created` | `session_id` | 接続時 |
| `response` | `response`、`category`、`intent` | メッセージ毎 |
| `error` | `detail` | エラー時 |

```javascript
const ws = new WebSocket("ws://localhost:8400/ws/chat");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "session_created") {
        console.log("セッション:", data.session_id);
    } else if (data.type === "response") {
        console.log("AI:", data.response);
    } else if (data.type === "error") {
        console.error("エラー:", data.detail);
    }
};

ws.send(JSON.stringify({ message: "こんにちは！" }));
```

!!! warning
    API には**組み込みの認証がありません**。認証付きリバースプロキシなしで公開インターネットに公開しないでください。

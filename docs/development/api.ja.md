# REST API リファレンス

API サーバーの起動：

```bash
uvicorn agent.api:app --host 0.0.0.0 --port 8400
```

## エンドポイント

| エンドポイント | メソッド | 説明 |
|---|---|---|
| `/chat` | POST | メッセージ送信、返信取得 |
| `/session/new` | POST | 新規セッション作成 |
| `/sleep` | POST | 記憶整理をトリガー |
| `/profile` | GET | 現在のプロファイル取得 |
| `/hypotheses` | GET | 全仮説取得 |
| `/sessions` | GET | アクティブセッション一覧 |
| `/ws/chat` | WebSocket | リアルタイムチャット |

## POST /chat

メッセージを送信して返信を受け取る。

```bash
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "こんにちは、初めまして！"}'
```

## POST /session/new

新しい会話セッションを作成。

```bash
curl -X POST http://localhost:8400/session/new
```

## POST /sleep

オフライン記憶統合（Sleep）をトリガー。

```bash
curl -X POST http://localhost:8400/sleep
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

```javascript
const ws = new WebSocket("ws://localhost:8400/ws/chat");
ws.onmessage = (event) => console.log(event.data);
ws.send(JSON.stringify({ message: "こんにちは！" }));
```

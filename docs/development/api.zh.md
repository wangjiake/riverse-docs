# REST API 参考

启动 API 服务：

```bash
uvicorn agent.api:app --host 0.0.0.0 --port 8400
```

## 端点列表

| 端点 | 方法 | 说明 |
|---|---|---|
| `/chat` | POST | 发送消息，获取回复 |
| `/session/new` | POST | 创建新会话 |
| `/sleep` | POST | 触发记忆整理 |
| `/profile` | GET | 获取当前画像 |
| `/hypotheses` | GET | 获取所有假设 |
| `/sessions` | GET | 列出活跃会话 |
| `/ws/chat` | WebSocket | 实时对话 |

## POST /chat

发送消息并接收回复。

```bash
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，很高兴认识你！"}'
```

## POST /session/new

创建新的对话会话。

```bash
curl -X POST http://localhost:8400/session/new
```

## POST /sleep

触发离线记忆整理（Sleep）。

```bash
curl -X POST http://localhost:8400/sleep
```

## GET /profile

获取从对话中构建的用户画像。

```bash
curl http://localhost:8400/profile
```

## GET /hypotheses

列出系统对用户形成的所有假设。

```bash
curl http://localhost:8400/hypotheses
```

## GET /sessions

列出所有活跃的对话会话。

```bash
curl http://localhost:8400/sessions
```

## WebSocket /ws/chat

连接进行实时双向对话。

```javascript
const ws = new WebSocket("ws://localhost:8400/ws/chat");
ws.onmessage = (event) => console.log(event.data);
ws.send(JSON.stringify({ message: "你好！" }));
```

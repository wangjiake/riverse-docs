# REST API Reference

Start the API server:

```bash
uvicorn agent.api:app --host 0.0.0.0 --port 8400
```

## Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/chat` | POST | Send message, get reply |
| `/session/new` | POST | Create new session |
| `/sleep` | POST | Trigger memory consolidation |
| `/profile` | GET | Get current profile |
| `/hypotheses` | GET | Get all hypotheses |
| `/sessions` | GET | List active sessions |
| `/ws/chat` | WebSocket | Real-time chat |

## POST /chat

Send a message and receive a reply.

```bash
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, nice to meet you!"}'
```

## POST /session/new

Create a new conversation session.

```bash
curl -X POST http://localhost:8400/session/new
```

## POST /sleep

Trigger offline memory consolidation (Sleep).

```bash
curl -X POST http://localhost:8400/sleep
```

## GET /profile

Retrieve the current user profile built from conversations.

```bash
curl http://localhost:8400/profile
```

## GET /hypotheses

List all hypotheses the system has formed about the user.

```bash
curl http://localhost:8400/hypotheses
```

## GET /sessions

List all active conversation sessions.

```bash
curl http://localhost:8400/sessions
```

## WebSocket /ws/chat

Connect for real-time bidirectional chat.

```javascript
const ws = new WebSocket("ws://localhost:8400/ws/chat");
ws.onmessage = (event) => console.log(event.data);
ws.send(JSON.stringify({ message: "Hello!" }));
```

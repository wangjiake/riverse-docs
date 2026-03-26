# REST API Reference

Start the API server:

```bash
uvicorn agent.api:app --host 127.0.0.1 --port 8400
```

## Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/chat` | POST | Send message, get reply |
| `/session/new` | POST | Create new session |
| `/sleep` | POST | Trigger memory consolidation |
| `/health` | GET | Check service health |
| `/profile` | GET | Get current profile |
| `/hypotheses` | GET | Get all hypotheses |
| `/sessions` | GET | List active sessions |
| `/ws/chat` | WebSocket | Real-time chat |

## POST /chat

Send a message and receive a reply.

**Request body:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `message` | string | `""` | The user's message text |
| `session_id` | string \| null | `null` | Session ID (auto-created if omitted) |
| `input_type` | string | `"text"` | Input type: `"text"`, `"voice"`, `"image"`, `"file"` |
| `file_path` | string \| null | `null` | Path to attached file (for voice/image/file types) |

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | string | The AI's reply |
| `session_id` | string | Session ID used |
| `category` | string | Detected category (e.g. `"chat"`, `"personal"`) |
| `intent` | string | Detected intent |

```bash
# Text message
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, nice to meet you!"}'

# With session ID
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me more", "session_id": "abc-123"}'
```

## POST /session/new

Create a new conversation session.

```bash
curl -X POST http://localhost:8400/session/new
# {"session_id": "...", "created_at": "2024-01-01T00:00:00"}
```

## POST /sleep

Trigger offline memory consolidation (Sleep).

```bash
curl -X POST http://localhost:8400/sleep
# {"status": "ok", "message": "Memory consolidation complete"}
```

## GET /health

Check database connectivity and LLM API reachability.

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"ok"`, `"degraded"`, or `"error"` |
| `db` | boolean | Database reachable |
| `llm` | boolean | LLM API reachable |

Returns HTTP 200 when healthy, 503 when degraded or error.

```bash
curl http://localhost:8400/health
# {"status": "ok", "db": true, "llm": true}
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

**Events from server:**

| Event | Fields | When |
|-------|--------|------|
| `session_created` | `session_id` | On connection |
| `response` | `response`, `category`, `intent` | After each message |
| `error` | `detail` | On error |

```javascript
const ws = new WebSocket("ws://localhost:8400/ws/chat");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "session_created") {
        console.log("Session:", data.session_id);
    } else if (data.type === "response") {
        console.log("AI:", data.response);
    } else if (data.type === "error") {
        console.error("Error:", data.detail);
    }
};

ws.send(JSON.stringify({ message: "Hello!" }));
```

!!! warning
    The API has **no built-in authentication**. Do not expose to the public internet without a reverse proxy with authentication.

# REST API 参考

启动 API 服务：

```bash
uvicorn agent.api:app --host 127.0.0.1 --port 8400
```

## 端点列表

| 端点 | 方法 | 说明 |
|---|---|---|
| `/chat` | POST | 发送消息，获取回复 |
| `/session/new` | POST | 创建新会话 |
| `/sleep` | POST | 触发记忆整理 |
| `/health` | GET | 检查服务健康状态 |
| `/profile` | GET | 获取当前画像 |
| `/hypotheses` | GET | 获取所有假设 |
| `/sessions` | GET | 列出活跃会话 |
| `/ws/chat` | WebSocket | 实时对话 |

## POST /chat

发送消息并接收回复。

**请求体：**

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `message` | string | `""` | 用户的消息文本 |
| `session_id` | string \| null | `null` | 会话 ID（省略时自动创建） |
| `input_type` | string | `"text"` | 输入类型：`"text"`、`"voice"`、`"image"`、`"file"` |
| `file_path` | string \| null | `null` | 附件文件路径（用于语音/图片/文件类型） |

**响应：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `response` | string | AI 的回复 |
| `session_id` | string | 使用的会话 ID |
| `category` | string | 检测到的分类（如 `"chat"`、`"personal"`） |
| `intent` | string | 检测到的意图 |

```bash
# 文本消息
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，很高兴认识你！"}'

# 指定会话 ID
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "继续聊聊", "session_id": "abc-123"}'
```

## POST /session/new

创建新的对话会话。

```bash
curl -X POST http://localhost:8400/session/new
# {"session_id": "...", "created_at": "2024-01-01T00:00:00"}
```

## POST /sleep

触发离线记忆整理（Sleep）。

```bash
curl -X POST http://localhost:8400/sleep
# {"status": "ok", "message": "Memory consolidation complete"}
```

## GET /health

检查数据库连接和 LLM API 可达性。

**响应：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | string | `"ok"`、`"degraded"` 或 `"error"` |
| `db` | boolean | 数据库是否可达 |
| `llm` | boolean | LLM API 是否可达 |

健康时返回 HTTP 200，降级或错误时返回 503。

```bash
curl http://localhost:8400/health
# {"status": "ok", "db": true, "llm": true}
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

**服务器事件：**

| 事件 | 字段 | 触发时机 |
|------|------|----------|
| `session_created` | `session_id` | 连接时 |
| `response` | `response`、`category`、`intent` | 每条消息后 |
| `error` | `detail` | 出错时 |

```javascript
const ws = new WebSocket("ws://localhost:8400/ws/chat");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "session_created") {
        console.log("会话:", data.session_id);
    } else if (data.type === "response") {
        console.log("AI:", data.response);
    } else if (data.type === "error") {
        console.error("错误:", data.detail);
    }
};

ws.send(JSON.stringify({ message: "你好！" }));
```

!!! warning
    API **没有内置认证**。未经过带认证的反向代理，请勿暴露到公网。

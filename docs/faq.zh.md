# 常见问题

## PostgreSQL 连接失败

确认 PostgreSQL 正在运行：

```bash
pg_isready -h localhost
```

如果用户名不是默认的 `postgres`，需要修改 `settings.yaml` 中的 `database.user`。如果 PostgreSQL 需要密码，请添加 `database.password`。

## Ollama 模型未找到

```bash
ollama list
ollama pull <your-model>    # 例如 qwen2.5:14b, llama3, mistral
ollama pull bge-m3          # 嵌入模型（可选）
```

## Telegram Bot 无响应

1. 确认 `bot_token` 正确
2. 确认 `allowed_user_ids` 包含你的 Telegram user ID
3. 查看终端输出的日志信息
4. 确认 Bot 没有在其他进程中运行

## 如何只用云端不用 Ollama

将 `llm_provider` 改为 `"openai"`，填入 API Key，将 `embedding.enabled` 设为 `false`。

## 如何配置时区？

在 `settings.yaml` 中使用 IANA 格式设置 `timezone`：

```yaml
timezone: "Asia/Shanghai"    # 或 America/New_York, Asia/Tokyo 等
```

这会影响静默时段和主动消息的时间安排。

## 如何启用 TTS（文字转语音）？

```yaml
tts:
    enabled: true
    voices:
        zh: "zh-CN-XiaoxiaoNeural"
        en: "en-US-AriaNeural"
    max_chars: 500
```

需要安装 Edge TTS 库（`pip install edge-tts`）。

## 如何用 pgvector 加速嵌入搜索？

安装 pgvector 扩展并运行迁移脚本：

```bash
# 安装 pgvector (macOS)
brew install pgvector

# 运行迁移
psql -h localhost -U YOUR_USERNAME -d Riverse -f migrations/001_pgvector.sql
```

应用会自动检测 pgvector 并在可用时使用。

## 如何调优会话记忆？

在 `settings.yaml` 中调整 `session_memory`：

```yaml
session_memory:
    char_budget: 3000        # 增大以获取更长上下文
    keep_recent: 5           # 更多近期轮次 = 更多即时上下文
    recall_max: 3            # 从对话早期召回更多轮次
```

详情参见[记忆与睡眠](features/memory.md#session-memory)。

## 如何检查 API 是否健康？

```bash
curl http://localhost:8400/health
# {"status": "ok", "db": true, "llm": true}
```

仅一个服务可达时返回 `"degraded"`，两个都不可达时返回 `"error"`。

## 主动消息不工作？

1. 确认 `settings.yaml` 中 `proactive.enabled: true`
2. 确认 `timezone` 设置正确
3. 确认当前时间不在 `quiet_hours` 范围内
4. 确认 `max_messages_per_day` 未达到上限
5. 查看日志中主动扫描的输出

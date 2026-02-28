# 常见问题

## PostgreSQL 连接失败

确认 PostgreSQL 正在运行：

```bash
pg_isready -h localhost
```

如果用户名不是默认的 `postgres`，需要修改项目根目录 `settings.yaml` 中的 `database.user`。

## Ollama 模型未找到

```bash
ollama list                     # 查看已安装模型
ollama pull <your-model>         # 例如 qwen2.5:14b, llama3, mistral
ollama pull bge-m3              # 安装嵌入模型
```

## Telegram Bot 无响应

1. 确认 `bot_token` 正确
2. 确认 `allowed_user_ids` 包含你的 Telegram user ID
3. 查看终端输出的日志信息

## 如何只用云端不用 Ollama

将 `llm_provider` 改为 `"openai"`，填入 API Key，将 `embedding.enabled` 设为 `false`。

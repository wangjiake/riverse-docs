# 配置

所有配置统一在项目根目录的 `settings.yaml` 中管理。

## 数据库

```yaml
database:
    name: "Riverse"
    user: "your_username"     # ← 改为你的 PostgreSQL 用户名
    host: "localhost"
```

!!! tip
    macOS Homebrew 安装的 PostgreSQL 用户名通常是你的系统用户名（终端执行 `whoami` 查看）；Linux/Windows 安装通常是 `postgres`。

## 语言

```yaml
language: "zh"                  # zh / en / ja
```

## LLM 配置

=== "本地 Ollama（推荐）"

    ```bash
    ollama pull <your-model>         # 例如 qwen2.5:14b, llama3, mistral
    ollama pull bge-m3              # 向量嵌入模型（可选）
    ```

    ```yaml
    llm_provider: "local"

    local:
      model: "your-model"            # 例如 qwen2.5:14b, llama3, mistral
      api_base: "http://localhost:11434"
      temperature: 0.7              # 回复随机性 0-1
      max_tokens: 2048              # 最大回复长度
    ```

=== "纯云端（不需要 Ollama）"

    ```yaml
    llm_provider: "openai"

    openai:
      model: "gpt-4o-mini"
      api_base: "https://api.openai.com"
      api_key: "sk-your-openai-api-key"
      temperature: 0.7
      max_tokens: 2048
    ```

!!! tip
    `openai` 配置支持所有 OpenAI 兼容接口：OpenAI / DeepSeek / Groq / 本地 vLLM 等。只需修改 `api_base` 和 `api_key`。

## 云端 LLM（兜底 + 网页搜索）

本地模型回答质量不足时自动升级到云端。即使用本地模型也建议配置：

```yaml
cloud_llm:
  enabled: true
  providers:
    - name: "openai"
      model: "gpt-4o"
      api_base: "https://api.openai.com"
      api_key: "sk-your-openai-api-key"
      search: true              # 启用网页搜索能力
      priority: 1
    - name: "deepseek"
      model: "deepseek-chat"
      api_base: "https://api.deepseek.com"
      api_key: "sk-your-deepseek-key"
      priority: 2
  escalation:
    auto: true                    # 自动升级
    feedback: true                # 升级后告知用户
    min_response_length: 20       # 回复少于此字数视为低质量
    failure_keywords:             # 包含这些关键词视为失败
      - "我不确定"
      - "我无法"
```

## Telegram Bot

1. 在 Telegram 找 [@BotFather](https://t.me/BotFather)，发 `/newbot` 创建 Bot，获取 Token
2. 获取你的 user ID（二选一）：
    - 给 [@userinfobot](https://t.me/userinfobot) 发任意消息，它会回复你的 ID
    - 或给 Bot 发一条消息，然后访问 `https://api.telegram.org/bot<TOKEN>/getUpdates` 查看
3. 填入配置：

```yaml
telegram:
  bot_token: "123456:ABC-DEF..."
  temp_dir: "tmp/telegram"
  allowed_user_ids: [your_user_id]  # 只允许你自己使用
```

## Discord Bot（可选）

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications) 创建应用
2. 在 Bot 页面获取 Token，开启 Message Content Intent
3. 用 OAuth2 URL 邀请 Bot 到你的服务器

```yaml
discord:
  bot_token: "your-discord-bot-token"
  allowed_user_ids: []           # 空 = 允许所有人；填 ID 则限制
```

## 向量嵌入（可选，默认关闭）

启用后可按语义搜索记忆（而非关键词匹配）。需要 Ollama 运行 bge-m3 模型：

```bash
ollama pull bge-m3
```

```yaml
embedding:
  enabled: true
  model: "bge-m3"
  api_base: "http://localhost:11434"
```

## 其他可选配置

```yaml
# 工具
tools:
  enabled: true
  shell_exec:
    enabled: false               # 安全考虑默认禁用

# TTS 文字转语音
tts:
  enabled: false

# MCP 协议
mcp:
  enabled: false
  servers: []

# 主动推送
proactive:
  enabled: true
  quiet_hours:
    start: "23:00"
    end: "08:00"
```

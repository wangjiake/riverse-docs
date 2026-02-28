# 多渠道接入

Riverse 支持多种通信渠道，所有渠道共享同一份记忆和画像。

## 支持的渠道

| 渠道 | 命令 | 说明 |
|---|---|---|
| CLI | `python -m agent.main` | 终端交互模式 |
| Telegram Bot | `python -m agent.telegram_bot` | 支持文本、语音、图片、文件 |
| Discord Bot | `python -m agent.discord_bot` | 文本聊天 |
| REST API | `uvicorn agent.api:app --host 0.0.0.0 --port 8400` | HTTP 端点 |
| WebSocket | 包含在 REST API 中 | 实时双向对话 |
| Web 仪表盘 | `python web.py` | 画像查看和记忆管理 |

## Telegram Bot

推荐的主要聊天入口 — 支持多模态输入（文本、语音、图片、文件）。

设置：

1. 通过 [@BotFather](https://t.me/BotFather) 创建 Bot（`/newbot`）
2. 从 [@userinfobot](https://t.me/userinfobot) 获取你的 User ID
3. 在 `settings.yaml` 中配置：

```yaml
telegram:
  bot_token: "123456:ABC-DEF..."
  temp_dir: "tmp/telegram"
  allowed_user_ids: [your_user_id]
```

## Discord Bot

1. 在 [Discord Developer Portal](https://discord.com/developers/applications) 创建应用
2. 在 Bot 页面开启 Message Content Intent
3. 用 OAuth2 URL 邀请 Bot 到服务器

```yaml
discord:
  bot_token: "your-discord-bot-token"
  allowed_user_ids: []           # 空 = 允许所有人
```

## Web 仪表盘

```bash
python web.py                          # 默认端口 1234
python web.py --port 8401              # 指定端口
```

仪表盘功能：

- 画像总览（分类、时间线、确认/待确认状态）
- 人际关系图
- 人物轨迹分析
- 观察记录
- 人工审核（编辑、确认、驳回、解决矛盾）
- 财务数据、健康数据

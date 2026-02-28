# 第一次对话

安装和配置完成后，以下是开始第一次对话的方法。

## CLI 交互模式

最简单的入门方式：

```bash
source .venv/bin/activate
python -m agent.main
```

在终端中直接输入文字对话，输入 `quit` 或按 `Ctrl+C` 退出。退出时会自动触发 Sleep 整理记忆。

## Telegram Bot

```bash
python -m agent.telegram_bot
```

打开 Telegram 与 Bot 对话。支持：

- 文本消息
- 语音消息（通过 Whisper 转写）
- 图片（通过 GPT-4 Vision / LLaVA 分析）

发送 `/new` 开始新会话并触发 Sleep。

## Discord Bot

```bash
python -m agent.discord_bot
```

## REST API

```bash
uvicorn agent.api:app --host 0.0.0.0 --port 8400
```

发送消息：

```bash
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，很高兴认识你！"}'
```

## Web 仪表盘

```bash
python web.py                          # 默认端口 1234
python web.py --port 8401              # 指定端口
```

浏览器访问 `http://localhost:1234`，可查看：

- 画像总览（分类、时间线、确认/待确认状态）
- 人际关系图
- 人物轨迹分析
- 观察记录
- 人工审核（编辑、确认、驳回、解决矛盾）
- 财务数据、健康数据

## 提示

!!! tip "推荐：Telegram Bot"
    由于 Riverse 支持文本、语音和图片，建议使用 Telegram Bot 作为主要聊天入口，在 `settings.yaml` 中填入你唯一的 Telegram User ID。

!!! info "关于准确性"
    目前没有任何 LLM 是专门为个人画像提取训练的，提取结果可能偶尔出现偏差。发现不准确的内容时，可以在 Web 面板中**拒绝**错误记忆或**关闭**不再适用的记忆。Riverse 不支持手动编辑记忆内容 — 错误的记忆就像河流中的泥沙，应该被水流冲走，而不是人工雕刻河床。随着对话积累，河流算法会不断自我修正。

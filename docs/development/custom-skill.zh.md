# 自定义技能开发

技能是 YAML 定义的行为扩展，可以按关键词触发或定时执行。

## 技能文件位置

将 `.yaml` 文件放入 `agent/skills/` 目录，启动时自动加载。

## 技能类型

### 指令型技能（关键词触发）

触发时为 LLM 提供指令的简单技能：

```yaml
name: explain_code
description: 用户发代码时自动提供逐行解释
trigger:
  type: keyword
  keywords: ["解释代码", "explain code"]
instruction: |
  用户希望你解释代码。请：
  1. 先用一句话概括这段代码的功能
  2. 逐行或逐块解释关键逻辑
  3. 指出可能的改进点
enabled: true
```

### 工作流技能（定时触发）

按 cron 定时执行的技能：

```yaml
name: weekly_summary
description: 每周日晚上发送温馨周末问候
trigger:
  type: schedule
  cron: "0 20 * * 0"            # 每周日 20:00
steps:
  - respond: |
      写一条简短温馨的周末问候。
enabled: true
```

## 字段参考

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | 是 | 技能的唯一标识 |
| `description` | 是 | 技能功能描述（帮助 LLM 判断何时使用） |
| `trigger.type` | 是 | `keyword` 或 `schedule` |
| `trigger.keywords` | 关键词类型时 | 触发短语列表 |
| `trigger.cron` | 定时类型时 | cron 表达式 |
| `instruction` | 关键词类型时 | LLM 的指令 |
| `steps` | 定时类型时 | 要执行的操作列表 |
| `enabled` | 是 | `true` / `false` |

## 对话中创建技能

直接对 Bot 说即可：

> "创建一个技能，每两小时提醒我喝水"

> "帮我做一个技能，每天晚上 9 点总结我的一天"

Bot 会自动生成 YAML 并保存到 `agent/skills/`。

!!! tip
    对于 Telegram 定时技能，需要安装 job queue 扩展：`pip install "python-telegram-bot[job-queue]"`

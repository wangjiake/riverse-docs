# 技能系统

用简单的 YAML 文件创建自定义行为 — 按关键词或 cron 定时触发。

## 创建技能

在 `agent/skills/` 目录下创建 `.yaml` 文件即可定义技能。

### 关键词触发

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

### 定时触发

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

## 对话中创建技能

直接对 Bot 说"创建一个技能..."或"帮我做一个定时提醒..."，Bot 会自动生成 YAML 并保存。

## 自定义技能开发

更多详情参见[自定义技能开发](../development/custom-skill.md)指南。

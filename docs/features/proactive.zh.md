# 主动关怀

Riverse 可以主动联系你 — 跟进重要事件、空闲问候、策略提醒。

## 配置

```yaml
proactive:
  enabled: true
  scan_interval_minutes: 30       # 扫描间隔（分钟）
  quiet_hours:
    start: "23:00"
    end: "08:00"
  max_messages_per_day: 3         # 每天最多推送条数
  min_gap_minutes: 120            # 两次推送最小间隔（分钟）
```

## 触发类型

### 事件跟进

自动跟进重要事件（例如你提到的面试、旅行计划等）。

```yaml
proactive:
  triggers:
    event_followup:
      enabled: true
      min_importance: 0.6         # 最低重要性分数（0-1）
      followup_after_hours: 24    # 事件发生后等待多久再跟进
      max_age_days: 7             # 超过此天数的事件不再跟进
```

### 策略推送

基于画像策略洞察触发主动消息 — 例如根据对话中发现的模式建议行动。

```yaml
proactive:
  triggers:
    strategy:
      enabled: true
```

### 空闲问候

一段时间没聊天时发送友好消息。

```yaml
proactive:
  triggers:
    idle_checkin:
      enabled: true
      idle_hours: 48              # 静默超过此小时数后触发
```

## 工作原理

主动系统按 `scan_interval_minutes` 间隔定期扫描。每次扫描：

1. 检查是否在静默时段 — 如果是则跳过
2. 检查频率限制（`max_messages_per_day`、`min_gap_minutes`）
3. 依次评估每种触发类型
4. 如果触发条件满足，使用与普通对话相同的记忆和认知系统生成上下文相关的消息

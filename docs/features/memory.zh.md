# 记忆与 Sleep

## 持久记忆

Riverse 跨会话记忆，构建随你演化的用户画像。每一次对话都会加深对你性格、偏好、经历和人际关系的理解。

这由**河流算法**驱动 — 对话像水流，关键信息像河床泥沙一样沉淀，经过多轮验证逐步从"猜测"升级为"确认"再到"稳固"。

## Sleep — 离线记忆整合

Sleep 是 Riverse 消化对话、更新画像的过程。支持自动触发和手动触发：

| 触发方式 | 说明 |
|---|---|
| **Telegram** | 发送 `/new` — 重置会话并在后台运行 Sleep |
| **CLI** | 退出时自动执行（`quit` 或 Ctrl+C） |
| **REST API** | `POST /sleep` |
| **定时任务（推荐）** | 用 cron 设定每晚定时跑，整合一天的对话 |

### cron 示例

每天凌晨 0 点运行 Sleep：

```bash
# crontab -e
0 0 * * * cd /path/to/JKRiver && /path/to/python -c "from agent.sleep import run; run()"
```

## 语义搜索

开启向量嵌入（BGE-M3）后，Riverse 可以按语义而非关键词检索相关记忆。

```yaml
embedding:
  enabled: true
  model: "bge-m3"
  api_base: "http://localhost:11434"
```

## 记忆准确性

!!! info
    目前没有任何 LLM 是专门为个人画像提取训练的，提取结果可能偶尔出现偏差。发现不准确的内容时，可以在 Web 面板中**拒绝**错误记忆或**关闭**不再适用的记忆。Riverse 不支持手动编辑记忆内容 — 错误的记忆就像河流中的泥沙，应该被水流冲走，而不是人工雕刻河床。随着对话积累，河流算法会通过多轮验证和矛盾检测不断自我修正，画像会越来越准确。

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

## 知识网络

Sleep 还会构建**知识网络** — 用类型化的边连接相关的画像事实（如 `causes`、`related_to`、`contradicts`、`supports`）。让 AI 看到事实之间的结构关系，而不只是孤立的条目。

当事实被关闭或取代时，相关的边会自动清理。

## 记忆聚类

开启向量嵌入后，Sleep 还可以对记忆向量做 KMeans 聚类，并为每个簇生成主题标签，提供"鸟瞰"视角了解 AI 对你的认知全貌。

```yaml
embedding:
  clustering:
    enabled: true
    show_themes: true
```

## 语义搜索

开启向量嵌入（BGE-M3）后，Riverse 可以按语义而非关键词检索相关记忆。

```yaml
embedding:
  enabled: true
  model: "bge-m3"
  api_base: "http://localhost:11434"
```

## 会话记忆（Session Memory） {#session-memory}

会话记忆通过三层结构管理单次对话中的上下文：

1. **滑动摘要** — 旧对话被 LLM 压缩为滚动摘要，保留历史不超 token 限制
2. **向量召回** — 开启向量嵌入后，根据当前消息的语义相似度召回早期相关对话
3. **最近轮次** — 最近几轮对话完整保留，提供即时上下文

三层系统让对话可以无限进行而不丢失重要上下文。在 `settings.yaml` 中配置：

```yaml
session_memory:
    char_budget: 3000        # 会话上下文总字符预算
    keep_recent: 5           # 保留完整的最近轮次数
    summary_ratio: 0.4       # 摘要占预算的比例
    recall_max: 3            # 向量召回最大条数
    recall_min_score: 0.45   # 召回最低相似度
```

## pgvector 加速

默认情况下，向量以 JSONB 存储，余弦相似度在 Python 中计算。对于大数据集，安装 [pgvector](https://github.com/pgvector/pgvector) 扩展可显著提升性能：

```bash
# macOS
brew install pgvector

# Debian/Ubuntu
apt install postgresql-16-pgvector
```

然后运行迁移脚本：

```bash
psql -h localhost -U YOUR_USERNAME -d Riverse -f migrations/001_pgvector.sql
```

这会创建原生 `vector(1024)` 列和 IVFFlat 索引，实现快速近似最近邻搜索。应用会自动检测 pgvector 并在可用时使用，无需修改配置。

## 记忆准确性

!!! info
    目前没有任何 LLM 是专门为个人画像提取训练的，提取结果可能偶尔出现偏差。你可以在 Web 面板中将错误的记忆**标记为错误**，或手动**关闭**过期的记忆 — 但记忆不能被删除或直接修改。这是有意为之：河流算法将记忆视为审计记录，错误的记忆就像河流中的泥沙，应该被水流冲走，而不是人工雕刻河床。

    如果错误率较高，根本原因通常是 LLM 的理解能力，而非系统 Bug。建议切换更强的模型 — 记忆提取流程本身也是评估你的 LLM 是否适合此场景的实用基准。随着对话积累，算法会通过多轮验证和矛盾检测持续自我修正，画像会越来越准确。

# 安装

## 前置要求

| 依赖 | 说明 |
|---|---|
| Python 3.10+ | 运行时 |
| PostgreSQL 16+ | 数据存储 |
| Ollama | 本地 LLM 推理（可选，也可纯云端） |

## 克隆项目并安装依赖

```bash
git clone https://github.com/wangjiake/JKRiver.git
cd JKRiver
python3 -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

## 配置 PostgreSQL

```bash
# 创建数据库（根据你的 PostgreSQL 用户名调整）
createdb -h localhost -U your_username Riverse

# 建表
psql -h localhost -U your_username -d Riverse -f agent/schema.sql
```

!!! note
    Riverse 和 [河流算法 — AI 对话历史特别篇](https://github.com/wangjiake/RiverHistory) 共享同一个数据库。任一项目的建表命令都会创建两个项目所需的全部表。如果你已经运行过另一个项目的建表命令，可以跳过此步骤。

验证建表成功：

```bash
psql -h localhost -U your_username -d Riverse -c "\dt"
```

应看到 `conversation_turns`、`user_profile`、`observations` 等十余张表。

!!! tip
    如需定时技能支持（Telegram Job Queue）：
    ```bash
    pip install "python-telegram-bot[job-queue]"
    ```

## 拉取 Ollama 模型（可选）

如果使用本地 LLM：

```bash
ollama pull <your-model>         # 例如 qwen2.5:14b, llama3, mistral
ollama pull bge-m3              # 向量嵌入模型（可选）
```

## 启动

```bash
python -m agent.main                                    # CLI
uvicorn agent.api:app --host 0.0.0.0 --port 8400       # REST API
python web.py                                            # Web 仪表盘
python -m agent.telegram_bot                             # Telegram Bot
python -m agent.discord_bot                              # Discord Bot
```

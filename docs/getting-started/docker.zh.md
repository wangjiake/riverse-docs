# Docker

不想装 Python 和 PostgreSQL？通过 Docker 一键运行完整的 Riverse AI 系统 — 无需编辑任何配置文件，三条命令即可启动。

**自动启动三个服务：**

| 服务 | 地址 | 功能说明 |
|------|------|----------|
| **JKRiver** | http://localhost:1234 | 网页聊天 + 系统配置（API 密钥、语言等） |
| **RiverHistory** | http://localhost:2345 | 用户画像查看器 — 查看提取的性格、偏好、经历和人生时间线 |
| **API 文档** | http://localhost:8400/docs | 开发者 REST API 参考 |

## 前置要求

- 安装 [Docker Desktop](https://docs.docker.com/get-docker/)（已自带 Docker Compose）

## 快速开始

```bash
# 1. 获取 compose 文件
mkdir jkriver && cd jkriver
curl -O https://raw.githubusercontent.com/wangjiake/JKRiver/main/docker/docker-compose.yaml

# 2. 启动所有服务
docker compose pull && docker compose up -d

# 3. 获取访问 Token（首次启动时自动生成）
docker logs jkriver-jkriver-1 2>&1 | grep "Token:"
```

在浏览器打开 `http://localhost:1234`，输入 Token 后进入 **System** 页面配置 API Key 等设置即可。无需手动编辑任何配置文件。

> **Token 只生成一次。** 保存在 `./config/settings.yaml` 中，只要 `config/` 目录存在就无需再次查找。

## System 页面配置

登录后打开 **System** 页面（http://localhost:1234），所有配置均可在网页界面完成，无需编辑配置文件。

| 配置区域 | 可配置内容 |
|---------|-----------|
| **LLM** | AI 提供商（OpenAI / DeepSeek / Groq / Ollama）、模型名、API Key、API 地址 |
| **语言与时区** | LLM 提示词语言（zh / en / ja）、本地时区 |
| **Telegram** | 机器人 Token、允许使用的用户 ID |
| **Discord** | 机器人 Token |
| **记忆整理（Sleep）** | 整理模式（每日定时 / 每次聊天后 / 手动）、定时小时 |
| **工具** | 各工具的开关（网络搜索、财务、健康等） |
| **云端 LLM** | 用于网络搜索和兜底的额外提供商 |

配置立即保存到 `./config/settings.yaml`，重启后生效。

## 如何聊天

JKRiver 提供**多种方式**与 AI 聊天。所有对话都会被河流算法分析，持续丰富你的个人画像：

| 方式 | 配置 | 适合场景 |
|------|------|----------|
| **网页聊天** | 内置，直接打开 http://localhost:1234 | 浏览器随时访问 |
| **Telegram 机器人** | 在 System 页面设置 token，从 [@BotFather](https://t.me/BotFather) 获取 | 日常手机使用，最方便 |
| **Discord 机器人** | 在 System 页面设置 token，从 [Developer Portal](https://discord.com/developers/applications) 获取 | 社区/群组使用 |
| **命令行** | 无需额外配置 | 快速测试，不需要机器人 token |

**命令行** — 打开终端运行：
```bash
docker compose exec jkriver bash -c "cd /app && python -m agent.main"
```
在 `>` 提示符后输入消息，输入 `quit` 退出。退出时会自动运行记忆整理。

## 安全须知

!!! warning "部署到服务器前必读"

    JKRiver 设计为**单用户本地使用**。网页面板（端口 1234）受 Access Token 保护。但 **REST API（端口 8400）和 RiverHistory（端口 2345）没有认证**。部署到远程服务器时请遵循以下规则：

    **1. 不要将端口 8400 和 2345 暴露到公网**

    任何能访问这些端口的人都可以读取你的完整画像、健康数据、财务记录，并触发 LLM 调用。

    - **本地使用：** 没有问题 — 端口只在你的电脑上可访问。
    - **远程服务器：** 将端口绑定到 `127.0.0.1`，使用带认证的反向代理（Nginx/Caddy），或通过 SSH 隧道访问。

    ```yaml
    # docker-compose.yaml — 仅绑定到本机
    ports:
      - "127.0.0.1:8400:8400"   # 而不是 "8400:8400"
      - "127.0.0.1:2345:2345"   # 而不是 "2345:2345"
    ```

    **2. 不要暴露 PostgreSQL 端口 5432**

    默认的 Docker Compose 将 `5432` 端口映射到宿主机，且没有密码（`trust` 认证）。在远程服务器上，请删除 postgres 的 `ports` 配置或绑定到本机：

    ```yaml
    # docker-compose.yaml — postgres 部分
    ports:
      - "127.0.0.1:5432:5432"   # 或直接删除这一行
    ```

    **3. 使用 Telegram 机器人时设置 `TELEGRAM_ALLOWED_USERS`**

    如果不设置，**任何人**找到你的机器人都能跟它聊天 — 消耗你的 LLM API 额度并写入你的画像。

    在 System 页面设置，或通过环境变量传入：
    ```bash
    TELEGRAM_ALLOWED_USERS=123456789
    ```
    获取 Telegram 用户 ID：给 [@userinfobot](https://t.me/userinfobot) 发任意消息。

## 支持的 AI 模型

支持所有 OpenAI 兼容接口。在 **System** 页面（http://localhost:1234）配置，或在首次启动前通过环境变量设置：

| 提供商 | `OPENAI_API_BASE` | `OPENAI_MODEL` | 说明 |
|--------|-------------------|----------------|------|
| **OpenAI** | `https://api.openai.com` | `gpt-4o-mini` | 默认，质量好 |
| **DeepSeek** | `https://api.deepseek.com` | `deepseek-chat` | 最便宜，中文处理快 |
| **Groq** | `https://api.groq.com` | `llama-3.3-70b-versatile` | 有免费额度 |
| **Ollama**（本地） | — | — | 设置 `LLM_PROVIDER=local`，不需要 API 密钥 |

使用 Ollama 需要先在你的电脑上安装（`https://ollama.ai`），然后运行 `ollama pull qwen2.5:14b`。

## 体验 Demo

Demo 对话会在启动时自动导入。运行河流算法处理并查看提取的画像：

```bash
docker compose exec riverhistory bash -c "cd /app_work && python run.py demo max"
```

处理需要几分钟（会调用 AI 模型）。完成后打开 http://localhost:2345 查看结果 — 从 20 段对话中提取的完整人格画像。

处理完成后，AI 会**拥有 Demo 主人公的身份**。当你通过命令行、Telegram 或 Discord 聊天时，AI 已经了解这个角色 — 职业变迁、感情经历、性格特点和人生时间线。你可以问"我现在做什么工作？"或"说说我前女友"，AI 会根据提取的画像来回答。

在后续的命令行或 Telegram/Discord 聊天中，你可以体验实时的感知和记忆功能 — AI 会在对话中持续更新画像。如果想测试更多记忆能力，可以编辑 demo JSON 文件，添加更多人生事件、拉长时间线。

## 导入自己的数据

你可以导入自己在 ChatGPT、Claude 或 Gemini 上的真实对话记录。

> **建议：** 先用 Demo 体验一下速度和效果。处理大量真实数据可能需要几小时甚至更久。体验完 Demo 后，运行 `docker compose down -v` 清空数据库，再开始导入自己的数据。
>
> **费用提醒（远端 LLM API）：** 每条对话都会消耗 token。包含大量代码或超长消息的对话会消耗更多。越智能的模型（如 GPT-4o）画像质量越好，但费用越高；便宜的模型（如 GPT-4o-mini、DeepSeek）更快更省，但可能遗漏细节。也可以使用本地 Ollama 模型慢慢跑，完全免费。建议处理前检查导出数据，删除不需要的对话（如纯编程会话）。**请关注你的 API 账单。**

**第一步：导出数据**

| 平台 | 导出方式 |
|------|----------|
| **ChatGPT** | Settings → Data controls → Export data → 解压得到 `conversations.json` |
| **Claude** | Settings → Account → Export Data → 解压得到 `conversations.json` |
| **Gemini** | [Google Takeout](https://takeout.google.com/) → 选择 Gemini Apps → 解压 |

**第二步：放入 `data/` 文件夹**

在 `jkriver/` 目录下创建 `data/` 文件夹，把导出文件放进去：

```
jkriver/
├── docker-compose.yaml
├── config/                    ← 首次启动自动创建（存储你的配置）
└── data/                      ← 创建此目录存放导出文件
    ├── ChatGPT/               ← 把 conversations.json 放这里
    ├── Claude/                ← 把 conversations.json 放这里
    └── Gemini/                ← 把 Takeout 文件放这里
```

**第三步：导入并处理**

```bash
# 导入（选一个或多个）
docker compose exec riverhistory bash -c "cd /app_work && python import_data.py --chatgpt data/ChatGPT/conversations.json"
docker compose exec riverhistory bash -c "cd /app_work && python import_data.py --claude data/Claude/conversations.json"
docker compose exec riverhistory bash -c "cd /app_work && python import_data.py --gemini 'data/Gemini/我的活动记录.html'"

# 处理所有导入的数据
docker compose exec riverhistory bash -c "cd /app_work && python run.py all max"
```

打开 http://localhost:2345 查看你的个人画像。

## 配置说明

启动后，大部分配置可在 `http://localhost:1234` 的 **System** 页面修改。以下环境变量仅在首次启动时（`./config/settings.yaml` 创建之前）生效。

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `ACCESS_TOKEN` | *（自动生成）* | 网页面板访问 Token。未设置时首次启动自动生成 — 查看 `docker logs` 获取 |
| `TIMEZONE` | `Asia/Tokyo` | 你的本地时区（如 `Asia/Shanghai`、`America/New_York`）。用于 AI 感知你的本地时间 |
| `LANGUAGE` | `en` | LLM 提示词语言：`zh` 中文 / `en` 英文 / `ja` 日文 |
| `LLM_PROVIDER` | `openai` | `openai` = 远端 API / `local` = 本机 Ollama |
| `OPENAI_API_KEY` | | 你的 API 密钥（使用远端 API 时必填） |
| `OPENAI_API_BASE` | `https://api.openai.com` | API 地址（换 DeepSeek、Groq 等改这里） |
| `OPENAI_MODEL` | `gpt-4o-mini` | 使用哪个 AI 模型 |
| `OLLAMA_MODEL` | `qwen2.5:14b` | Ollama 模型名（当 `LLM_PROVIDER=local`） |
| `SLEEP_MODE` | `cron` | 记忆整理方式：`cron` = 每天定时 / `auto` = 每次聊天后 / `off` = 手动 |
| `SLEEP_CRON_HOUR` | `0` | 每天几点运行记忆整理（0-23） |
| `TELEGRAM_BOT_TOKEN` | | Telegram 机器人 token（从 [@BotFather](https://t.me/BotFather) 获取） |
| `TELEGRAM_ALLOWED_USERS` | | 允许使用机器人的 Telegram 用户 ID，逗号分隔，**不要加括号**（留空 = 所有人）。获取 ID：给 [@userinfobot](https://t.me/userinfobot) 发消息 |
| `DISCORD_BOT_TOKEN` | | Discord 机器人 token（从 [Developer Portal](https://discord.com/developers/applications) 获取） |

## 常用命令

```bash
# 启动 / 停止
docker compose up                  # 启动（前台运行，可看日志）
docker compose up -d               # 启动（后台运行）
docker compose down                # 停止（数据保留）
docker compose down -v             # 停止并删除所有数据

# 命令行聊天
docker compose exec jkriver bash -c "cd /app && python -m agent.main"

# 处理数据：run.py <来源> <数量>
#   来源：demo / chatgpt / claude / gemini / all（all = chatgpt+claude+gemini，不含 demo）
#   数量：max = 全部处理，或填数字如 50 = 从最早开始处理 50 条（适合先试水看费用）
#   可以随时中断，下次运行会自动跳过已处理的对话
docker compose exec riverhistory bash -c "cd /app_work && python run.py demo max"
docker compose exec riverhistory bash -c "cd /app_work && python run.py all max"
docker compose exec riverhistory bash -c "cd /app_work && python run.py chatgpt 50"

# 手动触发 Sleep（整理对话中的记忆，沉淀为画像）
curl -X POST http://localhost:8400/sleep

# 清空所有画像和记忆，保留原始对话数据（含 demo）
docker compose exec riverhistory bash -c "cd /app_work && python reset_db.py"

# 查看日志
docker compose logs -f             # 所有服务
docker compose logs -f jkriver     # 单个服务

# 更新到最新版本
docker compose pull && docker compose up -d

# 彻底重置（删除所有数据包括数据库）
docker compose down -v && docker compose up
```

## Demo 演示什么？

Demo 角色拥有充满矛盾的人生轨迹，用来测试河流算法的能力：

| 挑战 | 普通 RAG | 河流算法 |
|------|---------|----------|
| 先说"高级工程师"，后来承认是"测试" | 两个都存 | 用真相取代谎言 |
| 换了 4 个城市、4 份工作 | 全部返回 | 追踪时间线，知道当前状态 |
| 对父母、女朋友、同事说不同的谎 | 把谎话当事实 | 区分真实 vs 表述 |
| 前女友 → 分手 → 新女友 | 混在一起 | 标记前任为已结束，追踪现任 |
| "跑外卖丢人" → "那是人生最重要的几个月" | 矛盾 | 追踪态度演变 |

## 架构

```
docker compose up
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────┐  ┌────────────────┐  ┌───────────────────┐│
│  │ postgres │  │  riverhistory  │  │     jkriver       ││
│  │  :5432   │←─│  :2345 (web)   │  │  :1234 (网页聊天) ││
│  │          │  │  init schema   │  │  :8400 (api)       ││
│  │ Riverse  │←─│  load demo     │←─│  telegram bot      ││
│  │   (DB)   │  │  process data  │  │  discord bot       ││
│  └──────────┘  └────────────────┘  └───────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

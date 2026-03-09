# 对话历史导入 (RiverHistory)

RiverHistory 是河流算法的特别版，专注于从你的 **ChatGPT、Claude 和 Gemini 对话历史中批量提取个人画像**。它不需要实时对话，而是回溯分析你过去的 AI 聊天记录，构建出同样丰富的画像 — 性格特征、人生时间线、人际关系、职业变迁等。

RiverHistory 与 [JKRiver](https://github.com/wangjiake/JKRiver) 主项目共享同一个 PostgreSQL 数据库（`Riverse`）。从历史记录中提取的画像和通过实时对话构建的画像存储在一起，提供统一的视图。

**源代码：** [https://github.com/wangjiake/RiverHistory](https://github.com/wangjiake/RiverHistory)

## 演示数据集

内置三个演示角色，无需导入自己的数据即可测试系统：

| 参数 | 角色 | 语言 | 会话数 | 说明 |
|------|------|------|--------|------|
| `--demo` | 林雨桐 | 中文 | 50 | 一位经历职业变迁、感情纠葛和城市生活的年轻女性 — 测试算法处理矛盾和态度演变的能力 |
| `--demo2` | 沈一帆 | 中文 | 15 | 一位有艺术追求的建筑师 — 较短的数据集，适合快速测试 |
| `--demo3` | Jake Morrison | 英文 | 20 | 旧金山的软件工程师 — 英文演示 |

!!! note
    `--demo2` 和 `--demo3` 导入前会清空 demo 表。这意味着它们会替换之前加载的演示数据。`--demo` 则是追加导入，不会清空。

## 前置要求

| 依赖 | 说明 |
|------|------|
| Python 3.11+ | 运行环境 |
| PostgreSQL 16+ | 数据存储（与 JKRiver 共享） |
| LLM API 密钥 **或** Ollama | 用于画像提取的 AI 模型 |

## 快速开始（从源码）

```bash
# 1. 克隆仓库
git clone https://github.com/wangjiake/RiverHistory.git
cd RiverHistory

# 2. 创建虚拟环境
python3 -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

# 3. 安装依赖
pip install -r requirements.txt

# 4. 配置设置
cp settings.yaml settings.yaml   # 编辑此文件 — 设置数据库凭据和 LLM 配置
#    database.user: 你的 PostgreSQL 用户名（macOS/Linux 终端运行 whoami 查看）
#    llm_provider: "openai" 使用远端 API，"local" 使用 Ollama
#    openai.api_key: 你的 API 密钥（使用远端 API 时需要）
#    language: "zh" / "en" / "ja"

# 5. 初始化数据库（创建 Riverse 数据库和所有表）
python setup_db.py

# 6. 导入演示数据
python import_data.py --demo

# 7. 用河流算法处理
python run.py demo max

# 8. 查看提取的画像
python web.py
```

打开 [http://localhost:2345](http://localhost:2345) 查看网页画像查看器。

## 导出你的对话数据

导入之前，需要先从各平台导出数据：

| 平台 | 导出方式 |
|------|----------|
| **ChatGPT** | Settings → Data controls → Export data → 等邮件 → 下载解压 → 得到 `conversations.json` |
| **Claude** | Settings → Account → Export Data → 等邮件 → 下载解压 → 得到 `conversations.json` |
| **Gemini** | [Google Takeout](https://takeout.google.com/) → 只选择 "Gemini Apps" → 下载解压 |

将导出的文件放入 `data/` 目录：

```
RiverHistory/
├── settings.yaml
├── run.py
└── data/
    ├── ChatGPT/               ← 把 conversations.json 放这里
    ├── Claude/                ← 把 conversations.json 放这里
    └── Gemini/                ← 把 Takeout 文件放这里
```

## 导入命令

```bash
# 从各平台导入（选一个或多个）
python import_data.py --chatgpt data/ChatGPT/conversations.json
python import_data.py --claude data/Claude/conversations.json
python import_data.py --gemini "data/Gemini/我的活动记录.html"

# 导入演示数据集
python import_data.py --demo       # 林雨桐（50 段会话，中文）
python import_data.py --demo2      # 沈一帆（15 段会话，中文 — 导入前清空 demo 表）
python import_data.py --demo3      # Jake Morrison（20 段会话，英文 — 导入前清空 demo 表）

# 可以在一条命令中组合多个来源
python import_data.py --chatgpt data/ChatGPT/conversations.json --claude data/Claude/conversations.json
```

导入是幂等的 — 重复的对话会根据校验和自动跳过。

## 处理命令

导入完成后，运行河流算法提取画像：

```bash
python run.py <来源> <数量>
```

| 参数 | 可选值 | 说明 |
|------|--------|------|
| `来源` | `chatgpt`、`claude`、`gemini`、`demo`、`all` | 处理哪个数据源。`all` 合并处理 chatgpt + claude + gemini（不含 demo）。 |
| `数量` | 数字或 `max` | 处理多少条对话。按时间顺序（最早优先）。`max` 处理所有待处理的。 |

**示例：**

```bash
python run.py demo max          # 处理所有演示对话
python run.py chatgpt 50        # 处理最早的 50 条 ChatGPT 对话
python run.py claude max        # 处理所有 Claude 对话
python run.py gemini 100        # 处理最早的 100 条 Gemini 对话
python run.py all max           # 处理全部（chatgpt + claude + gemini，按时间混合排序）
python run.py all 200           # 所有来源混合，处理最早的 200 条
```

处理过程**可以随时中断** — 下次运行会自动跳过已处理的对话。

## 重置

清空所有提取的画像和记忆，但保留原始导入的对话数据：

```bash
python reset_db.py
```

这会重置画像相关表（`user_profile`、`observations`、`hypotheses`、`trajectory_summary`、`relationships` 等），但不会动来源数据表（`chatgpt`、`claude`、`gemini`、`demo`）。你可以重新运行 `run.py` 从头处理。

## 网页查看器

```bash
python web.py
```

在 [http://localhost:2345](http://localhost:2345) 打开网页仪表盘，浏览提取的画像 — 性格维度、人生时间线、人际关系、职业经历等。

## Docker 方式

如果不想手动安装 Python 和 PostgreSQL，可以通过 Docker 运行 RiverHistory。参见 [Docker 指南](docker.md)，一条 `docker compose up` 命令即可同时启动 RiverHistory 和 JKRiver。

## 费用提醒

!!! warning "Token 费用（远端 LLM API）"
    每条对话在处理时都会消耗 token。包含大量代码或超长消息的对话会消耗更多。

    - **更智能的模型**（如 GPT-4o）画像质量更好，但费用更高。
    - **便宜的模型**（如 GPT-4o-mini、DeepSeek）更快更省，但可能遗漏细节。
    - **本地 Ollama 模型** 完全免费，只是速度较慢。

    处理前建议检查导出数据，删除不需要的对话（如纯编程会话）。**请关注你的 API 账单。**

    先用少量数据试试（如 `python run.py chatgpt 10`），估算费用后再处理全部。

## 准确性说明

!!! info "LLM 的局限性"
    画像提取依赖 LLM 对对话的理解。结果可能存在不准确之处：

    - LLM 可能将讽刺、玩笑或假设性陈述误解为事实。
    - 模糊或矛盾的表述可能被错误解读。
    - 不同模型产生不同质量的结果 — 可以尝试找到最适合你数据的模型。
    - 河流算法专门设计来处理矛盾和演变中的信息，但没有系统是完美的。

    请务必检查提取的画像是否准确。如有需要，可以重置后换一个模型重新处理。

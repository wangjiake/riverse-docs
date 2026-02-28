# Python SDK (riverse)

将 River Algorithm 记忆能力集成到你自己的 Python 应用中。

## 安装

```bash
pip install riverse
```

PyPI: [pypi.org/project/riverse](https://pypi.org/project/riverse/) · GitHub: [github.com/wangjiake/riverse](https://github.com/wangjiake/riverse)

## 快速开始

```python
from riverse import Riverse

r = Riverse(
    api_key="sk-...",
    api_base="https://api.deepseek.com",
    model="deepseek-chat",
    language="zh",           # "en" | "zh" | "ja"
)

# 1. 存储对话
r.add(messages=[
    {"role": "user", "content": "我刚搬到东京，在 Google 找了份新工作。"},
    {"role": "assistant", "content": "太棒了！适应得怎么样？"},
], user_id="alex")

# 2. 运行 Sleep 巩固（River Algorithm 核心）
result = r.sleep(user_id="alex")
print(result)
# {'status': 'ok', 'processed': 2, 'new_facts': 3, 'contradictions': 0, ...}

# 3. 获取用户画像
profile = r.get_profile(user_id="alex")
for fact in profile:
    print(f"[{fact['layer']}] {fact['category']}/{fact['subject']}: {fact['value']}")

# 4. 搜索记忆
results = r.search("他住在哪里？", user_id="alex")

# 5. 获取用户模型（人格 + 轨迹）
model = r.get_user_model(user_id="alex")
```

## 配置

```python
r = Riverse(
    api_key="sk-...",                        # API 密钥
    api_base="https://api.openai.com",       # 或 DeepSeek/Ollama/Groq 地址
    model="gpt-4o-mini",                     # 模型名称
    language="zh",                           # 提示词语言："en" | "zh" | "ja"
    db_path="~/.riverse/memory.db",          # SQLite 路径
    temperature=0.7,
    max_tokens=4096,
)
```

### 支持的 API 提供商

| 提供商 | `api_base` | `model` |
|--------|-----------|---------|
| **OpenAI** | `https://api.openai.com` | `gpt-4o-mini` |
| **DeepSeek** | `https://api.deepseek.com` | `deepseek-chat` |
| **Groq** | `https://api.groq.com` | `llama-3.3-70b-versatile` |
| **Ollama** | `http://localhost:11434` | `llama3.1` |

## API 参考

### `r.add(messages, user_id, session_id=None)`

存储对话消息以供后续巩固。

- `messages` — 消息列表 `{"role": "user"|"assistant", "content": "..."}`
- `user_id` — 用户标识符
- `session_id` — 可选会话分组（省略则自动生成）

### `r.sleep(user_id)`

运行完整的 River Algorithm 巩固管线：

1. 提取观察、事件和关系
2. 与现有画像分类对比
3. 创建新事实，检测矛盾
4. 交叉验证可疑事实以晋升
5. 解决争议事实对
6. 更新成熟度衰减和用户模型
7. 生成轨迹摘要

返回操作计数的摘要字典。

### `r.get_profile(user_id)`

返回所有活跃的画像事实列表。

每个事实包含：`category`（分类）、`subject`（主题）、`value`（值）、`layer`（层级：`suspected`/`confirmed`/`closed`）、`evidence`（证据）、`created_at`（创建时间）等。

### `r.get_user_model(user_id)`

返回 `{"dimensions": [...], "trajectory": {...}}`。

- **dimensions** — 人格分析（沟通风格、信任程度、敏感度等）
- **trajectory** — 人生阶段、方向、关键锚点、不稳定领域

### `r.search(query, user_id, top_k=10)`

跨画像事实、事件和观察的关键词搜索。

## 语言设置

`language` 参数控制巩固过程中所有 LLM 内部提示词的语言。

| 值 | 语言 |
|----|------|
| `"en"` | 英文（默认） |
| `"zh"` | 中文 |
| `"ja"` | 日文 |

选择与用户对话匹配的语言以获得最佳提取效果。

## 矛盾检测

当跨对话检测到冲突信息时，River Algorithm 会：

1. 用新值创建新事实
2. 将旧事实标记为被取代
3. 记录矛盾证据链
4. 生成后续验证策略

```python
# 第 1 轮对话
r.add([{"role": "user", "content": "我在 Google 工作。"}], user_id="alex", session_id="s1")
r.sleep(user_id="alex")

# 第 2 轮对话 — 与第 1 轮矛盾
r.add([{"role": "user", "content": "我刚跳槽到微软了。"}], user_id="alex", session_id="s2")
r.sleep(user_id="alex")

# 画像现在显示微软，Google 的事实已被取代
profile = r.get_profile(user_id="alex")
```

## 三层置信度模型

事实经过置信度层级递进：

- **`suspected`** — 初始提取，未验证
- **`confirmed`** — 通过多次提及或佐证交叉验证
- **`closed`** — 被更新信息取代或过期

## 与 JKRiver 的区别

| | riverse（Python SDK） | JKRiver（完整应用） |
|---|---|---|
| **定位** | 集成到你自己应用的库 | 完整的 AI 助手 |
| **安装** | `pip install riverse` | Docker 或手动部署 |
| **存储** | SQLite（零配置） | PostgreSQL |
| **渠道** | 由你的代码决定 | Telegram、Discord、命令行、Web |
| **适用** | 给你的产品加上记忆能力 | 作为你的个人 AI 使用 |

完整版：[github.com/wangjiake/JKRiver](https://github.com/wangjiake/JKRiver)

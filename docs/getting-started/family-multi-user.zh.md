# 家庭多账号模式

一个 Riverse 部署，多个家庭成员各自有独立的对话历史、画像、记忆、财务/健康数据，共享同一个 Postgres 数据库，互不交叉。

## 概念

| 术语 | 含义 |
|------|------|
| **账号 (Account)** | `accounts` 表里的一行。有数字 `id`、内部名 `name`（如 `jk`、`wife`）、显示名 `display_name`。 |
| **Owner** | 账号的同义词。每条业务行（观察、画像事实、记忆快照、财务交易…）都带 `owner_id` 限定归属。 |
| **Admin** | `id=1` 的账号。首次 init 时自动创建。只有 admin 能邀请新成员、登出设备、修改家庭设置。 |
| **设备 (Device)** | `access_tokens` 表里的一行。一个浏览器会话一行。Token 明文只在浏览器 cookie 里，DB 只存 SHA-256 hash + 前 8 字符用于显示。 |
| **邀请 (Invite)** | admin 分享给家人的一次性 UUID URL。家人在自己设备打开即自动生成新的设备 token。 |

## 什么时候需要

**不需要**：

- 你是唯一用户，没别人用。

**需要**：

- 老婆 / 孩子 / 父母想有自己的对话和记忆，不和你的混。
- 在一台 VPS 上部署，全家从各自手机来用 agent。
- 想按人统计 LLM token 用量。

## 如何启用

### 1. 初始化数据库

第一次运行 `setup_db.py` 会自动播种 admin 账号。名字优先取 `settings.yaml.admin_name`，否则取系统用户 (`whoami`)，最后兜底 `jk`：

```yaml
# settings.yaml — 可选，自定义 admin 名字
admin_name: "alice"
admin_display_name: "Alice"
```

```bash
python3 setup_db.py
# → Seeded admin account: id=1 name='alice' display='Alice'
```

重复运行幂等——已有账号不会被覆盖（`ON CONFLICT DO NOTHING`）。

### 2. 添加家庭成员

在 JKRiver 网页：**System → 家庭成员 → + 添加成员**。

- **内部名**：唯一的英文标识，如 `wife`、`kid1`。这是 `--owner-name` 命中的字段。
- **显示名**：UI 上显示，可以含空格 / 中日文。

或直接用 SQL：

```sql
INSERT INTO accounts (name, display_name) VALUES ('wife', '老婆');
```

### 3. 邀请他们的设备

在 **System → 家庭成员 → 邀请新设备**：

1. 选邀请发给哪个成员。
2. 可选填备注（"老婆的 iPhone"、"客厅 iPad"）。
3. 点**生成** — 会出一个一次性 URL + QR 码。
4. 分享 URL（或让他们扫 QR）。
5. 他们在自己设备上给设备命个名，点**接受** → cookie 自动设好 → 登录到他们的账号。

邀请单次使用，24 小时过期。

### 4. 审批门（可选）

想更严的管控，可以让家人接受邀请后还要 admin 显式批准才能登录。`settings.yaml` 里打开：

```yaml
family:
    require_admin_approval: true
```

打开后，接受邀请的设备会停在 `pending_approval=true` 状态。家人看到"等待 admin 审批"页。admin 在 System 页**待审批设备** banner 里批准。

### 5. IM 映射（Telegram / Discord）

如果老婆主要用 Telegram bot 而不是网页，在 **System → 家庭成员 → + 添加 IM 映射** 把她的 Telegram user_id 映射到她的账号上。她发来的消息会自动按她的 `owner_id` 归类，不会进你的账。

映射存在 `channel_identities(channel, external_id, owner_id)`。bot 处理每条消息时查这张表（带短缓存），所以改完最多一分钟内生效。

## RiverHistory：批量历史导入到特定账号

跟 [RiverHistory](https://github.com/wangjiake/RiverHistory) 共享数据库做 ChatGPT/Claude/Gemini 历史导入时，RH 一次运行只往**一个** owner 名下写：

```bash
python3 run.py chatgpt 50                    # 自动选 owner（仅限单账号库）
python3 run.py chatgpt 50 --owner-name jk    # 写到 'jk' 账号
python3 run.py claude max --owner-name wife  # 写到 'wife' 账号
```

多账号库不带 `--owner-name` 直接运行的话，`run.py` 会列出所有账号让你指定。

## 隔离机制

每张业务表都有 `owner_id` 列（默认 1）。会话期间所有写入都带请求用户的 `owner_id`，所有读取都 `WHERE owner_id = ?` 过滤。涉及的表：

- `observations`、`user_profile`、`current_profile`、`user_model`
- `raw_conversations`、`conversation_turns`、`session_meta`、`session_tags`、`session_summaries`
- `memory_snapshot`、`memory_clusters`、`memory_embeddings`、`fact_edges`
- `strategies`、`trajectory_summary`、`relationships`、`review_log`
- `outsource_tasks`、`proactive_log`、`token_usage`
- `finance_transactions`、`withings_*`

Sleep 流水线现在按 **owner 循环** 跑，每个家人独立提取画像/记忆，不会交叉污染。

## 操作记录

每次成员管理、设备管理、邀请生成、IM 映射变更都记录在 `family_audit` 表里。在 System UI 的**操作记录**区域查看，支持分页。

## 限制

- 同一个浏览器 cookie 只能存一个设备 token —— 所以两个家人没法在同一个浏览器同时"登录"，需要用不同浏览器或不同 profile。
- IM bot 按 `channel_identities` 路由；如果没有映射，未知用户要么命中 `telegram.allowed_user_ids` 白名单，要么被拒绝。
- 所有账号共用同一份 LLM 后端配置（model、API key、云端 fallback 等）。每账号独立 LLM 密钥（暂）不支持。

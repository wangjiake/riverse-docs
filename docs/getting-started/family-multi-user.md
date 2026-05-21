# Family Multi-User Mode

One Riverse deployment, multiple family members — each with isolated chat history, profile, memory, finance/health data, all sharing the same Postgres database without crossing wires.

## Concepts

| Term | What it is |
|------|-----------|
| **Account** | A row in the `accounts` table. Has an integer `id`, an internal `name` (e.g. `jk`, `wife`), and a `display_name`. |
| **Owner** | Synonym for account. Every business row (observation, profile fact, memory snapshot, finance transaction…) carries `owner_id` to scope it. |
| **Admin** | The account with `id=1`. Created automatically at first init. Only the admin can invite new members, sign devices out, or change family settings. |
| **Device** | A row in `access_tokens`. One per browser session. The token plaintext only ever lives in the browser cookie — the DB stores SHA-256 hash + the first 8 chars for display. |
| **Invite** | A single-use UUID URL admin shares with a family member. Opening it on the family member's device mints a fresh device token automatically. |

## When you need it

You **don't** need this if:

- You're the only person using Riverse, period.

You **do** want it when:

- Your spouse / kid / parent want their own chat with their own memory, not mixed into yours.
- You're running on a single VPS and want each family member to talk to the agent from their own phone.
- You want per-person LLM token accounting.

## Set it up

### 1. Initialise the database

The admin account is seeded automatically the first time `setup_db.py` runs. Its name comes from `settings.yaml` if present, otherwise from the OS user (`whoami`), with `jk` as a final fallback.

```yaml
# settings.yaml — optional, customise the seed admin name
admin_name: "alice"
admin_display_name: "Alice"
```

```bash
python3 setup_db.py
# → Seeded admin account: id=1 name='alice' display='Alice'
```

Re-running is idempotent — existing accounts are kept (`ON CONFLICT DO NOTHING`).

### 2. Add a family member

Use the System page in the JKRiver web UI: **System → 家庭成员 → + Add member**.

- **Internal name**: a unique slug like `wife` or `kid1`. This is what `--owner-name` matches.
- **Display name**: shown in the UI, can contain spaces / CJK.

Or insert directly via SQL:

```sql
INSERT INTO accounts (name, display_name) VALUES ('wife', 'Wife');
```

### 3. Invite their device

In **System → 家庭成员 → 邀请新设备**:

1. Pick which family member the invite is for.
2. Optionally add a label ("Wife iPhone", "Living-room iPad").
3. Click **Generate** — you get a one-time URL plus a QR code.
4. Share the URL (or have them scan the QR).
5. On their device, they name the device and click **Accept** → cookie is set → they're logged in to their account.

The invite is single-use and expires in 24 hours.

### 4. Approval gate (optional)

For tighter control, require admin approval before a newly accepted invite is allowed in. Set in `settings.yaml`:

```yaml
family:
    require_admin_approval: true
```

With this on, accepting an invite parks the new device in `pending_approval=true`. The family member sees a "waiting for admin to approve" page. You then approve them in the System UI's **Pending devices** banner.

### 5. IM mappings (Telegram / Discord)

If your spouse uses your Telegram bot instead of the web UI, map their Telegram user_id to their account in **System → 家庭成员 → + 添加 IM 映射**. Their incoming messages get automatically tagged with their `owner_id`, not yours.

The mapping is stored in `channel_identities(channel, external_id, owner_id)`. The bot consults this table on each message (with a short cache) so changes take effect within a minute.

## RiverHistory: process history into one specific account

When the same DB is shared with [RiverHistory](https://github.com/wangjiake/RiverHistory) for batch importing exported ChatGPT/Claude/Gemini histories, RH writes everything under **one** chosen owner per run:

```bash
python3 run.py chatgpt 50                    # auto-pick owner (only works if 1 account exists)
python3 run.py chatgpt 50 --owner-name jk    # write under 'jk'
python3 run.py claude max --owner-name wife  # write under 'wife'
```

If you don't pass `--owner-name` in a multi-account DB, `run.py` lists the available accounts and asks you to specify one.

## How isolation actually works

Every business table has an `owner_id` column (default 1). All writes during a session carry the requesting user's `owner_id`; all reads filter `WHERE owner_id = ?`. The columns include:

- `observations`, `user_profile`, `current_profile`, `user_model`
- `raw_conversations`, `conversation_turns`, `session_meta`, `session_tags`, `session_summaries`
- `memory_snapshot`, `memory_clusters`, `memory_embeddings`, `fact_edges`
- `strategies`, `trajectory_summary`, `relationships`, `review_log`
- `outsource_tasks`, `proactive_log`, `token_usage`
- `finance_transactions`, `withings_*`

The sleep pipeline now loops *per owner* rather than processing one global pool, so each family member gets their own profile/memory extraction without cross-contamination.

## Audit log

Every membership / device / invite / IM-mapping change is recorded in `family_audit`. Visible in the System UI under **Activity**, with pagination.

## Limitations

- The same browser cookie can hold only one device token — so two family members can't both be "logged in" on the same browser at the same time. They'd use separate browsers or profiles.
- IM bots route by `channel_identities` mapping; without a mapping, unknown users hit the `telegram.allowed_user_ids` whitelist or get denied.
- All accounts share the same LLM backend config (model, API key, cloud-fallback settings). Per-account LLM keys are not (yet) supported.

# ファミリーマルチユーザーモード

1つの Riverse デプロイで複数の家族メンバーがそれぞれ独立した会話履歴・プロフィール・記憶・家計/健康データを持ちつつ、1つの Postgres を共有 — 互いに混ざらない。

## 概念

| 用語 | 意味 |
|------|------|
| **アカウント (Account)** | `accounts` テーブルの1行。数値 `id`、内部名 `name`（`jk`、`wife` など）、表示名 `display_name` を持つ。 |
| **Owner** | アカウントの同義語。すべての業務行（観察、プロフィール事実、記憶スナップショット、家計取引…）は `owner_id` で所有者を限定。 |
| **Admin** | `id=1` のアカウント。初回 init 時に自動作成。メンバー招待・デバイスログアウト・家族設定変更は admin のみ。 |
| **デバイス (Device)** | `access_tokens` テーブルの1行。ブラウザセッションごとに1つ。トークン平文はブラウザ cookie にのみ存在し、DB には SHA-256 ハッシュ + 先頭8文字（表示用）のみ保存。 |
| **招待 (Invite)** | admin が家族に共有する使い切り UUID URL。家族が自分のデバイスで開くと自動でデバイストークンが発行される。 |

## いつ使うか

**不要**：

- あなたが唯一のユーザーで、他に誰も使わない。

**有用**：

- 配偶者 / 子供 / 親に自分の対話と記憶を持たせたい、あなたのものと混ぜたくない。
- 1台の VPS にデプロイし、家族全員が自分のスマホからエージェントを使う。
- メンバーごとの LLM token 使用量を計測したい。

## セットアップ

### 1. データベース初期化

`setup_db.py` 初回実行時に admin アカウントが自動播種される。名前は `settings.yaml.admin_name` 優先、なければ OS ユーザー（`whoami`）、最終フォールバックは `jk`：

```yaml
# settings.yaml — 任意、admin 名をカスタマイズ
admin_name: "alice"
admin_display_name: "Alice"
```

```bash
python3 setup_db.py
# → Seeded admin account: id=1 name='alice' display='Alice'
```

冪等で再実行可（`ON CONFLICT DO NOTHING` で既存アカウントは保護）。

### 2. 家族メンバー追加

JKRiver の Web UI から：**System → 家庭成员 → + メンバー追加**。

- **内部名**：`wife`、`kid1` のようなユニークなスラグ。`--owner-name` がマッチするフィールド。
- **表示名**：UI に表示される、スペースや日本語可。

または SQL で直接：

```sql
INSERT INTO accounts (name, display_name) VALUES ('wife', '妻');
```

### 3. デバイス招待

**System → 家庭成员 → 新デバイス招待**：

1. どのメンバー宛の招待かを選ぶ。
2. ラベル（「妻の iPhone」「リビングの iPad」）を任意入力。
3. **生成** をクリック → 使い切り URL と QR コードが出る。
4. URL を共有（または QR をスキャンしてもらう）。
5. 家族側でデバイスに名前を付け **承諾** をクリック → cookie 自動設定 → 自分のアカウントでログイン完了。

招待は1回限り、24時間で失効。

### 4. 承認ゲート（任意）

より厳格な制御として、招待承諾後も admin の明示承認が必要にする。`settings.yaml` で：

```yaml
family:
    require_admin_approval: true
```

これを有効にすると、招待を承諾したデバイスは `pending_approval=true` で待機。家族には「admin の承認待ち」画面が表示される。admin は System UI の **承認待ちデバイス** バナーで承認する。

### 5. IM マッピング（Telegram / Discord）

配偶者が主に Telegram bot を使う場合、**System → 家庭成员 → + IM マッピング追加** で Telegram user_id を彼女のアカウントにマッピング。送信メッセージは自動的に彼女の `owner_id` でタグ付けされ、あなたの方に混ざらない。

マッピングは `channel_identities(channel, external_id, owner_id)` に保存。bot はメッセージごとにこのテーブルを参照する（短時間キャッシュあり）ので、変更は最大 1 分以内に反映。

## RiverHistory：履歴を特定アカウントに集約

[RiverHistory](https://github.com/wangjiake/RiverHistory) で同じ DB を共有して ChatGPT/Claude/Gemini 履歴をバッチインポートする場合、RH は1回の実行で**1つの** owner 名義のみに書き込む：

```bash
python3 run.py chatgpt 50                    # owner 自動選択（単一アカウントのみ）
python3 run.py chatgpt 50 --owner-name jk    # 'jk' に書き込み
python3 run.py claude max --owner-name wife  # 'wife' に書き込み
```

複数アカウントある DB で `--owner-name` を省くと、`run.py` は利用可能なアカウントを列挙して指定を求める。

## 分離の仕組み

すべての業務テーブルに `owner_id` カラム（デフォルト 1）。セッション中のすべての書き込みはリクエストユーザーの `owner_id` を保持し、すべての読み込みは `WHERE owner_id = ?` でフィルタ。対象テーブル：

- `observations`、`user_profile`、`current_profile`、`user_model`
- `raw_conversations`、`conversation_turns`、`session_meta`、`session_tags`、`session_summaries`
- `memory_snapshot`、`memory_clusters`、`memory_embeddings`、`fact_edges`
- `strategies`、`trajectory_summary`、`relationships`、`review_log`
- `outsource_tasks`、`proactive_log`、`token_usage`
- `finance_transactions`、`withings_*`

Sleep パイプラインは **owner ごとにループ** するようになり、各家族メンバーが独立してプロフィール/記憶抽出を行う。クロスコンタミネーションなし。

## 操作ログ

メンバー管理・デバイス管理・招待生成・IM マッピング変更はすべて `family_audit` テーブルに記録される。System UI の **操作記録** 領域でページング表示可能。

## 制限

- 同一ブラウザの cookie は1つのデバイストークンしか保持できない → 2人の家族が同じブラウザに同時「ログイン」はできない。別ブラウザまたは別プロファイルが必要。
- IM bot は `channel_identities` マッピングでルーティング。マッピングがない場合、未知のユーザーは `telegram.allowed_user_ids` ホワイトリストにヒットするか拒否される。
- 全アカウントで同じ LLM バックエンド設定を共有（model、API key、クラウドフォールバックなど）。アカウントごとの LLM キーは（まだ）非対応。

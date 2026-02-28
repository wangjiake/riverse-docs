# カスタムスキル開発

スキルは YAML で定義される動作拡張で、キーワードトリガーまたはスケジュール実行が可能です。

## スキルファイルの場所

`.yaml` ファイルを `agent/skills/` に配置。起動時に自動的にロードされます。

## スキルタイプ

### インストラクションスキル（キーワードトリガー）

トリガー時に LLM にインストラクションを提供するシンプルなスキル：

```yaml
name: explain_code
description: コードを送った時に自動で説明
trigger:
  type: keyword
  keywords: ["コード説明", "explain code"]
instruction: |
  コードをステップバイステップで説明してください：
  1. コードの機能を一文で要約
  2. キーロジックを行ごとに説明
  3. 改善点を指摘
enabled: true
```

### ワークフロースキル（スケジュール）

cron スケジュールで実行されるスキル：

```yaml
name: weekly_summary
description: 毎週日曜日に週末の挨拶を送信
trigger:
  type: schedule
  cron: "0 20 * * 0"            # 毎週日曜 20:00
steps:
  - respond: |
      短く温かい週末の挨拶を書いてください。
enabled: true
```

## フィールドリファレンス

| フィールド | 必須 | 説明 |
|-----------|------|------|
| `name` | はい | スキルの一意識別子 |
| `description` | はい | スキルの機能説明（LLM がいつ使うか判断に使用） |
| `trigger.type` | はい | `keyword` または `schedule` |
| `trigger.keywords` | keyword タイプ時 | トリガーフレーズのリスト |
| `trigger.cron` | schedule タイプ時 | cron 式 |
| `instruction` | keyword タイプ時 | LLM へのインストラクション |
| `steps` | schedule タイプ時 | 実行するアクションのリスト |
| `enabled` | はい | `true` / `false` |

## チャットでスキルを作成

Bot に直接話しかけるだけ：

> 「スキルを作って、2時間ごとに水を飲むよう思い出させて」

> 「毎晩9時に一日のまとめを送るスキルを作って」

Bot が自動的に YAML を生成し、`agent/skills/` に保存します。

!!! tip
    Telegram のスケジュールスキルには job queue 拡張のインストールが必要です：`pip install "python-telegram-bot[job-queue]"`

# スキルシステム

シンプルな YAML ファイルでカスタム動作を作成 — キーワードまたは cron スケジュールでトリガー。

## スキルの作成

`agent/skills/` に `.yaml` ファイルを作成してスキルを定義。

### キーワードトリガー

```yaml
name: explain_code
description: コードを送った時に自動で説明
trigger:
  type: keyword
  keywords: ["コード説明", "explain code"]
instruction: |
  ユーザーがコードの説明を求めています。以下の手順で：
  1. コードの目的を一文で要約
  2. 主要なロジックを行ごとまたはブロックごとに説明
  3. 改善点を指摘
enabled: true
```

### スケジュールトリガー

```yaml
name: weekly_summary
description: 毎週日曜日に週末の挨拶を送信
trigger:
  type: schedule
  cron: "0 20 * * 0"
steps:
  - respond: |
      短く温かい週末の挨拶を書いてください。
enabled: true
```

## チャットでスキルを作成

Bot に直接話しかけるだけでスキルを作成できます：

> 「スキルを作って、2時間ごとに水を飲むよう思い出させて」

Bot が自動的に YAML を生成し、`agent/skills/` に保存します。

## カスタムスキル開発

高度なスキル構築の詳細は[カスタムスキル開発](../development/custom-skill.md)ガイドをご参照ください。

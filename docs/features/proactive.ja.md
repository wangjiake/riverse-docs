# プロアクティブ通知

Riverse はプロアクティブにあなたに連絡できます — イベントのフォローアップ、アイドルチェックイン、タイムリーなリマインダー。

## 設定

```yaml
proactive:
  enabled: true
  scan_interval_minutes: 30       # スキャン間隔（分）
  quiet_hours:
    start: "23:00"
    end: "08:00"
  max_messages_per_day: 3         # 1日の最大メッセージ数
  min_gap_minutes: 120            # メッセージ間の最小間隔（分）
```

## トリガータイプ

### イベントフォローアップ

重要なイベントを自動的にフォローアップ（例：面接、旅行の計画など）。

```yaml
proactive:
  triggers:
    event_followup:
      enabled: true
      min_importance: 0.6         # 最小重要度スコア（0-1）
      followup_after_hours: 24    # フォローアップまでの待機時間
      max_age_days: 7             # これより古いイベントはフォローしない
```

### 戦略

プロフィール戦略の洞察に基づいてプロアクティブメッセージをトリガー — 会話で発見されたパターンに基づくアクション提案など。

```yaml
proactive:
  triggers:
    strategy:
      enabled: true
```

### アイドルチェックイン

しばらく会話がない時にフレンドリーなメッセージを送信。

```yaml
proactive:
  triggers:
    idle_checkin:
      enabled: true
      idle_hours: 48              # この時間沈黙後にチェックイン
```

## 仕組み

プロアクティブシステムは `scan_interval_minutes` 間隔で定期的にスキャンします。各スキャンで：

1. 静寂時間帯かどうかを確認 — 該当する場合はスキップ
2. レート制限を確認（`max_messages_per_day`、`min_gap_minutes`）
3. 各トリガータイプを順番に評価
4. トリガー条件が満たされた場合、通常の会話と同じメモリと認知システムを使用してコンテキストに即したメッセージを生成

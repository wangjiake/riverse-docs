# マルチチャネルアクセス

Riverse は複数の通信チャネルをサポートしています。すべてのチャネルで同じメモリとプロフィールを共有します。

## 対応チャネル

| チャネル | コマンド | 説明 |
|---|---|---|
| CLI | `python -m agent.main` | ターミナル対話モード |
| Telegram Bot | `python -m agent.telegram_bot` | テキスト、音声、画像対応 |
| Discord Bot | `python -m agent.discord_bot` | テキスト、音声、画像対応 |
| REST API | `uvicorn agent.api:app --host 127.0.0.1 --port 8400` | HTTP エンドポイント |
| WebSocket | REST API に含まれる | リアルタイム双方向チャット |
| Web ダッシュボード | `python scripts/start_local.py` | プロフィール表示、メモリ管理、派遣タスク |

## Telegram Bot

推奨メインインターフェース — マルチモーダル入力（テキスト、音声、画像）をサポート。

設定：

1. [@BotFather](https://t.me/BotFather) で Bot を作成（`/newbot`）
2. [@userinfobot](https://t.me/userinfobot) で User ID を取得
3. `settings.yaml` で設定：

```yaml
telegram:
  bot_token: "123456:ABC-DEF..."
  temp_dir: "tmp/telegram"
  allowed_user_ids: [your_user_id]
```

## Discord Bot

1. [Discord Developer Portal](https://discord.com/developers/applications) でアプリケーションを作成
2. Bot ページで Message Content Intent を有効化
3. OAuth2 でサーバーに招待

```yaml
discord:
  bot_token: "your-discord-bot-token"
  allowed_user_ids: []           # 空 = 全員許可
```

## Web ダッシュボード

```bash
python scripts/start_local.py          # 推奨：FastAPI + Flask を同時起動
```

手動起動の場合（両方必要）：

```bash
uvicorn agent.api:app --host 127.0.0.1 --port 8400
python web.py
```

ダッシュボード機能：

- プロフィール概要（カテゴリ、タイムライン、確認/未確認ステータス）
- 人間関係グラフ
- 軌跡分析
- 観察記録
- メモリレビュー（確認、拒否、矛盾の解決）
- 財務・健康データ

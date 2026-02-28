# マルチチャネルアクセス

Riverse は複数の通信チャネルをサポートしています。すべてのチャネルで同じメモリとプロフィールを共有します。

## 対応チャネル

| チャネル | コマンド | 説明 |
|---|---|---|
| CLI | `python -m agent.main` | ターミナル対話モード |
| Telegram Bot | `python -m agent.telegram_bot` | テキスト、音声、画像対応 |
| Discord Bot | `python -m agent.discord_bot` | テキスト、音声、画像対応 |
| REST API | `uvicorn agent.api:app --host 0.0.0.0 --port 8400` | HTTP エンドポイント |
| WebSocket | REST API に含まれる | リアルタイム双方向チャット |
| Web ダッシュボード | `python web.py` | プロフィール表示とメモリ管理 |

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
python web.py                          # デフォルトポート 1234
python web.py --port 8401              # ポート指定
```

ダッシュボード機能：

- プロフィール概要（カテゴリ、タイムライン、確認/未確認ステータス）
- 人間関係グラフ
- 軌跡分析
- 観察記録
- メモリレビュー（確認、拒否、矛盾の解決）
- 財務・健康データ

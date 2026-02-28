# 初めての会話

インストールと設定が完了したら、Riverse との初めての会話を始めましょう。

## CLI モード

最も簡単な始め方：

```bash
source .venv/bin/activate
python -m agent.main
```

ターミナルで直接メッセージを入力。`quit` または `Ctrl+C` で終了 — Sleep が自動的に実行され、会話が記憶に統合されます。

## Telegram Bot

```bash
python -m agent.telegram_bot
```

Telegram で Bot とチャットを開始。対応：

- テキストメッセージ
- 音声メッセージ（Whisper で文字起こし）
- 画像（GPT-4 Vision / LLaVA で分析）

`/new` を送信して新しいセッションを開始し、Sleep をトリガー。

## Discord Bot

```bash
python -m agent.discord_bot
```

## REST API

```bash
uvicorn agent.api:app --host 0.0.0.0 --port 8400
```

メッセージ送信：

```bash
curl -X POST http://localhost:8400/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "こんにちは、初めまして！"}'
```

## Web ダッシュボード

```bash
python web.py                          # デフォルトポート 1234
python web.py --port 8401              # ポート指定
```

`http://localhost:1234` にアクセス：

- プロフィール概要（カテゴリ、タイムライン、確認/未確認ステータス）
- 人間関係グラフ
- 軌跡分析
- 観察記録
- メモリレビュー（確認、拒否、矛盾の解決）
- 財務・健康データ

## ヒント

!!! tip "推奨：Telegram Bot"
    Riverse はテキスト、音声、画像をサポートするため、Telegram Bot をメインインターフェースとして使用することを推奨します。`settings.yaml` にあなた固有の Telegram User ID を設定してください。

!!! info "精度について"
    現在、個人プロファイル抽出に特化して訓練された LLM は存在しないため、抽出結果に誤りが含まれる場合があります。不正確な内容を見つけた場合は、Web ダッシュボードで誤った記憶を**拒否**するか、古くなった記憶を**クローズ**できます。Riverse は記憶内容の手動編集を意図的にサポートしていません — 誤った記憶は河の中の泥沙のように、水流に洗い流されるべきものです。会話が蓄積されるにつれ、河流アルゴリズムが継続的に自己修正します。

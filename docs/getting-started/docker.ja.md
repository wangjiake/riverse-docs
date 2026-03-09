# Docker

Python や PostgreSQL をインストールしたくない方へ。Docker を使って Riverse AI システム全体をワンクリックで実行できます。AI モデルの API キーを設定して、1 つのコマンドを実行するだけです。

**2 つのサービスが自動的に起動します：**

| サービス | URL | 機能 |
|----------|-----|------|
| **RiverHistory** | http://localhost:2345 | Web プロフィールビューアー — 抽出された性格、好み、経験、人生タイムラインを確認 |
| **JKRiver** | http://localhost:8400/docs | AI コアエンジン — REST API、チャットボット、記憶整理スケジューラー |

## チャット方法

JKRiver は **3 つの方法** で AI とチャットできます。すべての会話は River Algorithm で分析され、パーソナルプロフィールに反映されます：

| 方法 | 設定 | 最適な用途 |
|------|------|-----------|
| **Telegram Bot** | `.env` で `TELEGRAM_BOT_TOKEN` を設定、[@BotFather](https://t.me/BotFather) でトークン取得 | 日常のモバイル利用、最も便利 |
| **Discord Bot** | `.env` で `DISCORD_BOT_TOKEN` を設定、[Developer Portal](https://discord.com/developers/applications) でトークン取得 | コミュニティ / グループ利用 |
| **コマンドライン** | 追加設定不要 | クイックテスト、ボットトークン不要 |

**Telegram Bot** — @BotFather でボットを作成し、トークンを `.env` にコピー。アクセスを制限するには、`TELEGRAM_ALLOWED_USERS` にユーザー ID を設定（[@userinfobot](https://t.me/userinfobot) に任意のメッセージを送ると取得できます）。**括弧は付けない** — 数字のみ、例：`TELEGRAM_ALLOWED_USERS=123456789`。`docker compose up` 後、ボットに直接メッセージを送信。

**Discord Bot** — Discord Developer Portal でアプリケーションとボットを作成、トークンを `.env` にコピー。ボットをサーバーに招待。`docker compose up` 後、ボットにメンションまたは DM。

**コマンドライン** — ターミナルを開いて実行：
```bash
docker compose exec jkriver bash -c "cd /app_work && python -m agent.main"
```
`>` プロンプトでメッセージを入力、`quit` で終了。終了時に自動的に記憶整理が実行されます。

> REST API も利用可能です。開発者向けドキュメント：`http://localhost:8400/docs`。

## 前提条件

- [Docker Desktop](https://docs.docker.com/get-docker/) をインストール（Docker Compose 含む）

## クイックスタート

```bash
# 1. ファイルを取得
git clone https://github.com/wangjiake/JKRiver.git
cd JKRiver/docker

# 2. 設定ファイルを作成
cp .env.example .env

# 3. .env を編集 — API キーを入力（下の「対応 AI モデル」を参照）
#    最低限：OPENAI_API_KEY=sk-あなたのキー
#    LANGUAGE=zh/en/ja を設定 — LLM プロンプトの言語を制御（Web UIには影響しません）
#    チャット：TELEGRAM_BOT_TOKEN または DISCORD_BOT_TOKEN を設定（またはコマンドラインを使用）

# 4. すべてのサービスを起動
docker compose up
```

http://localhost:2345 を開いてプロフィールを確認。Telegram / Discord / コマンドラインでチャット。

## 対応 AI モデル

OpenAI 互換 API すべてに対応。`.env` を編集してプロバイダーを切り替え：

| プロバイダー | `OPENAI_API_BASE` | `OPENAI_MODEL` | 備考 |
|-------------|-------------------|----------------|------|
| **OpenAI** | `https://api.openai.com` | `gpt-4o-mini` | デフォルト、高品質 |
| **DeepSeek** | `https://api.deepseek.com` | `deepseek-chat` | 最安値、中国語が高速 |
| **Groq** | `https://api.groq.com` | `llama-3.3-70b-versatile` | 無料枠あり |
| **Ollama**（ローカル） | — | — | `LLM_PROVIDER=local` に設定、API キー不要 |

Ollama を使用するには、まずコンピュータにインストール（`https://ollama.ai`）し、`ollama pull qwen2.5:14b` を実行してください。

## デモを体験

デモ会話は起動時に自動インポートされます。River Algorithm で処理してプロフィールを確認：

```bash
docker compose exec riverhistory bash -c "cd /app_work && python run.py demo max"
```

処理には数分かかります（AI モデルを呼び出します）。完了後、http://localhost:2345 を開いて結果を確認 — 20 の会話から抽出された完全なプロフィール。

処理完了後、AI は**デモキャラクターのアイデンティティを持ちます**。コマンドライン、Telegram、Discord でチャットすると、AI はすでにこのキャラクターを知っています — 職歴の変遷、恋愛関係、性格特徴、人生のタイムライン。「今の仕事は？」や「元カノについて教えて」と聞けば、抽出されたプロフィールに基づいて回答します。

コマンドラインや Telegram/Discord での後続チャットでは、リアルタイムの感知と記憶機能を体験できます — AI は会話の中でプロフィールを継続的に更新します。より多くの記憶機能をテストしたい場合は、デモ JSON ファイルを編集して、より多くの人生イベントやタイムラインを追加できます。

## 自分のデータをインポート

ChatGPT、Claude、Gemini の実際の会話履歴をインポートできます。

> **推奨：** まずデモで速度と品質を体験してください。大量の実データ処理には数時間以上かかる場合があります。デモ体験後、`docker compose down -v` でデータベースをクリアし、自分のデータのインポートを開始してください。
>
> **費用に関する注意（リモート LLM API）：** 各会話はトークンを消費します。大量のコードや非常に長いメッセージを含む会話はより多く消費します。高性能モデル（GPT-4o など）はプロフィール品質が高いですがコストも高く、安価なモデル（GPT-4o-mini、DeepSeek など）は高速で安価ですが細部を見逃す可能性があります。ローカル Ollama モデルを使えば完全無料でゆっくり処理できます。処理前にエクスポートデータを確認し、不要な会話（純粋なコーディングセッション等）を削除してください。**API の請求額を確認してください。**

**ステップ 1：データをエクスポート**

| プラットフォーム | エクスポート方法 |
|-----------------|-----------------|
| **ChatGPT** | Settings → Data controls → Export data → 解凍して `conversations.json` を取得 |
| **Claude** | Settings → Account → Export Data → 解凍して `conversations.json` を取得 |
| **Gemini** | [Google Takeout](https://takeout.google.com/) → Gemini Apps を選択 → 解凍 |

**ステップ 2：`data/` フォルダに配置**

`docker-compose.yml` と同じディレクトリに `data/` フォルダを作成し、エクスポートファイルを配置：

```
JKRiver/docker/
├── docker-compose.yml
├── .env
└── data/                      ← 同梱済み
    ├── ChatGPT/               ← conversations.json をここに配置
    ├── Claude/                ← conversations.json をここに配置
    └── Gemini/                ← Takeout ファイルをここに配置
```

**ステップ 3：インポートと処理**

```bash
# インポート（1つまたは複数選択）
docker compose exec riverhistory bash -c "cd /app_work && python import_data.py --chatgpt data/ChatGPT/conversations.json"
docker compose exec riverhistory bash -c "cd /app_work && python import_data.py --claude data/Claude/conversations.json"
docker compose exec riverhistory bash -c "cd /app_work && python import_data.py --gemini 'data/Gemini/マイ アクティビティ.html'"

# インポートしたデータをすべて処理
docker compose exec riverhistory bash -c "cd /app_work && python run.py all max"
```

http://localhost:2345 を開いてプロフィールを確認。

## 設定リファレンス

| 設定項目 | デフォルト | 説明 |
|----------|-----------|------|
| `LANGUAGE` | `en` | LLM プロンプト言語：`zh` 中国語 / `en` 英語 / `ja` 日本語（Web UI には影響しません） |
| `LLM_PROVIDER` | `openai` | `openai` = リモート API / `local` = ローカル Ollama |
| `OPENAI_API_KEY` | | API キー（リモート API 使用時に必須） |
| `OPENAI_API_BASE` | `https://api.openai.com` | API エンドポイント（DeepSeek、Groq 等はここを変更） |
| `OPENAI_MODEL` | `gpt-4o-mini` | 使用する AI モデル |
| `OLLAMA_MODEL` | `qwen2.5:14b` | Ollama モデル名（`LLM_PROVIDER=local` の場合） |
| `DEMO_MODE` | `true` | 起動時にデモ会話をインポート |
| `DEMO_PROCESS` | `false` | 起動時にデモを自動処理（AI を使用、数分かかる） |
| `SLEEP_MODE` | `cron` | 記憶整理：`cron` = 毎日定時 / `auto` = チャット毎 / `off` = 手動 |
| `SLEEP_CRON_HOUR` | `0` | 毎日何時に記憶整理を実行（0-23） |
| `TELEGRAM_BOT_TOKEN` | | Telegram ボットトークン（[@BotFather](https://t.me/BotFather) で取得） |
| `TELEGRAM_ALLOWED_USERS` | | ボット使用を許可する Telegram ユーザー ID、カンマ区切り、**括弧不要**（空 = 全員）。ID 取得：[@userinfobot](https://t.me/userinfobot) にメッセージ |
| `DISCORD_BOT_TOKEN` | | Discord ボットトークン（[Developer Portal](https://discord.com/developers/applications) で取得） |

## よく使うコマンド

```bash
# 起動 / 停止
docker compose up                  # 起動（フォアグラウンド、ログ表示）
docker compose up -d               # 起動（バックグラウンド）
docker compose down                # 停止（データ保持）
docker compose down -v             # 停止してすべてのデータを削除

# コマンドラインチャット
docker compose exec jkriver bash -c "cd /app_work && python -m agent.main"

# データ処理：run.py <ソース> <件数>
#   ソース：demo / chatgpt / claude / gemini / all（all = chatgpt+claude+gemini、デモ除外）
#   件数：max = すべて処理、または数字（例: 50）= 最も古い 50 件から処理（コスト確認に最適）
#   中断しても安全 — 次回実行時に処理済み会話は自動スキップ
docker compose exec riverhistory bash -c "cd /app_work && python run.py demo max"
docker compose exec riverhistory bash -c "cd /app_work && python run.py all max"
docker compose exec riverhistory bash -c "cd /app_work && python run.py chatgpt 50"

# Sleep を手動トリガー（会話から記憶を整理し、プロフィールに沈殿）
curl -X POST http://localhost:8400/sleep

# すべてのプロフィールと記憶をクリア、元の会話データは保持（デモ含む）
docker compose exec riverhistory bash -c "cd /app_work && python reset_db.py"

# ログ確認
docker compose logs -f             # 全サービス
docker compose logs -f jkriver     # 単一サービス

# 最新バージョンに更新
docker compose pull && docker compose up -d

# 完全リセット（データベースを含むすべてを削除）
docker compose down -v && docker compose up
```

## デモは何を示していますか？

デモキャラクターは矛盾に満ちた人生軌跡を持ち、River Algorithm の能力をテストします：

| 課題 | 通常の RAG | River Algorithm |
|------|-----------|-----------------|
| 「シニアエンジニア」と言い、後に「テスター」と認める | 両方保存 | 嘘を真実で上書き |
| 4 つの都市、4 つの仕事を転々 | すべて同等に返す | タイムライン追跡、現在の状態を把握 |
| 親、彼女、同僚に違う嘘をつく | 嘘を事実として扱う | 実際 vs 発言を区別 |
| 元カノ → 別れ → 新しい彼女 | 混同 | 元カノを終了済みにし、現在を追跡 |
| 「配達は恥ずかしい」→「人生で最も大切な数ヶ月」 | 矛盾 | 態度の変化を追跡 |

## アーキテクチャ

```
docker compose up
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────┐  ┌────────────────┐  ┌───────────────────┐│
│  │ postgres │  │  riverhistory  │  │     jkriver       ││
│  │  :5432   │←─│  :2345 (web)   │  │  :8400 (api)      ││
│  │          │  │  init schema   │  │  telegram bot      ││
│  │ Riverse  │←─│  load demo     │←─│  discord bot       ││
│  │   (DB)   │  │  process data  │  │  sleep scheduler   ││
│  └──────────┘  └────────────────┘  └───────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

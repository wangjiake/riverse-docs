# 設定

すべての設定はプロジェクトルートの `settings.yaml` で一元管理しています。

## データベース

```yaml
database:
    name: "Riverse"
    user: "your_username"     # PostgreSQL のユーザー名
    host: "localhost"
```

!!! tip
    macOS Homebrew の PostgreSQL はシステムのユーザー名（`whoami` で確認）を使います。Linux/Windows は通常 `postgres` です。

## 言語

```yaml
language: "ja"                  # en / zh / ja
```

## LLM 設定

=== "ローカル（Ollama）"

    ```bash
    ollama pull <your-model>         # 例：qwen2.5:14b, llama3, mistral
    ollama pull bge-m3              # 埋め込みモデル（オプション）
    ```

    ```yaml
    llm_provider: "local"

    local:
      model: "your-model"            # 例：qwen2.5:14b, llama3, mistral
      api_base: "http://localhost:11434"
      temperature: 0.7              # 応答のランダム性 0-1
      max_tokens: 2048              # 最大応答長
    ```

=== "クラウドのみ（Ollama 不要）"

    ```yaml
    llm_provider: "openai"

    openai:
      model: "gpt-4o-mini"
      api_base: "https://api.openai.com"
      api_key: "sk-your-openai-api-key"
      temperature: 0.7
      max_tokens: 2048
    ```

!!! tip
    `openai` 設定はすべての OpenAI 互換 API に対応: OpenAI / DeepSeek / Groq / ローカル vLLM など。`api_base` と `api_key` を変更するだけです。

## クラウド LLM フォールバック

ローカルモデルの品質が不十分な場合に自動的にクラウドにエスカレーション。ローカルモデル使用時でも設定を推奨：

```yaml
cloud_llm:
  enabled: true
  providers:
    - name: "openai"
      model: "gpt-4o"
      api_base: "https://api.openai.com"
      api_key: "sk-your-openai-api-key"
      search: true              # Web検索を有効化
      priority: 1
    - name: "deepseek"
      model: "deepseek-chat"
      api_base: "https://api.deepseek.com"
      api_key: "sk-your-deepseek-key"
      priority: 2
  escalation:
    auto: true                    # 自動エスカレーション
    feedback: true                # エスカレーション後にユーザーに通知
    min_response_length: 20       # これより短い回答は低品質と判定
    failure_keywords:             # これらを含む回答は失敗と判定
      - "わかりません"
      - "できません"
```

## Telegram Bot

1. Telegram で [@BotFather](https://t.me/BotFather) に `/newbot` を送信して Bot を作成、トークンを取得
2. user ID を取得（どちらか）：
    - [@userinfobot](https://t.me/userinfobot) に任意のメッセージを送ると、ID が返ってきます
    - または Bot にメッセージを送り、`https://api.telegram.org/bot<TOKEN>/getUpdates` にアクセス
3. `settings.yaml` を編集：

```yaml
telegram:
  bot_token: "123456:ABC-DEF..."
  temp_dir: "tmp/telegram"
  allowed_user_ids: [your_user_id]  # 自分だけ許可
```

## Discord Bot（オプション）

1. [Discord Developer Portal](https://discord.com/developers/applications) でアプリケーションを作成
2. Bot ページでトークンを取得、Message Content Intent を有効化
3. OAuth2 URL で Bot をサーバーに招待

```yaml
discord:
  bot_token: "your-discord-bot-token"
  allowed_user_ids: []           # 空 = 全員許可、ID を入れると制限
```

## 埋め込み / セマンティック検索（オプション）

キーワードではなく意味で記憶を検索できます。Ollama + bge-m3 が必要：

```bash
ollama pull bge-m3
```

```yaml
embedding:
  enabled: true
  model: "bge-m3"
  api_base: "http://localhost:11434"
```

## タイムゾーン

```yaml
timezone: "Asia/Tokyo"          # IANA 形式：Asia/Shanghai, America/New_York など
```

静かな時間帯やプロアクティブ通知のスケジュールに使用。

## データベース（詳細）

```yaml
database:
    name: "Riverse"
    user: "your_username"
    host: "localhost"
    password: ""                # PostgreSQL にパスワードが必要な場合
    port: 5432                  # デフォルト PostgreSQL ポート
```

## セッションメモリ

単一会話内での AI のコンテキスト管理を制御：

```yaml
session_memory:
    char_budget: 3000           # コンテキストの合計文字バジェット
    keep_recent: 5              # そのまま保持する最近のターン数
    summary_ratio: 0.4          # バジェットのうち要約に割り当てる割合
    recall_max: 3               # ベクトル検索による最大リコール数
    recall_min_score: 0.45      # リコールの最小類似度
```

詳細は [メモリ & Sleep](../features/memory.md#セッションメモリ) を参照。

## ツール

```yaml
tools:
    enabled: true

    voice_transcribe:
        model: "whisper-1"
        language: "ja"          # 音声の言語

    image_describe:
        provider: "openai"      # "openai" か "local"（Ollama LLaVA）
        model: "gpt-4o"

    file_read:
        enabled: true
        max_file_size: 1048576  # 最大 1MB
        allowed_dirs: []        # 空=制限なし

    shell_exec:
        enabled: false          # セキュリティのためデフォルト無効
        timeout: 30
        whitelist:
            - "ls"
            - "date"
            - "git status"

    web_search:                 # cloud_llm の search=true のモデルを自動使用
```

## 音声合成（TTS）

```yaml
tts:
    enabled: false
    voices:
        zh: "zh-CN-XiaoxiaoNeural"
        en: "en-US-AriaNeural"
    temp_dir: "tmp/tts"
    max_chars: 500              # この長さを超えると切り捨て
```

## 埋め込み検索（詳細）

```yaml
embedding:
    enabled: true
    model: "bge-m3"
    api_base: "http://localhost:11434"
    search:
        top_k: 5               # 上位結果の数
        min_score: 0.40         # 最小類似度
    clustering:
        enabled: false          # KMeans クラスタリング
        show_themes: false      # コンテキストにクラスタテーマを表示
```

## MCP プロトコル

```yaml
mcp:
    enabled: false
    servers: []
```

## プロアクティブ通知

```yaml
proactive:
    enabled: true
    scan_interval_minutes: 30
    quiet_hours:
        start: "23:00"
        end: "08:00"
    max_messages_per_day: 3
    min_gap_minutes: 120
    triggers:
        event_followup:
            enabled: true
            min_importance: 0.6
            followup_after_hours: 24
            max_age_days: 7
        strategy:
            enabled: true
        idle_checkin:
            enabled: true
            idle_hours: 48
```

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

## その他の設定

```yaml
# ツール
tools:
  enabled: true
  shell_exec:
    enabled: false               # セキュリティのためデフォルト無効

# TTS
tts:
  enabled: false

# MCP プロトコル
mcp:
  enabled: false
  servers: []

# プロアクティブ通知
proactive:
  enabled: true
  quiet_hours:
    start: "23:00"
    end: "08:00"
```

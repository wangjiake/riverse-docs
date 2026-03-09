# よくある質問

## PostgreSQL 接続失敗

PostgreSQL が動作しているか確認：

```bash
pg_isready -h localhost
```

ユーザー名が `postgres` でない場合、`settings.yaml` の `database.user` を更新してください。PostgreSQL にパスワードが必要な場合は `database.password` を追加してください。

## Ollama モデルが見つからない

```bash
ollama list
ollama pull <your-model>    # 例：qwen2.5:14b, llama3, mistral
ollama pull bge-m3          # 埋め込みモデル（オプション）
```

## Telegram Bot が応答しない

1. `bot_token` が正しいか確認
2. `allowed_user_ids` に自分の Telegram user ID が含まれているか確認
3. ターミナルのログ出力を確認
4. Bot が別のプロセスで既に実行されていないか確認

## Ollama なしでクラウドのみ

`llm_provider: "openai"` に設定、API キーを入力、`embedding.enabled: false` に設定。

## タイムゾーンの設定方法

`settings.yaml` で IANA 形式の `timezone` を設定：

```yaml
timezone: "Asia/Tokyo"    # または America/New_York, Asia/Shanghai など
```

静粛時間帯やプロアクティブメッセージのスケジュールに影響します。

## TTS（テキスト読み上げ）の有効化方法

```yaml
tts:
    enabled: true
    voices:
        zh: "zh-CN-XiaoxiaoNeural"
        en: "en-US-AriaNeural"
    max_chars: 500
```

Edge TTS ライブラリが必要です（`pip install edge-tts`）。

## pgvector で埋め込み検索を高速化するには？

pgvector 拡張をインストールしてマイグレーションを実行：

```bash
# pgvector のインストール (macOS)
brew install pgvector

# マイグレーション実行
psql -h localhost -U YOUR_USERNAME -d Riverse -f migrations/001_pgvector.sql
```

アプリケーションは pgvector を自動検出し、利用可能な場合に使用します。

## セッションメモリの調整方法

`settings.yaml` の `session_memory` を調整：

```yaml
session_memory:
    char_budget: 3000        # 長いコンテキストのために増加
    keep_recent: 5           # 最近のターン数 = より多くの直近コンテキスト
    recall_max: 3            # 会話の早い段階からより多くのターンを想起
```

詳細は[メモリとスリープ](features/memory.md#session-memory)を参照。

## API が正常か確認するには？

```bash
curl http://localhost:8400/health
# {"status": "ok", "db": true, "llm": true}
```

片方のサービスのみ到達可能な場合は `"degraded"`、両方ダウンの場合は `"error"` を返します。

## プロアクティブメッセージが動作しない？

1. `settings.yaml` で `proactive.enabled: true` を確認
2. `timezone` が正しく設定されているか確認
3. 現在の時刻が `quiet_hours` 内でないか確認
4. `max_messages_per_day` に達していないか確認
5. プロアクティブスキャンのログ出力を確認

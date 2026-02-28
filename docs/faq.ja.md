# よくある質問

## PostgreSQL 接続失敗

PostgreSQL が動作しているか確認：

```bash
pg_isready -h localhost
```

ユーザー名が `postgres` でない場合、`settings.yaml` の `database.user` を更新してください。

## Ollama モデルが見つからない

```bash
ollama list
ollama pull <your-model>    # 例：qwen2.5:14b, llama3, mistral
ollama pull bge-m3
```

## Telegram Bot が応答しない

1. `bot_token` が正しいか確認
2. `allowed_user_ids` に自分の Telegram user ID が含まれているか確認
3. ターミナルのログ出力を確認

## Ollama なしでクラウドのみ

`llm_provider: "openai"` に設定、API キーを入力、`embedding.enabled: false` に設定。

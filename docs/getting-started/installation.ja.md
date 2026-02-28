# インストール

## 前提条件

| 依存 | 説明 |
|---|---|
| Python 3.10+ | ランタイム |
| PostgreSQL 16+ | データ保存 |
| Ollama | ローカル LLM 推論（オプション、クラウドのみも可）|

## クローン & インストール

```bash
git clone https://github.com/wangjiake/JKRiver.git
cd JKRiver
python3 -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

## PostgreSQL セットアップ

```bash
createdb -h localhost -U your_username Riverse
psql -h localhost -U your_username -d Riverse -f agent/schema.sql
```

!!! note
    Riverse と [River Algorithm — AI会話履歴特別版](https://github.com/wangjiake/RiverHistory) は同じデータベースを共有しています。どちらのプロジェクトからテーブルを作成しても、両方に必要な全テーブルが作成されます。もう一方のプロジェクトで既にテーブル作成済みの場合、このステップはスキップできます。

テーブルが作成されたか確認：

```bash
psql -h localhost -U your_username -d Riverse -c "\dt"
```

`conversation_turns`、`user_profile`、`observations` など10以上のテーブルが表示されるはずです。

!!! tip
    スケジュールスキルサポートが必要な場合（Telegram Job Queue）：
    ```bash
    pip install "python-telegram-bot[job-queue]"
    ```

## Ollama モデルの取得（オプション）

ローカル LLM を使用する場合：

```bash
ollama pull <your-model>         # 例：qwen2.5:14b, llama3, mistral
ollama pull bge-m3              # 埋め込みモデル（オプション）
```

## 起動

```bash
python -m agent.main                                    # CLI
uvicorn agent.api:app --host 0.0.0.0 --port 8400       # REST API
python web.py                                            # Web ダッシュボード
python -m agent.telegram_bot                             # Telegram Bot
python -m agent.discord_bot                              # Discord Bot
```

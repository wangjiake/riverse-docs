# Python SDK (riverse)

River Algorithm のメモリ機能を自分の Python アプリケーションに統合できます。

## インストール

```bash
pip install riverse
```

PyPI: [pypi.org/project/riverse](https://pypi.org/project/riverse/) · GitHub: [github.com/wangjiake/riverse](https://github.com/wangjiake/riverse)

## クイックスタート

```python
from riverse import Riverse

r = Riverse(
    api_key="sk-...",
    api_base="https://api.deepseek.com",
    model="deepseek-chat",
    language="ja",           # "en" | "zh" | "ja"
)

# 1. 会話を保存
r.add(messages=[
    {"role": "user", "content": "東京に引っ越して、Googleで新しい仕事を始めました。"},
    {"role": "assistant", "content": "すごいですね！慣れましたか？"},
], user_id="alex")

# 2. Sleep 統合を実行（River Algorithm のコア）
result = r.sleep(user_id="alex")
print(result)
# {'status': 'ok', 'processed': 2, 'new_facts': 3, 'contradictions': 0, ...}

# 3. ユーザープロファイルを取得
profile = r.get_profile(user_id="alex")
for fact in profile:
    print(f"[{fact['layer']}] {fact['category']}/{fact['subject']}: {fact['value']}")

# 4. メモリを検索
results = r.search("彼はどこに住んでいますか？", user_id="alex")

# 5. ユーザーモデルを取得（人格 + 軌跡）
model = r.get_user_model(user_id="alex")
```

## 設定

```python
r = Riverse(
    api_key="sk-...",                        # API キー
    api_base="https://api.openai.com",       # または DeepSeek/Ollama/Groq の URL
    model="gpt-4o-mini",                     # モデル名
    language="ja",                           # プロンプト言語："en" | "zh" | "ja"
    db_path="~/.riverse/memory.db",          # SQLite パス
    temperature=0.7,
    max_tokens=4096,
)
```

### 対応プロバイダー

| プロバイダー | `api_base` | `model` |
|-------------|-----------|---------|
| **OpenAI** | `https://api.openai.com` | `gpt-4o-mini` |
| **DeepSeek** | `https://api.deepseek.com` | `deepseek-chat` |
| **Groq** | `https://api.groq.com` | `llama-3.3-70b-versatile` |
| **Ollama** | `http://localhost:11434` | `llama3.1` |

## API リファレンス

### `r.add(messages, user_id, session_id=None)`

会話メッセージを保存し、後で統合処理します。

- `messages` — メッセージリスト `{"role": "user"|"assistant", "content": "..."}`
- `user_id` — ユーザー識別子
- `session_id` — オプションのセッショングループ（省略時は自動生成）

### `r.sleep(user_id)`

River Algorithm の完全な統合パイプラインを実行：

1. 観察、イベント、関係を抽出
2. 既存プロファイルに対して分類
3. 新しい事実を作成、矛盾を検出
4. 疑わしい事実を交差検証して昇格
5. 争議のある事実ペアを解決
6. 成熟度減衰とユーザーモデルを更新
7. 軌跡サマリーを生成

アクション数のサマリー辞書を返します。

### `r.get_profile(user_id)`

すべてのアクティブなプロファイル事実をリストで返します。

各事実には `category`（カテゴリ）、`subject`（主題）、`value`（値）、`layer`（レイヤー：`suspected`/`confirmed`/`closed`）、`evidence`（証拠）、`created_at`（作成日時）などが含まれます。

### `r.get_user_model(user_id)`

`{"dimensions": [...], "trajectory": {...}}` を返します。

- **dimensions** — 人格分析（コミュニケーションスタイル、信頼レベル、感受性など）
- **trajectory** — ライフフェーズ、方向性、キーアンカー、不安定な領域

### `r.search(query, user_id, top_k=10)`

プロファイル事実、イベント、観察にわたるキーワード検索。

## 言語設定

`language` パラメータは統合プロセス中のすべての LLM 内部プロンプトの言語を制御します。

| 値 | 言語 |
|----|------|
| `"en"` | 英語（デフォルト） |
| `"zh"` | 中国語 |
| `"ja"` | 日本語 |

ユーザーの会話に合った言語を選択することで、最適な抽出品質が得られます。

## 矛盾検出

会話間で矛盾する情報が検出されると、River Algorithm は：

1. 新しい値で新しい事実を作成
2. 古い事実を「取り替え済み」としてマーク
3. 矛盾の証拠チェーンを記録
4. フォローアップの検証戦略を生成

```python
# セッション 1
r.add([{"role": "user", "content": "Googleで働いています。"}], user_id="alex", session_id="s1")
r.sleep(user_id="alex")

# セッション 2 — セッション 1 と矛盾
r.add([{"role": "user", "content": "マイクロソフトに転職しました。"}], user_id="alex", session_id="s2")
r.sleep(user_id="alex")

# プロファイルはマイクロソフトを表示、Googleの事実は取り替え済み
profile = r.get_profile(user_id="alex")
```

## 三層信頼度モデル

事実は信頼度レイヤーを通じて進行します：

- **`suspected`** — 初期抽出、未検証
- **`confirmed`** — 複数回の言及や裏付けによる交差検証済み
- **`closed`** — 新しい情報に置き換えられたか期限切れ

## JKRiver との違い

| | riverse（Python SDK） | JKRiver（フルアプリ） |
|---|---|---|
| **位置づけ** | 自分のアプリに統合するライブラリ | 完全な AI アシスタント |
| **インストール** | `pip install riverse` | Docker または手動セットアップ |
| **ストレージ** | SQLite（ゼロコンフィグ） | PostgreSQL |
| **チャネル** | コードで決定 | Telegram、Discord、CLI、Web |
| **用途** | 製品にメモリ機能を追加 | パーソナル AI として使用 |

フルバージョン：[github.com/wangjiake/JKRiver](https://github.com/wangjiake/JKRiver)

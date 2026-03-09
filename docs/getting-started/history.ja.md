# チャット履歴インポート (RiverHistory)

RiverHistory は River Algorithm の特別版で、**ChatGPT、Claude、Gemini の会話履歴からパーソナルプロフィールをバッチ抽出する**ことに特化しています。リアルタイムの会話ではなく、過去の AI チャット履歴を遡って分析し、同じ豊かなプロフィールを構築します — 性格特性、人生のタイムライン、人間関係、キャリアの変遷など。

RiverHistory は [JKRiver](https://github.com/wangjiake/JKRiver) メインプロジェクトと同じ PostgreSQL データベース（`Riverse`）を共有しています。履歴から抽出されたプロフィールとライブチャットで構築されたプロフィールが一緒に保存され、統一されたビューを提供します。

**ソースコード：** [https://github.com/wangjiake/RiverHistory](https://github.com/wangjiake/RiverHistory)

## デモデータセット

3 つの組み込みデモキャラクターで、自分のデータをインポートせずにシステムをテストできます：

| フラグ | キャラクター | 言語 | セッション数 | 説明 |
|--------|-------------|------|-------------|------|
| `--demo` | 林雨桐（Lin Yutong） | 中国語 | 50 | キャリアの変遷、恋愛、都市生活を経験する若い女性 — アルゴリズムの矛盾処理と態度変化の追跡能力をテスト |
| `--demo2` | 沈一帆（Shen Yifan） | 中国語 | 15 | 芸術的追求を持つ建築家 — クイックテスト用の短いデータセット |
| `--demo3` | Jake Morrison | 英語 | 20 | サンフランシスコのソフトウェアエンジニア — 英語デモ |

!!! note
    `--demo2` と `--demo3` はインポート前にデモテーブルをクリアします。つまり、以前ロードしたデモデータを置き換えます。`--demo` はクリアせずに追加インポートします。

## 前提条件

| 依存関係 | 説明 |
|----------|------|
| Python 3.11+ | ランタイム |
| PostgreSQL 16+ | データストレージ（JKRiver と共有） |
| LLM API キー **または** Ollama | プロフィール抽出用 AI モデル |

## クイックスタート（ソースから）

```bash
# 1. リポジトリをクローン
git clone https://github.com/wangjiake/RiverHistory.git
cd RiverHistory

# 2. 仮想環境を作成
python3 -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

# 3. 依存関係をインストール
pip install -r requirements.txt

# 4. 設定を構成
cp settings.yaml settings.yaml   # このファイルを編集 — データベース情報と LLM 設定を入力
#    database.user: PostgreSQL ユーザー名（macOS/Linux のターミナルで whoami を実行して確認）
#    llm_provider: "openai" = リモート API、"local" = Ollama
#    openai.api_key: API キー（リモート API 使用時）
#    language: "ja" / "en" / "zh"

# 5. データベースを初期化（Riverse データベースと全テーブルを作成）
python setup_db.py

# 6. デモデータをインポート
python import_data.py --demo

# 7. River Algorithm で処理
python run.py demo max

# 8. 抽出されたプロフィールを確認
python web.py
```

[http://localhost:2345](http://localhost:2345) を開いて Web プロフィールビューアーを確認。

## 会話データのエクスポート

インポートの前に、各プラットフォームからデータをエクスポートする必要があります：

| プラットフォーム | エクスポート方法 |
|-----------------|-----------------|
| **ChatGPT** | Settings → Data controls → Export data → メールを待つ → ダウンロードして解凍 → `conversations.json` |
| **Claude** | Settings → Account → Export Data → メールを待つ → ダウンロードして解凍 → `conversations.json` |
| **Gemini** | [Google Takeout](https://takeout.google.com/) → 「Gemini Apps」のみ選択 → ダウンロードして解凍 |

エクスポートしたファイルを `data/` ディレクトリに配置：

```
RiverHistory/
├── settings.yaml
├── run.py
└── data/
    ├── ChatGPT/               ← conversations.json をここに配置
    ├── Claude/                ← conversations.json をここに配置
    └── Gemini/                ← Takeout ファイルをここに配置
```

## インポートコマンド

```bash
# 各プラットフォームからインポート（1 つまたは複数選択）
python import_data.py --chatgpt data/ChatGPT/conversations.json
python import_data.py --claude data/Claude/conversations.json
python import_data.py --gemini "data/Gemini/マイ アクティビティ.html"

# デモデータセットをインポート
python import_data.py --demo       # 林雨桐（50 セッション、中国語）
python import_data.py --demo2      # 沈一帆（15 セッション、中国語 — インポート前にデモテーブルをクリア）
python import_data.py --demo3      # Jake Morrison（20 セッション、英語 — インポート前にデモテーブルをクリア）

# 1 つのコマンドで複数のソースを組み合わせ可能
python import_data.py --chatgpt data/ChatGPT/conversations.json --claude data/Claude/conversations.json
```

インポートは冪等です — 重複する会話はチェックサムに基づいて自動的にスキップされます。

## 処理コマンド

インポート後、River Algorithm を実行してプロフィールを抽出：

```bash
python run.py <ソース> <件数>
```

| パラメータ | 値 | 説明 |
|-----------|-----|------|
| `ソース` | `chatgpt`、`claude`、`gemini`、`demo`、`all` | どのデータソースを処理するか。`all` は chatgpt + claude + gemini を合わせて処理（demo は除外）。 |
| `件数` | 数値または `max` | 何件の会話を処理するか。時系列順（古い順）。`max` は保留中のすべてを処理。 |

**例：**

```bash
python run.py demo max          # すべてのデモ会話を処理
python run.py chatgpt 50        # 最も古い 50 件の ChatGPT 会話を処理
python run.py claude max        # すべての Claude 会話を処理
python run.py gemini 100        # 最も古い 100 件の Gemini 会話を処理
python run.py all max           # すべて処理（chatgpt + claude + gemini、時系列で混合）
python run.py all 200           # すべてのソース混合、最も古い 200 件
```

処理は**安全に中断できます** — 次回実行時に処理済みの会話は自動的にスキップされます。

## リセット

抽出されたすべてのプロフィールと記憶をクリアし、元のインポート済み会話データは保持：

```bash
python reset_db.py
```

プロフィール関連テーブル（`user_profile`、`observations`、`hypotheses`、`trajectory_summary`、`relationships` など）をリセットしますが、ソーステーブル（`chatgpt`、`claude`、`gemini`、`demo`）はそのまま残ります。その後 `run.py` を再実行して最初から処理できます。

## Web ビューアー

```bash
python web.py
```

[http://localhost:2345](http://localhost:2345) で Web ダッシュボードを開き、抽出されたプロフィールを閲覧 — 性格次元、人生のタイムライン、人間関係、キャリア履歴など。

## Docker の代替手段

Python と PostgreSQL を手動でインストールしたくない場合は、Docker で RiverHistory を実行できます。[Docker ガイド](docker.md)を参照してください。`docker compose up` 1 つのコマンドで RiverHistory と JKRiver の両方を起動できます。

## 費用に関する注意

!!! warning "トークンコスト（リモート LLM API）"
    各会話は処理時にトークンを消費します。大量のコードや非常に長いメッセージを含む会話はより多く消費します。

    - **高性能モデル**（GPT-4o など）はプロフィール品質が高いですが、コストも高い。
    - **安価なモデル**（GPT-4o-mini、DeepSeek など）は高速で安価ですが、細部を見逃す可能性がある。
    - **ローカル Ollama モデル**は完全無料、ただし速度は遅い。

    処理前にエクスポートデータを確認し、不要な会話（純粋なコーディングセッション等）を削除してください。**API の請求額を確認してください。**

    まず少量で試して（例：`python run.py chatgpt 10`）、コストを見積もってからすべてを処理してください。

## 精度に関する注意

!!! info "LLM の制限"
    プロフィール抽出は LLM の会話解釈に依存しています。結果には不正確な部分が含まれる可能性があります：

    - LLM は皮肉、冗談、仮定の発言を事実として誤解する場合があります。
    - 曖昧または矛盾する発言が誤って解釈される場合があります。
    - モデルによって結果の品質が異なります — データに最適なモデルを見つけるために実験してください。
    - River Algorithm は矛盾や変化する情報を処理するよう設計されていますが、完璧なシステムはありません。

    抽出されたプロフィールの正確性を必ず確認してください。必要に応じてリセットし、別のモデルで再処理できます。

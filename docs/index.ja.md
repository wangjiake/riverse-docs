---
hide:
  - navigation
  - toc
---

<div class="hero" markdown>

# Riverse

<p class="hero-subtitle">
個人デバイスのために設計された AI エージェント — 永続的な記憶、オフライン認知、使うほどあなたを理解する。すべてのデータはローカルに保存。<br>
<span style="font-size:0.8rem; opacity:0.55;">v1.0 Beta · シングルユーザー推奨</span>
</p>

<div class="hero-actions">
<a href="getting-started/installation/" class="btn-primary">はじめる</a>
<a href="getting-started/docker/" class="btn-secondary">Docker クイックスタート</a>
<a href="https://github.com/wangjiake/JKRiver" class="btn-secondary">GitHub</a>
</div>

</div>

<div class="section-header" markdown>

## RAG メモリ vs. 河流アルゴリズム

類似度検索だけでは個人 AI には不十分な理由。

</div>

<div class="compare-container" markdown>

<div class="compare-card old" markdown>
<span class="compare-label">RAG / 既存 AI メモリ</span>

#### 検索して忘れる

- **キーワード / ベクトル類似度検索** — 「似ている」テキストを見つけるだけで、*あなた*にとって何が重要かは理解しない
- **タイムラインなし** — 3年前の事実と昨日の事実が同じ重みで扱われる
- **因果推論なし** — 「頭痛がする」と「転職した」は孤立した断片のまま、決して結びつかない
- **均等な重み** — 映画の感想と人生の核心的な価値観が同列に並ぶ
- **クラウド依存** — すべてのメッセージがリモートモデルを経由。データは他人のサーバーに

</div>

<div class="compare-card new" markdown>
<span class="compare-label">Riverse / 河流アルゴリズム</span>

#### 理解して進化する

- **個人プロフィール重み付け** — テキスト類似度ではなく、*あなた*との関連性で情報をランク付け
- **時間的進化** — 最近の出来事は勢いを持ち、古いパターンは時間と共に自然に固化または消退
- **因果推論** — 「転職 → ストレス → 頭痛 → 睡眠障害」を一貫した因果チェーンとして接続
- **確信度レベル** — 観察は推測 → 確認 → 確立へと、マルチターン検証を通じて段階的に昇格
- **ローカル駆動** — メモリはあなたのデバイスに。リモート LLM はローカル認知で解決できない時*だけ*一度呼び出す

</div>

</div>

<div class="scenario" markdown>
<div class="scenario-header">シナリオ：「最近頭痛がする」と言った — 2ヶ月前に転職を話していた</div>
<div class="scenario-body">
<div class="scenario-side rag">
<span class="side-label">RAG アプローチ</span>
<div class="chat-bubble user">最近頭痛がするんだよね</div>
<div class="chat-bubble ai">それは大変ですね。頭痛の一般的な原因は：脱水、画面の見すぎ、ストレスなどがあります。何かアドバイスしましょうか？</div>
<p style="font-size:0.8rem; opacity:0.6; margin-top:0.5rem;">ベクトル検索で医療Q&Aから「頭痛」を見つけただけ。あなたの人生とは無関係。</p>
</div>
<div class="scenario-side river">
<span class="side-label">河流アルゴリズム</span>
<div class="chat-bubble user">最近頭痛がするんだよね</div>
<div class="chat-bubble ai">約2ヶ月前にマネージャーになってから、同じ頃に睡眠も悪化してましたね — 夜1時過ぎまで起きてたって何度か言ってました。頭痛はそれと関連しているかもしれません。仕事のプレッシャーはどうですか？健康パターンとして追跡しましょうか？</div>
<p style="font-size:0.8rem; opacity:0.6; margin-top:0.5rem;">因果チェーン：転職 → 睡眠障害 → 頭痛。タイムライン認識、個人重み付け駆動。</p>
</div>
</div>
</div>

<div class="vision-box" markdown>

### 未来：あなたのデバイス、あなたの知性

今日の AI はクラウド中心 — すべての思考が他人のサーバーを経由します。Riverse はこれを逆転します。あなたの個人デバイスがメモリ、プロフィール、コンテキストを保持し、ローカルであなたを理解します。ローカルの認知能力を超える問題に遭遇した時だけ、問題を的確に記述してリモート LLM を一度だけ呼び出す — 脳をアウトソースするのではなく、専門家に相談するように。

<div class="vision-flow">
<span class="vf-step vf-local">ローカルメモリ & プロフィール</span>
<span class="vf-arrow">→</span>
<span class="vf-step vf-local">ローカル認知</span>
<span class="vf-arrow">→</span>
<span class="vf-step vf-local">ローカルで解決可能？</span>
<span class="vf-arrow">→</span>
<span class="vf-step vf-cloud">不可 → 問題を記述 → リモート1回呼出</span>
</div>

これが、スマートフォンやスマートウォッチなどの個人デバイスで本当のパーソナル AI を実行するための基盤です — あなたがデータ、プロフィール、知性を所有する。

</div>

<div class="section-header" markdown>

## 河流アルゴリズム

Riverse を際立たせるコア認知モデル。

</div>

会話は水の流れ、重要な情報は河床の堆積物のように沈殿し、複数ターンの検証を経て「推測」から「確認」へ、さらに「確立」へと段階的に昇格します。オフライン整理（Sleep）は河の自浄作用です。

<div class="river-diagram" markdown>

```
会話が流入 ──→ 浸食 ──→ 堆積 ──→ 認知を形成 ──→ 流れ続ける
                │         │         │
                │         │         └─ 確認された認知 → 安定した岩盤
                │         └─ 重要な情報 → 観察・仮説・プロフィール
                └─ 矛盾する古い認識は洗い流され、新たな洞察に
```

</div>

<div class="metaphor-grid" markdown>

<div class="metaphor-card flow" markdown>
<span class="metaphor-icon">:material-waves:</span>

#### 流れ（Flow）

すべての会話は流れる水。川は止まらず、あなたへの理解は進化し続け、リセットされない。

</div>

<div class="metaphor-card sediment" markdown>
<span class="metaphor-icon">:material-layers:</span>

#### 堆積（Sediment）

重要情報は沈泥のように堆積：事実はプロフィールに、感情は観察に、パターンは仮説に。繰り返し確認された認知はより深く沈む。

</div>

<div class="metaphor-card purify" markdown>
<span class="metaphor-icon">:material-water-check:</span>

#### 自浄（Purify）

Sleep は川の自浄能力 — 古い情報を洗い流し、矛盾を解消し、断片を統合して一貫した理解へ。

</div>

</div>

<div class="section-header" markdown>

## 特徴

本当のパーソナル AI に必要なすべて。

</div>

<div class="feature-grid" markdown>

<div class="feature-card" markdown>
<span class="feature-icon">:material-brain:</span>

### 永続的な記憶

セッションを超えて記憶。あなたと共に進化するプロファイルを構築。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-sleep:</span>

### オフライン整理

会話終了後に自動処理 — 洞察の抽出、矛盾の解消、確認済み知識の強化。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-image-text:</span>

### マルチモーダル入力

テキスト、音声、画像 — Whisper、GPT-4 Vision、LLaVA でネイティブに理解。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-wrench:</span>

### プラガブルツール

Web検索、財務追跡、健康同期（Withings）、TTS など。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-file-code:</span>

### YAML スキル

シンプルな YAML でカスタム動作を作成、キーワードまたはスケジュールでトリガー。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-connection:</span>

### 外部エージェント

設定ファイルで Home Assistant、n8n、Dify 等を接続。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-forum:</span>

### マルチチャネル

Telegram、Discord、REST API、WebSocket、CLI、Web ダッシュボード。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-server:</span>

### ローカルファースト

デフォルトは Ollama、必要時に OpenAI / DeepSeek へ自動エスカレーション。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-bell-ring:</span>

### プロアクティブ

イベントフォローアップ、アイドルチェックイン、静寂時間帯を尊重。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-magnify:</span>

### セマンティック検索

BGE-M3 ベクトル埋め込み、意味で関連する記憶を検索。

</div>

<div class="feature-card" markdown>
<span class="feature-icon">:material-protocol:</span>

### MCP プロトコル

Model Context Protocol 対応、Gmail 等の MCP Server を接続。

</div>

</div>

<div class="section-header" markdown>

## 技術スタック

</div>

| レイヤー | 技術 |
|---|---|
| ランタイム | Python 3.10+, PostgreSQL 16+ |
| ローカル LLM | Ollama（任意の互換モデル） |
| クラウド LLM | OpenAI GPT-4o / DeepSeek（フォールバック）|
| 埋め込み | Ollama + BGE-M3 |
| REST API | FastAPI + Uvicorn |
| Web ダッシュボード | Flask |
| Telegram | python-telegram-bot (async) |
| Discord | discord.py (async) |
| 音声 / 画像 | Whisper-1, GPT-4 Vision, LLaVA |
| TTS | Edge TTS |

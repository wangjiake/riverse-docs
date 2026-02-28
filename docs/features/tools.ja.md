# ビルトインツール

Riverse にはプラガブルなツールシステムが含まれています。LLM が会話の文脈に基づいて自動的にツールの呼び出しを判断します。

## 利用可能なツール

| ツール | 説明 |
|---|---|
| Web 検索 | 最新情報を Web で検索（cloud LLM の `search: true` モデルを使用） |
| 画像認識 | GPT-4 Vision / Ollama LLaVA で画像分析 |
| 音声認識 | OpenAI Whisper-1 で音声をテキストに変換 |
| ファイル読み取り | ローカルテキストファイル（.txt, .py, .yaml, .json, .md）を読み取り |
| Shell コマンド | 安全なシェルコマンドを実行（ホワイトリスト制、デフォルト無効） |
| 財務追跡 | 財務データの追跡と分析 |
| 健康同期 | Withings デバイスから健康データを同期 |

また、**テキスト読み上げ (TTS)** 機能は Edge TTS を通じて Telegram と Discord Bot で利用可能です。TTS はレジストリツールではなく、Bot の応答パイプラインに直接統合されています。`settings.yaml` で有効化：

```yaml
tts:
  enabled: true
```

## 設定

```yaml
tools:
  enabled: true
  shell_exec:
    enabled: false               # セキュリティのためデフォルト無効
```

## 仕組み

1. 起動時に `ToolRegistry` が `agent/tools/` 内のすべての `.py` ファイルをスキャン（`_` で始まるファイルはスキップ）
2. 各 `BaseTool` サブクラスに対して `is_available()` を呼び出し
3. 利用可能なツールは `manifest().name` で登録
4. ユーザーがメッセージを送信すると、LLM はすべてのツールの manifest を確認し、どれを呼び出すか決定
5. ツールの `execute()` 結果が LLM のコンテキストに注入され、最終回答の生成に使用

## カスタムツール

`agent/tools/` に `.py` ファイルを追加して独自のツールを作成できます。[カスタムツール開発](../development/custom-tool.md)ガイドをご参照ください。

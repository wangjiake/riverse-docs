# 外部エージェント

`agent/config/agents_ja.yaml` を編集して外部サービスを接続。LLM が自動的にいつ呼び出すかを判断します。

## 組み込みテンプレート

| エージェント | タイプ | 説明 | デフォルト |
|---|---|---|---|
| weather_query | HTTP | wttr.in 天気取得 | 有効 |
| home_lights | HTTP | Home Assistant 照明制御 | 無効 |
| home_status | HTTP | Home Assistant デバイス状態 | 無効 |
| n8n_email | HTTP | n8n メール送信 | 無効 |
| n8n_workflow | HTTP | n8n ワークフロー | 無効 |
| dify_agent | HTTP | Dify サブエージェント | 無効 |
| backup_notes | Command | ローカルバックアップ | 無効 |
| system_info | Command | システム情報取得 | 無効 |

## エージェントの有効化

`enabled` を `true` に変更し、URL/トークンを入力：

```yaml
- name: home_lights
  type: http
  description: "Home Assistant で照明を制御"
  parameters:
    entity_id: "照明のエンティティ ID"
    action: "toggle / turn_on / turn_off"
  examples:
    - "リビングの照明をつけて"
  enabled: true
  http:
    url: "http://your-home-assistant:8123/api/services/light/{action}"
    method: POST
    headers:
      Authorization: "Bearer YOUR_TOKEN"
    body_template:
      entity_id: "{entity_id}"
    timeout: 10
```

## エージェントタイプ

### HTTP エージェント

外部サービスに HTTP リクエストを送信（Home Assistant、n8n、Dify など）。

### Command エージェント

ローカルシェルコマンドを実行（バックアップスクリプト、システムクエリなど）。

## 多言語設定

エージェント設定は複数言語で利用可能：

- `agent/config/agents_en.yaml` — 英語
- `agent/config/agents_zh.yaml` — 中国語
- `agent/config/agents_ja.yaml` — 日本語

使用される設定は `settings.yaml` の `language` 設定で決まります。

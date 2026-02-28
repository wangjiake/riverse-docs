# External Agents

Connect external services to Riverse via `agent/config/agents_en.yaml`. The LLM automatically decides when to invoke agents based on conversation context.

## Built-in Templates

| Agent | Type | Description | Default |
|---|---|---|---|
| weather_query | HTTP | wttr.in weather query | Enabled |
| home_lights | HTTP | Home Assistant light control | Disabled |
| home_status | HTTP | Home Assistant device status | Disabled |
| n8n_email | HTTP | Send email via n8n | Disabled |
| n8n_workflow | HTTP | Trigger n8n workflow | Disabled |
| dify_agent | HTTP | Dify sub-agent | Disabled |
| backup_notes | Command | Local backup script | Disabled |
| system_info | Command | System info query | Disabled |

## Enabling an Agent

Set `enabled: true` and fill in your URL/token:

```yaml
- name: home_lights
  type: http
  enabled: true
  url: "http://your-home-assistant:8123/api/services/light/toggle"
  headers:
    Authorization: "Bearer YOUR_TOKEN"
  description: "Toggle lights via Home Assistant"
```

## Agent Types

### HTTP Agent

Makes HTTP requests to external services (Home Assistant, n8n, Dify, etc.).

### Command Agent

Executes local shell commands (backup scripts, system queries, etc.).

## Multi-Language Config

Agent configs are available in multiple languages:

- `agent/config/agents_en.yaml` — English
- `agent/config/agents_zh.yaml` — Chinese
- `agent/config/agents_ja.yaml` — Japanese

The active config is determined by the `language` setting in `settings.yaml`.

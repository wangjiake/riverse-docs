# 外部 Agent

通过编辑 `agent/config/agents_zh.yaml` 接入外部服务。LLM 会自动判断何时调用。

## 内置模板

| Agent | 类型 | 说明 | 默认状态 |
|---|---|---|---|
| weather_query | HTTP | wttr.in 天气查询 | 启用 |
| home_lights | HTTP | Home Assistant 灯控 | 禁用 |
| home_status | HTTP | Home Assistant 设备状态 | 禁用 |
| n8n_email | HTTP | n8n 发送邮件 | 禁用 |
| n8n_workflow | HTTP | n8n 通用工作流 | 禁用 |
| dify_agent | HTTP | Dify 子 Agent | 禁用 |
| backup_notes | Command | 本地备份脚本 | 禁用 |
| system_info | Command | 查看系统信息 | 禁用 |

## 启用 Agent

将 `enabled` 改为 `true` 并填入地址/Token：

```yaml
- name: home_lights
  type: http
  enabled: true
  url: "http://your-home-assistant:8123/api/services/light/toggle"
  headers:
    Authorization: "Bearer YOUR_TOKEN"
  description: "通过 Home Assistant 控制灯光"
```

## Agent 类型

### HTTP Agent

向外部服务发送 HTTP 请求（Home Assistant、n8n、Dify 等）。

### Command Agent

执行本地 shell 命令（备份脚本、系统查询等）。

## 多语言配置

Agent 配置文件支持多语言：

- `agent/config/agents_en.yaml` — 英文
- `agent/config/agents_zh.yaml` — 中文
- `agent/config/agents_ja.yaml` — 日文

使用哪个取决于 `settings.yaml` 中的 `language` 设置。

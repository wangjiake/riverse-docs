# 内置工具

Riverse 包含可插拔的工具系统。LLM 会根据对话上下文自动判断何时调用工具。

## 可用工具

| 工具 | 说明 |
|---|---|
| 网页搜索 | 搜索网页获取最新信息（使用 cloud LLM 中 `search: true` 的模型） |
| 图像理解 | 通过 GPT-4 Vision / Ollama LLaVA 分析图片 |
| 语音识别 | 通过 OpenAI Whisper-1 语音转文字 |
| TTS | 通过 Edge TTS 文字转语音 |
| 文件读取 | 读取本地文本文件（.txt, .py, .yaml, .json, .md） |
| Shell 命令 | 执行安全的 Shell 命令（白名单机制，默认关闭） |
| 财务追踪 | 追踪和分析财务数据 |
| 健康同步 | 从 Withings 设备同步健康数据 |

## 配置

```yaml
tools:
  enabled: true
  shell_exec:
    enabled: false               # 安全考虑默认禁用
```

## 工作原理

1. 启动时，`ToolRegistry` 扫描 `agent/tools/` 下所有 `.py` 文件（跳过 `_` 开头的文件）
2. 对每个 `BaseTool` 子类调用 `is_available()`
3. 可用的工具按 `manifest().name` 注册
4. 用户发送消息时，LLM 会看到所有工具的 manifest，决定调用哪个
5. 工具的 `execute()` 结果会注入 LLM 上下文，用于生成最终回复

## 自定义工具

你可以通过在 `agent/tools/` 目录下添加 `.py` 文件来创建自己的工具。参见[自定义工具开发](../development/custom-tool.md)指南。

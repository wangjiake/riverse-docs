# 技能系统

用简单的 YAML 文件创建自定义行为 — 按关键词或 cron 定时触发。

## 创建技能

在 `agent/skills/` 目录下创建 `.yaml` 文件即可定义技能。

### 关键词触发

```yaml
name: explain_code
description: 用户发代码时自动提供逐行解释
trigger:
  type: keyword
  keywords: ["解释代码", "explain code"]
instruction: |
  用户希望你解释代码。请：
  1. 先用一句话概括这段代码的功能
  2. 逐行或逐块解释关键逻辑
  3. 指出可能的改进点
enabled: true
```

### 定时触发

```yaml
name: weekly_summary
description: 每周日晚上发送温馨周末问候
trigger:
  type: schedule
  cron: "0 20 * * 0"            # 每周日 20:00
steps:
  - respond: |
      写一条简短温馨的周末问候。
enabled: true
```

## 在 Web 面板中管理技能

打开 **System 页面 → 技能** 区域，可以直接：

- **开关（ON/OFF）**：点击技能卡片上的 ON/OFF 标签
- **删除**：点击 ✕ 按钮删除对应的 YAML 文件
- **安装**：点击右上角「+ 安装技能」按钮，通过两种方式安装：
    - **粘贴安装**：直接粘贴 YAML 或 SKILL.md 格式内容
    - **SkillHub 搜索**：输入技能名称（如 `explain-code`）从 SkillHub 拉取安装

技能卡片会显示来源标签：无标签为内置技能，**已安装** 为本地文件，**SkillHub** 为从 SkillHub 安装。

## 对话中创建技能

直接对 Bot 说"创建一个技能..."或"帮我做一个定时提醒..."，Bot 会自动生成 YAML 并保存。

## 对话中删除技能

也可以直接对 Bot 说来删除技能：

> "删除喝水提醒技能"

Bot 会找到并删除 `agent/skills/` 中对应的 YAML 文件。

## 自定义技能开发

更多详情参见[自定义技能开发](../development/custom-skill.md)指南。

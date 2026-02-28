# Skill System

Create custom behaviors with simple YAML files — trigger by keyword or cron schedule.

## Creating Skills

Create `.yaml` files in `agent/skills/` to define custom skills.

### Keyword-Triggered

```yaml
name: explain_code
description: Auto-explain code when user sends a snippet
trigger:
  type: keyword
  keywords: ["explain code", "what does this do"]
instruction: |
  The user wants you to explain code. Please:
  1. Summarize the purpose of the code in one sentence
  2. Explain key logic line by line or block by block
  3. Point out potential improvements
enabled: true
```

### Scheduled

```yaml
name: weekly_summary
description: Send a warm weekend greeting every Sunday
trigger:
  type: schedule
  cron: "0 20 * * 0"
steps:
  - respond: |
      Write a short, warm weekend greeting.
enabled: true
```

## Creating Skills via Chat

You can create skills by telling the bot directly:

> "Create a skill that reminds me to drink water every 2 hours"

The bot will automatically generate the YAML and save it to `agent/skills/`.

## Custom Skill Development

For more details on building advanced skills, see the [Custom Skill Development](../development/custom-skill.md) guide.

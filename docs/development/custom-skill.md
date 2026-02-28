# Custom Skill Development

Skills are YAML-defined behaviors that extend Riverse's capabilities. They can be triggered by keywords or run on a schedule.

## Skill File Location

Place `.yaml` files in `agent/skills/`. They are loaded automatically on startup.

## Skill Types

### Instruction Skill (keyword-triggered)

A simple skill that provides instructions to the LLM when triggered:

```yaml
name: explain_code
description: Auto-explain code when user sends a snippet
trigger:
  type: keyword
  keywords: ["explain code", "what does this do"]
instruction: |
  Explain the code step by step:
  1. Summarize what the code does in one sentence
  2. Explain key logic line by line
  3. Point out potential improvements
enabled: true
```

### Workflow Skill (scheduled)

A skill with steps that runs on a cron schedule:

```yaml
name: weekly_summary
description: Send a warm weekend greeting every Sunday
trigger:
  type: schedule
  cron: "0 20 * * 0"            # Every Sunday at 20:00
steps:
  - respond: |
      Write a short, warm weekend greeting.
enabled: true
```

## Fields Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the skill |
| `description` | Yes | What the skill does (helps LLM decide when to use it) |
| `trigger.type` | Yes | `keyword` or `schedule` |
| `trigger.keywords` | For keyword type | List of trigger phrases |
| `trigger.cron` | For schedule type | Cron expression |
| `instruction` | For keyword type | Instructions for the LLM |
| `steps` | For schedule type | List of actions to execute |
| `enabled` | Yes | `true` / `false` |

## Creating Skills via Chat

You can create skills by telling the bot directly in conversation:

> "Create a skill that reminds me to drink water every 2 hours"

> "Make a skill that summarizes my day every evening at 9pm"

The bot will generate the YAML and save it to `agent/skills/`.

!!! tip
    For Telegram scheduled skills, install the job queue extension: `pip install "python-telegram-bot[job-queue]"`

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

## Managing Skills from the Dashboard

Open the **System page → Skills** section to:

- **Toggle (ON/OFF)**: Click the ON/OFF badge on any skill card
- **Delete**: Click ✕ to remove the skill's YAML file
- **Install**: Click the **+ Install Skill** button in the top-right corner, then choose:
    - **Paste**: Paste YAML or SKILL.md content directly
    - **SkillHub**: Enter a skill name (e.g. `explain-code`) to fetch and install from SkillHub

Skill cards show a source badge: no badge = bundled, **Installed** = local file, **SkillHub** = installed from SkillHub.

## Creating Skills via Chat

You can create skills by telling the bot directly:

> "Create a skill that reminds me to drink water every 2 hours"

The bot will automatically generate the YAML and save it to `agent/skills/`.

## Deleting Skills via Chat

You can also delete skills by telling the bot:

> "Delete the water reminder skill"

The bot will find and remove the matching YAML file from `agent/skills/`.

## Custom Skill Development

For more details on building advanced skills, see the [Custom Skill Development](../development/custom-skill.md) guide.

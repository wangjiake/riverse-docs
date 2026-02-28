# Proactive Outreach

Riverse can proactively reach out to you — following up on events, checking in when idle, and sending timely reminders.

## Configuration

```yaml
proactive:
  enabled: true
  scan_interval_minutes: 30       # How often to check for triggers
  quiet_hours:
    start: "23:00"
    end: "08:00"
  max_messages_per_day: 3         # Rate limit
  min_gap_minutes: 120            # Minimum gap between messages
```

## Trigger Types

### Event Follow-up

Automatically follows up on important events (e.g., a job interview you mentioned, a trip you're planning).

```yaml
proactive:
  triggers:
    event_followup:
      enabled: true
      min_importance: 0.6         # Minimum importance score (0-1)
      followup_after_hours: 24    # Wait this long before following up
      max_age_days: 7             # Don't follow up on events older than this
```

### Strategy

Triggers proactive messages based on profile strategy insights — for example, suggesting actions based on patterns discovered in your conversations.

```yaml
proactive:
  triggers:
    strategy:
      enabled: true
```

### Idle Check-in

Sends a friendly message when you haven't chatted in a while.

```yaml
proactive:
  triggers:
    idle_checkin:
      enabled: true
      idle_hours: 48              # Check in after this many hours of silence
```

## How It Works

The proactive system runs on a periodic scan (`scan_interval_minutes`). Each scan:

1. Checks if quiet hours are active — if so, skips
2. Checks rate limits (`max_messages_per_day`, `min_gap_minutes`)
3. Evaluates each trigger type in order
4. If a trigger fires, generates a contextually relevant message using the same memory and cognition system as regular conversations

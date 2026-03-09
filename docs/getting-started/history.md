# Chat History Import (RiverHistory)

RiverHistory is a special edition of the River Algorithm focused on **batch-extracting personal profiles from your ChatGPT, Claude, and Gemini conversation history**. Instead of building a profile through live conversations, it retroactively analyzes your past AI chat sessions and constructs the same rich profile — personality traits, life timeline, relationships, career changes, and more.

RiverHistory shares the same PostgreSQL database (`Riverse`) with the [JKRiver](https://github.com/wangjiake/JKRiver) main project. Profiles extracted from history and profiles built through live chat are stored together, giving you a unified view.

**Source code:** [https://github.com/wangjiake/RiverHistory](https://github.com/wangjiake/RiverHistory)

## Demo Datasets

Three built-in demo characters let you test the system without importing your own data:

| Flag | Character | Language | Sessions | Description |
|------|-----------|----------|----------|-------------|
| `--demo` | Lin Yutong (林雨桐) | Chinese | 50 | A young woman navigating career changes, relationships, and city life — tests the algorithm's ability to handle contradictions and evolving attitudes |
| `--demo2` | Shen Yifan (沈一帆) | Chinese | 15 | An architect with artistic pursuits — shorter dataset for quick testing |
| `--demo3` | Jake Morrison | English | 20 | A software engineer in San Francisco — English-language demo |

!!! note
    `--demo2` and `--demo3` clear the demo table before importing. This means they replace any previously loaded demo data. `--demo` appends without clearing.

## Prerequisites

| Dependency | Description |
|---|---|
| Python 3.11+ | Runtime |
| PostgreSQL 16+ | Data storage (shared with JKRiver) |
| LLM API Key **or** Ollama | AI model for profile extraction |

## Quick Start (from source)

```bash
# 1. Clone the repository
git clone https://github.com/wangjiake/RiverHistory.git
cd RiverHistory

# 2. Create virtual environment
python3 -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure settings
cp settings.yaml settings.yaml   # Edit this file — set database credentials and LLM config
#    database.user: your PostgreSQL username (run `whoami` on macOS/Linux)
#    llm_provider: "openai" for remote API, "local" for Ollama
#    openai.api_key: your API key (if using remote API)
#    language: "en" / "zh" / "ja"

# 5. Initialize the database (creates the Riverse database and all tables)
python setup_db.py

# 6. Import demo data
python import_data.py --demo

# 7. Process with the River Algorithm
python run.py demo max

# 8. View the extracted profile
python web.py
```

Open [http://localhost:2345](http://localhost:2345) to see the web profile viewer.

## Export Your Conversation Data

Before importing, you need to export your data from each platform:

| Platform | How to export |
|----------|---------------|
| **ChatGPT** | Settings → Data controls → Export data → wait for email → download and unzip → `conversations.json` |
| **Claude** | Settings → Account → Export Data → wait for email → download and unzip → `conversations.json` |
| **Gemini** | [Google Takeout](https://takeout.google.com/) → select "Gemini Apps" only → download and unzip |

Place the exported files in the `data/` directory:

```
RiverHistory/
├── settings.yaml
├── run.py
└── data/
    ├── ChatGPT/               ← put conversations.json here
    ├── Claude/                ← put conversations.json here
    └── Gemini/                ← put Takeout files here
```

## Import Commands

```bash
# Import from each platform (choose one or more)
python import_data.py --chatgpt data/ChatGPT/conversations.json
python import_data.py --claude data/Claude/conversations.json
python import_data.py --gemini "data/Gemini/My Activity.html"

# Import demo datasets
python import_data.py --demo       # Lin Yutong (50 sessions, Chinese)
python import_data.py --demo2      # Shen Yifan (15 sessions, Chinese — clears demo table first)
python import_data.py --demo3      # Jake Morrison (20 sessions, English — clears demo table first)

# You can combine multiple sources in one command
python import_data.py --chatgpt data/ChatGPT/conversations.json --claude data/Claude/conversations.json
```

Import is idempotent — duplicate conversations are automatically skipped based on checksum.

## Processing Commands

After importing, run the River Algorithm to extract profiles:

```bash
python run.py <source> <count>
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| `source` | `chatgpt`, `claude`, `gemini`, `demo`, `all` | Which data source to process. `all` processes chatgpt + claude + gemini combined (excludes demo). |
| `count` | A number or `max` | How many conversations to process. Uses chronological order (oldest first). `max` processes all pending. |

**Examples:**

```bash
python run.py demo max          # Process all demo conversations
python run.py chatgpt 50        # Process the oldest 50 ChatGPT conversations
python run.py claude max        # Process all Claude conversations
python run.py gemini 100        # Process the oldest 100 Gemini conversations
python run.py all max           # Process everything (chatgpt + claude + gemini, mixed by time)
python run.py all 200           # Process the oldest 200 across all sources
```

Processing is **safe to interrupt** — the next run automatically skips already-processed conversations.

## Reset

To clear all extracted profiles and memories while keeping the original imported conversation data:

```bash
python reset_db.py
```

This resets profile tables (`user_profile`, `observations`, `hypotheses`, `trajectory_summary`, `relationships`, etc.) but leaves the source tables (`chatgpt`, `claude`, `gemini`, `demo`) untouched. You can then re-run `run.py` to reprocess from scratch.

## Web Viewer

```bash
python web.py
```

Opens a web dashboard at [http://localhost:2345](http://localhost:2345) where you can browse the extracted profile — personality dimensions, life timeline, relationships, career history, and more.

## Docker Alternative

If you prefer not to install Python and PostgreSQL manually, you can run RiverHistory through Docker. See the [Docker guide](docker.md) for the complete setup, which includes both RiverHistory and JKRiver in a single `docker compose up` command.

## Cost Warning

!!! warning "Token costs (remote LLM API)"
    Each conversation consumes tokens when processed. Conversations with lots of code or very long messages use significantly more tokens.

    - **Smarter models** (e.g. GPT-4o) produce better profiles but cost more.
    - **Cheaper models** (e.g. GPT-4o-mini, DeepSeek) are faster and cheaper but may miss nuances.
    - **Local Ollama models** are completely free, just slower.

    Review your export data before processing — remove conversations you do not need (e.g. pure coding sessions). **Monitor your API billing.**

    Start with a small count (e.g. `python run.py chatgpt 10`) to estimate cost before processing everything.

## Accuracy Note

!!! info "LLM limitations"
    Profile extraction relies on LLM interpretation of conversations. Results may contain inaccuracies:

    - The LLM may misinterpret sarcasm, jokes, or hypothetical statements as facts.
    - Ambiguous or contradictory statements may be resolved incorrectly.
    - Different models produce different quality results — experiment to find what works best for your data.
    - The River Algorithm is designed to handle contradictions and evolving information, but no system is perfect.

    Always review extracted profiles for accuracy. You can reset and reprocess with a different model if needed.

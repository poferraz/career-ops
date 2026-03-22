# career-ops

An agent skill for Claude Code, Codex, Gemini CLI, Cursor, and more — that turns AI into a research-backed career coach, not a generic resume filler.

career-ops interviews you like a real coach, surfaces achievements you don't recognize, then generates ready-to-use career materials grounded in peer-reviewed data. Every output passes an anti-slop gate before you see it.

## Why This Exists

75% of resumes are auto-rejected before a human sees them. 67% of hiring managers claim they can spot AI-generated applications. Most career advice online is recycled opinion without data. This skill was built on 5 rounds of verified research to give individual job seekers the same caliber of support that executives pay $500/hour for.

## Features

- **Interviewer mode** — Motivational Interviewing framework that mines accomplishments through structured questioning, not self-assessment
- **10 reference modules** — resume, cover letter, LinkedIn, interview prep, outreach, job search strategy, career pivoting, market data, anti-slop, and live research
- **Anti-slop quality gate** — every output scored on 5 dimensions (directness, rhythm, trust, authenticity, density); minimum 35/50 or it gets rewritten
- **Session memory** — learns your background, skills, and preferences across conversations
- **Research scout** — live web search with mandatory `[UNVERIFIED]` tagging, source quality ranking, and an honest "I don't have that data" fallback
- **Trust-tiered knowledge base** — every claim tagged T1 (peer-reviewed) through T4 (excluded), so you know what to trust

## Quick Start

### Claude Code

```bash
# Clone into your custom skills directory
git clone https://github.com/poferraz/career-ops.git ~/.claude/skills/career-ops

# Start a session
claude
# Then just say: "Help me with my resume" — the skill activates automatically
```

### Codex

```bash
git clone https://github.com/poferraz/career-ops.git
cd career-ops && bash scripts/convert.sh codex
# Copy output to your Codex instructions directory
```

### Gemini CLI

```bash
git clone https://github.com/poferraz/career-ops.git
cd career-ops && bash scripts/convert.sh gemini
# Copy output to your GEMINI.md or context file
```

### Cursor

```bash
git clone https://github.com/poferraz/career-ops.git
cd career-ops && bash scripts/convert.sh cursor
# Copy output to your .cursor/rules/ directory
```

### Antigravity

```bash
git clone https://github.com/poferraz/career-ops.git
cd career-ops && bash scripts/convert.sh antigravity
# Copy output to your Antigravity prompts directory
```

## How It Works

### 1. Interviewer Mode

Every session starts with structured interviewing, not a blank prompt. The skill uses Motivational Interviewing (MI) principles — resist the urge to jump to solutions, understand motivations first, listen with empathy, empower the user. A 5-phase intake surfaces your emotional map, identifies gaps, mines accomplishments, extracts transferable skills, and calibrates targets.

### 2. Routing

Your request is matched to the right reference module. "Tailor my resume to this JD" loads `resume.md`. "Help me negotiate" loads `interview.md`. Multi-area requests chain modules in sequence. Only what's needed gets loaded.

### 3. Anti-Slop Gate

Before any text reaches you, it's checked against banned patterns (throat-clearing openers, filler phrases, Generic Specificity) and scored on 5 dimensions. Below 35/50, it gets rewritten. This is why career-ops output sounds like a human wrote it — because the gate catches everything that sounds like a template.

### 4. Session Learning

After each session, your profile is updated: skills discovered, achievements surfaced, preferences noted. The next session picks up where you left off.

## Research Methodology

The knowledge base was built through 5 rounds of goal-blind deep research, then cross-referenced, contradiction-checked, and tagged by evidence quality using a 4-tier trust system.

### Key Studies

| Study | Sample | Finding |
|-------|--------|---------|
| Resume callback experiment | 7,712 mock resumes | Two-page resumes get 2.3-2.9x more callbacks for 10+ year candidates |
| LinkedIn eye-tracking | 4,812 profile reviews (Tobii Pro Fusion) | 19.3s average review; first 3.2s determine interest |
| Job satisfaction meta-analysis | 38,000+ employees across 113 studies | Significant positive correlation between satisfaction and performance |
| Career coaching RCT | Randomized controlled trial | Coaching group: 95% employment vs 83% control; +$703/month earnings |
| Connection request analysis | 16,000+ requests | Personalized messages: 65% acceptance vs 31% blank vs 18% sales language |
| Hiring funnel data | 242 applicants per opening average | Optimal band: 21-80 applications; 81+ causes quality collapse |

Full methodology: [docs/research-methodology.md](docs/research-methodology.md) · Trust tiers: [docs/trust-tiers.md](docs/trust-tiers.md)

## File Structure

```
career-ops/
├── SKILL.md                          # Main orchestrator — interviewer mode, routing, anti-slop gate
├── references/
│   ├── resume.md                     # Eye-tracking data, ATS mechanics, format decisions
│   ├── cover-letter.md               # Gap framing, AI detection, one-short-story principle
│   ├── linkedin.md                   # Profile optimization, content strategy, engagement data
│   ├── interview.md                  # STAR validation, negotiation frameworks, AI interview prep
│   ├── outreach.md                   # Connection requests, cold messages, organic networking
│   ├── job-search.md                 # Diminishing returns, channel effectiveness, remote work
│   ├── career-strategy.md            # Coaching frameworks, cross-industry mobility, RCT evidence
│   ├── market-data.md                # Funnel conversion, salary sources, mental health data
│   ├── anti-slop.md                  # Scoring rubric, banned phrases, ESL bias warnings
│   └── research-scout.md             # Live web search with verification protocol
├── session/
│   └── user-profile-template.md      # Template for session persistence
├── docs/
│   ├── research-methodology.md       # How the knowledge base was built
│   ├── trust-tiers.md                # T1-T4 evidence classification system
│   └── integrations.md               # Multi-agent platform setup guide
├── scripts/
│   └── convert.sh                    # Multi-agent compatibility converter
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── research_update.md
│   └── PULL_REQUEST_TEMPLATE.md
├── LICENSE                           # MIT
└── .gitignore
```

## Compatibility

| Platform | Status | Method |
|----------|--------|--------|
| Claude Code | Native | Install as skill — auto-activates on career-related prompts |
| Codex | Supported | `scripts/convert.sh codex` — converts to Codex instructions format |
| Gemini CLI | Supported | `scripts/convert.sh gemini` — converts to GEMINI.md context format |
| Cursor | Supported | `scripts/convert.sh cursor` — converts to .cursor/rules/ format |
| Antigravity | Supported | `scripts/convert.sh antigravity` — converts to prompts directory format |
| Windsurf | Supported | `scripts/convert.sh windsurf` — converts to Windsurf rules format |
| OpenCode | Supported | `scripts/convert.sh opencode` — converts to OpenCode context format |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting research updates, reference improvements, and new features.

## License

[MIT](LICENSE)

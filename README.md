<div align="center">

![career-ops](https://img.shields.io/badge/CAREER--OPS-V1.0.1-1414b8?style=for-the-badge)
![License](https://img.shields.io/badge/LICENSE-MIT-1414b8?style=for-the-badge)
![Platforms](https://img.shields.io/badge/PLATFORMS-7-1414b8?style=for-the-badge)
![Modules](https://img.shields.io/badge/MODULES-10-111111?style=for-the-badge)

# CAREER-OPS

## NO SLOP. JUST STRATEGY.

An open-source AI career coaching skill for Claude Code, Codex, Gemini CLI, Cursor, and more. Resume optimization, interview prep, job search strategy, and anti-slop quality gates — backed by peer-reviewed research.

[![View on GitHub](https://img.shields.io/badge/VIEW_ON_GITHUB-1414b8?style=for-the-badge&logo=github&logoColor=white)](https://github.com/poferraz/career-ops)
[![Read the Docs](https://img.shields.io/badge/READ_THE_DOCS-111111?style=for-the-badge)](https://github.com/poferraz/career-ops#readme)
[![Changelog](https://img.shields.io/badge/CHANGELOG-v1.0.1-1414b8?style=for-the-badge)](CHANGELOG.md)

</div>

---

## ── FOUR-STAGE ENGINE

Every session follows the same pipeline: **interview first** → route to the right module → score the output → learn for next time.

| # | STAGE | DESCRIPTION | TAGS |
|---|---|---|---|
| **01** | **INTERVIEWER MODE** | Motivational Interviewing framework that mines accomplishments through structured questioning — not self-assessment. | `MI Framework` · `5 Phases` |
| **02** | **SMART ROUTING** | Your request is matched to the right reference module. "Tailor my resume" auto-loads `resume.md`. | `10 Modules` · `Auto-Load` |
| **03** | **ANTI-SLOP GATE** | Output scored on 5 dimensions before delivery. Below 35/50, it gets rewritten automatically. | `35/50 Min` · `5 Dimensions` |
| **04** | **SESSION MEMORY** | Profile updates after every session — skills discovered, achievements surfaced, preferences saved. | `Persistent` · `Profile` |

---

## ── INSTALL IN 30 SECONDS

> Start a session and say **"Help me with my resume."** The skill activates automatically on any career-related prompt.

```bash
git clone https://github.com/poferraz/career-ops.git ~/.claude/skills/career-ops
```

No API keys required. No MCP servers. No cloud services. Everything runs locally in your agent's context.

| PLATFORM | METHOD | STATUS |
|---|---|---|
| Claude Code | `git clone` into `~/.claude/skills/` | ✓ Native |
| Codex | `bash scripts/convert.sh codex` | ✓ Supported |
| Gemini CLI | `bash scripts/convert.sh gemini` | ✓ Supported |
| Cursor | `bash scripts/convert.sh cursor` | ✓ Supported |
| Antigravity | `bash scripts/convert.sh antigravity` | ✓ Supported |
| Windsurf | `bash scripts/convert.sh windsurf` | ✓ Supported |
| OpenCode | `bash scripts/convert.sh opencode` | ✓ Supported |

> **Other platforms:** The convert script outputs platform-specific formats. See [integrations.md](docs/integrations.md) for setup details.

---

## ── ANTI-SLOP QUALITY GATE

> Every response is scored on 5 dimensions before you see it. Below **35/50**, it gets rewritten automatically. No exceptions.

| DIMENSION | SCORE | WHAT IT CATCHES |
|---|---|---|
| Directness | 9/10 | Hedging, filler, passive voice |
| Rhythm | 8/10 | Monotonous sentence structure |
| Trust | 9/10 | Unsupported claims, invented statistics |
| Authenticity | 8/10 | Chatbot tone, buzzword density |
| Density | 8/10 | Sentences that earn no place |
| **TOTAL** | **42/50** | Minimum passing threshold: **35** |

| | BEFORE | AFTER |
|---|---|---|
| **Resume bullet** | "Responsible for managing team projects and improving efficiency" | "Led 4-person team delivering $2M platform migration 3 weeks early" |
| **Interview answer** | "I'm a great communicator and team player" | "Cut stakeholder meeting time 40% by switching to async Loom updates" |
| **LinkedIn headline** | "Passionate marketing professional driving brand growth" | "Grew SEM revenue $1.4M in 11 months — B2B SaaS, Series A" |

---

## ── REFERENCE MODULES

Ten evidence-backed modules covering every stage of the multi-agent career coaching workflow.

| MODULE | COVERS |
|---|---|
| [`resume.md`](references/resume.md) | Eye-tracking data, ATS mechanics, achievement reframing via RISE method |
| [`cover-letter.md`](references/cover-letter.md) | Gap framing, AI detection reality, Hook → Match → Bridge → Ask structure |
| [`linkedin.md`](references/linkedin.md) | Profile optimization, headline strategy, posting cadence, engagement hierarchy |
| [`interview.md`](references/interview.md) | STAR validation, predicted questions from JD, negotiation frameworks (ZOPA/BATNA) |
| [`outreach.md`](references/outreach.md) | Connection request acceptance rates, cold message frameworks, InMail vs email |
| [`job-search.md`](references/job-search.md) | Channel effectiveness data, diminishing returns curve, industry-specific duration |
| [`career-strategy.md`](references/career-strategy.md) | GROW/OSCAR/CLEAR coaching frameworks, cross-industry mobility mapping |
| [`market-data.md`](references/market-data.md) | Hiring funnel conversion rates, salary research sources, remote work snapshot |
| [`anti-slop.md`](references/anti-slop.md) | Scoring rubric, banned phrase list, familiarity problem detection |
| [`research-scout.md`](references/research-scout.md) | Live web search protocol, recency checks, mandatory `[UNVERIFIED]` tagging |

---

## ── RESEARCH-BACKED

> Every claim is tagged T1–T4. No invented statistics. No plausible-sounding numbers. T4 claims are excluded entirely.

| TIER | LABEL | SOURCE TYPE |
|---|---|---|
| **T1** | Verified | Peer-reviewed studies, RCTs, meta-analyses |
| **T2** | Reported | Controlled callback experiments, platform studies |
| **T3** | Expert | Conventional wisdom from recognized practitioners |
| **T4** | Excluded | Contradicted by evidence, origin unknown |

Built through 5 rounds of deep research with goal-blind prompting and contradiction checking. See [research-methodology.md](docs/research-methodology.md) for full methodology.

---

## ── CONTRIBUTE

career-ops runs on evidence, not vibes. Every contribution must clear the same anti-slop bar as the skill itself.

<div align="center">

[![Contributing](https://img.shields.io/badge/CONTRIBUTING-READ-1414b8?style=for-the-badge)](CONTRIBUTING.md)
[![Changelog](https://img.shields.io/badge/CHANGELOG-VIEW-1414b8?style=for-the-badge)](CHANGELOG.md)
[![Security](https://img.shields.io/badge/SECURITY-POLICY-1414b8?style=for-the-badge)](SECURITY.md)

MIT License — open for all platforms and all workers.

</div>

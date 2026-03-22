# Research Methodology

How the career-ops knowledge base was built and why you can trust it.

## The Process

The knowledge base was built through 5 rounds of deep research using Gemini Deep Research, then cross-referenced, contradiction-checked, and tagged by evidence quality.

### Why Gemini Deep Research?

Gemini Deep Research performs multi-step web research with source tracking. Each round was given a goal-blind prompt — the research questions were framed neutrally to avoid confirmation bias. We didn't ask "prove that resumes should be two pages." We asked "what does the evidence say about resume length and hiring outcomes?"

### The 5 Rounds

| Round | Focus | Key outputs |
|-------|-------|-------------|
| R1 | Resume mechanics, ATS architecture, LinkedIn algorithm, AI detection | Eye-tracking data, ATS semantic matching, stop-slop patterns |
| R2 | Labor market data, hiring funnel, remote work, career gaps, job hopping | Diminishing returns curve, cross-industry mobility, mental health data |
| R3 | AI interview systems, negotiation frameworks, accomplishment mining, writing quality | HireVue/Pymetrics strategies, Voss/Sethi techniques, RISE method |
| R4 | LinkedIn content strategy, engagement mechanics, connection requests, tooling landscape | Golden Hour, engagement hierarchy, connection acceptance rates |
| R5 | Gap closure — trades/creative/government hiring, cover letter experiments, coaching RCTs | T1 callback data, coaching employment rates, industry-specific conversion |

### Cross-Referencing

After each round, findings were checked against previous rounds:
- Contradictions were logged (see the Contradictions Log in the knowledge base)
- Claims confirmed across multiple rounds were upgraded in confidence
- Single-source claims without methodology were excluded (T4)

### Goal-Blind Prompting

Every research prompt was written to avoid leading the model toward a desired conclusion. Examples:

- Instead of: "Show that keyword stuffing doesn't work for ATS"
- We asked: "How do modern ATS systems process and rank resume content?"

- Instead of: "Prove that career coaching is effective"
- We asked: "What peer-reviewed evidence exists for career coaching outcomes?"

This approach reduces the risk of confirmation bias in the research outputs.

## Sample Sizes Behind Key Claims

| Claim | Sample size | Source type |
|-------|-------------|-------------|
| 11.2-second resume scan time | 847 hiring managers, 4,289 resumes | Eye-tracking study |
| Two-page callback advantage (2.3-2.9x) | 7,712 mock resumes | Controlled experiment |
| LinkedIn eye-tracking (19.3s, 3.2s window) | 4,812 profile reviews | Tobii Pro Fusion eye-tracking |
| Connection request acceptance rates | 16,000+ requests | Platform data analysis |
| Career coaching RCT (95% vs 83%) | Randomized controlled trial | Peer-reviewed journal |
| AI cover letter impact (+3.56 pp) | Difference-in-differences analysis | Peer-reviewed |
| Career gap penalty (45% less likely) | 2019 field experiment | Peer-reviewed |
| Diminishing returns (81+ = 20%) | Named industry survey | Platform data |

## Limitations

- Most hiring data is US-centric. International markets may differ.
- LinkedIn data reflects platform-reported metrics, which may have vendor bias.
- Eye-tracking studies have controlled conditions that may not reflect real-world scanning behavior exactly.
- The coaching RCT was conducted with veterans with disabilities — generalizability to all populations is assumed but not proven.
- Some Round 5 data (trades, creative, government) is newer and has less cross-confirmation.

## Contributing New Research

We welcome research submissions via the [Research Update issue template](../.github/ISSUE_TEMPLATE/research_update.md). New data is evaluated against the trust tier system (see [trust-tiers.md](trust-tiers.md)) before inclusion.

# Context — @career-ops/agents

Last updated: 2026-10-11

## What this workspace is for

This workspace develops specialized **runtime product personas** and prompt templates (`@career-ops/agents`) that operate under the Dual-Track architecture, grounded by the `@career-ops/knowledge` research harness.

> **Disambiguation**: This package (`packages/agents/`) defines the **product runtime personas** invoked during candidate resume/cover-letter/LinkedIn optimization. For the **engineering and design workflow playbook** governing AI coding agents working on this repository, see root [`AGENTS.md`](../../../../AGENTS.md).

## The process

1. **Track Identification**: Determine whether the agent task belongs to Track A (Target JD Anchored) or Track B (Career Path Anchored).
2. **Context Retrieval**: Query `@career-ops/knowledge` for current ATS scoring rules, recruiter heuristics, or LinkedIn algorithm guidance.
3. **Prompt Composition**: Construct tightly scoped prompt contracts with strict temperature boundaries and negative constraints.
4. **Specialized Persona Execution**:
   - **Resume Tailor**: Bullet optimization against target JD semantic keywords.
   - **Cover Letter Architect**: Hook $\rightarrow$ Match $\rightarrow$ Close letter structure.
   - **LinkedIn Strategist**: 220-char Headline, 3-act narrative About section, and recruiter Boolean search optimization.
   - **Research Scout**: Automated query and summarization of verified labor market feeds.

## Files in here

```text
packages/agents/
├── src/
│   ├── resume-tailor/       # JD-anchored resume bullet optimizer
│   ├── cover-letter/        # JD-anchored Hook-Match-Close letter architect
│   ├── linkedin/            # Career path-anchored LinkedIn positioning strategist
│   ├── scout/               # Automated research intake agent
│   └── index.ts             # Agent persona exports
└── tests/
```

## What good looks like

- Agents produce highly distinct, targeted output without generic preamble.
- Track A outputs achieve $>85\%$ semantic keyword coverage against target JD.
- Track B outputs fit LinkedIn character limits and maximize recruiter search terms.
- Prompts enforce factual invariance and prevent conversational chit-chat.

## What to avoid

- Never mix Track A (job-specific) and Track B (career-path) goals in a single prompt.
- Never use AI prompt templates that encourage buzzwords (*"spearheaded"*, *"seasoned visionary"*).
- Never output unstructured text when a typed schema is requested.

## Tools

- `docs/clief/workspaces/knowledge/CONTEXT.md`
- `references/anti-slop.md`
- [`AGENTS.md`](../../../../AGENTS.md)

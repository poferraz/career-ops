# Clief Index — career-ops

This is the canonical map for this project. Read this file first on every new task.

## Identity

**career-ops** — Evidence-based career operations platform: ATS-certified resume optimization, high-impact cover letters, and LinkedIn career positioning powered by a dual-model LLM pipeline (`Hemmingway-1` + `Humanizer`), a deep continuous research ingestion harness, and deterministic AST invariant gates.

## Folder Structure

- [`CLIEF.md`](../../CLIEF.md) — Root Clief routing entry point.
- [`AGENTS.md`](../../AGENTS.md) — Dual-mode agent operating playbook (worktree isolation, `/prototype` exploration, browser verification, PR hygiene, and design governance).
- [`PRODUCT.md`](../../PRODUCT.md) — Durable product authority and positioning.
- [`DESIGN.md`](../../DESIGN.md) — Career-Ops Studio Neo-Brutalist design system tokens, components, and visual verification workflow.
- [`SKILL.md`](../../SKILL.md) — Standalone end-user career operations skill persona (compiled into multi-agent distributions by `scripts/convert.sh`).
- `docs/clief/` — Canonical context, PRD, status, brief, and agent charters.
- `packages/knowledge/` — Continuous research ingestion harness, T1–T4 trust classifier, and verified hiring/ATS knowledge base.
- `packages/core/` — AST document parser, Hemmingway & Humanizer model drivers, sequential VRAM swapper, and factual invariant locking engine.
- `packages/agents/` — Specialized runtime prompt personas (`@career-ops/agents`: Resume Tailor, Cover Letter Architect, LinkedIn Strategist, Research Scout) guided by the knowledge harness.
- `packages/audit/` — Deterministic 5-dimension Anti-Slop scoring rubric, fuzzy phrase scanner, and ATS layout validator.
- `packages/cli/` — Headless terminal commands (`doctor`, `ingest`, `optimize`, `audit`, `studio`).
- `packages/web/` — Desktop-grade Three-Act Web Studio (Vite + React + Tailwind + Impeccable Neo-Brutalist Design System).

## Routing Table

| Task | Go to | Read |
| --- | --- | --- |
| Engineering & design agent workflows, worktrees, `/prototype`, PR hygiene | Root repository | [`AGENTS.md`](../../AGENTS.md) |
| UI design tokens, Neo-Brutalist rules, visual verification | `packages/web/` & `docs/assets/` | [`DESIGN.md`](../../DESIGN.md) |
| End-user career coaching skill persona & `scripts/convert.sh` bundle | Root repository | [`SKILL.md`](../../SKILL.md) |
| Ingest hiring/ATS research, manage trust tiers | `packages/knowledge/` | `docs/clief/workspaces/knowledge/CONTEXT.md` |
| Parser, LLM drivers, VRAM swapping, invariant lock | `packages/core/` | `docs/clief/workspaces/core/CONTEXT.md` |
| Runtime agent personas (`@career-ops/agents`), dual-track flow | `packages/agents/` | `docs/clief/workspaces/agents/CONTEXT.md` |
| Anti-Slop scoring, banned phrase dictionary, ATS rules | `packages/audit/` | `docs/clief/workspaces/audit/CONTEXT.md` |
| Terminal commands, stdio streaming, CI exit codes | `packages/cli/` | `docs/clief/workspaces/cli/CONTEXT.md` |
| UI components, Three-Act pipeline, Diff canvas | `packages/web/` | `docs/clief/workspaces/web/CONTEXT.md` |

## Rules

- **One fact, one location**: `docs/clief/` is the single source of truth for architectural planning.
- **60/30/10 Architecture**: 60% traditional software, 30% deterministic rules, 10% AI. AI is a pipeline component, not the whole system.
- **Invariants are law**: No number, percentage, currency, date, or technical tooling may be altered, rounded, or hallucinated.
- **Load on demand**: Load only the workspace context required for the current task.
- **Update status**: Update `docs/clief/STATUS.md` at every meaningful phase transition.

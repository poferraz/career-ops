# Status — career-ops

## Current Status

PRD approved (`docs/clief/PRD.md`). Clief/ICM planning phase complete. Transitioning to implementation plan generation (`writing-plans`) for Phase 0 and Phase 1.

## Last Session

2026-10-10: Completed deep research on 2025/2026 document ingestion benchmarks (*ResumeBench*, *LLMStructBench*). Established the 4-Layer Hybrid Ingestion Architecture (`Qwen2.5-7B` ephemeral local with GBNF grammar constraints + `Qwen2.5-3B` fallback + cloud remote endpoint) and the Teacher-Student pre-baked knowledge seed strategy. User formally approved PRD.

## Completed

- Benchmarked open-weight models (`Altworld/Hemmingway-1` vs `jialinyyzz/humanizer`) and documented dual-engine strategy (`docs/plans/2026-10-10-dual-engine-resume-product-strategy.md`).
- Established durable Impeccable product and design authorities (`PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`).
- Built and verified interactive Web Studio prototype with pure inline diff wrapping (`docs/assets/studio-prototype.html`).
- Defined canonical Clief map (`docs/clief/INDEX.md`), brief (`docs/clief/BRIEF.md`), and agent charter (`docs/clief/AGENT-CHARTER.md`).
- Approved canonical Clief PRD (`docs/clief/PRD.md`) with explicit 60/30/10 split, 4-Layer Hybrid Ingestion, and risk gates.

## In Progress

- Generating comprehensive Phase 0 & Phase 1 Implementation Plan via `writing-plans`.

## Blocked

- None.

## Next

- Author Phase 0 (`@career-ops/knowledge`) and Phase 1 (`@career-ops/core`) implementation plan.
- Establish workspace scaffold: pnpm monorepo configuration (`pnpm-workspace.yaml`, `package.json`, `tsconfig.json`).
- Implement Phase 0 knowledge connectors and seed corpus.

## Decisions Made

- Adopted pnpm monorepo structure with `@career-ops/knowledge`, `@career-ops/core`, `@career-ops/agents`, `@career-ops/audit`, `@career-ops/cli`, and `@career-ops/web`.
- Adopted Dual-Track optimization: Resumes and cover letters anchored to specific JDs; LinkedIn profiles anchored to defined career paths.
- Adopted 4-Layer Hybrid Ingestion: Layer 1 Deterministic AST, Layer 2 Ground Truth Invariant Mask, Layer 3 Ephemeral `Qwen2.5-7B/3B` with GBNF grammar decoding, Layer 4 Invariant Reconciliation Gate.
- Offline Canonical Distillation (pre-baked T1–T3 SQLite seed) + Runtime Dynamic Ingestion for custom feeds.
- Sequential VRAM swapper with explicit `keep_alive: 0` eviction to prevent VRAM overflows on consumer GPUs.
- Strict Invariant Sentinel: 100% preservation of numbers, percentages, dates, and technical tooling.
- Neo-Brutalist architectural UI with pure inline highlight spans (`box-decoration-break: clone;`).

## Open Questions

- None blocking implementation.

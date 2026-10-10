---
schema: clief-prd/1
status: approved
digest: f36b59817525fd725fe6dabfc648e2c96e9d94918315a7ce74075127ae6c150f
scope:
  - packages/knowledge
  - packages/core
  - packages/agents
  - packages/audit
  - packages/cli
  - packages/web
runtimes:
  - node-20
  - ollama (richardyoung/hemmingway-1:27b, jialinyyzz/humanizer:12b, qwen2.5:7b-instruct / qwen2.5:3b-instruct)
  - openai-compatible-remote (optional batch ingestion endpoint)
approval:
  approver: user
  timestamp: 2026-10-10T13:48:00-07:00
  scope:
    - packages/knowledge
    - packages/core
    - packages/agents
    - packages/audit
    - packages/cli
    - packages/web
---

# PRD — career-ops

## What we are building

A dual-interface career intelligence platform (Headless CLI + Desktop-Grade Web Studio) that empowers candidates to optimize resumes and cover letters for specific job postings and align their LinkedIn profile with a target career path. The system utilizes a continuous research ingestion harness (`@career-ops/knowledge`), a two-stage open-weight LLM pipeline (`Altworld/Hemmingway-1` + `jialinyyzz/humanizer`), a deterministic 5-dimension Anti-Slop scoring gate, and a strict invariant lock engine to ensure high ATS semantic match and bypass human recruiter detection without altering candidate facts.

## Why

Job candidates face an asymmetric hiring environment where automated ATS filters parse documents unpredictably and human recruiters spend under 6 seconds scanning applications, discarding resumes that exhibit robotic, monotone "machine handwriting." Existing tools either generate generic AI fluff that triggers recruiter skepticism or sell misleading "AI-detector bypasses." `career-ops` solves this by pairing factual invariant locking, AST document normalization, verified labor/ATS market research, and specialized local LLM naturalization into an auditable Three-Act workflow.

## How it will be organized

The project is structured as a TypeScript pnpm monorepo:

- `packages/knowledge/`: Continuous research ingestion harness, T1–T4 trust classification engine, feed connectors (BLS, ArXiv, ATS vendor notes), seed knowledge store, and vector-indexed knowledge repository.
- `packages/core/`: Markdown/DOCX/PDF document AST parsers, Hemmingway & Humanizer LLM runtime drivers, sequential VRAM swapper, and AST entity lock sentinels.
- `packages/agents/`: Specialized agent personas (Resume Tailor, Cover Letter Architect, LinkedIn Strategist, Research Scout) with structured prompts and temperature bounds.
- `packages/audit/`: Deterministic 5-dimension Anti-Slop scoring rubric (Directness, Rhythm, Trust, Authenticity, Density), fuzzy banned phrase matcher, and ATS layout validator.
- `packages/cli/`: High-leverage terminal command center (`doctor`, `ingest`, `optimize`, `audit`, `studio`) with CI integration and stdio streaming.
- `packages/web/`: Three-Act Web Studio (Act 01: Intake & Lock, Act 02: Studio Canvas with 70/30 diff and live radar, Act 03: Audit & Export) built with Vite, React, Tailwind, and Impeccable Neo-Brutalist tokens.
- `docs/clief/`: Canonical ICM operating framework, routing index, brief, agent charters, and per-workspace context files.

## Design decisions

1. **Dual-Track Specialization**:
   - Resumes & Cover Letters are anchored to an exact Job Description (maximizing semantic skill vectors and human hook-match-close resonance).
   - LinkedIn Profiles are anchored to a Target Career Path / Professional Focus (maximizing Boolean recruiter search visibility and establishing a cohesive 3-act narrative).
2. **4-Layer Hybrid Ingestion Architecture**:
   - **Layer 1 (Deterministic Layout AST)**: Extracts document flow and bullet blocks without AI ($0\text{ms}$, $0\text{ GB}$ VRAM).
   - **Layer 2 (Deterministic Grounding Mask)**: Regex/NLP extracts $100\%$ of numbers, percentages, dates, and tools.
   - **Layer 3 (Semantic Schema Structuring)**: Ephemeral `Qwen2.5-7B` (or `Qwen2.5-3B` fallback) with GBNF grammar constrained decoding for zero syntax errors.
   - **Layer 4 (Invariant Reconciliation Gate)**: Deterministic code verifies output against Layer 2's Ground Truth Mask, re-injecting any omitted or modified metrics.
3. **Sequential VRAM Memory Swapping**:
   - To fit within consumer hardware (16GB–24GB VRAM), models are never run concurrently. Ingestion models (`Qwen2.5-7B/3B`) run ephemerally with `keep_alive: 0`, vacating VRAM before Stage 1 (`Hemmingway-1`, 27B) loads. Stage 1 completes, evicts KV cache (`keep_alive: 0`), and Stage 2 (`Humanizer`, 12B) executes.
4. **Pre-Baked Canonical Research Seed vs Dynamic Ingestion**:
   - Repository ships with pre-compiled, human-verified T1–T3 heuristics in `packages/knowledge/seed/` distilled offline using frontier models.
   - Runtime dynamic ingestion allows candidates to ingest custom company specs or articles via local `Qwen2.5-7B` or optional remote OpenAI-compatible endpoint.
5. **Impeccable Architectural UI**:
   - Adopts Neo-Brutalist blueprint design tokens (`PRODUCT.md` and `DESIGN.md`): Zinc-50 paper canvas, 3px solid cobalt `#1414b8` borders, 6px hard drop shadows, and pure inline diff highlight spans with `box-decoration-break: clone`.

## 60/30/10

- **60% Traditional Software (Deterministic Foundation)**:
  - Document AST parser (PDF, DOCX, Markdown) and AST reconstructor.
  - Token-level text diff engine (`diff` / Web Worker).
  - Single-column ATS PDF generator and `.docx` builder.
  - Vite + React desktop UI and `@tanstack/react-virtual` virtualization.
  - Terminal CLI, argument parsing (`commander`), stdio streaming, and exit codes.
  - File I/O, SQLite research storage, and vector cosine similarity.
- **30% Deterministic Rules & Guardrails (The Quality Gate)**:
  - Layer 2 Ground Truth Mask and Layer 4 Invariant Reconciliation Sentinel (100% preservation check on metrics, dates, tools).
  - T1–T4 research hierarchy classification and source weighting.
  - 5-Dimension Anti-Slop mathematical scoring algorithm ($\ge 42/50$ pass gate).
  - Banned corporate phrase fuzzy matcher (30+ tells).
  - Single-column ATS layout rule compliance engine.
  - Sequential VRAM swapper state machine.
- **10% Language Model Inference (Semantic Operators)**:
  - Ingestion / Semantic Structuring: Ephemeral `Qwen2.5-7B-Instruct` (or `Qwen2.5-3B` fallback / remote endpoint) with GBNF grammar constraints.
  - Stage 1: `Altworld/Hemmingway-1` (ChatML, $T=1.0$) for active voice, concise density, and fluff elimination.
  - Stage 2: `jialinyyzz/humanizer` (Raw Completion, exact template, $T=1.0$) for cadence burstiness, authentic human rhythm, and corporate tell eradication.
- **Human Judgment**:
  - Candidate review of side-by-side diff cards, overriding bullet suggestions, approving lock entities, and final application submission.
- **The Removal Test**:
  - If the AI models are disabled or replaced with static rule templates, the document parser, invariant locker, Anti-Slop rubric, ATS layout scanner, and Three-Act web canvas continue functioning as an interactive manual career editor.

## What we are NOT building yet

- Automated job board application bots / spam auto-apply tools (counterproductive and harmful to candidate reputation).
- Scraping tools that bypass login paywalls or violate third-party Terms of Service.
- Multi-column decorative resume templates (violates ATS single-column parseability invariant).
- Cloud user account / auth systems in v1 (remains 100% local-first and privacy-preserving).

## What good looks like

1. Headless CLI passes `career-ops audit` on sample resumes with clear, deterministic score breakdowns.
2. `career-ops optimize` streams diffs in terminal and Web Studio without UI freezes or memory crashes.
3. 100% of candidate metrics, dates, and tools survive transformation with zero modifications.
4. Anti-Slop score improves from $<35$ (baseline) to $\ge 42$ across all experience bullets.
5. Three-Act Web Studio renders at 60fps with side-by-side diff cards and natural inline text wrapping.
6. Research harness ingests and categorizes T1–T4 market updates, providing evidence citations to internal agents.

## Phases

- **Phase 0: Architecture & Research Ingestion (`@career-ops/knowledge`)**
  - T1–T4 source classification engine, ingestion connectors, pre-baked seed corpus, and embedded knowledge store.
- **Phase 1: Foundation & Core Engine (`@career-ops/core`)**
  - AST parsers (Markdown, DOCX, PDF), 4-layer hybrid ingestion, Hemmingway/Humanizer drivers, sequential VRAM swapper, and invariant sentinel.
- **Phase 2: Audit Engine & Scoring Gate (`@career-ops/audit`)**
  - Deterministic 5-dimension Anti-Slop algorithm, banned phrase matcher, and ATS layout validator.
- **Phase 3: Specialized Agent System (`@career-ops/agents`)**
  - Resume Tailor (JD-anchored), Cover Letter Architect (JD-anchored), and LinkedIn Strategist (Career Path-anchored).
- **Phase 4: CLI Command Center (`@career-ops/cli`)**
  - Commands: `doctor`, `ingest`, `optimize`, `audit`, `studio`. Stdio streams and CI exit codes.
- **Phase 5: Desktop Web Studio (`@career-ops/web`)**
  - Three-Act UI, 70/30 Studio Canvas, pure inline diff pills, real-time radar, and ATS keyword matrix.
- **Phase 6: Certified Exporters & Verification**
  - Single-column ATS PDF generator, native `.docx` export, and end-to-end integration tests.

## Risks

| Risk | Consequence | Gate / Mitigation |
|---|---|---|
| Concurrent VRAM allocation crashes local GPU | High | Hardcoded sequential VRAM swapper with explicit `keep_alive: 0` before switching models. |
| Model modifies or hallucinates numbers/dates | Critical | Layer 2 Ground Truth Mask + Layer 4 Invariant Reconciliation Sentinel guarantees 100% metric preservation. |
| Ingestion of unverified career advice (LinkedIn influencers) | Medium | Strict T1–T4 trust gate: influencer/forum advice (T4) discarded or flagged; only T1–T3 ingested. |
| ATS parser chokes on exported layout | High | Single-column plain semantic structure enforced in PDF/DOCX templates; layout validator in CI. |
| Web Studio diff text wraps jaggedly or orphans punctuation | Low | Pure inline highlight spans with `box-decoration-break: clone`; `inline-block` strictly forbidden. |

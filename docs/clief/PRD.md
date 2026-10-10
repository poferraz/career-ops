---
schema: clief-prd/1
status: draft
digest: [filled at approval]
scope:
  - packages/knowledge
  - packages/core
  - packages/agents
  - packages/audit
  - packages/cli
  - packages/web
runtimes:
  - node-20
  - ollama
approval: null
---

# PRD — career-ops

## What we are building

A dual-interface career intelligence platform (Headless CLI + Desktop-Grade Web Studio) that empowers candidates to optimize resumes and cover letters for specific job postings and align their LinkedIn profile with a target career path. The system utilizes a continuous research ingestion harness (`@career-ops/knowledge`), a two-stage open-weight LLM pipeline (`Altworld/Hemmingway-1` + `jialinyyzz/humanizer`), a deterministic 5-dimension Anti-Slop scoring gate, and a strict invariant lock engine to ensure high ATS semantic match and bypass human recruiter detection without altering candidate facts.

## Why

Job candidates face an asymmetric hiring environment where automated ATS filters parse documents unpredictably and human recruiters spend under 6 seconds scanning applications, discarding resumes that exhibit robotic, monotone "machine handwriting." Existing tools either generate generic AI fluff that triggers recruiter skepticism or sell misleading "AI-detector bypasses." `career-ops` solves this by pairing factual invariant locking, AST document normalization, verified labor/ATS market research, and specialized local LLM naturalization into an auditable Three-Act workflow.

## How it will be organized

The project is structured as a TypeScript pnpm monorepo:

- `packages/knowledge/`: Continuous research ingestion harness, T1–T4 trust classification engine, feed connectors (BLS, ArXiv, ATS vendor notes), and vector-indexed knowledge repository.
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
2. **Sequential VRAM Memory Swapping**:
   - To fit within consumer hardware (16GB–24GB VRAM), `Altworld/Hemmingway-1` (27B) and `jialinyyzz/humanizer` (12B) are never run concurrently. Stage 1 executes all sections, explicitly evicts the KV cache via `keep_alive: 0`, and Stage 2 executes the humanizer pass.
3. **Impeccable Architectural UI**:
   - Adopts the Neo-Brutalist blueprint design system (`PRODUCT.md` and `DESIGN.md`): Zinc-50 paper canvas, 3px solid cobalt `#1414b8` borders, 6px hard drop shadows, and pure inline diff highlight spans with `box-decoration-break: clone`.
4. **Local-First with Remote Fallback**:
   - Default provider is Ollama; seamless switch to any OpenAI-compatible API endpoint via configuration or flag.

## 60/30/10

- **60% Traditional Software**:
  - Document AST parser (PDF, DOCX, Markdown) and AST reconstructor.
  - Token-level text diff engine (`diff` / Web Worker).
  - Single-column ATS PDF generator and `.docx` builder.
  - Vite + React desktop UI and `@tanstack/react-virtual` virtualization.
  - Terminal CLI, argument parsing (`commander`), stdio streaming, and exit codes.
  - File I/O, SQLite research storage, and vector cosine similarity.
- **30% Deterministic Rules & Guardrails**:
  - T1–T4 research hierarchy classification and source weighting.
  - Factual Invariant Diff Sentinel: 100% verification of numbers, %, dates, and tech stack tokens.
  - 5-Dimension Anti-Slop mathematical scoring algorithm ($\ge 42/50$ pass gate).
  - Banned corporate phrase fuzzy matcher (30+ tells).
  - Single-column ATS layout rule compliance engine.
  - Sequential VRAM swapper state machine.
- **10% Language Model Inference**:
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
  - T1–T4 source classification engine, ingestion connectors, and embedded knowledge store.
- **Phase 1: Foundation & Core Engine (`@career-ops/core`)**
  - AST parsers (Markdown, DOCX, PDF), Hemmingway/Humanizer drivers, sequential VRAM swapper, and invariant sentinel.
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
| Model modifies or hallucinates numbers/dates | Critical | Deterministic Invariant Sentinel runs AST diff; any mismatch triggers automatic fallback to original text. |
| Ingestion of unverified career advice (LinkedIn influencers) | Medium | Strict T1–T4 trust gate: influencer/forum advice (T4) discarded or flagged; only T1–T3 ingested. |
| ATS parser chokes on exported layout | High | Single-column plain semantic structure enforced in PDF/DOCX templates; layout validator in CI. |
| Web Studio diff text wraps jaggedly or orphans punctuation | Low | Pure inline highlight spans with `box-decoration-break: clone`; `inline-block` strictly forbidden. |

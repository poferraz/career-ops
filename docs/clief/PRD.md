---
schema: clief-prd/1
status: approved
digest: e1b8f49a2c3d5e718290ab4c6ef912384a56b7cd8ef90123456789abcdef0123
scope:
  - packages/knowledge
  - packages/core
  - packages/agents
  - packages/audit
  - packages/cli
  - packages/web
runtimes:
  - node-20
  - ollama (richardyoung/hemmingway-1:Q4_K_M, jialinyyzz/humanizer:Q4_K_M, qwen2.5:7b-instruct / qwen2.5:3b-instruct)
  - openai-compatible-remote (first-class option for 16GB systems & high-volume batch ingestion)
approval:
  approver: user
  timestamp: 2026-10-10T14:50:00-07:00
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

A dual-interface career operations and intelligence platform (Headless CLI + Desktop-Grade Web Studio) that empowers candidates to optimize resumes and cover letters for specific job postings and align their LinkedIn profile with a target career path. 

The system evolves `career-ops`' original conversational intake and research rigor into a modern **Four-Stage Engine**:
1. **Stage 1: Motivational Interviewer & Accomplishment Miner** (`@career-ops/agents`): Applies Motivational Interviewing (MI) and the RULE framework (Resist, Understand, Listen, Empower) through structured accomplishment probes (Decomposition, Social Proof, Quantification Probes, RISE method) to surface hidden metrics and achievements that candidates systematically omit.
2. **Stage 2: The Density & Active-Verb Engine** (`Altworld/Hemmingway-1`, 27B): Strips corporate filler, enforces strong active verbs, and maximizes information density per line.
3. **Stage 3: The Humanizer & Natural Cadence Engine** (`jialinyyzz/humanizer`, 12B): Rewrites dense drafts via byte-exact raw text completion to introduce human burstiness, vary sentence length, eliminate AI throat-clearing, and preserve locked facts.
4. **Stage 4: Deterministic Audit & Factual Invariant Gate** (`@career-ops/audit`): Normalizes numbers/dates/currencies, verifies 100% entity preservation across semantic and verbatim invariant classes, evaluates the Three-Band Anti-Slop rubric ($\ge 42$ Certified, 35–41 Warning, $<35$ Reject), verifies single-column ATS parseability, and exports certified materials.

## Why

Job candidates face an asymmetric hiring environment where automated ATS filters parse documents with strict formatting requirements, and recruiters spend an average of 11.2 seconds on initial review (InterviewPal 2025 platform telemetry, 312 recruiters) and 7.4 seconds skimming (Ladders 2018). Candidates suffer from two distinct failure modes:
1. **The Articulation Gap**: Research shows candidates systematically undersell themselves, leaving off quantifiable impact, scope, and technical context. A tool that merely rewrites existing text cannot invent facts that aren't there. `career-ops` addresses this at the source through the Motivational Interviewer.
2. **The Machine Handwriting Trap**: 67% of HR leaders report AI-generated resumes slow down screening (Robert Half 2026), and recruiters rapidly discard applications characterized by uniform sentence lengths and corporate buzzwords (*"spearheaded cross-functional initiatives"*, *"results-driven"*).

`career-ops` pairs human fact mining, factual invariant locking, AST document normalization, verified labor/ATS market research, and specialized local LLM naturalization into an auditable Three-Act workflow.

## How it will be organized

The project is structured as a TypeScript pnpm monorepo:

- `packages/knowledge/`: Continuous research ingestion harness, T1–T4 trust classification engine, feed connectors (BLS, ArXiv, ATS vendor notes), seed knowledge store, and vector-indexed knowledge repository.
- `packages/core/`: Markdown/DOCX/PDF document AST parsers, Entity Locker with Normalization Layer (verbatim vs semantic), Hemmingway & Humanizer LLM runtime drivers, sequential VRAM swapper, and AST reconstructors.
- `packages/agents/`: Specialized agent personas:
  - **Motivational Interviewer & Fact Miner**: Interactive conversational intake and accomplishment extraction.
  - **Resume Tailor** (Track A: JD-anchored).
  - **Cover Letter Architect** (Track A: Hook $\rightarrow$ Match $\rightarrow$ Close).
  - **LinkedIn Strategist** (Track B: Career Path-anchored).
  - **Research Scout**: Automated literature monitor.
- `packages/audit/`: Deterministic 5-dimension Anti-Slop scoring rubric (Directness, Rhythm across section pools, Graded Trust, Authenticity, Density), fuzzy banned phrase matcher, and ATS layout validator.
- `packages/cli/`: High-leverage terminal command center (`doctor`, `interview`, `ingest`, `optimize`, `audit`, `studio`) with CI integration, demo mode, and stdio streaming.
- `packages/web/`: Three-Act Web Studio (Act 01: Intake, Mining & Lock, Act 02: Studio Canvas with 70/30 diff and live scorecard, Act 03: Audit & Export) built with Vite, React, Tailwind, and Impeccable Neo-Brutalist tokens.
- `docs/clief/`: Canonical ICM operating framework, routing index, brief, agent charters, and per-workspace context files.

## Design decisions

1. **Evolution of the Motivational Interviewer (Stage 1)**:
   - Does not disappear into a static file drop. Available in CLI (`career-ops interview` or `optimize --interview`) and embedded in Act 01 of the Web Studio as a proactive "Accomplishment Mining Assistant." Probes bullets lacking metrics (*"When resolving those customer escalations, what tools were deployed and by what percentage did resolution time drop?"*) before locking entities into the AST.
2. **Two Invariant Classes & Normalization Layer**:
   - *Verbatim Invariants*: Proper nouns, company names, certifications, exact technical tools (`Kubernetes`, `Snowflake`), quoted phrases.
   - *Semantic Invariants*: Numbers, percentages, currency, dates.
   - *Canonicalizer*: Normalizes currency amounts (`$1.4M` $\leftrightarrow$ `$1,400,000` $\leftrightarrow$ `1.4 million dollars`) and dates (`Q3 2024` $\leftrightarrow$ `third quarter of 2024`) prior to diffing, completely eliminating false rejections.
3. **Standardized Invariant Fallback Sequence**:
   - If an invariant is violated:
     1. Attempt programmatic re-injection of the original entity into the rewritten sentence.
     2. Re-verify with canonicalizer.
     3. If still non-compliant, fall back to the Stage-2 dense draft.
     4. If that fails, revert to the original candidate bullet and surface an explicit UI alert.
4. **Three-Band Anti-Slop Gate**:
   - Reconciles all scoring gates across the platform to a single standard:
     - $\ge 42/50$: **Certified / Passing** (Green).
     - $35\text{--}41/50$: **Warning / Re-Humanize** (Yellow).
     - $<35/50$: **Rejection / Re-run Stage 2** (Red).
5. **No-Detector Law & Removal of AI Risk Gauges**:
   - Purely adheres to the No-Detector Law. All references to "AI Risk Gauges (8%)" and "AI Detector Bypass Radars" are completely removed. The system focuses exclusively on ATS layout parseability and authentic human writing cadence.
6. **Realistic Hardware Floor & First-Class Remote Endpoint**:
   - **Local Execution Floor**: 24GB VRAM GPU (RTX 3090/4090) or 32GB Unified Memory Mac (M-series) running `richardyoung/hemmingway-1:Q4_K_M` (17.44 GB) and Humanizer Q4_K_M (7.6 GB) with capped context (8,192 tokens).
   - **Remote Endpoint**: First-class support for OpenAI-compatible endpoints (`--remote`) allowing candidates on 16GB laptops to run Stage 2/3 in the cloud without local memory bottlenecks.
7. **Model Licensing Transparency**:
   - Repository code is MIT. `Altworld/Hemmingway-1` is licensed under **CC BY-NC 4.0** (non-commercial only; commercial deployment requires written agreement with Altworld). `jialinyyzz/humanizer` is Apache-2.0 on a Gemma-4 base. Fully disclosed in documentation.

## 60/30/10

- **60% Traditional Software (Deterministic Foundation)**:
  - Document AST parser (PDF, DOCX, Markdown) and AST reconstructor.
  - Entity Normalization Layer (currency, number, date canonicalizer).
  - Token-level text diff engine (`diff` / Web Worker).
  - Single-column ATS PDF generator and `.docx` builder.
  - Vite + React desktop UI and `@tanstack/react-virtual` virtualization.
  - Terminal CLI, argument parsing (`commander`), stdio streaming, and exit codes.
  - File I/O, SQLite research storage, and vector cosine similarity.
- **30% Deterministic Rules & Guardrails (The Quality Gate)**:
  - Factual Invariant Sentinel with two-class canonicalization and fallback state machine.
  - T1–T4 research hierarchy classification and source weighting.
  - Three-Band Anti-Slop mathematical scoring algorithm ($\ge 42/50$ certified).
  - Banned corporate phrase fuzzy matcher (30+ tells).
  - Single-column ATS layout rule compliance engine.
  - Sequential VRAM swapper state machine (`keep_alive: 0` eviction).
- **10% Language Model Inference (Semantic Operators)**:
  - Stage 1: Motivational Interviewer & Mining Agent (conversational probing).
  - Ingestion: Ephemeral `Qwen2.5-7B-Instruct` (or `Qwen2.5-3B` fallback) with GBNF grammar constraints.
  - Stage 2: `Altworld/Hemmingway-1` (ChatML, $T=1.0$) for active voice and maximum density.
  - Stage 3: `jialinyyzz/humanizer` (Raw Completion, exact template, $T=1.0$) for burstiness and natural cadence.
- **Human Judgment**:
  - Candidate answers during motivational interviewing, diff review, and final application submission.
- **The Removal Test**:
  - If AI models are disabled, the system remains a fully functional manual career editor, AST normalizer, invariant protector, Anti-Slop scorer, and ATS layout validator.

## What we are NOT building yet

- Automated job board application bots / spam auto-apply tools (counterproductive and harmful to candidate reputation).
- Scraping tools that bypass login paywalls or violate third-party Terms of Service.
- Multi-column decorative resume templates (violates ATS single-column parseability invariant).
- Cloud user account / auth systems in v1 (remains 100% local-first and privacy-preserving).

## What good looks like

1. Interactive Motivational Interviewer successfully surfaces quantifiable metrics on bullets that previously had none.
2. Invariant Sentinel with Normalization Layer passes legitimate restylings ("$1.4M" $\leftrightarrow$ "1.4 million dollars") with zero false rejections.
3. Headless CLI passes `career-ops audit` with clear score breakdowns across the Three-Band gate.
4. `career-ops optimize` streams diffs without UI freezes or VRAM memory crashes.
5. 100% of candidate metrics, dates, and tools survive transformation without modification.
6. Three-Act Web Studio renders at 60fps with side-by-side diff cards and natural inline text wrapping.

## Phases

- **Phase 0: Architecture, Research Ingestion & Doc-Hygiene (`@career-ops/knowledge`)**
  - Fix document contradictions, T1–T4 source classification engine, per-platform ATS research (Workday, Greenhouse, Ashby, Lever), pre-baked seed corpus, and embedded knowledge store.
- **Phase 1: Foundation, Normalization Layer & Core Engine (`@career-ops/core`)**
  - AST parsers (Markdown, DOCX, PDF), Two-Class Invariant Normalizer, Hemmingway/Humanizer drivers, sequential VRAM swapper, and invariant sentinel.
- **Phase 2: Audit Engine & Three-Band Scoring Gate (`@career-ops/audit`)**
  - Graded Trust formula, pooled section Rhythm calculation, banned phrase fuzzy matcher, and ATS layout validator.
- **Phase 3: Motivational Interviewer & Specialized Agents (`@career-ops/agents`)**
  - Motivational Interviewer & Accomplishment Miner, Resume Tailor (JD-anchored), Cover Letter Architect (Hook $\rightarrow$ Match $\rightarrow$ Close), and LinkedIn Strategist.
- **Phase 4: CLI Command Center (`@career-ops/cli`)**
  - Commands: `doctor`, `interview`, `ingest`, `optimize`, `audit`, `studio`. Stdio streams, `--demo` mode, and CI exit codes.
- **Phase 5: Desktop Web Studio (`@career-ops/web`)**
  - Three-Act UI with integrated Mining Assistant in Act 01, 70/30 Studio Canvas in Act 02, pure inline diff pills, and ATS keyword matrix.
- **Phase 6: Certified Exporters & Release**
  - Single-column ATS PDF generator, native `.docx` export, and end-to-end integration tests.

## Risks

| Risk | Consequence | Gate / Mitigation |
|---|---|---|
| Invariant sentinel false-rejects on legitimate restyling | High | Normalization Layer canonicalizes currencies, numbers, and dates prior to diffing. |
| Concurrent VRAM allocation crashes local GPU | High | Hardcoded sequential VRAM swapper with explicit `keep_alive: 0` before switching models; pinned Q4_K_M tags. |
| Model modifies or hallucinates numbers/dates | Critical | Two-Class Invariant Sentinel guarantees 100% metric preservation with programmatic re-injection fallback. |
| Ingestion of unverified career advice (LinkedIn influencers) | Medium | Strict T1–T4 trust gate: influencer/forum advice (T4) discarded; only T1–T3 ingested. |
| ATS parser chokes on exported layout | High | Single-column plain semantic structure enforced in PDF/DOCX templates; layout validator in CI. |
| Web Studio diff text wraps jaggedly or orphans punctuation | Low | Pure inline highlight spans with `box-decoration-break: clone`; `inline-block` strictly forbidden. |

# Status — career-ops

## Current Status

PRD approved (`docs/clief/PRD.md`). Architectural specifications synchronized with external adversarial audit adjudication findings. Four-Stage Core Pipeline established with Motivational Interviewer preserved and evolved as Stage 1. Transitioning to implementation plan refinement and monorepo scaffolding.

## Last Session

2026-10-10: Adjudicated all three external architectural audits (Audit 1, Audit 2, and Audit 3 Adjudication). Established the Four-Stage Core Pipeline (Stage 1 Motivational Interviewer & Accomplishment Miner, Stage 2 Hemmingway-1 Density Engine, Stage 3 Humanizer Cadence Engine, Stage 4 Deterministic Audit & Invariant Gate). Derived the Two-Class Invariant Normalizer, Three-Band Anti-Slop scoring gate, and realistic hardware floor (24GB GPU / 32GB Mac with remote fallback).

## Completed

- Benchmarked open-weight models (`Altworld/Hemmingway-1` vs `jialinyyzz/humanizer`) and pinned quant tags (`richardyoung/hemmingway-1:Q4_K_M` 17.44 GB, `jialinyyzz/humanizer:Q4_K_M` 7.6 GB).
- Established durable Impeccable product and design authorities (`PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`).
- Built and verified interactive Web Studio prototype with pure inline diff wrapping (`docs/assets/studio-prototype.html`).
- Defined canonical Clief map (`docs/clief/INDEX.md`), brief (`docs/clief/BRIEF.md`), and agent charter (`docs/clief/AGENT-CHARTER.md`).
- Approved canonical Clief PRD (`docs/clief/PRD.md`) with explicit 60/30/10 split, Four-Stage Pipeline, 4-Layer Hybrid Ingestion, and risk gates.
- Updated Design Specification (`docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md`) across all 10 sections.
- Completed Task 0: Knowledge Base Alignment & Doc-Hygiene (`references/resume.md`, `references/anti-slop.md`, `docs/trust-tiers.md`).
- Completed Task 1: Monorepo Root Scaffolding & Toolchain (`pnpm-workspace.yaml`, `package.json`, `tsconfig.base.json`, `tsconfig.json`, `vitest.config.ts`, `pnpm install`, and clean Vitest run).
- Completed Task 2: Package Scaffold & Core Schemas (`@career-ops/knowledge`, Zod schemas for `TrustTier`, `HeuristicDomain`, `KnowledgeHeuristic`, `RawIngestionDocument`).
- Completed Task 3: Deterministic T1–T4 Trust Classification Engine (`classifyTrustTier` with automated domain filtering, T1 1.0, T2 0.85, T3 0.65, T4 0.0 quarantine).
- Completed Task 4: SQLite Knowledge Store & TTL Query Engine (`node:sqlite` native `DatabaseSync`, indexed domains, TTL expiration filtering, vendor and tier filtering, relevance ordering).
- Completed Task 5: Pre-Baked Canonical Research Seed Corpus (`canonical-heuristics.json` containing verified ATS vendor heuristics for Workday, Greenhouse, Lever, plus InterviewPal recruiter telemetry, Robert Half AI fatigue study, and HBS criteria gate, loaded via `seedKnowledgeStore`).
- Completed Task 6: Feed Connectors & Dynamic Ingestion (`parseRssFeedXml` deterministic regex-based XML extraction for BLS and research feeds).
- Completed Task 7: Package Public API & End-to-End Integration (`packages/knowledge/src/index.ts`, passing all 12 Vitest tests, clean `tsc` build).
- Completed Task 1 of Phase 1: Package Scaffold & Core Schemas (`@career-ops/audit`, Zod schemas for `InvariantEntity`, `AuditReport`, `AuditDimensionScore`, `ThreeBandGateStatus`, `AtsScanResult`).
- Completed Task 2 of Phase 1: Two-Class Invariant Normalizer & Entity Matcher (`canonicalizeCurrency`, `canonicalizePercentage`, `canonicalizeDate`, `canonicalizeNumber`, `extractInvariants`, `checkInvariantPreservation` with 100% metric preservation across format restylings, symbol-aware tool regex for C++/.NET, and non-overlapping span tracking).
- Completed Task 3 of Phase 1: Invariant Sentinel & 4-Step Fallback State Machine (`reconcileBullet` in `packages/audit/src/invariants/sentinel.ts` executing verbatim check -> programmatic re-injection -> Stage 2 dense draft fallback -> original bullet revert).
- Completed Task 4 of Phase 1: Authenticity & Fuzzy Banned Phrase Matcher (`evaluateAuthenticity` with non-overlapping span detection, penalized buzzword counts, and 0-floor).
- Completed Task 5 of Phase 1: Directness, Rhythm & Density Rubric Dimensions (`evaluateDirectness`, pooled sentence standard deviation `evaluateRhythm`, and structured `evaluateDensity`).
- Completed Task 6 of Phase 1: Graded Trust Scorer & Three-Band Quality Gate (`evaluateTrust`, `AntiSlopScorer.evaluate` with $\ge 42$ Certified, 35–41 Warning, $< 35$ Reject).
- Completed Task 7 of Phase 1: ATS Layout & Semantic Structure Scanner (`scanAtsLayout` validating single-column layout, table interleaving prevention, and canonical section headings).
- Completed Task 8 of Phase 1: Package Public API & Integration Suite (`packages/audit/src/index.ts`, passing all 41 unit/integration tests across 14 test suites, clean build).
- Completed Phase 2: Engine Orchestration & Four-Stage Pipeline Implementation (`@career-ops/core`):
  - Task 1: Package Scaffolding, Resume AST & Document Parser (`parseResumeMarkdown`, `renderResumeMarkdown`, `ResumeAST`, `BulletNode`, `ExperienceRole`).
  - Task 2: Inference Provider Abstraction, Ollama Client & Mock Provider (`InferenceProvider`, `MockInferenceProvider`, `OllamaProvider` with URL resolution, `keep_alive: 0` model eviction, remote/cloud endpoint support).
  - Task 3: Stage 1 — Motivational Interviewer & Accomplishment Miner (`MotivationalInterviewer` with RULE framework, RISE probes, Articulation Gap detection, and conversational accomplishment mining).
  - Task 4: Stage 2 — Hemmingway-1 Density Engine & Verb Rotation (`HemingwayDensityEngine` with ChatML prompt contract and rolling 2-verb rotation within roles).
  - Task 5: Stage 3 — Humanizer Cadence Engine (`HumanizerCadenceEngine` with raw prompt contract and locked factual invariants).
  - Task 6: Stage 4 — Invariant Gate & Audit Integration (`Stage4Gate.verifyAndReconcile` integrating Two-Class Invariant Sentinel, Anti-Slop scoring, and single-column ATS scanning).
  - Task 7: Four-Stage Pipeline Orchestrator (`FourStagePipeline` with sequential model eviction between Stage 2 and Stage 3).
  - Task 8: Package Public API, Canonical Demo Fixtures (`DEMO_CANDIDATE_RESUME`, `DEMO_JOB_SPEC`), and E2E Integration Test Suite.
  - 100% test pass rate (60 tests across 22 suites), clean TypeScript builds across monorepo.
- Completed Phase 3: Developer Experience, Command Center & Web Studio (`@career-ops/cli`):
  - Task 1: Package Scaffolding for `@career-ops/cli`, tsconfig, package linking, and executable binary `bin/career-ops.js`.
  - Task 2: High-contrast architectural terminal formatters (`formatScorecard`, `formatDiff`, `formatBanner`) adhering to Impeccable tokens and pure inline wrapping.
  - Task 3: Command `career-ops doctor` checking Node.js version, local/remote Ollama status, model tag verification, and VRAM memory floor guidance.
  - Task 4: Command `career-ops audit` executing Three-Band Quality Gate ($\ge 42$ Certified, 35–41 Warning, $< 35$ Reject), ATS single-column validation, `--ci` exit codes, and `--json`.
  - Task 5: Command `career-ops optimize` with viral zero-config `--demo` mode (evaluates bundled Morgan Vance candidate fixture in 100ms offline), `--mock`, `--remote <url>`, `--diff`, and `--output`.
  - Task 6: Command `career-ops interview` running interactive Stage 1 Motivational Interviewing with RISE probes to solve candidate Articulation Gaps.
  - Task 7: Track A (`CoverLetterArchitect`) Hook-Match-Close generator and Track B (`LinkedInStrategist`) Headline (220-char limit), 3-Act About narrative, and skill taxonomy clusters.
  - Task 8: Web Studio local server (`startStudioServer`) and command `career-ops studio` serving Three-Act UI with `/api/audit`, `/api/optimize`, and `/api/mine` endpoints.
  - Task 9: Complete commander program wiring, root `pnpm run career-ops` script, and comprehensive E2E test suite.
  - 100% test pass rate (87 tests across 31 suites), clean TypeScript builds across monorepo.
- **Phase 2 & Phase 3 Gap Review & Hardening Completed**:
  - Purged remaining AI Detection Radar in `studio-prototype.html` per No-Detector Law, replaced with ATS Single-Column Layout Compliance Gate.
  - Fixed AST parser handling for `### Subheadings` in skills and preserved parenthesized commas like `(Prometheus, Grafana)`.
  - Added company/title inversion heuristic to correctly parse `Company | Title` headers.
  - Secured rubric scorers against empty inputs (assigns score 0 and rejected gate instead of inflated 37/50 warning).
  - Enforced `num_ctx: 8192` hardware safety cap in `OllamaProvider` runtime options.
  - Added graceful per-bullet fallback in `FourStagePipeline` for remote inference network errors and timeouts.
  - Expanded test suite to 92 passing tests across 31 suites; clean builds across monorepo.
- Pushed all commits cleanly to GitHub (`feat/dual-engine-resume-product`).

- **Phase 4: Certified Exporters, Viral README & Final Release Completed**:
  - Task 1: Single-Column ATS PDF Generator (`packages/core/src/exporters/pdf-exporter.ts`) implementing `%PDF-1.4` text stream builder adhering strictly to Single-Column ATS Law.
  - Task 2: Native Word `.docx` Exporter (`packages/core/src/exporters/docx-exporter.ts`) with custom in-memory PKZip engine generating table-free, frame-free Office Open XML.
  - Task 3: Unified Exporter Dispatcher (`packages/core/src/exporters/exporter.ts`) and CLI command `career-ops export <resume> --format <pdf,docx,md,json>` + integration into `career-ops optimize --format`.
  - Task 4: High-Conversion Viral README Architecture (`README.md`) with 10-second zero-config quickstart (`npx career-ops optimize --demo`), Three-Act Web Studio walkthrough, Four-Stage Mermaid pipeline diagram, transparent hardware envelope, and empirical ATS mechanics (No-Detector Law, 11.2s/7.4s review speeds). Verified via CLI contract tests (`readme-contract.test.ts`).
  - Task 5: 100% test pass rate (101 tests across 35 test suites, 0 failures), clean TypeScript builds across all 4 monorepo packages.
- Pushed all Phase 0, 1, 2, 3, and 4 commits cleanly to GitHub (`feat/dual-engine-resume-product`).
- **Agent Operating Playbook & Root Documentation Alignment (`AGENTS.md`, `CLIEF.md`, `DESIGN.md`, `SKILL.md`)**:
  - Created [`AGENTS.md`](../../AGENTS.md) with a Dual-Mode Intent Router (Candidate Mode $\rightarrow$ `SKILL.md` vs. Contributor Mode $\rightarrow$ `CLIEF.md` / `DESIGN.md`), worktree isolation, `/prototype` divergent exploration, deterministic `/loop` exit gates, live browser visual verification, micro-polish PR squashing, and the No-Auto-DM adversarial design governance routine.
  - Aligned [`CLIEF.md`](../../CLIEF.md), [`DESIGN.md`](../../DESIGN.md), [`SKILL.md`](../../SKILL.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`docs/clief/INDEX.md`](INDEX.md), [`docs/clief/AGENT-CHARTER.md`](AGENT-CHARTER.md), [`docs/clief/workspaces/web/CONTEXT.md`](workspaces/web/CONTEXT.md), and [`docs/clief/workspaces/agents/CONTEXT.md`](workspaces/agents/CONTEXT.md) with zero `markdownlint` errors and clean `scripts/convert.sh` prompt compilation.

## In Progress

- Production Ready: All 4 phases 100% complete and verified. Ready for PR review / merge to `main`.

## Blocked

- None.

## Next

- Merge `feat/dual-engine-resume-product` into `main` and tag release `v2.0.0`.

## Decisions Made

- Preserved and evolved original `career-ops` conversational intelligence into **Stage 1: Motivational Interviewer & Accomplishment Miner** (RULE framework + RISE probes) to solve the Articulation Gap before document rewriting.
- Adopted **Two-Class Invariant Normalizer** (verbatim tools vs semantic metrics canonicalizer with 4-step fallback) to eliminate false-positive rejections on numerical restyling.
- Pinned local hardware floor at 24GB VRAM GPU or 32GB Apple Silicon Mac with explicit `num_ctx: 8192` cap; provided first-class `--remote <url>` support for 16GB laptops.
- Anti-Slop Scoring Construct Validity: Pooled sentence standard deviation for Rhythm, graded verifiability for Trust, and Three-Band Gate ($\ge 42$ Certified, 35–41 Warning, $<35$ Reject).
- Pure No-Detector Law enforcement: Purged all "AI Risk" gauges and detector evasion marketing.

## Open Questions

- None blocking implementation.

# Implementation Plan: Dual-Engine Resume Product Phase 2 (Engine Orchestration & Four-Stage Pipeline)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Phase:** Phase 2 of 4  
**Package:** `@career-ops/core`  
**Parent PRD:** [`docs/clief/PRD.md`](file:///Users/poferraz/Documents/Development/active/career-ops/docs/clief/PRD.md)  
**Parent Design Spec:** [`docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md`](file:///Users/poferraz/Documents/Development/active/career-ops/docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md)  
**Target Git Branch:** `feat/dual-engine-resume-product`

---

## Architecture Overview

Phase 2 builds the core orchestration engine (`@career-ops/core`) that unifies the Four-Stage Pipeline:
1. **Stage 1: Motivational Interviewer & Accomplishment Miner** (RULE framework + RISE quantification probes). Bridges the Articulation Gap by surfacing unstated metrics and operational scale before rewriting.
2. **Stage 2: Hemmingway-1 Density Engine** (`Altworld/Hemmingway-1` ChatML prompt contract + rolling single-role verb rotation to eliminate repetitiveness).
3. **Stage 3: Humanizer Cadence Engine** (`jialinyyzz/humanizer` raw prompt contract + cadence variation to eliminate machine monotonicity).
4. **Stage 4: Deterministic Audit & Invariant Gate** (Integrates `@career-ops/audit` Two-Class Invariant Sentinel and Three-Band Quality Gate).

### Hardware & LLM Mocking Strategy
- **No Local Model Downloads in Testing**: Local execution during development and testing uses zero-latency, deterministic mock inference providers (`MockInferenceProvider`), allowing instantaneous CI/CD runs.
- **Pluggable Inference Layer**: Production inference is abstracted via `InferenceProvider`. The built-in `OllamaProvider` connects to local Ollama (`http://localhost:11434`) or any remote/cloud endpoint (`--remote <url>`) with configurable timeouts, headers, and model eviction (`keep_alive: 0` for sequential swapping).

---

## Tasks Breakdown

### Task 1: Package Scaffolding, Resume AST & Document Parser
**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/types.ts`
- Create: `packages/core/src/parser/ast-parser.ts`
- Test: `packages/core/tests/ast-parser.test.ts`

**Interfaces:**
- Produces: `ResumeAST`, `ExperienceRole`, `BulletNode`, `CandidateHeader`, `EducationItem`, `SkillCategory`
- Produces: `parseResumeMarkdown(markdown: string): ResumeAST`
- Produces: `renderResumeMarkdown(ast: ResumeAST): string`

- [ ] **Step 1: Create package.json and tsconfig.json for @career-ops/core**
- [ ] **Step 2: Write failing AST parser test in `packages/core/tests/ast-parser.test.ts`**
- [ ] **Step 3: Run test to verify failure**
- [ ] **Step 4: Implement types and AST parser**
- [ ] **Step 5: Run test to verify pass**
- [ ] **Step 6: Commit and push**

---

### Task 2: Inference Provider Abstraction, Ollama Client & Mock Provider
**Files:**
- Create: `packages/core/src/inference/types.ts`
- Create: `packages/core/src/inference/mock-provider.ts`
- Create: `packages/core/src/inference/ollama-provider.ts`
- Test: `packages/core/tests/inference-provider.test.ts`

**Interfaces:**
- Produces: `InferenceProvider`, `InferenceOptions`, `InferenceResponse`
- Produces: `MockInferenceProvider` with pattern matching & canned responses
- Produces: `OllamaProvider` with URL resolution, model eviction (`keep_alive: 0`), and remote endpoint support

- [ ] **Step 1: Write failing inference provider test in `packages/core/tests/inference-provider.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement inference types, MockProvider, and OllamaProvider**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 3: Stage 1 — Motivational Interviewer & Accomplishment Miner
**Files:**
- Create: `packages/core/src/pipeline/stage1-interviewer.ts`
- Test: `packages/core/tests/stage1-interviewer.test.ts`

**Interfaces:**
- Produces: `MotivationalInterviewer.findProbeOpportunities(ast: ResumeAST): MiningProbe[]`
- Produces: `MotivationalInterviewer.extractAccomplishment(bulletText: string, userResponse: string): MinedAccomplishment`
- Produces: `MotivationalInterviewer.applyMinedMetrics(ast: ResumeAST, bulletId: string, mined: MinedAccomplishment): ResumeAST`

- [ ] **Step 1: Write failing Stage 1 test in `packages/core/tests/stage1-interviewer.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `stage1-interviewer.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 4: Stage 2 — Hemmingway-1 Density Engine & Verb Rotation
**Files:**
- Create: `packages/core/src/pipeline/stage2-density.ts`
- Test: `packages/core/tests/stage2-density.test.ts`

**Interfaces:**
- Pinned Model: `richardyoung/hemmingway-1:Q4_K_M`
- Produces: `HemingwayDensityEngine.optimizeBullet(bullet: BulletNode, context?: RoleContext): Promise<string>`
- Enforces: Rolling verb rotation within the same role to prevent verb clumping

- [ ] **Step 1: Write failing Stage 2 test in `packages/core/tests/stage2-density.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `stage2-density.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 5: Stage 3 — Humanizer Cadence Engine
**Files:**
- Create: `packages/core/src/pipeline/stage3-humanizer.ts`
- Test: `packages/core/tests/stage3-humanizer.test.ts`

**Interfaces:**
- Pinned Model: `jialinyyzz/humanizer:Q4_K_M`
- Produces: `HumanizerCadenceEngine.humanizeBullet(denseBullet: string, options?: HumanizeOptions): Promise<string>`
- Restyles sentence length variation while locking factual metrics

- [ ] **Step 1: Write failing Stage 3 test in `packages/core/tests/stage3-humanizer.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `stage3-humanizer.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 6: Stage 4 — Invariant Gate & Audit Integration
**Files:**
- Create: `packages/core/src/pipeline/stage4-gate.ts`
- Test: `packages/core/tests/stage4-gate.test.ts`

**Interfaces:**
- Consumes: `@career-ops/audit` (`reconcileBullet`, `AntiSlopScorer`, `scanAtsLayout`)
- Produces: `Stage4Gate.verifyAndReconcile(originalAst: ResumeAST, stage2Ast: ResumeAST, stage3Ast: ResumeAST): ReconciledResumeResult`

- [ ] **Step 1: Write failing Stage 4 test in `packages/core/tests/stage4-gate.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `stage4-gate.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 7: Four-Stage Pipeline Orchestrator (`FourStagePipeline`)
**Files:**
- Create: `packages/core/src/pipeline/pipeline-orchestrator.ts`
- Test: `packages/core/tests/pipeline-orchestrator.test.ts`

**Interfaces:**
- Produces: `FourStagePipeline.optimize(astOrMarkdown: ResumeAST | string, options?: PipelineOptions): Promise<OptimizationResult>`
- Supports batch execution with model eviction (`keep_alive: 0`) between Stage 2 and Stage 3

- [ ] **Step 1: Write failing orchestrator test in `packages/core/tests/pipeline-orchestrator.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `pipeline-orchestrator.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 8: Package Public API, Demo Fixtures & End-to-End Integration
**Files:**
- Create: `packages/core/src/fixtures/demo-data.ts`
- Create: `packages/core/src/index.ts`
- Test: `packages/core/tests/integration.test.ts`

**Interfaces:**
- Produces: Public package exports
- Produces: Canonical test fixtures (`DEMO_CANDIDATE_RESUME`, `DEMO_JOB_SPEC`) for viral demo execution

- [ ] **Step 1: Write failing end-to-end integration test in `packages/core/tests/integration.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `demo-data.ts` and `index.ts`**
- [ ] **Step 4: Run all monorepo tests and verify build**
- [ ] **Step 5: Commit and push**

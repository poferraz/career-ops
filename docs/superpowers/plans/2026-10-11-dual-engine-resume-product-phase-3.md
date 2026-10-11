# Implementation Plan: Dual-Engine Resume Product Phase 3 (CLI Command Center, Track A/B Engines & Web Studio)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Phase:** Phase 3 of 4  
**Package:** `@career-ops/cli`  
**Parent PRD:** [`docs/clief/PRD.md`](file:///Users/poferraz/Documents/Development/active/career-ops/docs/clief/PRD.md)  
**Parent Design Spec:** [`docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md`](file:///Users/poferraz/Documents/Development/active/career-ops/docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md)  
**Target Git Branch:** `feat/dual-engine-resume-product`

---

## Architecture Overview

Phase 3 builds the developer experience, terminal command center, and interactive interfaces:
1. **The CLI Command Center (`packages/cli`)**:
   - `career-ops audit <resume.md>`: Evaluates 5-dimension Anti-Slop rubric, Three-Band Gate ($\ge 42$ Certified, 35–41 Warning, $< 35$ Reject), and ATS single-column compliance. Supports `--ci` and `--json`.
   - `career-ops optimize <resume.md>`: Full Four-Stage Pipeline runner with `--demo` (instant zero-config viral demo using bundled fixtures), `--mock`, `--remote <url>`, `--diff`, and `--output`.
   - `career-ops interview <resume.md>`: Interactive Stage 1 Accomplishment Miner solving the Articulation Gap via RULE framework and RISE probes.
   - `career-ops doctor`: Diagnoses local runtime, Ollama connectivity, model availability, and VRAM memory floor.
   - `career-ops cover-letter`: Track A Hook $\rightarrow$ Match $\rightarrow$ Close cover letter generator anchored to target JD.
   - `career-ops linkedin`: Track B Headline (220 char limit), 3-Act About narrative, and skill taxonomy clusters.
   - `career-ops studio`: Serves the local interactive Web Studio with live pipeline API endpoints.
2. **Terminal UX & Formatting**: High-contrast architectural terminal output matching Impeccable guidelines (bold cobalt styling, clean diffs, zero line-break glitches).
3. **No-Detector Law Compliance**: Zero AI detector evasion radar or fake detector metrics; pure focus on ATS parseability and human cadence.

---

## Tasks Breakdown

### Task 1: Package Scaffolding for `@career-ops/cli`
**Files:**
- Create: `packages/cli/package.json`
- Create: `packages/cli/tsconfig.json`
- Create: `packages/cli/bin/career-ops.js`
- Test: `packages/cli/tests/scaffold.test.ts`

**Interfaces:**
- Produces: CLI package linking `@career-ops/core`, `@career-ops/audit`, `@career-ops/knowledge`
- Produces: Executable binary entry point `bin/career-ops.js`

- [ ] **Step 1: Create `package.json` and `tsconfig.json` for `@career-ops/cli`**
- [ ] **Step 2: Write failing scaffolding test in `packages/cli/tests/scaffold.test.ts`**
- [ ] **Step 3: Run test to verify failure**
- [ ] **Step 4: Implement executable entry point `bin/career-ops.js`**
- [ ] **Step 5: Run test to verify pass**
- [ ] **Step 6: Commit and push**

---

### Task 2: Terminal Formatters, Scorecard & Diff Visualizer
**Files:**
- Create: `packages/cli/src/ui/formatters.ts`
- Create: `packages/cli/src/ui/diff-view.ts`
- Test: `packages/cli/tests/formatters.test.ts`

**Interfaces:**
- Produces: `formatScorecard(report: AuditReport, atsScan?: AtsScanResult): string`
- Produces: `formatDiff(original: string, rewritten: string, invariants?: string[]): string`
- Produces: `formatBanner(): string`

- [ ] **Step 1: Write failing formatter test in `packages/cli/tests/formatters.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `formatters.ts` and `diff-view.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 3: Command `career-ops doctor`
**Files:**
- Create: `packages/cli/src/commands/doctor.ts`
- Test: `packages/cli/tests/doctor.test.ts`

**Interfaces:**
- Produces: `runDoctorCommand(options?: DoctorOptions): Promise<DoctorReport>`
- Checks: Node.js version, local/remote Ollama status, model tag presence (`hemmingway-1`, `humanizer`), and VRAM recommendations.

- [ ] **Step 1: Write failing doctor command test in `packages/cli/tests/doctor.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `doctor.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 4: Command `career-ops audit`
**Files:**
- Create: `packages/cli/src/commands/audit.ts`
- Test: `packages/cli/tests/audit-command.test.ts`

**Interfaces:**
- Produces: `runAuditCommand(filePath: string, options?: AuditCommandOptions): Promise<number>`
- Supports: `--ci` (exit code 1 on reject or ATS violation), `--json`, custom tools.

- [ ] **Step 1: Write failing audit command test in `packages/cli/tests/audit-command.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `audit.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 5: Command `career-ops optimize` & Viral `--demo` Mode
**Files:**
- Create: `packages/cli/src/commands/optimize.ts`
- Test: `packages/cli/tests/optimize-command.test.ts`

**Interfaces:**
- Produces: `runOptimizeCommand(filePath?: string, options?: OptimizeCommandOptions): Promise<OptimizationResult>`
- Supports: `--demo` (zero-config demo), `--mock`, `--remote <url>`, `--output <path>`, `--diff`, `--json`.

- [ ] **Step 1: Write failing optimize command test in `packages/cli/tests/optimize-command.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `optimize.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 6: Command `career-ops interview` (Stage 1 Interactive Mining)
**Files:**
- Create: `packages/cli/src/commands/interview.ts`
- Test: `packages/cli/tests/interview-command.test.ts`

**Interfaces:**
- Produces: `runInterviewCommand(filePath: string, options?: InterviewCommandOptions): Promise<string>`
- Interactively probes Articulation Gap bullets using RISE questions and outputs enriched markdown.

- [ ] **Step 1: Write failing interview command test in `packages/cli/tests/interview-command.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `interview.ts`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 7: Track A (Cover Letter) & Track B (LinkedIn Strategist) Engines & Commands
**Files:**
- Create: `packages/core/src/pipeline/cover-letter.ts`
- Create: `packages/core/src/pipeline/linkedin.ts`
- Create: `packages/cli/src/commands/cover-letter.ts`
- Create: `packages/cli/src/commands/linkedin.ts`
- Test: `packages/cli/tests/track-agents.test.ts`

**Interfaces:**
- Produces: `CoverLetterArchitect.generateLetter(candidateAst: ResumeAST, jobSpec: string): Promise<string>`
- Produces: `LinkedInStrategist.generateProfile(candidateAst: ResumeAST, targetRole?: string): Promise<LinkedInProfile>`
- Commands: `career-ops cover-letter <resume> --jd <job.md>` and `career-ops linkedin <resume>`

- [ ] **Step 1: Write failing Track A & B test in `packages/cli/tests/track-agents.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement Cover Letter Architect, LinkedIn Strategist, and CLI commands**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 8: Web Studio Integration & Command `career-ops studio`
**Files:**
- Create: `packages/cli/src/server/studio-server.ts`
- Create: `packages/cli/src/commands/studio.ts`
- Test: `packages/cli/tests/studio-command.test.ts`

**Interfaces:**
- Produces: Local HTTP server serving interactive Three-Act Studio with API endpoints `/api/audit`, `/api/optimize`, `/api/mine`.
- Command: `career-ops studio [--port 3000] [--open]`

- [ ] **Step 1: Write failing studio server test in `packages/cli/tests/studio-command.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement studio server and command**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit and push**

---

### Task 9: CLI Program Wiring, Monorepo Integration & Verification
**Files:**
- Create: `packages/cli/src/index.ts`
- Modify: `packages/cli/bin/career-ops.js`
- Modify: Root `package.json` (add `"career-ops"` script)
- Test: `packages/cli/tests/cli-e2e.test.ts`

**Interfaces:**
- Produces: Complete commander program wiring all commands with help text, options, and error handling.

- [ ] **Step 1: Write failing end-to-end CLI program test in `packages/cli/tests/cli-e2e.test.ts`**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Wire `src/index.ts` and `bin/career-ops.js`**
- [ ] **Step 4: Run all monorepo tests and build verification**
- [ ] **Step 5: Commit and push**

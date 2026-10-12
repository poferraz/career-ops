# Implementation Plan: Dual-Engine Resume Product Phase 4 (Certified Exporters, Viral README & Final Release)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Phase:** Phase 4 of 4  
**Packages:** `@career-ops/core`, `@career-ops/cli`, Root Docs  
**Parent PRD:** [`docs/clief/PRD.md`](file:///Users/poferraz/Documents/Development/active/career-ops/docs/clief/PRD.md)  
**Parent Design Spec:** [`docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md`](file:///Users/poferraz/Documents/Development/active/career-ops/docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md)  
**Target Git Branch:** `feat/dual-engine-resume-product`

---

## Architecture Overview

Phase 4 completes the production pipeline of `career-ops`, taking optimized Resume ASTs and generating certified, production-ready deliverables:
1. **The Single-Column ATS Law Exporters (`@career-ops/core/exporters`)**:
   - `pdf-exporter.ts`: Generates standards-compliant `%PDF-1.4` documents with single-column linear text layout, standard typography (clean font hierarchy, 0.75" margins), no multi-column tables, no text boxes, and zero graphics. Guarantees 100% sequential parseability in Workday, Greenhouse, Ashby, and Lever.
   - `docx-exporter.ts`: Generates native Office Open XML (`.docx`) archives with semantic Word headings (`Heading 1`, `Heading 2`, `Heading 3`) and standard bullet lists. Completely free of tables, frames, or multi-column sections.
   - `exporter.ts`: Unified export dispatcher supporting `pdf`, `docx`, `md`, and `json` outputs.
2. **CLI Command Center Integration (`@career-ops/cli`)**:
   - `career-ops export <resume.md> --format <pdf,docx,md,json> --output <dir>`: Standalone command for batch or targeted format exports.
   - Wire export flags into `career-ops optimize --output <dir> --format <pdf,docx,md,json>`.
3. **Viral README Architecture & Quickstart**:
   - Top-trending GitHub repository architecture: High-impact hero banner, viral zero-config `npx career-ops optimize --demo` walkthrough, visual terminal ASCII/diagrams, empirical research citations (11.2s/7.4s review speeds, No-Detector Law), and transparent hardware compatibility matrix (24GB/32GB local floor vs. `--remote <url>` cloud Ollama for 16GB laptops).
4. **Final Monorepo Verification & Release Checklist**:
   - Comprehensive test suite validation, build passes across all packages, clean E2E CLI execution.

---

## Global Constraints

- **No-Detector Law**: Zero fake AI detection gauges or bypass metrics. Focus strictly on ATS parseability and human cadence.
- **Single-Column ATS Law**: Strict single-column, table-free, text-box-free document generation for PDF and DOCX.
- **Zero LLM Downloads**: All test suites must remain 100% offline and deterministic using `MockInferenceProvider` and fixtures.
- **Hardware Envelope Transparency**: Pin local hardware floor at 24GB VRAM GPU or 32GB Apple Silicon Mac; prominently support `--remote <url>` for 16GB laptops.
- **Strict TDD**: Write failing test first, implement minimal code, verify pass.

---

## Tasks Breakdown

### Task 1: Single-Column ATS PDF Generator (`@career-ops/core`)
**Files:**
- Create: `packages/core/src/exporters/types.ts`
- Create: `packages/core/src/exporters/pdf-exporter.ts`
- Test: `packages/core/tests/pdf-exporter.test.ts`

**Interfaces:**
- Produces: `export interface ExportOptions { outputDir?: string; filename?: string; author?: string; }`
- Produces: `export function generateAtsPdf(ast: ResumeAST, options?: ExportOptions): Buffer`

- [x] **Step 1: Write failing tests in `packages/core/tests/pdf-exporter.test.ts`**
  - Verify generated buffer starts with `%PDF-1.4` header and ends with `%%EOF`.
  - Verify PDF includes candidate name, contact, section headers (`EXPERIENCE`, `EDUCATION`, `SKILLS`), and bullet points.
  - Verify layout has no tables or multi-column constructs.
- [x] **Step 2: Run test to verify failure (Red phase)**
- [x] **Step 3: Implement `types.ts` and `pdf-exporter.ts`**
  - Build clean, deterministic PDF stream builder with font dictionary (Helvetica, Helvetica-Bold), font sizes (18pt name, 12pt section headings, 10pt text), proper line wrapping, and page streams.
- [x] **Step 4: Run test to verify pass (Green phase)**
- [x] **Step 5: Commit changes**

---

### Task 2: Native Word `.docx` Exporter (`@career-ops/core`)
**Files:**
- Create: `packages/core/src/exporters/docx-exporter.ts`
- Test: `packages/core/tests/docx-exporter.test.ts`

**Interfaces:**
- Produces: `export function generateAtsDocx(ast: ResumeAST, options?: ExportOptions): Buffer`

- [x] **Step 1: Write failing tests in `packages/core/tests/docx-exporter.test.ts`**
  - Verify output is a valid zip buffer containing `[Content_Types].xml`, `word/document.xml`, `_rels/.rels`.
  - Verify `document.xml` contains candidate name, headings, bullet list items (`w:numPr` or bullet paragraph style), and role entries.
  - Verify document contains zero tables (`w:tbl`) or multi-column sections.
- [x] **Step 2: Run test to verify failure (Red phase)**
- [x] **Step 3: Implement `docx-exporter.ts`**
  - Generate standard Office Open XML structure packaged into zip buffer.
- [x] **Step 4: Run test to verify pass (Green phase)**
- [x] **Step 5: Commit changes**

---

### Task 3: Unified Export Dispatcher & CLI Integration
**Files:**
- Create: `packages/core/src/exporters/exporter.ts`
- Modify: `packages/core/src/index.ts`
- Create: `packages/cli/src/commands/export.ts`
- Modify: `packages/cli/src/commands/optimize.ts`
- Modify: `packages/cli/src/bin.ts`
- Test: `packages/cli/tests/export-command.test.ts`

**Interfaces:**
- Produces: `export async function exportResume(ast: ResumeAST, formats: ExportFormat[], options: ExportOptions): Promise<Record<ExportFormat, string>>`
- Produces: CLI command `career-ops export <resume.md> --format <formats> --output <dir>`
- Extends: `career-ops optimize` to automatically export to requested formats when `--output` is specified.

- [x] **Step 1: Write failing tests in `packages/cli/tests/export-command.test.ts`**
  - Verify exporting to PDF, DOCX, and Markdown writes files to destination directory.
  - Verify `career-ops optimize --output <dir> --format pdf,docx,md` produces all 3 files.
- [x] **Step 2: Run test to verify failure (Red phase)**
- [x] **Step 3: Implement `exporter.ts`, `export.ts`, update `optimize.ts` and `bin.ts`**
- [x] **Step 4: Run test to verify pass (Green phase)**
- [x] **Step 5: Commit changes**

---

### Task 4: High-Conversion Viral README Architecture (`README.md`)
**Files:**
- Modify: `README.md`
- Test: `packages/cli/tests/readme-contract.test.ts`

**Interfaces:**
- Produces: Production-grade GitHub README featuring:
  1. Hero section with bold positioning, badges (Build Passing, MIT, Node 20+, 100% Invariant Preserving, 0 LLM Downloads Demo).
  2. Viral Zero-Config Quickstart: `npx career-ops optimize --demo`.
  3. Architecture overview with Mermaid pipeline diagram (Stages 1–4).
  4. Real ATS Mechanics section (dispelling 6-second and AI detector myths with empirical data).
  5. Hardware compatibility table (24GB/32GB local floor vs `--remote <url>`).
  6. Complete CLI Command Reference table.

- [x] **Step 1: Write contract test verifying that documented CLI commands and flags exist and execute in help mode**
- [x] **Step 2: Rewrite `README.md` with complete viral architecture and pristine formatting**
- [x] **Step 3: Run test to verify pass**
- [x] **Step 4: Commit changes**

---

### Task 5: Final Verification, Monorepo Build & Status Update
**Files:**
- Modify: `docs/clief/STATUS.md`

- [x] **Step 1: Run full test suite across all 4 workspace packages (`pnpm test`)**
- [x] **Step 2: Run full build across all packages (`pnpm build`)**
- [x] **Step 3: Run end-to-end CLI commands (`node packages/cli/bin/career-ops.js optimize --demo`, `audit`, `doctor`, `studio --help`)**
- [x] **Step 4: Update `docs/clief/STATUS.md` to mark Phase 4 complete and project release-ready**
- [x] **Step 5: Final git commit and push to `feat/dual-engine-resume-product`**

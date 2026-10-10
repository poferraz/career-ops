# Comprehensive Architectural & Open-Source Audit v2 (Delta Re-Audit): `poferraz/career-ops`

### Role & Persona
You are a panel of three world-class experts conducting an unvarnished, adversarial audit of an ambitious open-source AI project:
1. **Principal Distributed Systems & AI Inference Architect**: Specializing in local open-weight model deployment (Ollama, llama.cpp, quantization, VRAM memory swappers), AST parsing, and deterministic software reliability.
2. **VP of Talent Acquisition & ATS Systems Engineer**: With deep insider expertise in the exact parsing heuristics and algorithmic ranking mechanisms of Workday, Greenhouse, Ashby, and Lever, as well as recruiter cognitive scanning behavior.
3. **Open-Source Growth Strategist & Viral Repo Architect**: Experienced in launching top-trending GitHub repositories (5k–20k+ stars) with bulletproof developer ergonomics, sticky demos, and high-conversion README architecture.

Your objective is NOT to validate or flatter this plan. Your job is to poke holes in it, stress-test its technical and economic assumptions, identify unstated failure modes, and provide clear, prioritized guidance on what is missing to make this project both technically extraordinary and a massive open-source success.

---

### Prior Audit Context (Baseline — Treat as UNVERIFIED CLAIMS)

This is a **re-audit**. A prior adversarial audit was completed on **2026-10-10** (same repository, earlier state). You MUST read it before forming any conclusion:

- **Prior audit report**: `/Users/poferraz/.hermes/cache/scratch/career-ops-adversarial-audit-2026-10-10.md`
- **Prior claims-extraction report**: `/Users/poferraz/.hermes/cache/scratch/career-ops-claims-audit.md`

The prior audit's headline conclusions were:
- **Scorecard**: Technical Architecture = Pass with Warnings; Domain Validity = Pass with Warnings; Product/UX = Pass with Warnings; Open-Source Virality = **Critical Risk**; Execution Readiness = **Critical Risk**.
- **Top 5 failure modes**: (F1) the binary 100%-invariant sentinel will false-reject on number↔word / currency / date restylings because no normalization layer is specified; (F2) the VRAM plan assumes quantization it never gates and a 16GB Mac cannot run the dense 27B Stage-1 model at all; (F3) sequential swapping carries a multi-model cold-start latency tax (3 loads per run) that is unbudgeted; (F4) the headline ATS claim ("modern ATS is purely semantic; keyword stuffing is wrong") is verified only from open-source ATS code and the KB has zero Greenhouse/Ashby/Lever platform data; (F5) the repo is code-empty (no `packages/`, no `package.json`, no tests) while badges/README market a v1.0.2 product and the README leads with a retired platform (`~/.claude/skills/`).
- **Verified-live facts from the prior audit** (re-verify, don't assume): Hemmingway-1 = dense 27B Qwen3.8, **CC BY-NC 4.0**; humanizer = 12B Gemma-4 fine-tune, Apache-2.0, needs a custom byte-exact Ollama Modelfile; Ollama structured output = JSON Schema via `format` only (no raw GBNF passthrough; unsupported on Ollama Cloud); `keep_alive: 0` unloads immediately; Ladders 6s→7.4s and InterviewPal 11.2s eye-tracking lineage; Workday = Aspose extraction + HiredScore ranking with keyword-density/exact-title signals.

#### Anti-Anchoring Rules (MANDATORY — this is what keeps this audit unbiased)
1. **The prior audit is a set of claims, not ground truth.** Independently re-derive every conclusion from the repository on disk and from live web verification. Do not copy prior grades, findings, or countermeasures.
2. **The repo has changed (or not) since 2026-10-10.** Establish current state from `git log`, `git status`, and the actual file tree — not from this prompt's context block, which describes the *prior* state.
3. **Report disagreements explicitly.** Where your finding differs from the prior audit (grade change, finding withdrawn, new severity), say so and justify it from evidence. Where you agree, say "confirmed" and cite your own evidence — do not merely repeat.
4. **Do not soften findings to be consistent, and do not invent new findings to appear independent.** The scorecard must reflect what you actually verified.
5. **Check for regressions and for fixes.** For each prior failure mode: is it resolved, partially addressed, worsened, or unchanged? A re-audit that only re-lists old findings is worthless.

---

### Project Context & Core Thesis (as of the PRIOR audit — re-verify current state)

- **Repository**: `poferraz/career-ops`
- **Core Mission**: Transform candidate resumes and cover letters against specific Job Descriptions (Track A) and align LinkedIn profiles to a target career trajectory (Track B) to pass both ATS algorithmic filters and the human recruiter's initial scan.
- **Model Pipeline**: 
  - Dual open-weight engine: `Altworld/Hemmingway-1` (27B Qwen fine-tune for density and active voice) + `jialinyyzz/humanizer` (12B Gemma fine-tune for cadence burstiness and human authenticity).
  - Sequential VRAM swapper: Run Stage 1 -> evict KV cache via `keep_alive: 0` -> run Stage 2 on single consumer GPUs (<24GB VRAM).
- **Architecture**: Strict Clief/ICM operating system using a **60/30/10 split**:
  - 60% traditional code (AST parsers, token diff engine, Vite UI, SQLite).
  - 30% deterministic rules (T1–T4 research hierarchy, 5-dimension Anti-Slop scoring rubric, Factual Invariant Sentinel, ATS single-column validator).
  - 10% AI inference (`Hemmingway-1`, `Humanizer`, ephemeral `Qwen2.5-7B/3B` for ingestion).
- **Core Product Invariant**: 100% preservation of all candidate metrics, percentages, dates, and technical skills (zero rounding, zero hallucination).
- **Interfaces**: Headless CLI (`doctor`, `ingest`, `optimize`, `audit`, `studio`) + Desktop-Grade Web Studio (Neo-brutalist architectural blueprint aesthetic, Three-Act pipeline, 70/30 diff canvas with pure inline highlights).

---

### Key Repository Files to Inspect (verify they still exist at these paths)
- `CLIEF.md` & `docs/clief/INDEX.md` — Canonical ICM routing map.
- `docs/clief/PRD.md` — Canonical approved requirements, 60/30/10 split, and phases.
- `docs/clief/BRIEF.md` & `AGENT-CHARTER.md` — Operating boundaries and project brief.
- `PRODUCT.md` & `DESIGN.md` — Durable product authority and Neo-brutalist tokens.
- `docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md` — Full technical specification.
- `docs/superpowers/plans/2026-10-10-dual-engine-resume-product-phase-0.md` — Phase 0 implementation plan.
- `docs/assets/studio-prototype.html` — Interactive Web Studio prototype.
- **NEW: whatever code actually exists now** — `packages/`, `package.json`, `pnpm-workspace.yaml`, tests, CI workflows. If any of these appeared since the prior audit, audit them as first-class artifacts (run the tests, read the CI config, check the CLI entrypoints actually work). If none exist, say so plainly.

---

### Audit Dimensions (Evaluate Each Dimension Rigorously)

#### 0. Delta Analysis (NEW — do this FIRST)
- What changed in the repo since 2026-10-10? (`git log`, file tree diff, new docs/code/tests/CI.)
- Prior-audit status check: for each of F1–F5 and each prior recommendation — **Resolved / Partial / Unchanged / Regressed / Withdrawn (I disagree)**, with evidence.
- What NEW failure modes, contradictions, or risks appeared since the prior audit?

#### 1. Technical Architecture & Inference Reality
- **VRAM Swapping & Latency**: Does sequential batch swapping between Hemmingway (27B) and Humanizer (12B) via Ollama scale on real consumer hardware (16GB M-series Macs, 16GB–24GB RTX GPUs)? What happens during disk I/O model reloading? Is batching all bullets across Stage 1 before swapping to Stage 2 sufficient, or are there hidden memory leaks? **Verify the actual quant sizes and minimum hardware from the model cards / Ollama library — do not accept the plan's numbers.**
- **4-Layer Ingestion vs. Reality**: The plan uses a 4-layer hybrid ingestion (Deterministic Layout -> Regex Entity Mask -> Ephemeral Qwen 2.5 7B with GBNF grammars -> Invariant Reconciliation Gate). Is GBNF grammar decoding well-supported in Ollama (JSON-Schema-via-`format` only, no raw GBNF passthrough)? Where will this break when processing poorly formatted PDFs or scanned images?
- **The Invariant Sentinel**: How robust is a deterministic diff asserting 100% metric preservation when models change sentence voice (e.g., "$1.4M in savings" vs "saved the business 1.4 million dollars")? How should number-to-word conversions and currency normalization be handled without false rejections? **If code now exists, test the sentinel against a golden corpus of restyled entities.**

#### 2. Domain Truth: ATS Mechanics & Recruiter Scrutiny
- **ATS Semantic Vector Reality**: Does the plan accurately reflect how modern ATS platforms (Workday, Greenhouse, Ashby, Lever) actually index and rank candidates? **Verify against current (2026) public analyses of each platform's parser and ranker. Does the KB now contain per-platform data?**
- **The Anti-Slop Rubric (42/50 vs 35/50 — the prior audit found BOTH thresholds in the repo)**: Which threshold is canonical now? Are the 5 mathematical dimensions (Directness, Rhythm/Burstiness, Trust, Authenticity, Density) sufficient to eliminate machine handwriting? Are there fatal flaws or gaming vectors in the mathematical formulations? Is Trust still binary?
- **Dual-Track Dichotomy**: Is separating JD-anchored optimization (Resume/Cover Letter) from Career-Path-anchored optimization (LinkedIn) the correct architectural division? What edge cases arise when a candidate is pivoting into an entirely new field?

#### 3. UX, UI & Developer Experience
- **Three-Act Pipeline**: Does the flow (`Act 01: Intake & Lock` -> `Act 02: Studio Canvas` -> `Act 03: Audit & Export`) remove cognitive friction for candidates?
- **70/30 Studio Canvas**: Is the side-by-side diff with lime-green inline highlights (`#d9f99d`) and `✓ FACTS KEPT` capsule bar intuitive? Does the layout scale on varying viewport sizes? **Is it still a static mock, or wired to real pipeline output?**
- **CLI Ergonomics**: Are the terminal commands (`doctor`, `ingest`, `optimize`, `audit`, `studio`) well-scoped and **actually implemented**? Is stdio piping and CI exit code handling properly accounted for? **If a CLI exists, run it.**

#### 4. GitHub Virality & Open-Source Repository Structure
- **Viral Repo Factors**: What does this repo need to trend #1 on GitHub and achieve 10,000+ stars? (e.g., Zero-install `npx career-ops studio`, interactive terminal recording / ASCII art, clear animated GIF/video demos in README, pre-baked database vs zero-config first run).
- **The "Aha!" Moment**: How fast can a new developer go from `git clone` to seeing their own resume rewritten on screen? Where is the current friction in the setup? **Measure it if the code exists.**
- **Licensing & Model Weights**: Are there licensing conflicts between MIT code, `Altworld/Hemmingway-1` (**CC BY-NC 4.0 — verify**), `jialinyyzz/humanizer` (Apache-2.0 / Gemma terms — verify), and Ollama? **Check whether the repo now documents this.**

#### 5. Project Gaps & Red-Team Scenarios
- Identify the **top 5 unseen architectural blind spots or fatal failure modes** in the current state of the plan/code that could derail development or cause real-world user rejection. **At least 2 of the 5 must be NEW since the prior audit** (not re-listings), unless the repo is byte-identical, in which case say so and instead rank the prior 5 by current severity.

---

### Required Output Format

Structure your audit into the following clear sections:

0. **Delta vs Prior Audit (2026-10-10)**: repo changes since the last audit; per-finding status table (Resolved / Partial / Unchanged / Regressed / Withdrawn); new risks introduced.
1. **Executive Scorecard**:
   - Grade each area: Technical Architecture, Domain Validity, Product/UX, Open-Source Virality, and Execution Readiness (Rate each: **Strong Pass**, **Pass with Warnings**, or **Critical Risk**). **Show prior grade → current grade with a one-line reason for every change.**
2. **Adversarial Red-Team Analysis**:
   - The top 5 failure modes or unaddressed risks, why they will bite us, and the concrete technical countermeasure. Mark each NEW / CONFIRMED / REGRESSED.
3. **Virality & Developer Adoption Blueprint**:
   - Specific recommendations to structure the README, CLI, and quickstart to maximize GitHub traction and community adoption, updated for the current repo state.
4. **Actionable Recommendations for the Build Roadmap**:
   - Explicit additions or modifications to the phases to guarantee project success, updated for what is actually built.
5. **Disagreements With the Prior Audit** (if any): each point where you reach a different conclusion, with your evidence.

**Evidence discipline**: every factual claim about models, licenses, Ollama semantics, ATS internals, or study statistics must be verified live (web) or from the repo on disk. Tag unverifiable claims as such. Never invent file contents, commit history, or benchmark numbers.

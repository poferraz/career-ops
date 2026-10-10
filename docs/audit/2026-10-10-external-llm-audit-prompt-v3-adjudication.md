# Comprehensive Architectural & Open-Source Audit v3 (Adjudication Re-Audit): `poferraz/career-ops`

### Operating Mode
This prompt assumes you can browse the web and read provided files (Gemini with search / Deep Research, or Gemini CLI with filesystem access). If you cannot read local paths, ask the user to attach the three prior reports and a snapshot of the repository, then proceed. **If any required input is missing, stop and request it — do not audit from this prompt's summaries alone.**

### Role & Persona
You are a panel of three world-class experts conducting an unvarnished, adversarial audit of an ambitious open-source AI project:
1. **Principal Distributed Systems & AI Inference Architect**: local open-weight model deployment (Ollama, llama.cpp, quantization, VRAM memory management), AST parsing, deterministic software reliability.
2. **VP of Talent Acquisition & ATS Systems Engineer**: insider expertise in the parsing heuristics and ranking mechanisms of Workday, Greenhouse, Ashby, and Lever, and recruiter cognitive scanning behavior.
3. **Open-Source Growth Strategist & Viral Repo Architect**: launching top-trending GitHub repositories with bulletproof developer ergonomics, sticky demos, and high-conversion README architecture.

This is the **third** audit of this project. Your objective is NOT to validate or flatter anyone — not the project, and not the prior auditors. Your job is to: establish what changed since the second audit, independently re-derive every load-bearing conclusion, **adjudicate the disagreements between the two prior audits**, hunt for errors both prior audits share, and produce a convergence map that lets the project finally treat some things as settled and act on them.

---

### Required Inputs (stop and request if missing)
- **The repository**: `/Users/poferraz/Documents/Development/active/career-ops` (if you have filesystem/shell access). Working branch at last audit: `feat/dual-engine-resume-product`; `main` holds the shipped "skill" product.
- **Audit 1 report**: `/Users/poferraz/.hermes/cache/scratch/career-ops-adversarial-audit-2026-10-10.md`
- **Audit 1 claims-extraction report**: `/Users/poferraz/.hermes/cache/scratch/career-ops-claims-audit.md`
- **Audit 2 report (delta re-audit)**: `/Users/poferraz/.hermes/cache/scratch/career-ops-adversarial-audit-v2-2026-10-10.md`

---

### Prior Audit Context (Baseline — Treat as UNVERIFIED CLAIMS)

Both prior audits ran on 2026-10-10, executed by the same AI-assistant toolchain (different underlying models); Audit 2 used blind verification subagents and live web checks.

**Audit 1 headline conclusions:**
- Scorecard: Technical Architecture = Pass with Warnings; Domain Validity = Pass with Warnings; Product/UX = Pass with Warnings; Open-Source Virality = **Critical Risk**; Execution Readiness = **Critical Risk**.
- Top 5 failure modes: (F1) the binary 100%-invariant sentinel will false-reject on number↔word / currency / date restylings because no normalization layer is specified; (F2) the VRAM plan assumes quantization it never gates and a 16GB Mac cannot run the dense 27B Stage-1 model; (F3) sequential model swapping carries a ~3-cold-load latency tax that is unbudgeted; (F4) the headline ATS claim ("modern ATS is purely semantic; keyword stuffing is wrong") is overstated and the knowledge base has zero Greenhouse/Ashby/Lever platform data; (F5) the repo is code-empty while badges/README market a v1.0.2 product.

**Audit 2 headline conclusions:**
- The repo was byte-identical to Audit 1's state (no commits between the audits); all F1–F5 **CONFIRMED** with independent evidence and re-ranked by severity F1 > F4 > F2 > F3 > F5; all five grades unchanged.
- Audit 2 additionally claimed these NEW issues Audit 1 missed (verify each independently — newer is not truer):
  - The product docs resurrect the "6-second recruiter scan" that the knowledge base itself excludes as a disproven myth (`docs/clief/PRD.md:36` "under 6 seconds"; `PRODUCT.md:19` "6-to-8-second"; design-spec §2.2 title) — while `references/resume.md:22` cites 11.2 s and `docs/trust-tiers.md:60` formally excludes the 6–7 s claim.
  - The design spec's §8.1 "deterministic" scoring formulas measure different constructs than the rubric dimensions they are named after (Trust = binary fact-preservation ≠ the rubric's graded verifiability; Authenticity = banned-phrase count ≠ personal voice; Density = bullet-component checklist ≠ fluff ratio; Rhythm's σ formula undefined for single-sentence bullets).
  - The spec ships an "AI Detection Risk gauge (8% AI Risk)" (§6.1) that violates its own No-Detector Law (§10.3) in the same document; the strategy doc goes further ("beat GPTZero, CopyLeaks, Turnitin… Live AI Detection Radar").
  - Three mutually incompatible score gates coexist: 35-minimum (skill-era files), 42-pass/three-band (spec), 42-binary (strategy doc); and the docs' own "Trust (9/10)" examples are impossible under the spec's binary Trust formula.
  - Hemmingway-1 **launched under Apache-2.0 and was relicensed CC BY-NC 4.0 two days later**; stale caches still show Apache-2.0 — a license-history trap.
  - Ollama's MLX backend (Apple Silicon) **silently ignores `format`/structured output** (open GitHub issue), breaking the constrained-ingestion layer on one of the two stated target platforms; Ollama Cloud has no structured outputs; raw GBNF is never exposed.
  - The InterviewPal study is cursor-tracking product telemetry, not eye-tracking, with 312 recruiters (not the KB's "847 hiring managers").
  - The spec describes **three different fallback behaviors** for an invariant violation (fallback to Stage-1 draft / fallback to original bullet / programmatic re-injection).

**Audit 1 ↔ Audit 2 open disagreements — adjudicate each with primary sources:**
1. **ATS vendor plumbing.** A1 asserted as verified-live: Workday uses Aspose-based extraction + HiredScore ranking; Greenhouse uses a Sovren/Textkernel parser + semantic AI score. A2 asserted: no evidence any of the four platforms uses Aspose, Sovren, or Textkernel — Greenhouse's parser is patented in-house, Lever's is built-in; the verified ranking mechanics are HiredScore (Workday, acquired 2024) and an opt-in, off-by-default LLM-based "Talent Fit" (Lever, AWS Bedrock + IBM watsonx.governance). Who is right, per primary vendor documentation?
2. **Ladders eye-tracking sample.** A1: "7.4 s (2018, ~30 recruiters)". A2: the 30-recruiters/10-weeks sample belongs to the **2012** (6-second) study; the 2018 report does not disclose its sample size, and sources attaching "30" to 7.4 s are borrowing the 2012 sample. Read the study PDFs themselves.
3. **InterviewPal 2025 sample & methodology.** The repo KB claims "847 hiring managers, 4,289 resumes, eye-tracking". A1: "312–847, inconsistent across secondary sources". A2: resolves to **312 recruiters and hiring managers**, and the methodology is cursor-tracking telemetry inside an AI-assisted tool (which inflates times), not eye-tracking. Check the primary study page.
4. **The "67%" statistic.** The KB (`references/anti-slop.md:18`) claims "67% of hiring managers claim they can identify AI content" (tier T2). A1 accepted it as a legitimate stat and criticized only its escalation to "discard/reject" in BRIEF/PRD/PRODUCT. A2 found the 67% figure itself **matches no primary survey** (nearest verified: 80% view-negatively, CV Genius 2024, widely mis-rendered as "80% discard"; 49% automatically dismiss, Resume.io Jan 2025; 62% conditional, Resume Now Mar 2025; 19.6% would reject + 33.5% can spot in <20 s, TopResume May 2025; 66% of HMs report their companies use AI-detection software, Kelly 2025). A2 also claims the design spec conflates the 67% with the 33.5%/20-second stat into one sentence. Does ANY primary source support a "67% can identify" figure?
5. **Hemmingway-1 Q4_K_M size.** A1: ~17.8 GB. A2: 17.4 GB (17.8 is Q4_1), plus the license-history finding above. Verify against the Hugging Face GGUF tables and the model repo's own commit history.
6. **README install-matrix framing.** A1: the matrix "leads with a dead platform" (Claude Code — retired in the owner's personal setup) and omits the auditing assistant. A2: that framing is environment-specific, not a market fact; the real defect is badges/version marketing an unbuilt platform. As a positioning question: what should the public README lead with?

---

### Anti-Anchoring Rules (MANDATORY — this is what keeps the audit unbiased)
1. **Both prior audits are claims, not ground truth — including the newer one.** Re-derive every conclusion from the repository on disk and live web verification. "Newer" is not "truer": Audit 2 corrected Audit 1 in places and can itself be wrong in others.
2. **The repo has changed (or not) since Audit 2.** Establish current state yourself from `git log`, `git status`, and the actual file tree — every description in this prompt (including its file:line citations) describes PAST states and may be stale.
3. **You are the adjudicator.** For each A1↔A2 disagreement, issue a verdict with primary-source evidence and a confidence level. Where you agree with a prior audit, "confirmed" requires YOUR OWN evidence — never repetition.
4. **Do not soften findings for consistency, and do not invent findings for novelty.** An audit cycle only converges if you are willing to say both "the prior audits are right" and "the prior audits are wrong" where your evidence leads.
5. **Shared-tooling warning.** Both prior audits were executed by the same AI-assistant toolchain with the same web-extraction backend — which demonstrably served a stale cached license page (launch-era Apache-2.0) during Audit 2's verification, caught only via commit-history diffs. Any claim BOTH audits agree on may still be a tooling artifact. Verify load-bearing claims through your own independent retrieval, and tag anything you cannot reproduce as **UNVERIFIED-BY-YOU**.
6. **Self-ownership bias.** Parts of this repository's knowledge base (`references/`, `docs/research-methodology.md`) were originally produced using **Gemini Deep Research**. Agreement with that material is not evidence — audit it exactly as if a third party had written it. Disagreement with it is not disloyalty.
7. **Check for fixes AND regressions.** Since Audit 2 the maintainers may have applied its "Phase 0 doc-hygiene" recommendations (six-second figure, 67% stat, gate reconciliation, gauge removal, tag drift, license section, CI triggers, dangling link). For every prior finding and recommendation: **Resolved / Partial / Unchanged / Regressed / Withdrawn (I disagree)**, with evidence.

---

### Project Context & Core Thesis (as of the PRIOR audits — re-verify current state)
- **Repository**: `poferraz/career-ops`
- **Core Mission**: Transform candidate resumes and cover letters against specific Job Descriptions (Track A) and align LinkedIn profiles to a target career trajectory (Track B) to pass both ATS algorithmic filters and the human recruiter's initial scan.
- **Model Pipeline**: Dual open-weight engine — `Altworld/Hemmingway-1` (27B Qwen fine-tune for density and active voice) + `jialinyyzz/humanizer` (12B Gemma fine-tune for cadence burstiness and human authenticity); sequential VRAM swapping (run Stage 1 → evict KV cache via `keep_alive: 0` → run Stage 2) targeting consumer hardware (≤24GB VRAM).
- **Architecture**: Strict Clief/ICM operating system using a **60/30/10 split** — 60% traditional code (AST parsers, token diff engine, Vite UI, SQLite); 30% deterministic rules (T1–T4 research hierarchy, 5-dimension Anti-Slop rubric, Factual Invariant Sentinel, ATS single-column validator); 10% AI inference (Hemmingway-1, Humanizer, ephemeral Qwen2.5-7B/3B for ingestion).
- **Core Product Invariant**: 100% preservation of all candidate metrics, percentages, dates, and technical skills (zero rounding, zero hallucination).
- **Interfaces**: Headless CLI (`doctor`, `ingest`, `optimize`, `audit`, `studio`) + Desktop-Grade Web Studio (Neo-brutalist architectural blueprint aesthetic, Three-Act pipeline, 70/30 diff canvas with pure inline highlights).

### Key Repository Files to Inspect (verify they still exist at these paths)
- `CLIEF.md` & `docs/clief/INDEX.md` — canonical ICM routing map.
- `docs/clief/PRD.md` — approved requirements, 60/30/10 split, phases.
- `docs/clief/BRIEF.md` & `AGENT-CHARTER.md` — operating boundaries and brief.
- `PRODUCT.md` & `DESIGN.md` — durable product/design authority.
- `docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md` — full technical specification.
- `docs/superpowers/plans/2026-10-10-dual-engine-resume-product-phase-0.md` — Phase 0 implementation plan.
- `docs/assets/studio-prototype.html` — interactive Web Studio prototype.
- `references/` — the research knowledge base (originally built with Gemini Deep Research).
- **Whatever code actually exists now** — `packages/`, `package.json`, `pnpm-workspace.yaml`, tests, CI workflows. If any appeared since Audit 2, audit them as first-class artifacts: run the tests, read the CI config, run the CLI entrypoints. If none exist, say so plainly.

---

### Audit Dimensions (evaluate each rigorously)

#### 0. Delta Since Audit 2 (do this FIRST)
- What changed in the repo since Audit 2? (`git log`, file-tree diff, new docs/code/tests/CI.)
- Status table for: prior F1–F5, Audit 2's newly-identified issues, and every prior recommendation — Resolved / Partial / Unchanged / Regressed / Withdrawn, with evidence.
- What NEW failure modes, contradictions, or risks appeared?

#### 1. Adjudication of Prior-Audit Disagreements
- Resolve each of the six listed A1↔A2 disagreements (plus any others you find reading the two reports) from primary sources: vendor documentation, the study PDFs/pages themselves, Hugging Face model repos and commit history. Verdict + evidence + confidence for each.

#### 2. Technical Architecture & Inference Reality
- **VRAM & quantization**: verify actual quant sizes and minimum hardware from model cards / GGUF tables / Ollama library — accept neither audit's numbers. Does the sequential swap plan scale on 16GB M-series Macs and 16–24GB RTX GPUs? Is disk-I/O model-reload latency budgeted anywhere?
- **Ingestion vs Ollama reality**: the plan uses a 4-layer hybrid ingestion ending in GBNF-grammar-constrained decoding. What does Ollama actually support (`format`/JSON Schema vs raw GBNF; Cloud; the MLX backend on Apple Silicon)? Where does this break on scanned PDFs?
- **The invariant sentinel**: how robust is a deterministic verbatim diff when models legitimately restyle values ("$1.4M" → "1.4 million dollars")? Is a normalization/canonicalization layer specified anywhere now? **If code exists, test the sentinel against a golden corpus of restyled entities.**

#### 3. Domain Truth: ATS Mechanics & Recruiter Scrutiny
- Verify, from primary vendor documentation, how Workday, Greenhouse, Ashby, and Lever actually parse and rank: parser technology, keyword/Boolean vs semantic/vector matching, auto-reject behavior. Does the plan's model of ATS reality hold? Does the KB now contain per-platform data?
- **Scan-time lineage**: verify the 6-second (Ladders 2012), 7.4-second (Ladders 2018), and 11.2-second (InterviewPal 2025) figures and their samples/methodologies from the sources themselves.
- **The Anti-Slop rubric**: which score gate is canonical now (35-minimum vs 42 three-band vs 42-binary)? Are the 5 dimensions and their mathematical formulations valid — adjudicate Audit 2's claim that the deterministic formulas measure different constructs than the rubric dimensions they are named after. Is Trust still binary?
- **Dual-Track dichotomy**: is JD-anchored (Resume/Cover Letter) vs career-path-anchored (LinkedIn) the right split? What breaks for a candidate pivoting into an entirely new field?

#### 4. UX, UI & Developer Experience
- Three-Act pipeline (`Intake & Lock` → `Studio Canvas` → `Audit & Export`): does it remove cognitive friction?
- 70/30 Studio Canvas with lime inline highlights and `✓ FACTS KEPT` capsule: still a static mock, or wired to real pipeline output?
- CLI ergonomics (`doctor`, `ingest`, `optimize`, `audit`, `studio`): well-scoped and **actually implemented**? Stdio/CI exit-code handling? **If a CLI exists, run it.**

#### 5. GitHub Virality & Open-Source Structure
- What does this repo need to trend and reach 10,000+ stars (zero-install `npx` path, demos, time-to-first-value)? **Measure clone-to-first-value if the code exists.**
- **Licensing — adjudicate from primary sources**: the Hemmingway-1 license (HF model card, LICENSE file, commit history — including the claimed Apache-2.0 → CC BY-NC 4.0 relicense), humanizer's license and Gemma base-model terms, and the MIT-code conflict. Is any of this documented in the repo now?

#### 6. Correlated-Error Sweep (NEW)
- List every claim that BOTH prior audits assert that you could NOT independently reproduce. These shared claims are the project's residual unknowns — they may be right, but two same-toolchain confirmations are not independent confirmation.

#### 7. Convergence & Go/No-Go (NEW)
- Produce (a) the **SETTLED list**: findings on which all three audits agree, which the project may now treat as ground truth; (b) the **CONTESTED list**: still-open disagreements, with your adjudication and what evidence would settle them; (c) a final **go/no-go recommendation** on starting Phase 0 implementation, with the top 3 fixes required first if "go".

---

### Required Output Format

0. **Delta Since Audit 2**: repo changes; per-finding/per-recommendation status table; new risks introduced.
1. **Disagreement Adjudication**: table — topic | Audit 1 position | Audit 2 position | your verdict | evidence (with sources) | confidence.
2. **Executive Scorecard**: grade Technical Architecture, Domain Validity, Product/UX, Open-Source Virality, Execution Readiness (**Strong Pass / Pass with Warnings / Critical Risk**). Show **Audit 1 → Audit 2 → yours**, with a one-line reason for every change.
3. **Adversarial Red-Team Analysis**: the top 5 current failure modes, why they will bite, and the concrete countermeasure — tag each **SETTLED** (all audits agree) / **NEW** / **DISPUTED**.
4. **Correlated-Error Report**: shared-tooling claims you could not reproduce, each tagged UNVERIFIED-BY-YOU.
5. **Virality & Developer Adoption Blueprint**: specific README/CLI/quickstart structure to maximize traction, updated for the current repo state.
6. **Actionable Recommendations for the Build Roadmap**: explicit phase additions/modifications, updated for what is actually built.
7. **Convergence & Go/No-Go**: the settled list, the contested list, and the final recommendation.

**Evidence discipline**: every factual claim about models, licenses, Ollama semantics, ATS internals, or study statistics must be verified live (web) or from the repo on disk — **by you**. Tag anything you cannot reproduce as UNVERIFIED-BY-YOU. Never invent file contents, commit history, or benchmark numbers. If a required input is missing, stop and request it.
# Brief — career-ops

## What we are building

`career-ops` is an evidence-based career intelligence platform combining a headless CLI and a desktop-grade Three-Act Web Studio. It optimizes candidate resumes and cover letters against specific job postings and aligns LinkedIn profiles with a target career trajectory. 

The system evolves `career-ops`' original conversational intake and research rigor into a modern **Four-Stage Engine**:
1. **Stage 1: Motivational Interviewer & Accomplishment Miner** (Surfacing unstated achievements, quantifying impact, and extracting transferable skills via Motivational Interviewing and RISE probes).
2. **Stage 2: The Density & Active-Verb Engine** (`Altworld/Hemmingway-1`, 27B) (Strips corporate filler, active-verb enforcement, maximum density).
3. **Stage 3: The Humanizer & Natural Cadence Engine** (`jialinyyzz/humanizer`, 12B) (Introduces burstiness, varies rhythm, eliminates AI boilerplate, raw completion).
4. **Stage 4: Deterministic Audit & Factual Invariant Gate** (`@career-ops/audit`) (Two-class normalization layer, graded Trust, Three-Band Anti-Slop scoring, ATS layout certification).

## The pain

1. **The Underselling & Articulation Gap**: Research shows candidates systematically undersell themselves, omitting quantifiable scope, impact, and tooling. A rewriter cannot optimize facts that are not present. `career-ops` solves this at intake through structured motivational interviewing.
2. **The Recruiter Initial Scan Gate**: Recruiters spend an average of 11.2 seconds on initial platform review (InterviewPal 2025, 312 recruiters) and 7.4 seconds skimming (Ladders 2018), discarding applications characterized by monotonous AI machine handwriting (*"spearheaded cross-functional initiatives"*).
3. **ATS Hybrid Filtering Reality**: Enterprise ATS platforms (Workday, Greenhouse, Ashby, Lever) combine strict single-column layout parsing and exact-match Boolean skill filters with semantic vector ranking. Candidates fail when layouts scramble or when required tool names are dropped.
4. **Context Collapse Across Materials**: Candidates submit generic resumes that don't match specific JDs, while leaving their LinkedIn profile unaligned with their broader career trajectory.

## Audience

High-performing software engineers, product leaders, designers, data scientists, and ambitious professionals who need verifiable, high-leverage career assets that pass ATS filters and human recruiter scrutiny.

## What good looks like

1. **Interactive Accomplishment Mining**: The Motivational Interviewer surfaces quantifiable metrics on bullets that previously lacked them before locking entities.
2. **Dual-Track Differentiation**:
   - **Track A (Resume & Cover Letter)**: Tailored to an exact Job Description. High semantic vector match, exact required skill presence, zero corporate filler, hook-match-close structure.
   - **Track B (LinkedIn Profile)**: Anchored to a defined career path / focus. High recruiter Boolean search visibility, multi-act narrative, and authentic thought leadership voice.
3. **Deterministic Three-Band Quality Gate**: Resumes and cover letters score $\ge 42/50$ (Certified) across Directness, Rhythm, Trust, Authenticity, and Density before export.
4. **Two-Class Factual Invariance**: Verbatim invariants (proper nouns, tools, certifications) and semantic invariants (numbers, currencies, percentages, dates) preserved 100% via an entity normalization layer.
5. **Three-Act Web Studio**: An architectural blueprint UI (Neo-Brutalist, cobalt blue, 6px hard shadows) featuring the Act 01 Mining Assistant, 70/30 Studio Canvas with pure inline highlights, and live scorecard.
6. **Continuous Research Harness**: Internal agents operate with verified T1–T3 data sources (BLS, peer-reviewed labor studies, ATS vendor engineering notes).

## What to avoid

1. **Never use AI detectors to score resumes**: Real ATS systems do not use GPTZero or Turnitin; scoring on AI detectors misleads the user and violates the No-Detector Law.
2. **Never alter or hallucinate facts**: No rounding "$1.4M" to "$1.5M", no modifying dates, and no injecting tools the candidate hasn't used.
3. **Never generate multi-column or graphic-heavy layouts**: ATS parsers choke on text boxes, multi-column tables, and header graphics. Single-column semantic flow is mandatory.
4. **Never run models concurrently in local VRAM**: `Hemmingway-1` (27B) and `Humanizer` (12B) combined exceed 24GB VRAM. Sequential batch swapping with KV cache eviction is required.
5. **Never use `display: inline-block` on diff highlight spans**: It creates rigid boxes that break word wrapping and orphan punctuation. Use pure inline styling with `box-decoration-break: clone`.

## Constraints

- **Hardware & Inference**: Local execution requires 24GB VRAM GPU or 32GB Unified Memory Mac for Q4_K_M. First-class OpenAI-compatible remote endpoint support for 16GB laptops.
- **Monorepo Architecture**: TypeScript pnpm monorepo cleanly separated into `@career-ops/knowledge`, `@career-ops/core`, `@career-ops/agents`, `@career-ops/audit`, `@career-ops/cli`, and `@career-ops/web`.
- **Design System Fidelity**: Adherence to [`PRODUCT.md`](file:///Users/poferraz/Documents/Development/active/career-ops/PRODUCT.md) and [`DESIGN.md`](file:///Users/poferraz/Documents/Development/active/career-ops/DESIGN.md) architectural tokens.

## References

- [`PRODUCT.md`](file:///Users/poferraz/Documents/Development/active/career-ops/PRODUCT.md) — Durable product authority.
- [`DESIGN.md`](file:///Users/poferraz/Documents/Development/active/career-ops/DESIGN.md) — Architectural neo-brutalist tokens and rules.
- [`.impeccable/design.json`](file:///Users/poferraz/Documents/Development/active/career-ops/.impeccable/design.json) — Impeccable component sidecar.
- [`docs/assets/studio-prototype.html`](file:///Users/poferraz/Documents/Development/active/career-ops/docs/assets/studio-prototype.html) — Interactive reference prototype.
- [`docs/trust-tiers.md`](file:///Users/poferraz/Documents/Development/active/career-ops/docs/trust-tiers.md) — T1–T4 research hierarchy.
- [`references/anti-slop.md`](file:///Users/poferraz/Documents/Development/active/career-ops/references/anti-slop.md) — Anti-slop scoring rubric and banned phrases.

## Open questions

1. **Knowledge Store Backend**: SQLite with `better-sqlite3` and keyword/tag indices initialized in Phase 0; optional vector extension evaluated in Phase 3.

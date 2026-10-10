# Brief — career-ops

## What we are building

`career-ops` is an evidence-based career intelligence platform combining a headless CLI and a desktop-grade Three-Act Web Studio. It optimizes candidate resumes and cover letters against specific job postings and aligns LinkedIn profiles with a target career trajectory. The system is driven by a deep continuous research ingestion harness (`@career-ops/knowledge`), a dual-model open-weight pipeline (`Altworld/Hemmingway-1` for punchy density + `jialinyyzz/humanizer` for natural cadence and anti-slop), and a deterministic factual invariant engine.

## The pain

1. **The 6-Second Recruiter Gate**: 67% of hiring managers discard applications flagged with "machine handwriting"—monotonous sentence structures, corporate jargon (*"spearheaded cross-functional synergies"*), and lack of authentic operational friction.
2. **ATS Technical Breakdown**: Applicants fail applicant tracking systems (Workday, Greenhouse, Ashby, Taleo) not due to mythical AI detectors, but due to two-column template parsing corruption, missing skill semantic vectors, and unquantified impact statements.
3. **Outdated & Fluffy Career Advice**: Candidates lack verified, up-to-date research on ATS parsing behavior, recruiter Boolean search queries, and labor market shifts, relying instead on generic AI chatbots that invent claims and hallucinate metrics.
4. **Context Collapse Across Materials**: Candidates submit generic resumes that don't match specific JDs, while leaving their LinkedIn profile unaligned with their broader career path.

## Audience

High-performing software engineers, product leaders, designers, data scientists, and ambitious professionals who need verifiable, high-leverage career assets that bypass ATS filters and pass human scrutiny.

## What good looks like

1. **Dual-Track Differentiation**:
   - **Track A (Resume & Cover Letter)**: Tailored to an exact Job Description. High semantic vector match, zero corporate filler, hook-match-close structure.
   - **Track B (LinkedIn Profile)**: Anchored to a defined career path / focus. High recruiter search visibility, multi-act narrative, and authentic thought leadership voice.
2. **Deterministic Anti-Slop Verification**: Resumes and cover letters score $\ge 42/50$ across Directness, Rhythm, Trust, Authenticity, and Density before export.
3. **100% Factual Invariance**: Every metric, currency amount, percentage, date, and tech tool in the original document is locked and preserved verbatim.
4. **Three-Act Web Studio**: An architectural blueprint UI (Neo-Brutalist, cobalt blue, 6px hard shadows) with an asymmetric 70/30 Studio Canvas featuring side-by-side diffing, pure inline highlights, and real-time radar feedback.
5. **Continuous Research Harness**: Internal agents operate with T1–T4 verified data sources (BLS, peer-reviewed labor studies, ATS vendor engineering changelogs) rather than generic training data.

## What to avoid

1. **Never use AI detectors to score resumes**: Real ATS systems do not use GPTZero or Turnitin; scoring on AI detectors misleads the user.
2. **Never alter or hallucinate facts**: No rounding "$1.4M" to "$1.5M", no modifying dates, and no injecting tools the candidate hasn't used.
3. **Never generate multi-column or graphic-heavy layouts**: ATS parsers choke on text boxes, multi-column tables, and header graphics. Single-column semantic flow is mandatory.
4. **Never run models concurrently in local VRAM**: `Hemmingway-1` (27B) and `Humanizer` (12B) combined exceed 24GB VRAM. Sequential batch swapping with KV cache eviction is required.
5. **Never use `display: inline-block` on diff highlight spans**: It creates rigid boxes that break word wrapping and orphan punctuation. Use pure inline styling with `box-decoration-break: clone`.

## Constraints

- **Local-First Inference**: Primary execution via Ollama on local hardware (Mac Apple Silicon / Linux CUDA) with optional OpenAI-compatible remote endpoint fallback.
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

1. **Knowledge Store Backend**: SQLite with `sqlite-vec` extension for embedded local vector similarity vs flat serialized JSON cosine index for zero native dependency builds.

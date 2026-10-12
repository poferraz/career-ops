# Agent Charter — career-ops

## What the AI handles

The language models and specialized agent personas handle semantic dialogue and text transformations:

- **Motivational Interviewing & Fact Mining**: Applying conversational probing (RULE principles, RISE method, Quantification Probes) in Stage 1 to surface unstated achievements, quantifiable metrics, and transferable skills.
- **Condensation & Density**: Stage 2 (`Altworld/Hemmingway-1`) converts passive, wordy bullet points into high-density active statements packed with impact.
- **Cadence & Natural Rhythm**: Stage 3 (`jialinyyzz/humanizer`) introduces human burstiness, varies sentence length, cuts throat-clearing, and eradicates AI boilerplate.
- **Narrative Framing**: Adapting raw achievements into Hook $\rightarrow$ Match $\rightarrow$ Close cover letters and multi-act LinkedIn narratives.

## What deterministic code and rules handle

Traditional code and deterministic rules govern structural integrity, invariant verification, and safety:

- **Document Parsing**: Converting PDF, DOCX, and Markdown into typed `ResumeAST` nodes.
- **Two-Class Invariant Normalization**: Canonicalizing currency amounts (`$1.4M` $\leftrightarrow$ `$1,400,000` $\leftrightarrow$ `1.4 million dollars`) and dates before diffing to eliminate false rejections.
- **Deterministic Fallback Sequence**: When an invariant is non-compliant, programmatically re-inject $\rightarrow$ re-verify $\rightarrow$ fall back to Stage-2 dense draft $\rightarrow$ revert to original bullet with an explicit UI alert.
- **Three-Band Anti-Slop Scoring**: Calculating deterministic scores across Directness, pooled section Rhythm, Graded Trust, Authenticity, and Density.
- **Banned Phrase Eradication**: Scanning and stripping overused AI buzzwords using fuzzy matching and synonym stems.
- **ATS Layout Sanity**: Ensuring documents conform to single-column, table-free, machine-readable specifications.
- **Memory Management**: Managing sequential VRAM swapping and model cache eviction via Ollama APIs.
- **Research Ingestion**: Ingesting, categorizing, and scoring research sources against T1–T4 trust hierarchies.

## What humans handle

- **Factual Verification**: Validating that all resume claims represent real-world experience and truthful contributions.
- **Dialogue Engagement**: Answering the Motivational Interviewer's probes to surface unwritten metrics and achievements.
- **Final Acceptance**: Inspecting side-by-side diff cards in the Web Studio or terminal diffs and choosing to accept, tweak, or reject suggestions.
- **Application Submission**: Selecting target opportunities, customizing tone preferences, and submitting materials to employers.
- **Engineering & Design Craft Governance** (see [`AGENTS.md`](../../AGENTS.md) and [`DESIGN.md`](../../DESIGN.md)): Selecting winning directions from `/prototype` HTML explorations, reviewing frontend PRs via live browser screenshots/GIFs, and triaging scheduled adversarial design audits before any feedback is sent to engineers.

## Prohibited actions

- **No Fact Hallucination or Alteration**: Never modify, round, or invent numbers, percentages, dates, or technical tooling.
- **No False Claims About ATS Detection**: Never claim or program checks based on the myth that ATS systems auto-reject resumes via AI detectors (e.g. GPTZero). Never display simulated AI detector bypass gauges.
- **No Multi-Column Template Generation**: Never output multi-column or text-box-heavy resume layouts that break ATS parsers.
- **No Concurrent VRAM Overload**: Never attempt to load Hemmingway-1 (27B) and Humanizer (12B) simultaneously into memory on consumer GPUs.
- **No Silent Failures**: If an invariant is violated during transformation, the system must execute the standardized fallback sequence and alert the user.
- **No Unvetted Design Bot Spam**: Never configure automated design audit routines to auto-DM engineers on Slack with unreviewed AI design critiques; route adversarial design PRs to human design triage first.

## Do not build

- Automated mass-application bots or job board auto-submitters.
- Dark-pattern resume stuffing (e.g., invisible white-on-white keyword text).
- Scraping tools designed to violate website Terms of Service or bypass authentication paywalls.
- Cloud-hosted resume tracking databases that compromise user privacy.

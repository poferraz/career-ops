# Agent Charter — career-ops

## What the AI handles

The language models (`Altworld/Hemmingway-1` and `jialinyyzz/humanizer`) handle semantic language transformations:
- **Condensation & Density**: Converting passive, wordy bullet points into high-density active statements packed with impact.
- **Cadence & Natural Rhythm**: Introducing human burstiness, varying sentence structures, cutting throat-clearing and AI boilerplate.
- **Narrative Framing**: Adapting raw achievements into Hook $\rightarrow$ Match $\rightarrow$ Close cover letter formats and multi-act LinkedIn narratives.

## What deterministic code and rules handle

Traditional code and deterministic rules govern all structural integrity, verification, and safety:
- **Document Parsing**: Converting PDF, DOCX, and Markdown into typed `ResumeAST` nodes.
- **Invariant Diffing**: Enforcing 100% preservation of all metrics, currency amounts, percentages, dates, and technical tooling.
- **Anti-Slop Scoring**: Calculating mathematical scores across Directness, Rhythm, Trust, Authenticity, and Density.
- **Banned Phrase Eradication**: Scanning and stripping overused AI buzzwords using fuzzy matching and synonym stems.
- **ATS Layout Sanity**: Ensuring documents conform to single-column, table-free, machine-readable specifications.
- **Memory Management**: Managing sequential VRAM swapping and model cache eviction via Ollama APIs.
- **Research Ingestion**: Ingesting, categorizing, and scoring research sources against T1–T4 trust hierarchies.

## What humans handle

- **Factual Verification**: Validating that all resume claims represent real-world experience and truthful contributions.
- **Final Acceptance**: Inspecting side-by-side diff cards in the Web Studio or terminal diffs and choosing to accept, tweak, or reject suggestions.
- **Application Submission**: Selecting target opportunities, customizing tone preferences, and submitting materials to employers.

## Prohibited actions

- **No Fact Hallucination or Alteration**: Never modify, round, or invent numbers, percentages, dates, or technical tooling.
- **No False Claims About ATS Detection**: Never claim or program checks based on the myth that ATS systems auto-reject resumes via AI detectors (e.g. GPTZero).
- **No Multi-Column Template Generation**: Never output multi-column or text-box-heavy resume layouts that break ATS parsers.
- **No Concurrent VRAM Overload**: Never attempt to load Hemmingway-1 (27B) and Humanizer (12B) simultaneously into memory on consumer GPUs.
- **No Silent Failures**: If an invariant is violated during transformation, the system must trigger an automatic fallback to the original bullet and alert the user.

## Do not build

- Automated mass-application bots or job board auto-submitters.
- Dark-pattern resume stuffing (e.g., invisible white-on-white keyword text).
- Scraping tools designed to violate website Terms of Service or bypass authentication paywalls.
- Cloud-hosted resume tracking databases that compromise user privacy.

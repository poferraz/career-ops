# Project Lessons & Architectural Invariants — `career-ops`

## UI & Layout Lessons
- **Diff Text Highlights Must Be Pure Inline**: Never use `display: inline-block` on inline text highlight spans. It causes rigid line breaks, trailing gaps, and orphan punctuation. Always use pure inline styling: `background-color: #d9f99d; color: #09090b; padding: 1px 3px; border-radius: 3px; box-decoration-break: clone; -webkit-box-decoration-break: clone; display: inline;`.
- **Identical Left-Alignment & Vertical Rhythm**: Both Draft and Rewrite columns must share identical left-alignment (`text-left`) and vertical rhythm (`leading-7`), with bullet markers (`•`) attached to text to enable instant comparative eye-tracking.
- **Neo-Brutalist Architectural Tokens**: Light zinc-50 paper canvas (`#fafafa`), 3px solid cobalt `#1414b8` borders, 6px hard geometric drop shadows (`box-shadow: 6px 6px 0px #1414b8`), and Inter/JetBrains Mono typography.

## Model Runtime & Memory Management
- **Sequential VRAM Memory Swapping**: `Altworld/Hemmingway-1` (27B) and `jialinyyzz/humanizer` (12B) combined exceed 24GB VRAM. Never run them concurrently on local GPUs. Batch all Stage 1 passes, evict KV cache via `keep_alive: 0`, and then run Stage 2 with Humanizer.
- **Protocol Mismatch Guard**: `Hemmingway-1` uses ChatML (`/api/chat`). `Humanizer` requires **raw completion only** (`/api/generate`) with the exact byte-level prompt template (`cc51d66b4c593fbe` SHA256 test). Wrapping Humanizer in ChatML breaks its fine-tuning.

## Ingestion & Document Parsing
- **The "Pure LLM" Ingestion Anti-Pattern**: Recent benchmarks (*ResumeBench*, *LLMStructBench*) reveal that unconstrained LLM parsing drops to 75%–85% accuracy on skills and experience, and chokes on multi-column layouts.
- **The 4-Layer Hybrid Ingestion Architecture**:
  - Layer 1: Deterministic Layout AST (`Docling` / `pdf-parse` / `mammoth`).
  - Layer 2: Deterministic Grounding Mask (Regex & NLP extraction of 100% of numbers, %, dates, tools).
  - Layer 3: Schema-Guided Semantic Structuring (`Qwen2.5-7B-Instruct` / `Qwen2.5-3B` fallback with GBNF grammar constraints).
  - Layer 4: Invariant Reconciliation Gate (Re-injects any omitted metric or date programmatically).
- **Teacher-Student Seed Model**: Pre-bake canonical T1–T3 heuristics into `packages/knowledge/seed/` distilled offline using frontier models so users have zero cold-start latency.

## Operating System & Governance (Clief/ICM)
- **60/30/10 Split**: 60% traditional code, 30% deterministic rules, 10% AI inference. AI is a pipeline component, not the whole system.
- **The Removal Test**: If LLMs are replaced with static templates, the system remains a fully functional manual career editor and ATS validator.
- **One Fact, One Location**: `docs/clief/` is the canonical source of truth for architectural planning and project status.

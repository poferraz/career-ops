# Context — @career-ops/core

Last updated: 2026-10-10

## What this workspace is for

This workspace houses the core document parsing engine, LLM inference drivers, sequential VRAM swapper, and the factual invariant locking engine that guarantees candidate truthfulness.

## The process

1. **Document Ingestion & AST Parsing**: Convert raw markdown, PDF, or DOCX into a normalized `ResumeAST`.
2. **Entity Extraction & Locking**: Extract all numbers, currencies, percentages, dates, and technical tooling into `LockedEntities`.
3. **Stage 1 (Hemmingway-1)**: Execute batch compression and active-verb enforcement via ChatML endpoint.
4. **VRAM Swapping**: If running in local constrained mode, evict Hemmingway KV cache (`keep_alive: 0`) and load Humanizer.
5. **Stage 2 (Humanizer)**: Execute raw-completion naturalization with the exact byte-level prompt template.
6. **Invariant Verification**: Assert 100% preservation of all `LockedEntities`. Fallback immediately if an invariant is violated.

## Files in here

```text
packages/core/
├── src/
│   ├── ast/                 # Markdown, PDF, DOCX parsers & AST serializers
│   ├── locker/              # Entity extraction and Invariant Diff Sentinel
│   ├── models/              # Hemmingway (ChatML) and Humanizer (Raw) drivers
│   ├── pipeline/            # Two-stage sequential batch runner & VRAM swapper
│   └── index.ts             # Core engine exports
└── tests/
```

## What good looks like

- AST preserves document structure across all sections without dropping text.
- 100% of metrics and dates in the input exist verbatim in the output.
- Ollama memory swapper cleanly transitions models without VRAM overflow.
- Humanizer output is produced via exact byte-level template, passing SHA tests.

## What to avoid

- Never execute Hemmingway and Humanizer concurrently on local hardware.
- Never use ChatML wrappers on `jialinyyzz/humanizer` (it is a raw-completion model).
- Never allow any model to round numbers or modify dates.

## Tools

- `docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md`
- `references/humanizer-byte-protocol.md`

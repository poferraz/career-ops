# Context — @career-ops/web

Last updated: 2026-10-10

## What this workspace is for

This workspace builds the desktop-grade Web Application (Career Studio) featuring the Three-Act Pipeline, 70/30 Studio Canvas, side-by-side diffing, and real-time Anti-Slop radar visualization.

## The process

1. **Act 01 (Intake & Lock)**: Candidate uploads resume (PDF/DOCX/MD) and inputs target JD or career path. AST parser extracts and locks invariant entities.
2. **Act 02 (Studio Canvas)**:
   - 70% Left Stage: Side-by-side Dual-Card Diff (`01 Draft` with red strikethroughs vs `02 Rewrite` with lime-green `#d9f99d` inline highlight spans) and `✓ FACTS KEPT` capsule bar.
   - 30% Right Stage: Architectural scorecard with bold cobalt `42/50` score, 5-dimension radar, ATS keyword coverage matrix, and AI Risk gauge.
3. **Act 03 (Audit & Export)**: ATS single-column certified PDF preview and 1-click download bundle.

## Files in here

```text
packages/web/
├── src/
│   ├── components/
│   │   ├── layout/          # Top nav, status strip, act breadcrumbs
│   │   ├── intake/          # File dropzone, JD input, entity lock pills
│   │   ├── canvas/          # 70/30 diff stage, dual-card diff, facts-kept capsule
│   │   ├── audit/           # Scorecard badge, 5-dim radar, keyword matrix
│   │   └── export/          # PDF/DOCX preview and export modal
│   ├── hooks/               # useStreamingDiff, usePipeline, useOllamaProxy
│   ├── workers/             # diff.worker.ts (offloaded token diff computation)
│   ├── App.tsx
│   └── main.tsx
└── tests/
```

## What good looks like

- Strictly implements tokens from [`PRODUCT.md`](file:///Users/poferraz/Documents/Development/active/career-ops/PRODUCT.md) and [`DESIGN.md`](file:///Users/poferraz/Documents/Development/active/career-ops/DESIGN.md): Zinc-50 paper canvas, 3px solid cobalt `#1414b8` borders, 6px hard shadows.
- Text highlights MUST use pure inline styling: `background-color: #d9f99d; color: #09090b; padding: 1px 3px; border-radius: 3px; box-decoration-break: clone; -webkit-box-decoration-break: clone; display: inline;`.
- Identical left-justified layout (`text-left`) and vertical rhythm (`leading-7`) across Draft and Rewrite columns.
- Runs at 60fps with virtualized rendering on long multi-page resumes.

## What to avoid

- Never use `display: inline-block` on diff highlight spans (breaks word wrapping and creates jagged lines).
- Never introduce generic purples, blurred dropshadows, or soft rounded pill aesthetics.
- Never make direct browser requests to Ollama without going through the local Vite proxy (avoids CORS issues).

## Tools

- [`PRODUCT.md`](file:///Users/poferraz/Documents/Development/active/career-ops/PRODUCT.md)
- [`DESIGN.md`](file:///Users/poferraz/Documents/Development/active/career-ops/DESIGN.md)
- [`.impeccable/design.json`](file:///Users/poferraz/Documents/Development/active/career-ops/.impeccable/design.json)
- [`docs/assets/studio-prototype.html`](file:///Users/poferraz/Documents/Development/active/career-ops/docs/assets/studio-prototype.html)

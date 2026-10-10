# Context — @career-ops/audit

Last updated: 2026-10-10

## What this workspace is for

This workspace builds the deterministic Anti-Slop scoring engine, the banned corporate phrase scanner, and the ATS document layout validator.

## The process

1. **ATS Layout & Parseability Verification**: Run single-column checks, verify machine text extraction, validate date formatting, and normalize section headings.
2. **5-Dimension Anti-Slop Scoring**:
   - **Directness (10 pts)**: Penalize passive voice and hedging phrases.
   - **Rhythm (10 pts)**: Measure sentence length variance (burstiness); penalize monotonic $18\text{--}22$ word clumping.
   - **Trust (10 pts)**: Verify 100% invariant preservation; fail if any metric/date was altered.
   - **Authenticity (10 pts)**: Scan against the 30+ banned phrase dictionary using fuzzy matching.
   - **Density (10 pts)**: Verify Action Verb + Context + Quantified Outcome formula.
3. **Decision Gate Evaluation**:
   - Score $\ge 42/50$: Pass / Green.
   - Score $35\text{--}41$: Warning / Re-Humanize.
   - Score $<35$: Reject / Re-run Stage 1.
4. **Report Generation**: Output structured JSON or terminal diagnostic table.

## Files in here

```text
packages/audit/
├── src/
│   ├── rubric/              # 5-dimension mathematical scoring algorithms
│   ├── banned-phrases/      # 30+ corporate buzzword list with fuzzy matcher
│   ├── ats-validator/       # Single-column and layout parser sanity checks
│   ├── gate/                # Pass/Warning/Fail decision evaluation
│   └── index.ts             # Audit module exports
└── tests/
```

## What good looks like

- Audit calculations are $100\%$ deterministic and reproducible (same input yields identical score).
- Runs in $<5\text{ms}$ per document without LLM calls.
- Clear error messages explain precisely which phrases or metrics triggered a deduction.

## What to avoid

- Never call an LLM to score text; all scoring in this package must be deterministic math and regex.
- Never use AI detector APIs (GPTZero, Turnitin) as scoring metrics.
- Never allow an application to pass if a single metric or date is missing.

## Tools

- `references/anti-slop.md`
- `docs/trust-tiers.md`

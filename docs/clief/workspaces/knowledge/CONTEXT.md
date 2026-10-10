# Context — @career-ops/knowledge

Last updated: 2026-10-10

## What this workspace is for

This workspace builds and maintains the continuous research ingestion harness that grounds internal agents in verified recruitment practices, ATS technical specifications, LinkedIn algorithm updates, and labor market trends.

## The process

1. **Connector Execution**: Fetch incoming articles, whitepapers, release notes, and reports via automated feed connectors.
2. **T1–T4 Trust Classification**: Run deterministic classifier against domain and publication metadata:
   - **T1 (Peer-Reviewed / Gov)**: BLS, academic labor studies, NBER. Weight: `1.0`.
   - **T2 (Authoritative Industry)**: ATS engineering release notes (Workday, Greenhouse, Ashby), LinkedIn Engineering reports. Weight: `0.85`.
   - **T3 (Reputable Practitioners)**: Tier-1 agency recruiters, verified hiring managers. Weight: `0.65`.
   - **T4 (Unverified / Social)**: Discarded or flagged as low-trust.
3. **Fact Extraction & Indexing**: Extract actionable heuristics, semantic keywords, and guidelines; generate embeddings; store in SQLite/JSON vector store.
4. **Agent Query Interface**: Provide clean query methods (`queryATSGuidelines()`, `queryLinkedInAlgorithms()`, `queryMarketSkills()`) for internal agents.

## Files in here

```text
packages/knowledge/
├── src/
│   ├── connectors/          # Connectors for BLS, ArXiv, ATS release notes, RSS feeds
│   ├── classifier/          # Deterministic T1–T4 trust scoring engine
│   ├── extractors/          # Semantic heuristic and keyword extractors
│   ├── store/               # SQLite / JSON vector store and query engine
│   └── index.ts             # Public module API
└── tests/
```

## What good looks like

- Connectors parse sources reliably without network deadlocks.
- T1–T4 scoring correctly tags sources and rejects spam/unverified social posts.
- Query API returns ranked, cited guidance in $<50\text{ms}$.
- Zero reliance on untracked training data assumptions.

## What to avoid

- Never ingest T4 social media influencer posts as authoritative guidance.
- Never hardcode dynamic ATS advice in static files without source timestamps and trust tier tags.
- Never block application startup on external network calls; ingestion is asynchronous and cached locally.

## Tools

- `docs/trust-tiers.md`
- `docs/research-methodology.md`

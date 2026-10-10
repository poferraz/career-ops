# Context — @career-ops/cli

Last updated: 2026-10-10

## What this workspace is for

This workspace builds the headless terminal command center (`doctor`, `ingest`, `optimize`, `audit`, `studio`), providing high-leverage workflows for engineers, CI/CD pipelines, and pre-submission git hooks.

## The process

1. **Argument Parsing & Validation**: Use `commander` to parse CLI flags and arguments.
2. **Pre-flight Environmental Check**: Probed by `career-ops doctor` to verify Ollama status, pulled models, and system memory.
3. **Execution Routing**: Route commands directly to `@career-ops/core`, `@career-ops/audit`, or `@career-ops/knowledge`.
4. **Output Calibration**:
   - Interactive TTY: Stream live terminal diffs with colored additions/deletions and spinners.
   - Non-TTY / Piped: Automatically detect `!process.stdout.isTTY` and suppress formatting, emitting pure JSON or raw text.
5. **Exit Code Management**: Return code `0` on successful optimization/audit ($\ge 42$), `1` on failure or invariant violation.

## Files in here

```text
packages/cli/
├── src/
│   ├── commands/
│   │   ├── doctor.ts        # Runtime health & model pre-flight check
│   │   ├── ingest.ts        # Trigger research ingestion harness
│   │   ├── optimize.ts      # End-to-end resume/cover letter optimization
│   │   ├── audit.ts         # Non-destructive quality gate for CI
│   │   └── studio.ts        # Launch Vite Web Studio in browser
│   ├── formatters/          # Terminal color diffs, tables, and JSON serializers
│   └── index.ts             # CLI entrypoint binary
└── tests/
```

## What good looks like

- `career-ops doctor` detects and diagnoses local Ollama model states in $<500\text{ms}$.
- `career-ops audit` integrates seamlessly into Git pre-commit hooks and GitHub Actions.
- Clean cancellation handling on `SIGINT` (no hanging processes or orphaned streams).
- Zero secret leakage in configuration files.

## What to avoid

- Never emit ANSI escape codes or spinners when stdout is piped to a file or another command.
- Never hardcode API keys or secrets in `.career-opsrc.json`.
- Never exit code `0` if an invariant was violated.

## Tools

- `docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md`

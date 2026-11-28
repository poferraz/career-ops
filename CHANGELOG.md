<!-- markdownlint-configure-file { "MD024": { "siblings_only": true } } -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `.github/ISSUE_TEMPLATE/config.yml` routing blank issues to private security reporting, installation docs, and support.
- Expanded `CONTRIBUTING.md` quality bar, `SKILL.md` routing-table registration requirement, and local verification commands.
- Pre-issue troubleshooting and PII-redaction checklist in `SUPPORT.md`.
- Keep a Changelog v1.1.0 version comparison links and structured sections.

### Changed

- Rebuilt `README.md` with the centered hero banner, `flat-square` badges, generic-AI vs. Career Ops comparison table, 15-second install commands, copyable starter prompts with a smoke test, full file inventory, and proactive evidence-tier framing.
- Standardized issue and pull request templates with clean headings, all 7+ supported AI hosts, explicit advice-vs-tooling proposal guidance, and mandatory PII-redaction checks.
- Updated `CODE_OF_CONDUCT.md` naming (`Career Ops`) and clarified private maintainer reporting channels.
- Switched default sessions to conversation-only operation; reading or writing a saved profile now requires explicit permission for a user-selected private file outside Git repositories and shared folders.
- Included the complete intake instructions and all ten public reference guides across all multi-agent exports in `scripts/convert.sh` (see [docs/integrations.md](docs/integrations.md) before updating an existing project).
- Clarified evidence notes across reference guides so historical figures without primary-source verification are checked or omitted before quoting.

### Security

- Strengthened prompt-injection guardrails so pasted job descriptions and web pages are treated as untrusted data rather than instructions.
- Reinforced PII-free web research rules and private reporting guidance in `SECURITY.md` and community templates.

### Fixed

- Replaced broken relative links in `.github/PULL_REQUEST_TEMPLATE.md` (`references/anti-slop.md`) and `.github/ISSUE_TEMPLATE/research_update.md` (`docs/trust-tiers.md`) with absolute repository URLs.

## [1.0.2] - 2026-03-22

### Changed

- **README**: Full rewrite to match companion website brand — brutalist design system, Architect Blue (`#1414b8`), `## ──` section headers, shields.io `for-the-badge` badges, and 7-section structure mirroring the site (Hero, Four-Stage Engine, Install, Anti-Slop Gate, Reference Modules, Research-Backed, Contribute).
- **Brand images**: Replaced dark neon assets with optimized PNG images matching the website's blueprint grid aesthetic. `social-preview.png` is exactly 1280×640 (GitHub OG spec). `readme-hero.png` displays the four-stage engine and terminal install in brutalist style. Both under 250KB.
- **CONTRIBUTING.md**: Refreshed tone to match brand voice; added `## QUALITY BAR` section enforcing trust tier and anti-slop standards for contributors.
- **SECURITY.md**: Added brand badge, version support table, explicit in/out-of-scope definitions, and uppercase section headers.
- **PR template**: Renamed quality checklist to `## QUALITY GATE`; added docs-update checkbox.
- **Issue templates**: Direct-voice rewrites — bug report adds anti-slop score field; feature request requires evidence section; research update enforces T4 rejection notice.

## [1.0.1] - 2026-03-22

### Fixed

- **Critical**: Escaped the git wildcard in `SECURITY.md` remediation command to prevent accidental deletion of tracked session templates.
- **High**: Refactored `scripts/convert.sh` to use streaming `cat`/`printf` instead of `echo`, preventing potential Markdown text corruption during build.
- **Medium**: Enabled `nullglob` in bash script to avoid crashes if reference directories are empty.
- Corrected badge URL in `README.md` for consistent rendering.

## [1.0.0] - 2026-03-22

### Added

- SKILL.md orchestrator with interviewer mode, MI framework, 5-phase intake, routing table, anti-slop quality gate, research pre-flight, and user profile persistence
- 10 reference modules: resume, cover-letter, linkedin, interview, outreach, job-search, career-strategy, market-data, anti-slop, research-scout
- Session template for user profile persistence across conversations
- Trust tier documentation (T1-T4 evidence classification)
- Research methodology documentation with sample sizes for all key claims
- Integrations guide for web search and LinkedIn MCP
- GitHub issue templates (bug report, feature request, research update) and PR template
- Multi-agent convert script for Codex, Gemini CLI, Cursor, Antigravity, Windsurf, OpenCode
- README with quick-start install, research methodology summary, and compatibility table
- CONTRIBUTING.md, SECURITY.md
- MIT license

### Research Base

- 5 rounds of goal-blind deep research via Gemini Deep Research
- Cross-referenced and contradiction-checked across all rounds
- Key studies: 7,712-resume callback experiment, 4,812 LinkedIn eye-tracking reviews, 38,000+ employee meta-analysis, career coaching RCT (95% vs 83%), 16,000+ connection request analysis
- The original audit reported checking roughly 230 data points. The guides do not include independent source verification for every figure.

[Unreleased]: https://github.com/poferraz/career-ops/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/poferraz/career-ops/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/poferraz/career-ops/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/poferraz/career-ops/releases/tag/v1.0.0

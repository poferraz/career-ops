# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Full audit passed: 0 hallucinations across ~230 data points

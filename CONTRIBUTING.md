# Contributing to Career Ops

Career Ops is a plain-Markdown, evidence-tiered career coaching skill. Contributions that sharpen its research rigor, multi-agent portability, or anti-slop editing standards are welcome.

## Ways to contribute

- **Verify or upgrade citations:** Replace unverified historical notes with primary **T1–T3** studies, exact publication dates, sample details, and direct source links using the [Research Update template](.github/ISSUE_TEMPLATE/research_update.md).
- **Test host exports:** Run Career Ops in Claude Code, Codex, Gemini CLI, Cursor, Antigravity, Windsurf, or OpenCode and report export or routing regressions via the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md).
- **Improve `scripts/convert.sh` and tests:** Strengthen cross-platform export packaging, edge-case coverage, and automated checks in `scripts/test_convert.py`.
- **Add anonymized anti-slop edge cases:** Propose fictional before-and-after examples or new banned-pattern catches for [`references/anti-slop.md`](references/anti-slop.md) via the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).

## Quality bar

Every pull request is evaluated against five project rules:

1. **T1–T3 evidence only:** Any advice claim or statistic must meet **T1**, **T2**, or **T3** standards defined in [Evidence tiers](docs/trust-tiers.md) and follow [Research methodology](docs/research-methodology.md). Omit figures whose original source cannot be verified.
2. **35/50 anti-slop floor:** Sample career outputs and instructional examples must score at least **35/50** on the rubric in [`references/anti-slop.md`](references/anti-slop.md) (Directness, Rhythm, Trust, Authenticity, and Density) and contain zero banned filler phrases.
3. **800-line cap per reference file:** Keep each file under `references/` focused and under 800 lines so AI hosts load only what is needed without blowing context budgets.
4. **Zero paid APIs or external databases:** Career Ops must remain runnable locally from plain Markdown with no required Career Ops account, paid third-party API, mandatory MCP server, or database.
5. **Register new modules in `SKILL.md`:** Any new `references/<module>.md` file **must** be registered in the `## Routing Table` section of [`SKILL.md`](SKILL.md) so `scripts/convert.sh` includes it in multi-agent exports.

## Local verification

Before opening a pull request, run the test suite, rebuild exports, and verify Markdown and link checks locally:

```sh
python3 scripts/test_convert.py -v
./scripts/convert.sh all
npm ci --prefix scripts/checks --ignore-scripts
npm --prefix scripts/checks run lint:md
npm --prefix scripts/checks run lint:links
```

## Privacy in issues and pull requests

Never paste real resumes, personal profiles, email addresses, phone numbers, or confidential employer information into public issues, pull requests, screenshots, or test fixtures. Always substitute fictional details.

- Follow our community standards in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Report security vulnerabilities, prompt-injection concerns, or accidental personal data exposure privately as described in [SECURITY.md](SECURITY.md).

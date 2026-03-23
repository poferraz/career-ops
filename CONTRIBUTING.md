<div align="center">

![Contributing](https://img.shields.io/badge/CONTRIBUTING-GUIDE-1414b8?style=for-the-badge)

</div>

# CONTRIBUTING TO CAREER-OPS

career-ops runs on evidence, not vibes. Every contribution must clear the same anti-slop bar as the skill itself. If you're submitting research, it needs a source. If you're submitting a feature, it needs a rationale.

## QUALITY BAR

All contributions must meet:

- **Trust tier tagged** — Every claim uses T1–T3 evidence. No invented statistics.
- **No slop** — Writing must score 35/50 minimum on the anti-slop rubric (see [`anti-slop.md`](references/anti-slop.md))
- **No T4 submissions** — Claims contradicted by evidence or of unknown origin will not be merged

---

## RESEARCH UPDATES

The knowledge base grows through new evidence. To submit a research update:

- Open a [Research Update issue](.github/ISSUE_TEMPLATE/research_update.md) with source metadata and trust tier
- Include raw data or direct quotes — paraphrasing introduces slop
- Cross-reference against existing claims in the relevant reference file

**Target files:** Any file in [`references/`](references/)

---

## REFERENCE IMPROVEMENTS

Found a framing that's more accurate, direct, or better supported?

- Open a PR with the specific change and the evidence behind it
- Do not rewrite sections wholesale — make surgical, justified edits
- Update the trust tier tag if the evidence level changes

---

## NEW FEATURES

Before building anything new:

- Open a [Feature Request issue](.github/ISSUE_TEMPLATE/feature_request.md) describing the problem, not the solution
- Wait for discussion — new modules require significant research investment
- The skill must remain zero-dependency: no paid APIs, no mandatory MCP servers

---

## BUG REPORTS

If the skill gives advice that contradicts its own reference data, or routes incorrectly:

- Open a [Bug Report issue](.github/ISSUE_TEMPLATE/bug_report.md)
- Include the exact prompt, the output received, and what the correct behavior should be
- Anti-slop gate failures (output scored below 35) are treated as bugs

---

## CONDUCT

Be direct. Disagree on evidence, not personality. This is a career tools repo for workers — keep it useful and keep it honest.

---

<div align="center">

[![Open an Issue](https://img.shields.io/badge/OPEN_AN_ISSUE-1414b8?style=for-the-badge&logo=github&logoColor=white)](https://github.com/poferraz/career-ops/issues/new/choose)

</div>

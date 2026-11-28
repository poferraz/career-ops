<div align="center">

![Security Policy](https://img.shields.io/badge/SECURITY-POLICY-1414b8?style=for-the-badge)

</div>

# SECURITY POLICY

## SUPPORTED VERSIONS

| Version | Supported |
| --- | --- |
| 1.0.x | ✓ Active |
| < 1.0 | ✗ Unsupported |

---

## WHAT COUNTS

career-ops is a knowledge base skill — it has no servers, no authentication, and no databases. Security scope is narrow but real:

**In scope:**

- Fabricated or manipulated research data in reference files
- Shell injection, symlink, path-traversal, or file-handling vulnerabilities in `scripts/convert.sh`
- CI/CD workflow security issues (such as unsafe triggers, excessive permissions, or untrusted input handling)
- Supply-chain vulnerabilities in `scripts/checks` dependencies or lockfile integrity
- Reading or saving career data without the user's permission, or saving a profile in a Git repository or shared folder
- Prompt injection patterns embedded in reference content, or missing prompt-injection guardrails for untrusted external content

**Out of scope:**

- General career advice disagreements
- Platform-specific behavior (Claude Code, Cursor, etc.) outside this repo
- Third-party MCP server vulnerabilities

---

## REPORTING A VULNERABILITY

Do **not** open a public issue for security vulnerabilities.

**Report privately via GitHub Security Advisories:**
[github.com/poferraz/career-ops/security/advisories/new](https://github.com/poferraz/career-ops/security/advisories/new)

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

**Response time:** Acknowledgment within 72 hours. Fix or mitigation plan within 14 days for confirmed issues.

**Coordinated disclosure and safe harbor:** We follow a 90-day coordinated disclosure window from initial acknowledgment before public details are released, unless an earlier joint release is agreed upon. Good-faith security research conducted in accordance with this policy—without accessing other users' personal data, disrupting services, or degrading repository availability—is welcomed and will not be met with legal action from the maintainers.

---

## SESSION DATA PROTECTION

Career Ops uses the current conversation by default. The AI host and its model provider may process or retain conversation and file contents according to the user's settings. Saving a profile requires an explicit request identifying a private file outside Git repositories and shared folders and the details to keep.

Older versions used `session/user-profile.md`. The current skill leaves that file alone. This repository's `.gitignore` blocks untracked files under `session/*` (except the blank template), local notes (`references/personal-notes*.md`, `references/*.local.md`), generated `exports/` and `dist/` artifacts, and common personal document and log formats (`*.pdf`, `*.docx`, `*.doc`, `*.rtf`, `*.odt`, `*.log`). However, `.gitignore` cannot protect files that were already staged, committed, or pushed. [Optional blank profile template](session/user-profile-template.md)

**If you accidentally pushed personal data to your own fork:**

1. Remove the file from your local Git history using [`git filter-repo`](https://github.com/newren/git-filter-repo) (for example, `git filter-repo --invert-paths --path <path/to/file>`).
2. Force-push all rewritten branches and tags (`git push --force --all` and `git push --force --tags`) and close or delete any pull requests that referenced the exposed commit.
3. Contact GitHub Support to request a purge of cached commits and views, and rotate any credentials or sensitive identifiers that were exposed.
4. If personal data was ever submitted to this upstream repository, report it through the private advisory channel above without pasting the personal data into the report.

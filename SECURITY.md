<div align="center">

![Security Policy](https://img.shields.io/badge/SECURITY-POLICY-1414b8?style=for-the-badge)

</div>

# SECURITY POLICY

## SUPPORTED VERSIONS

| Version | Supported |
| --- | --- |
| 1.0.x | ✓ Active |

---

## WHAT COUNTS

career-ops is a knowledge base skill — it has no servers, no authentication, and no databases. Security scope is narrow but real:

**In scope:**

- Fabricated or manipulated research data in reference files
- Shell injection vulnerabilities in `scripts/convert.sh`
- Reading or saving career data without the user's permission, or saving a profile in a Git repository or shared folder
- Prompt injection patterns embedded in reference content

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

---

## SESSION DATA PROTECTION

Career Ops uses the current conversation by default. The AI host and its model provider may process or retain conversation and file contents according to the user's settings. Saving a profile requires an explicit request identifying a private file outside Git repositories and shared folders and the details to keep.

Older versions used `session/user-profile.md`. The current skill leaves that file alone. The ignore rule in this checkout can protect an untracked legacy file here. An already-tracked file and past commits can remain visible. If a real profile was published, use the private reporting channel above and avoid copying the profile into the report. [Optional blank profile template](session/user-profile-template.md)

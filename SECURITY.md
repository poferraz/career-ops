<div align="center">

![Security Policy](https://img.shields.io/badge/SECURITY-POLICY-1414b8?style=for-the-badge)

</div>

# SECURITY POLICY

## SUPPORTED VERSIONS

| Version | Supported |
|---|---|
| 1.0.x | ✓ Active |

---

## WHAT COUNTS

career-ops is a knowledge base skill — it has no servers, no authentication, and no databases. Security scope is narrow but real:

**In scope:**
- Fabricated or manipulated research data in reference files
- Shell injection vulnerabilities in `scripts/convert.sh`
- Session data leakage (user profile written outside `session/` directory)
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

The `session/user-profile.md` file stores personal career data. It is gitignored by default.

**Verify it stays gitignored:**
```bash
git check-ignore -v session/user-profile.md
```

If this file has been committed accidentally, remove it from history:
```bash
git filter-repo --path 'session/user-profile.md' --invert-paths
```

Never commit personal session data. The template (`session/user-profile-template.md`) is safe to commit — it contains no personal information.

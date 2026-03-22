# Security Policy

## Scope

career-ops is a prompt-based skill — it contains no executable server code, no API endpoints, and no authentication flows. The security surface is limited to:

1. **Data integrity** — the knowledge base must not contain fabricated statistics
2. **User data** — session profiles (`session/user-profile.md`) contain personal career information
3. **convert.sh** — the only executable script, which reads local files and writes to `dist/`

## Reporting a Vulnerability

If you discover a security issue:

1. **Do not open a public issue**
2. Email the maintainer directly (see GitHub profile for contact)
3. Include: what the vulnerability is, how to reproduce it, and potential impact
4. You will receive a response within 72 hours

## What Counts as a Security Issue

- `convert.sh` executing unintended commands or accessing files outside the project directory
- Session profile data being committed to git (the `.gitignore` should prevent this)
- Prompt injection patterns in reference files that could cause the host agent to take unintended actions
- Research data that has been tampered with to mislead users

## What Does Not Count

- The skill producing generic or unhelpful advice (that's a bug, not a security issue)
- Disagreement with research methodology or trust tier assignments (open a research update issue)
- Issues with third-party tools referenced in `docs/integrations.md`

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Session Data Protection

The `.gitignore` excludes `session/*.md` to prevent accidental commits of user profile data. If you fork this repo for personal use, verify that your session files are not being tracked:

```bash
git status --short session/
```

If any session files appear as tracked, remove them from git tracking:

```bash
git rm --cached session/*.md
```

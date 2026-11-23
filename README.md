# Career Ops

Career Ops is a Markdown skill for job seekers. It interviews you about work you have actually done, then helps turn those details into a résumé bullet, a cover letter, an interview answer or a job-search plan. It runs in the AI tool you choose.

## Try it

For Claude Code, install the skill in your personal skills directory.

```sh
git clone https://github.com/poferraz/career-ops.git ~/.claude/skills/career-ops
```

Start a new session and ask “Use Career Ops to help me describe how I trained two new colleagues. Ask what changed before drafting a résumé bullet.” The skill asks for the details you can support. When a result cannot be quantified, describe what changed in words.

For Codex, Gemini CLI, Cursor, Antigravity, Windsurf and OpenCode, the converter writes the files for your chosen tool. [Installation and integrations](docs/integrations.md)

## What happens to your information

Career Ops uses the current conversation by default. To reuse a profile, select a private file outside Git repositories and shared folders and give permission to read it. To save details, choose the file and the specific fields you want written. The repository contains a blank example. [Profile template](session/user-profile-template.md)

Your AI host and its model provider may process the messages and files you supply. Its own chat history and retention settings apply. If you enable web research, the search provider receives the query. The skill uses public company, role or market details for searches. Keep applicant names, contact details and private work history out of search queries and public bug reports.

## My role and what changed

I maintain Career Ops and use AI tools to help develop it. The design starts with questions about someone's work before drafting application materials. The original research process used Gemini Deep Research to collect leads. The project later added a fallback for market figures the skill could not verify. The skill now says when the evidence is missing. Even a figure in a reference file needs a check against the original source before it is quoted. [Research method](docs/research-methodology.md) · [Change that added the fallback](https://github.com/poferraz/career-ops/commit/acaad1a3de1fd0a86e3ee6f5f6a1ded11acc69d3)

## Repository guide

| File or directory | What it contains |
| --- | --- |
| [Skill](SKILL.md) | Intake questions, topic selection, privacy instructions and writing checks |
| [References](references/) | Ten guides covering application materials, interviews, outreach, strategy, market research and writing quality |
| [Evidence tiers](docs/trust-tiers.md) | How to assess the source behind a claim |
| [Converter](scripts/convert.sh) | Host-specific exports for a separate project |

[Contribute](CONTRIBUTING.md) · [Get help](SUPPORT.md) · [Report a security concern](SECURITY.md) · [Changelog](CHANGELOG.md) · [MIT license](LICENSE)

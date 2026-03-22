# Integrations Guide

career-ops works fully without any external dependencies. No API keys, MCP servers, or paid tools are required. Everything below is optional — these integrations enhance the skill when available.

## Web Search

**What it enables:** Research pre-flight — the skill searches for current information about target companies before generating tailored materials (cover letters, interview prep, outreach messages).

**Without it:** The skill asks the user what they know about the company and works with what's provided. All core functionality remains intact.

**How to check:** The skill detects web search availability at runtime. No configuration needed.

## LinkedIn MCP Server

**What it enables:** Direct access to LinkedIn profile data, job search results, and company information.

**Recommended:** [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server)
- Profile scraping and analysis
- Job search within LinkedIn
- Company data retrieval
- Requires manual LinkedIn login and session management

**Alternative options:**

| Tool | Type | Access |
|------|------|--------|
| Composio Tool Router | MCP-based, 500+ app integrations | API key + OAuth |
| Official LinkedIn API | Limited to own-profile data and content sharing | App approval |

**Without it:** The skill generates all LinkedIn optimization advice from its reference data. Users paste their current profile text for analysis instead of the skill pulling it directly.

**Privacy note:** LinkedIn scraping tools operate in a ToS gray area. The skill never requires them — they're a convenience, not a dependency.

## Supporting Skills

career-ops pairs well with other Claude Code skills for specific workflows:

### Anti-Slop / De-Slop Skills
If you use a general-purpose anti-slop skill (like `hardikpandya/stop-slop`), career-ops has its own built-in quality gate adapted specifically for career materials. The two won't conflict — career-ops applies its check internally before delivering output.

### Research Skills
Skills that provide web search, Exa search, or other research capabilities enhance the research pre-flight phase. career-ops will use whatever search capability is available.

## What Will Never Be Required

These are design commitments, not current limitations:

- **No paid API keys** — the skill must work for job seekers who are often financially constrained
- **No mandatory MCP servers** — MCP adds setup friction that kills adoption
- **No external databases** — all reference data lives in the repo
- **No cloud services** — everything runs locally in your agent's context

The skill is built for workers, not for people selling to workers. The barrier to entry is one install command.

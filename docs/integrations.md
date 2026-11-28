# Installation and integrations

Career Ops supplies Markdown instructions and reference guides that your AI host runs locally or in chat. It requires no Career Ops account, API key, or database. Your AI host's own pricing, data processing, and retention settings apply.

## Supported hosts at a glance

| Host | Install method | Destination path |
| --- | --- | --- |
| **Claude Code** | Direct `git clone` | `~/.claude/skills/career-ops` (user-global) or `.claude/skills/career-ops` (workspace) |
| **Codex** | `bash scripts/convert.sh codex` | Copy `AGENTS.md` + `career-ops/` into a dedicated workspace root |
| **Gemini CLI** | `bash scripts/convert.sh gemini` | Copy `GEMINI.md` + `career-ops/` into a dedicated workspace root |
| **Cursor** | `bash scripts/convert.sh cursor` | Copy `career-ops/` into `.cursor/skills/` (workspace) or `~/.cursor/skills/` (user-global) |
| **Antigravity** | `bash scripts/convert.sh antigravity` | Copy `career-ops/` into `.agents/skills/` (workspace) or `~/.agents/skills/` (user-global) |
| **Windsurf** | `bash scripts/convert.sh windsurf` | Copy `career-ops/` into `.windsurf/skills/` (workspace) or `~/.windsurf/skills/` (user-global) |
| **OpenCode** | `bash scripts/convert.sh opencode` | Copy `AGENTS.md` + `career-ops/` into a dedicated workspace root |
| **OpenClaw / other Agent Skills hosts** | Copy repo or skill folder | Copy `SKILL.md` + `references/` into the host's Agent Skills directory |
| **Web-only chat (Claude.ai, ChatGPT, Gemini web)** | Manual upload or paste | Upload `SKILL.md` plus 1-2 needed `references/*.md` files into a Project, Custom GPT, or Gem |

## Generate host exports

From a shell with Git and Bash, clone the repository and generate either one host export or all of them:

```sh
git clone https://github.com/poferraz/career-ops.git
cd career-ops
bash scripts/convert.sh codex
```

To build exports for every supported host at once:

```sh
bash scripts/convert.sh all
```

The converter writes clean bundles to `dist/<host>/` containing only the skill instructions and the 10 reference modules named in [`SKILL.md`](../SKILL.md). Inspect `dist/<host>/` before copying files. See [`scripts/convert.sh`](../scripts/convert.sh) for export details.

## Option A: Dedicated private non-Git workspace (recommended)

Use a private folder outside your code repositories (such as `~/career-workspace`) so career notes stay out of Git and instruction files like `AGENTS.md` or `GEMINI.md` do not consume context tokens in unrelated software projects.

### Codex or OpenCode (`AGENTS.md`)

```sh
mkdir -p ~/career-workspace
cp dist/codex/AGENTS.md ~/career-workspace/
cp -r dist/codex/career-ops ~/career-workspace/
```

### Gemini CLI (`GEMINI.md`)

```sh
mkdir -p ~/career-workspace
cp dist/gemini/GEMINI.md ~/career-workspace/
cp -r dist/gemini/career-ops ~/career-workspace/
```

### Cursor, Antigravity, or Windsurf (workspace skill folder)

```sh
mkdir -p ~/career-workspace/.cursor/skills
cp -r dist/cursor/career-ops ~/career-workspace/.cursor/skills/
```

Replace `cursor` and `.cursor/skills` with `antigravity` / `.agents/skills` or `windsurf` / `.windsurf/skills` as needed. If your target workspace already has an `AGENTS.md` or `GEMINI.md`, review and merge instructions instead of overwriting.

## Option B: User-global skill directories

Hosts that support user-level Agent Skills can load Career Ops across sessions without per-workspace copies:

```sh
# Claude Code (direct clone)
git clone https://github.com/poferraz/career-ops.git ~/.claude/skills/career-ops

# Cursor, Antigravity, or Windsurf (after running scripts/convert.sh)
mkdir -p ~/.cursor/skills && cp -r dist/cursor/career-ops ~/.cursor/skills/
mkdir -p ~/.agents/skills && cp -r dist/antigravity/career-ops ~/.agents/skills/
mkdir -p ~/.windsurf/skills && cp -r dist/windsurf/career-ops ~/.windsurf/skills/
```

Check your host's current documentation if it uses a different user-level skills directory.

## Windows and no-Bash manual setup

If you do not have Git Bash or WSL available, download the repository ZIP from GitHub and set up your host manually:

- **Skill-directory hosts (Claude Code, Cursor, Antigravity, Windsurf, OpenClaw):** Create a `career-ops/` folder inside the host's skills directory and copy [`SKILL.md`](../SKILL.md) and the `references/` folder into it.
- **Root-instruction hosts (Codex, OpenCode, Gemini CLI):** Create a private `career-workspace/` folder, copy `references/` into `career-workspace/career-ops/references/`, copy `SKILL.md` to `career-workspace/AGENTS.md` (or `GEMINI.md`), remove the top `---` YAML frontmatter block, and replace `references/` with `career-ops/references/`.
- **Web-only chat (Claude.ai, ChatGPT, Gemini web):** Start a Project, Custom GPT, or Gem using [`SKILL.md`](../SKILL.md) as the instructions, and attach only the 1-2 `references/*.md` files relevant to your current task to keep context lean.

## Updating Career Ops

Pull the latest changes, regenerate your host export, and recopy the bundle:

```sh
cd /path/to/career-ops
git pull --ff-only
bash scripts/convert.sh all
```

For a direct Claude Code clone, run `git -C ~/.claude/skills/career-ops pull --ff-only`.

## Smoke test

Start a fresh session in your target workspace and send:

> Use Career Ops to help me describe how I trained two new colleagues. Ask what changed before drafting a resume bullet.

If the assistant asks concrete follow-up questions before drafting, Career Ops is active. If it immediately outputs a generic bullet, check your install path. See also the [Quick start](../README.md#try-it).

## Web research and career profiles

With web search enabled in your host, queries use only public company, role, location, or market details and are sent to your host's search provider. Keep names, contact details, quasi-identifiers, and private work history out of search queries. If search is unavailable or a URL is blocked, paste the job description directly into chat.

LinkedIn advice works from short excerpts you choose to share; Career Ops does not require a LinkedIn account integration. Conversation-only use is the default, and reading or writing a profile requires an explicit private file path outside Git repositories and shared folders. [Privacy and reporting](../SECURITY.md)

# Installation and integrations

Career Ops supplies Markdown instructions and reference guides. The AI host runs them. You can use the skill without a separate Career Ops account, API key or database. The host may have its own costs, processing and retention settings.

## Generate a host export

From a shell with Git and Bash, clone this repository and generate an export for one host.

```sh
git clone https://github.com/poferraz/career-ops.git
cd career-ops
bash scripts/convert.sh codex
```

Replace `codex` with your host from the table. The converter writes to `dist/<host>/` and prints the installation instructions. Inspect the output, then copy it into a dedicated project. If the project already has instructions under the same name, review how they should fit together before installing the export.

| Host argument | Files to install in the target project |
| --- | --- |
| `codex`, `opencode` | Copy `AGENTS.md` and its companion `career-ops/` directory into the project root. |
| `gemini` | Copy `GEMINI.md` and its companion `career-ops/` directory into the project root. |
| `cursor` | Copy the generated `career-ops/` skill directory into `.cursor/skills/`. |
| `antigravity` | Copy the generated `career-ops/` skill directory into `.agents/skills/`. |
| `windsurf` | Copy the generated `career-ops/` skill directory into `.windsurf/skills/`. |

The README gives the direct Claude Code install. Start a new session in the target project and ask to use Career Ops. [Quick start](../README.md#try-it)

## Web research and career profiles

With web search enabled in your host, use general role, industry or public company information. Searches are sent to the host's search service. If search is unavailable, the skill can work with a job description and details supplied in the conversation.

LinkedIn advice can use a short excerpt you choose to share. A separate LinkedIn account integration introduces its own access permissions and data handling. Career Ops does not need one.

Conversation-only use is the default. Reading or writing a profile requires an explicit choice of a private location and permission for that operation. [Privacy and reporting](../SECURITY.md)

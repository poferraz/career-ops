# Agent Operating Playbook (`AGENTS.md`)

> Distilled from *"How Claude Code's Lead Designer Builds with AI"* ([YouTube](https://www.youtube.com/watch/hKeDfupbA4U)) and adapted for the `career-ops` repository.

## Dual-Mode Intent Router (Read First)

Because AI coding assistants automatically load root `AGENTS.md`, determine which mode matches the user's request before taking action:

1. **Mode 1 — Candidate / Job-Seeker Mode (Using `career-ops` on a Resume, Cover Letter, LinkedIn, or Job Search)**
   - **Action**: Immediately load and follow [`SKILL.md`](SKILL.md) (Motivational Interviewing intake, 5-Phase Accomplishment Mining, and the 50-point Anti-Slop Quality Gate) or run the CLI (`npx career-ops optimize`, `npx career-ops studio`, `npx career-ops audit`).
   - Do **not** apply repository git-worktree or PR workflows to a job seeker's career coaching session.
2. **Mode 2 — Repository Engineering & Design Mode (Building, Designing, or Auditing `career-ops`)**
   - **Action**: Follow [`CLIEF.md`](CLIEF.md), [`docs/clief/INDEX.md`](docs/clief/INDEX.md), [`DESIGN.md`](DESIGN.md), and Sections 1–7 of this playbook.
   - **Package Disambiguation**: Root `AGENTS.md` governs AI coding/design agents modifying this repository. Runtime product personas (Resume Tailor, Cover Letter Architect, LinkedIn Strategist, Research Scout) live in [`packages/agents/`](docs/clief/workspaces/agents/CONTEXT.md) (`@career-ops/agents`).

---

## 1. Core Operating Tenets

### 1.1 Human-in-the-Loop for Craft & Taste

LLMs excel at implementation, exploration, and verification, but **they do not yet possess reliable design taste**.

- Automate code generation, option exploration, research, and CI mechanics.
- Keep human judgment strictly in the loop for visual craft, UX ergonomics, and product decisions—especially when enforcing the Neo-Brutalist architectural system in [`DESIGN.md`](DESIGN.md).

### 1.2 Automate Beyond Code (Multi-Horizon Automation)

If you only use agents to write application code, you are under-utilizing them. Delegate the surrounding operational work:

- Synthesizing context across Slack, Google Docs, meeting transcripts, analytics (BigQuery), and online prior art.
- Generating interactive HTML prototypes to compare product directions before writing production code.
- Running live browser verification and recording visual proof (screenshots/GIFs).
- Managing the entire post-implementation PR lifecycle: code pruning, addressing review comments, fixing CI, and notifying reviewers.
- **Build for the Next Model ("Next-Next-Step" Horizon)**: Design automations not just for the first step, but for the next step, the step after that, and the end-to-end pipeline. Even if a final step (such as autonomous design critique) requires human filtering today, wire the complete workflow now so it is ready to flip on immediately when the next frontier model drops.

### 1.3 Velocity Requires Scalable Quality Systems (60/30/10 Gate)

> **"Just because everyone can ship doesn't mean everything should ship."**

As the cost of generating code drops toward zero, unreviewed changes can degrade product coherence. In `career-ops`, autonomous velocity is subordinate to the **60/30/10 Architecture** (60% traditional software, 30% deterministic rules, 10% AI inference):

- Deterministic invariant and scoring gates (see [`CLIEF.md`](CLIEF.md), `packages/audit/`, and `pnpm career-ops audit --ci`).
- Pre-PR simplification (`/simplify`) and automated code review (`/code-review`) passes.
- Scheduled adversarial design audits that flag UI changes shipped without design review.

---

## 2. Environment & Session Defaults

### 2.1 Always Isolate Parallel Work in Git Worktrees

When running multiple concurrent agent sessions ("multi-Clauding"), **never run parallel agents in the same working tree**—they will overwrite files, clash on branches, and corrupt state.

- Start every parallel task in an isolated git worktree with its own branch:

```bash
# Using Claude Code CLI native flag
claude --worktree

# Or using standard git worktrees
git worktree add ../career-ops-<feature-name> -b feat/<feature-name>
```

### 2.2 High-Capacity Context & Fast Mode

- **Max Context Window**: Default to the largest available context window (e.g., `Opus 1M context`) so you do not waste cognitive overhead micro-managing compaction during multi-step loops.
- **Fast Mode**: Keep fast mode enabled during interactive prototyping and iterative UI loops.

### 2.3 Classifier-Gated Auto Mode

- Operate in **Auto Mode** (classifier-gated permissions) rather than manually approving every safe file read or test run (`"yes, yes, yes"`).
- Rely on risk classification to pause only on destructive or external side-effect commands.

### 2.4 CLI & Desktop App Parity + Raw Prompting Ergonomics

- **Full CLI / Desktop Parity**: Every workflow in this playbook (`--worktree`, `/prototype`, `/loop`, Auto Mode, live Chrome verification) works identically in both the terminal CLI and the Desktop App.
- **Raw-Typing Velocity**: Do not waste time fixing minor typos when typing rapid interactive prompts; modern frontier models resolve prompt typos natively without losing intent.

---

## 3. Feature & Prototyping Workflow

### 3.1 Prompt-Generated Skills (Never Hand-Write Boilerplate Skills)

Do not write repetitive workflow prompts or skill files by hand. Prompt the agent to generate and refine reusable slash skills (e.g., `/prototype`, `/simplify`, `/commit-push-pr`).

### 3.2 Divergent Prototyping (`/prototype`)

When building a new feature or UI interaction without a rigid spec:

1. **Generate $N$ Distinct Options**: Use `/prototype [N] [feature]` (default $N = 5$) to generate 5 genuinely different architectural or UX implementations in a self-contained HTML preview under `docs/assets/` (see [`docs/assets/studio-prototype.html`](docs/assets/studio-prototype.html) as the canonical reference).
2. **Self-Iterate**: Have the agent preview and refine the variations before presenting them.
3. **Opinionated Agent Recommendation**: Always instruct the agent to **pick the best option first and explain why** before or alongside human selection.
4. **Contextual Research**:
   - **Open-Source / Greenfield**: Research online prior art and established interaction patterns.
   - **Production / Internal**: Search Slack discussions, Google Docs, meeting transcripts, and analytics (e.g., BigQuery) to ground the recommendation in real user and team context.

### 3.3 Autonomous Execution Loop (`/loop` with Deterministic Exit Gates)

Once an option is chosen (or delegated), use `/loop` ("loop until you're done") to cycle continuously through implementation, alignment, and verification until all deterministic gates pass:

1. Implement the selected option in the target package (`packages/web/`, `packages/core/`, etc.).
2. Align styles strictly with [`DESIGN.md`](DESIGN.md) tokens (`#1414b8` 3px borders, `6px` hard shadows, pure inline diff highlights).
3. Run the deterministic repository verification suite (`pnpm build && pnpm test && pnpm career-ops optimize --demo`).
4. Verify behavior live in a browser (Chrome integration), capture a screenshot/GIF, and open the pull request.

---

## 4. Visual Self-Verification & PR Standards

### 4.1 Live Browser Self-Verification

For any frontend change (`packages/web/` or `docs/assets/`), static typechecks are necessary but insufficient.

- Have the agent open a real browser session (e.g., Chrome integration) to interact with the rendered UI, test keyboard/mouse flows, and verify visual alignment.

### 4.2 Review PRs with Visual Proof, Not Raw Transcripts

Do not waste time reading thousands of lines of raw terminal transcripts to judge whether a feature works.

- **Every frontend PR must include a screenshot or recorded GIF sequence** demonstrating the working feature in the browser.
- Perform human review at the PR + visual recording level.

---

## 5. Parallel Hygiene & Micro-Polish Workflows

### 5.1 Session Multiplexing & Background Micro-Polish Queue (Cloud / Web Sessions)

Because deep `/loop` + live browser verification runs take several minutes, multiplex your sessions:

- **Primary Worktrees (Local)**: Run heavy multi-step feature implementations and browser verification loops across isolated local git worktrees.
- **Background Micro-Polish Queue (Web / Cloud)**: While primary worktrees are running, dispatch dozens of tiny UI, copy, and CSS token fixes asynchronously in web/cloud agent sessions as you spot rough edges in the app.
- **Fast-Track vs. Squashed PRs**:
  - **Zero-Logic CSS / Token Micro-Fixes**: Tiny, deterministic CSS or token tweaks that pass all automated checks can be fast-tracked or auto-approved without blocking on engineering review.
  - **Squash Before Review**: When multiple micro-polish branches accumulate, instruct the agent to **squash them into a single consolidated polish PR** so engineering reviewers are not flooded with dozens of 2-line PRs.

### 5.2 Pre-PR Code Hygiene (`/simplify`, `/code-review`, `/commit-push-pr`)

Before opening or finalizing any significant PR, run a dedicated hygiene check mapped to `career-ops`'s deterministic gates:

1. **`/simplify`**: Prune dead code, flatten over-engineered abstractions, and tighten implementation density.
2. **`/code-review`**: Run an automated internal review pass against [`CLIEF.md`](CLIEF.md), [`docs/clief/AGENT-CHARTER.md`](docs/clief/AGENT-CHARTER.md) invariants, security rules, and [`DESIGN.md`](DESIGN.md) / [`SKILL.md`](SKILL.md) constraints.
3. **`/commit-push-pr`**: Execute the monorepo's deterministic verification commands before pushing and opening the PR:

```bash
pnpm build
pnpm test
pnpm lint
pnpm career-ops optimize --demo
npx --yes markdownlint-cli2 "**/*.md" "#node_modules"
```

### 5.3 Zero-Touch PR Shepherd (Finish-Line Automation)

Once the core feature and design decisions are complete, hand off PR completion to a background agent loop:

- Monitor CI status and automatically fix lint, build, or test failures.
- Address incoming code review comments and push follow-up commits.
- Notify assigned reviewers on Slack or ping the stamp/on-call channel when ready to merge.

---

## 6. Scalable Design Governance (Scheduled Routines)

To prevent unreviewed UI drift as shipping velocity scales, run a scheduled **Frontend Design Audit Routine**:

1. **Repository Scan**: Periodically scan all commits and PRs touching frontend code (`packages/web/`, `docs/assets/`).
2. **Designer Involvement Check**: Cross-reference PR metadata, Slack threads, design docs, and meeting notes to determine whether a designer reviewed or authored the change.
3. **Flag & Audit**: If a frontend change shipped without design involvement (or violates [`DESIGN.md`](DESIGN.md) rules), flag it automatically.
4. **Adversarial Design Draft**: Have the routine critique the implementation against [`DESIGN.md`](DESIGN.md) and draft an alternative/corrective PR with visual before/after proof.
5. **The No-Auto-DM Guardrail (Human Triage First)**:
   - **Never configure the routine to automatically DM engineers on Slack with unvetted AI design critiques.** Because current models still make flawed visual trade-offs, route all adversarial design PRs to the **human designer's triage inbox first**.
   - Keep the Slack notification step built in code behind a toggle so it can be enabled as model design judgment matures.

---

## 7. Reusable Prompt & Skill Templates

### 7.1 End-to-End Prototype-to-PR Prompt

```text
/prototype 5 <feature description>.
Pick the best option for me first and tell me why.
Feel free to research online (or check project docs/context) to figure out which pattern is best.
Implement the best option, verify it in Chrome, and make sure the styles match DESIGN.md.
Run /simplify and /code-review, then put up a PR with a screenshot/GIF recording.
/loop until you're done.
```

### 7.2 `/prototype` Skill Prompt Template

```text
Generate N distinct implementation options (default: 5) for the requested feature.
1. Render all N options in an interactive, self-contained HTML preview file under docs/assets/ so they can be compared side-by-side or toggled.
2. Open and preview the HTML file, then self-iterate 2-3 times to polish interactions and visual hierarchy against DESIGN.md.
3. Recommend the single strongest option and explain the architectural and UX rationale behind your choice.
```

### 7.3 Pre-PR Hygiene & Squash Prompt

```text
1. Run /simplify on all changed files in this branch to remove unnecessary complexity and dead code.
2. Run /code-review to verify compliance with CLIEF.md invariants, AGENT-CHARTER.md prohibitions, and DESIGN.md rules.
3. Run pnpm build && pnpm test && pnpm career-ops optimize --demo && npx markdownlint-cli2.
4. If multiple micro-polish fixes are queued, squash them into a single clean PR with before/after screenshots.
```

### 7.4 Autonomous PR Shepherd Prompt

```text
Review all of my open PRs and get them over the finish line:
1. Check CI status on each open PR; pull and fix any failing lint, typecheck, or test steps.
2. Read all unresolved code review comments, implement the requested fixes, and reply with the commit hash.
3. Once CI is green and comments are resolved, notify the assigned reviewers (or stamp channel) that the PR is ready to merge.
/loop until all open PRs are merged or explicitly blocked on a human product decision.
```

### 7.5 Scheduled Frontend Design Governance Routine

```text
Scan recent commits and PRs touching frontend files (packages/web/ and docs/assets/):
1. Check whether design review or DESIGN.md verification was performed.
2. For any frontend change that shipped without design validation, audit it against DESIGN.md (3px #1414b8 borders, 6px hard geometric shadows, pure inline diff highlights, 70/30 layout rhythm).
3. Flag violations and draft a corrective PR with visual before/after screenshots routed to the human design triage inbox (do not auto-DM authoring engineers until human-approved).
```

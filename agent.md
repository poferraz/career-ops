# Agent Operating Playbook (`agent.md`)

> Distilled from *"How Claude Code's Lead Designer Builds with AI"* ([YouTube](https://www.youtube.com/watch/hKeDfupbA4U)) and adapted for the `career-ops` repository.

This document defines the high-leverage workflows, session defaults, verification standards, and governance routines for building, designing, and shipping with AI coding agents in `career-ops`.

---

## 1. Core Operating Tenets

### 1.1 Human-in-the-Loop for Craft & Taste

LLMs excel at implementation, exploration, and verification, but **they do not yet possess reliable design taste**.

- Automate code generation, option exploration, research, and CI mechanics.
- Keep human judgment strictly in the loop for visual craft, UX ergonomics, and product decisions—especially when enforcing the Neo-Brutalist architectural system in [`DESIGN.md`](DESIGN.md).

### 1.2 Automate Beyond Code

If you only use agents to write application code, you are under-utilizing them. Delegate the surrounding operational work:

- Synthesizing context across Slack, Google Docs, meeting transcripts, analytics (BigQuery), and online prior art.
- Generating interactive HTML prototypes to compare product directions before writing production code.
- Running live browser verification and recording visual proof (screenshots/GIFs).
- Managing the entire post-implementation PR lifecycle: code pruning, addressing review comments, fixing CI, and notifying reviewers.

### 1.3 Velocity Requires Scalable Quality Systems

> **"Just because everyone can ship doesn't mean everything should ship."**

As the cost of generating code drops toward zero, unreviewed changes can degrade product coherence. Pair autonomous velocity with:

- Deterministic invariant gates (see [`CLIEF.md`](CLIEF.md) and `packages/audit/`).
- Pre-PR simplification and automated code review passes.
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

---

## 3. Feature & Prototyping Workflow

### 3.1 Prompt-Generated Skills (Never Hand-Write Boilerplate Skills)

Do not write repetitive workflow prompts or skill files by hand. Prompt the agent to generate and refine reusable slash skills (e.g., `/prototype`, `/simplify`, `/commit-push-pr`).

### 3.2 Divergent Prototyping (`/prototype`)

When building a new feature or UI interaction without a rigid spec:

1. **Generate $N$ Distinct Options**: Use `/prototype [N] [feature]` (default $N = 5$) to generate 5 genuinely different architectural or UX implementations in a self-contained HTML preview.
2. **Self-Iterate**: Have the agent preview and refine the variations before presenting them.
3. **Opinionated Agent Recommendation**: Always instruct the agent to **pick the best option first and explain why** before or alongside human selection.
4. **Contextual Research**:
   - **Open-Source / Greenfield**: Research online prior art and established interaction patterns.
   - **Production / Internal**: Search Slack discussions, Google Docs, meeting transcripts, and analytics (e.g., BigQuery) to ground the recommendation in real user and team context.

### 3.3 Autonomous Execution Loop (`/loop`)

Once an option is chosen (or delegated), use `/loop` ("loop until you're done") to cycle continuously through:

1. Implementing the selected option in the target package.
2. Aligning styles with [`DESIGN.md`](DESIGN.md) tokens.
3. Verifying behavior in a live browser and running test suites.
4. Capturing a screenshot/GIF and opening the pull request.

---

## 4. Visual Self-Verification & PR Standards

### 4.1 Live Browser Self-Verification

For any frontend change (`packages/web/`), static typechecks are necessary but insufficient.

- Have the agent open a real browser session (e.g., Chrome integration) to interact with the rendered UI, test keyboard/mouse flows, and verify visual alignment.

### 4.2 Review PRs with Visual Proof, Not Raw Transcripts

Do not waste time reading thousands of lines of raw terminal transcripts to judge whether a feature works.

- **Every frontend PR must include a screenshot or recorded GIF sequence** demonstrating the working feature in the browser.
- Perform human review at the PR + visual recording level.

---

## 5. Parallel Hygiene & Micro-Polish Workflows

### 5.1 Background Micro-Polish Queue (Cloud / Web Sessions)

While primary worktree sessions run heavy tasks, dispatch small UI, copy, and CSS polish fixes asynchronously in background web/cloud sessions:

- Use this for tiny craft fixes that are not worth spinning up a dedicated local terminal session.
- **Squash Before Review**: Periodically instruct the agent to **squash multiple micro-polish branches/commits into a single consolidated PR** so engineering reviewers are not flooded with dozens of 2-line PRs.

### 5.2 Pre-PR Code Hygiene (`/simplify` & `/code-review`)

Before opening or finalizing any significant PR, run a dedicated hygiene check:

1. **`/simplify`**: Prune dead code, flatten over-engineered abstractions, and tighten implementation density.
2. **`/code-review`**: Run an automated internal review pass against repository invariants, security rules, and [`DESIGN.md`](DESIGN.md) / [`SKILL.md`](SKILL.md) constraints.
3. **`/commit-push-pr`**: Execute repository lint, typecheck, and test gates before pushing and opening the PR.

### 5.3 Zero-Touch PR Shepherd (Finish-Line Automation)

Once the core feature and design decisions are complete, hand off PR completion to a background agent loop:

- Monitor CI status and automatically fix lint, build, or test failures.
- Address incoming code review comments and push follow-up commits.
- Notify assigned reviewers on Slack or ping the stamp/on-call channel when ready to merge.

---

## 6. Scalable Design Governance (Scheduled Routines)

To prevent unreviewed UI drift as shipping velocity scales, run a scheduled **Frontend Design Audit Routine**:

1. **Repository Scan**: Periodically scan all commits and PRs touching frontend code (`packages/web/`).
2. **Designer Involvement Check**: Cross-reference PR metadata, Slack threads, design docs, and meeting notes to determine whether a designer reviewed or authored the change.
3. **Flag & Audit**: If a frontend change shipped without design involvement (or violates [`DESIGN.md`](DESIGN.md) rules), flag it automatically.
4. **Adversarial Design Draft**: Have the routine critique the implementation against [`DESIGN.md`](DESIGN.md) and draft an alternative/corrective PR for human designer review before engaging the authoring engineer.

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
1. Render all N options in an interactive, self-contained HTML preview file so they can be compared side-by-side or toggled.
2. Open and preview the HTML file, then self-iterate 2-3 times to polish interactions and visual hierarchy.
3. Recommend the single strongest option and explain the architectural and UX rationale behind your choice.
```

### 7.3 Pre-PR Hygiene & Squash Prompt

```text
1. Run /simplify on all changed files in this branch to remove unnecessary complexity and dead code.
2. Run /code-review to verify compliance with CLIEF.md invariants and DESIGN.md rules.
3. If multiple micro-polish fixes are queued, squash them into a single clean PR with before/after screenshots.
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
Scan recent commits and PRs touching frontend files (packages/web/):
1. Check whether design review or DESIGN.md verification was performed.
2. For any frontend change that shipped without design validation, audit it against DESIGN.md (3px #1414b8 borders, 6px hard geometric shadows, pure inline diff highlights, 70/30 layout rhythm).
3. Flag violations and draft a corrective PR with visual before/after screenshots for human design triage.
```

# Clief Routing

This project runs the Clief/ICM operating system. Canonical architectural context lives in `docs/clief/`, and operational agent workflows live in [`agent.md`](agent.md).

Read `docs/clief/INDEX.md` first on every new task. It routes you to the right workspace context.

## Root Playbooks

- [`docs/clief/INDEX.md`](docs/clief/INDEX.md) — Canonical workspace map, package routing table, and 60/30/10 architecture rules.
- [`agent.md`](agent.md) — Agent operating playbook: git worktree isolation, `/prototype` divergent exploration, browser self-verification, PR hygiene (`/simplify`, `/code-review`), and scheduled design governance.
- [`DESIGN.md`](DESIGN.md) — Career-Ops Studio Neo-Brutalist design system tokens, component specs, and visual verification rules.
- [`SKILL.md`](SKILL.md) — Domain skill protocol: Motivational Interviewing (RULE/RISE), 5-phase intake, Anti-Slop 50-point quality gate, and research pre-flight.

## Rules

- **One fact, one location**: `docs/clief/` is the only source of project architectural facts.
- **Load only what is needed**: Load only the workspace context required for the current task.
- **Isolate parallel work in worktrees**: Always start concurrent agent sessions in dedicated git worktrees (`claude --worktree` or `git worktree add`) so branches and working trees never collide.
- **Verify visually & prune before PR**: Run `/simplify` and `/code-review` before opening PRs, and attach live browser screenshots or GIF recordings to every frontend PR.
- **Update status**: Update `docs/clief/STATUS.md` at meaningful milestones.

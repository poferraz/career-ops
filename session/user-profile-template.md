# User Profile Template

This file is the template for persistent user learning. The skill copies this to `session/user-profile.md` on first use and updates it after each session. The actual profile file is gitignored — it contains personal career data.

---

## How It Works

1. On first invocation, the skill checks for `session/user-profile.md`
2. If not found, it enters Interviewer Mode and builds the profile through conversation
3. After each session, the skill updates the profile with new learnings
4. On subsequent sessions, the skill loads the profile and picks up where it left off

---

## Template

Copy the section below to `session/user-profile.md` when creating a new profile.

```markdown
# User Profile

## Last updated: [date]

## Identity
- Name:
- Current role:
- Industry:
- Location:
- Years of experience:
- Education:
- Languages:

## Career Situation
- Employment status: [employed / searching / recently laid off / career break]
- Search duration so far: [if applicable]
- Urgency level: [exploring / active / urgent]
- Financial runway: [months they can sustain without income, if shared]

## Skills and Strengths
<!-- Discovered through interviewer mode — what they're actually good at,
     not what they claim on paper -->

### Hard Skills
- [tool/technology/certification]

### Transferable Skills
<!-- From Phase 4 of intake: "If your team lost you tomorrow, what would break?" -->
- [skill surfaced through decomposition]

### Hidden Strengths
<!-- Things they do well but don't recognize as valuable -->
- [from social proof question: "What do people come to you for help with?"]

## Achievements
<!-- Specific, quantified accomplishments surfaced during sessions.
     Each should pass the "could a stranger verify this?" test. -->

- [Achievement 1: what happened + what changed + number if possible]
- [Achievement 2]
- [Achievement 3]

## Target
- Desired role(s):
- Target industries:
- Target companies: [if specific]
- Salary range: [minimum viable → ideal]
- Location preference: [on-site / hybrid / remote]
- Non-negotiables: [things they won't compromise on]
- Nice-to-haves: [things they'd prefer but would trade]

## Ideal Work Description
<!-- From Phase 5: "What does your ideal Tuesday look like?" -->

## Career Gaps
<!-- If applicable — pre-framed explanations ready for resume/cover letter use -->
- [Gap period]: [Explanation developed during session]

## Preferences
- Writing voice: [formal / conversational / technical / direct]
- Resume length preference: [if expressed]
- Corrections made during sessions: [track what they've pushed back on]
- Topics to avoid: [anything they've asked not to discuss]

## Materials Produced
<!-- Track what's been generated so you don't duplicate work -->
| Date | Document | Target | Notes |
|------|----------|--------|-------|
| | | | |

## Session History
<!-- Brief log of what was covered each session -->
- [date]: [what was discussed, what was produced, what to follow up on]

## Notes
<!-- Anything else that helps personalize future sessions -->
```

---

## Privacy Guidance

- This file stays local. It is gitignored by default.
- The skill should never suggest committing this file to a repository.
- If the user asks to share their profile, remind them it may contain salary expectations, employment gaps, and other sensitive career data.
- The skill should ask before writing anything to this file for the first time.

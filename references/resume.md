# Resume Reference

Research-backed resume writing guidance. Every recommendation is grounded in eye-tracking data, ATS architecture analysis, and controlled experiments. Load this file when users need resume creation, tailoring, or ATS optimization.

## Required Inputs

Before generating a resume, collect:
- Full work history (titles, companies, dates, responsibilities)
- Target role and job description (if available)
- Years of experience
- Industry (determines format and length expectations)
- Whether applying to enterprise (ATS) or SMB (likely human-read)

---

## How Recruiters Actually Read Resumes

Eye-tracking data from 847 hiring managers reviewing 4,289 resumes:

| Finding | Tier |
|---------|------|
| Average initial scan time: 11.2 seconds (not 6-7 as commonly cited) | T2 |
| F-pattern reading: top of page → left margin → first bullets | T2 |
| 73% never read past the first third of page one | T2 |
| If candidate survives scan: median 1 min 34 sec verification read | T2 |

**Implication**: The top third of page one is the entire resume for 73% of reviewers. Front-load the strongest content. Name, target title, and top 2-3 achievements must land in the F-pattern scan zone.

---

## How ATS Actually Works

Forget everything you've heard about keyword stuffing. It's wrong.

| Finding | Tier |
|---------|------|
| Modern ATS uses NLP semantic matching, not keyword frequency | T1 |
| Models used: SBERT, GloVe, Doc2Vec (verified from open-source ATS code) | T1 |
| Content earlier in a section gets higher relevance scores | T2 |
| Multi-column layouts scramble in text extraction | T1 |
| Legacy Taleo installations break on PDF parsing | T2 |
| Chronological format preferred by both ATS and humans | T2 |
| Functional resumes are highly vulnerable to ATS rejection | T3 |

### Semantic Alignment (Not Keyword Stuffing)

Modern ATS understands that "managed a team" and "led a team" mean the same thing. Instead of repeating exact keywords, align your language semantically with the job description:
- Mirror the JD's framing of responsibilities (if they say "own," don't say "assisted with")
- Use the same level of specificity (if the JD names tools, name the tools you've used)
- Match the seniority language (if the JD says "drive strategy," don't say "help with planning")

### Format Decision Tree

| Situation | Format | Why | Tier |
|-----------|--------|-----|------|
| Applying to Fortune 500 / enterprise | .docx | Taleo and older ATS break on PDF parsing | T2 |
| Applying to modern tech companies | PDF | Modern ATS handles PDF fine; preserves layout | T2 |
| Applying to SMBs (<500 employees) | PDF | Only 20% use comprehensive ATS; human-read | T2 |
| Government (USAJobs) | Per platform spec | USAJobs enforces 2-page maximum | T1 |

Always: single-column layout, standard section headers, no tables or text boxes, no headers/footers for critical content.

---

## Resume Length

This is a genuine contradiction in the data. Present both sides.

| Finding | Tier |
|---------|------|
| Two-page resumes: 2.3-2.9x higher callback for 10+ years experience | T2 |
| Two-page gets 4 min 5 sec review vs 2 min 24 sec for one-page | T2 |
| 17% of hiring managers view >1 page negatively | T2 |
| Study: 7,712 mock resumes in controlled experiment | T2 |

### Guidance
- **<5 years experience**: One page. No exceptions.
- **5-10 years**: One page preferred. Two pages only if the second page contains directly relevant, substantial experience.
- **10+ years**: Two pages recommended. The 2.3-2.9x callback advantage outweighs the 17% minority risk.
- **Government**: Follow platform-specific requirements (USAJobs = 2-page max).

---

## Career Gaps

Gaps are penalized, but the penalty can be reduced.

| Finding | Tier |
|---------|------|
| Applicants with gaps: 45% less likely to get interviews | T1 |
| Family caregiving gaps penalized most heavily | T1 |
| 32% of recruiters now intentionally overlook gaps (2025 survey, 1,200+ respondents) | T2 |
| Functional resumes to hide gaps: ATS-hostile, recruiters dislike | T3 |

### Strategy
Always use chronological format. Address gaps directly:
- Frame as upskilling: "2022-2023: Completed Google Project Management Certificate while caregiving"
- Frame as consulting: "2021-2022: Freelance operations consulting (3 clients)"
- Frame as sabbatical: "2023: Intentional career break for [specific activity]"

Never leave a gap unexplained — it's the most damaging signal (see cover-letter.md for callback data).

---

## Job Hopping

Another genuine contradiction. Both findings are true.

| Finding | Tier |
|---------|------|
| 42% of recruiters consider job hopping a red flag | T3 |
| 1 in 3 recruiters avoid hiring Gen Z specifically due to hopping | T2 |
| 83% of Gen Z self-identify as job hoppers | T2 |
| Job changers get 14.8% salary increase vs 5.8% for loyalists | T2 |
| 64% of job switchers change to entirely new occupational category | T2 |

### Strategy
Don't hide short tenures. Frame them as strategic growth:
- Show progression in responsibility across roles
- Highlight what was accomplished at each stop (not just duration)
- If leaving after <1 year, note the specific deliverable: "Hired to launch X; shipped it in 8 months"
- Group very short contract roles under a single "Contract Work" heading with date range

---

## Achievement Reframing

Most people undersell their experience. Use these techniques to surface real achievements.

### The RISE Method [T2]
- **Record**: Spend 15 minutes every Friday noting wins from the week
- **Include** impact: What changed because of what you did?
- **Capture** skills: What abilities did the win demonstrate?
- **Embrace** your story: Stop minimizing ("I just did my job")

### Mining Sequences [T2]
- *Decomposition*: Break vague descriptions into specific skills ("managed the store" → inventory management, team scheduling, P&L review, customer escalation, vendor negotiation)
- *Quantification probe*: "What happened to the number after you did that?"
- *Social proof*: "What do coworkers or managers specifically praise you for?"
- *Counterfactual*: "If you hadn't done this, what would have gone wrong?"

### Writing the Bullet
Structure: **What you did** + **how you did it** + **what changed** (with a number when possible).

Bad: "Managed inventory processes" (generic specific — see anti-slop.md)
Better: "Rebuilt the cycle count system after 3 months of shrinkage spikes — brought inventory accuracy from 91% to 98.5% in one quarter"

---

## Quality Checklist

Before delivering a resume:
- [ ] Strongest content lands in the top third of page one (F-pattern zone)
- [ ] Semantic alignment with the JD, not keyword repetition
- [ ] Single-column layout, standard headers, no text boxes
- [ ] At least one verifiable, quantified achievement per role
- [ ] No banned phrases (check against anti-slop.md)
- [ ] Format matches target (.docx for enterprise ATS, PDF for modern/SMB)
- [ ] Length matches experience level
- [ ] Career gaps addressed directly (never hidden with functional format)
- [ ] Passes anti-slop scoring rubric (35/50 minimum)

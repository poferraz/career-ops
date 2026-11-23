# Resume Reference

Use this guide to select evidence, tailor a résumé and check its formatting.

**Evidence note.** Figures and study findings without a primary-source link are unverified historical research notes. The tier labels record the original classification. Check the publication, date and sample before using a figure in advice. If the source cannot be verified, omit the number.

## Required Inputs

Before generating a resume, collect:

- Relevant work experience the user chooses to share
- Target role and job description (if available)
- Years of experience
- Industry (determines format and length expectations)
- Whether applying to enterprise (ATS) or SMB (likely human-read)

---

## How Recruiters Actually Read Resumes

Eye-tracking data from 847 hiring managers reviewing 4,289 resumes:

| Finding | Tier |
| --------- | ------ |
| Average initial scan time: 11.2 seconds (not 6-7 as commonly cited) | T2 |
| F-pattern reading: top of page → left margin → first bullets | T2 |
| 73% never read past the first third of page one | T2 |
| If candidate survives scan: median 1 min 34 sec verification read | T2 |

Put the most relevant experience and a supported achievement near the top so a reader can find them quickly.

---

## How ATS Actually Works

Forget everything you've heard about keyword stuffing. It's wrong.

| Finding | Tier |
| --------- | ------ |
| Modern ATS uses NLP semantic matching, not keyword frequency | T1 |
| Models used: SBERT, GloVe, Doc2Vec (verified from open-source ATS code) | T1 |
| Content earlier in a section gets higher relevance scores | T2 |
| Multi-column layouts scramble in text extraction | T1 |
| Legacy Taleo installations break on PDF parsing | T2 |
| Chronological format preferred by both ATS and humans | T2 |
| Functional resumes are highly vulnerable to ATS rejection | T3 |

### Semantic Alignment (Not Keyword Stuffing)

Describe actual experience in terms the target audience understands. Follow the format requested in the posting.

- Use the posting’s terminology where it accurately describes the work.
- Use the same level of specificity (if the JD names tools, name the tools you've used)
- Distinguish tasks the user supported from decisions they owned.

### Choosing a file format

Follow the employer’s requested file type and page limit. When several formats are allowed, choose one that preserves readable text and a logical reading order. Check that the uploaded preview or extracted text preserves section headings, dates and contact details.

----------- | -------- | ----- | ------ |
| Applying to Fortune 500 / enterprise | .docx | Taleo and older ATS break on PDF parsing | T2 |
| Applying to modern tech companies | PDF | Modern ATS handles PDF fine; preserves layout | T2 |
| Applying to SMBs (<500 employees) | PDF | Only 20% use comprehensive ATS; human-read | T2 |
| Government (USAJobs) | Per platform spec | USAJobs enforces 2-page maximum | T1 |

Always: single-column layout, standard section headers, no tables or text boxes, no headers/footers for critical content.

---

## Resume Length

This is a genuine contradiction in the data. Present both sides.

| Finding | Tier |
| --------- | ------ |
| Two-page resumes: 2.3-2.9x higher callback for 10+ years experience | T2 |
| Two-page gets 4 min 5 sec review vs 2 min 24 sec for one-page | T2 |
| 17% of hiring managers view >1 page negatively | T2 |
| Study: 7,712 mock resumes in controlled experiment | T2 |

### Guidance

Choose a length that accommodates the experience relevant to the role. A concise first page may be enough. Add another page if the material earns the space and the posting allows it.

---

## Career Gaps

The original research notes recorded differing reactions to employment gaps.

| Finding | Tier |
| --------- | ------ |
| Applicants with gaps: 45% less likely to get interviews | T1 |
| Family caregiving gaps penalized most heavily | T1 |
| 32% of recruiters now intentionally overlook gaps (2025 survey, 1,200+ respondents) | T2 |
| Functional resumes to hide gaps: ATS-hostile, recruiters dislike | T3 |

### Describing a career gap

The applicant decides whether to mention a break. Keep dates accurate and allow the reason to stay private. If the user wants a short explanation, use their chosen wording, such as “Career break, 2022–2023.” Add training or other activities only if they happened and the applicant wants to include them.

---

## Job Hopping

Historical notes about employer perceptions and reasons for changing jobs follow.

| Finding | Tier |
| --------- | ------ |
| 42% of recruiters consider job hopping a red flag | T3 |
| 1 in 3 recruiters avoid hiring Gen Z specifically due to hopping | T2 |
| 83% of Gen Z self-identify as job hoppers | T2 |
| Job changers get 14.8% salary increase vs 5.8% for loyalists | T2 |
| 64% of job switchers change to entirely new occupational category | T2 |

### Explaining short tenures

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

- [ ] The most relevant experience is easy to find
- [ ] Semantic alignment with the JD, not keyword repetition
- [ ] Single-column layout, standard headers, no text boxes
- [ ] Achievements are accurate and quantified only where the user has support for the number
- [ ] No banned phrases (check against anti-slop.md)
- [ ] Format follows the application instructions
- [ ] Length fits the relevant experience and any stated limit
- [ ] Any mention of a career break uses only wording the user chose to share
- [ ] Passes anti-slop scoring rubric (35/50 minimum)

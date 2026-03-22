# Trust Tiers

Every claim in the career-ops knowledge base is tagged with a trust tier. This system exists so users (and contributors) know exactly how much weight to give any piece of advice.

## The Tiers

### T1 — VERIFIED

Multiple independent sources, peer-reviewed research, government data, or inspectable code.

**Examples in this repo:**
- STAR interview framework validated by peer-reviewed research (Taylor & Francis)
- Structured interviews 2x more predictive (Cambridge Core)
- Career gap penalty: 45% less likely to get interviews (2019 field experiment)
- Career coaching: 95% vs 83% employment (randomized controlled trial)
- AI cover letter callback increase: +3.56 pp (difference-in-differences analysis)
- GPTZero 15% false positive rate (Stanford research)
- ATS semantic matching via SBERT/GloVe/Doc2Vec (verified from open-source code)
- 514,000 discouraged workers (Bureau of Labor Statistics)
- EU Pay Transparency Directive June 2026 (legislation)

**What T1 means for the skill:** These claims can be stated as facts. Present them with confidence.

### T2 — REPORTED

Named industry surveys, platform analytics, single controlled experiments.

**Examples in this repo:**
- 11.2-second resume scan time (InterviewPal, 847 hiring managers)
- Two-page resume advantage 2.3-2.9x (ResumeGo, 7,712 resumes)
- LinkedIn eye-tracking data (Tobii Pro Fusion, 4,812 profiles)
- Connection request acceptance rates (16,000+ requests analyzed)
- Diminishing returns curve for applications (named industry survey)
- HireVue measures 25,000 data points per interview
- Job changers get 14.8% salary increase vs 5.8% for loyalists
- 67% of hiring managers claim they can detect AI content

**What T2 means for the skill:** Present these as "research shows" or "data from [source] indicates." Include sample sizes when available. Acknowledge single-source limitations when relevant.

### T3 — CONVENTIONAL

Expert opinion, anecdotal consensus, logically sound but unproven.

**Examples in this repo:**
- Functional resumes are ATS-hostile (logical, expert consensus, no controlled test)
- 42% of recruiters consider job hopping a red flag (small sample survey, n=86)
- 30-Day Skill Sprint for cross-industry transitions
- Terminology mapping for industry translation
- Best strategy for gap framing (chronological + direct explanation)

**What T3 means for the skill:** Present as recommendations, not facts. Use language like "experts recommend" or "conventional wisdom suggests." Never cite a percentage from T3 data without noting the limitation.

### T4 — EXCLUDED

Single-source claims with no methodology, vendor marketing, or contradicted by stronger evidence.

**What T4 means:** These claims were found during research but excluded from the knowledge base. They don't appear in any reference file.

**Examples of what gets excluded:**
- "6-7 second resume scan time" — contradicted by the 11.2-second eye-tracking study (T2)
- "Keyword stuff your resume" — contradicted by ATS semantic matching evidence (T1)
- Vendor claims without methodology or sample sizes
- Advice from a single blog post with no supporting data

## How Contradictions Are Handled

When two credible sources disagree, both findings are preserved with their trust tiers, and a resolution is noted. The skill presents both sides and lets the user decide based on their context.

Current contradictions in the knowledge base:

| Topic | Finding A | Finding B | Resolution |
|-------|-----------|-----------|------------|
| Resume length | 2.3-2.9x callbacks for 2-page (T2) | 17% view >1 page negatively (T2) | Present data, user decides by target |
| Job hopping | 42% recruiter red flag (T3) | 14.8% salary increase for changers (T2) | Both true. Frame strategically. |
| Follow-up messages | 74% managers appreciate (T2) | No causal evidence of impact (T2) | Include as practice, don't oversell |
| AI in applications | 52% accept AI-assisted (T2) | 20% red flag for rejection (T2) | De-slop everything. Quality is the line. |

## For Contributors

When submitting new research via the [Research Update template](../.github/ISSUE_TEMPLATE/research_update.md):
- Include the source, methodology, and sample size
- Propose a trust tier with justification
- Note if the finding contradicts existing data
- Maintainers will review and assign the final tier

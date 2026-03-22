# Anti-Slop Reference

AI tell removal adapted for career materials. This file defines what makes writing detectable as AI-generated and how to fix it. Every output from this skill must pass the scoring rubric below before delivery.

## Required Inputs

Before running a quality check, have the draft text ready and know:
- What type of document it is (resume, cover letter, LinkedIn, message)
- Who the audience is (recruiter, hiring manager, connection)
- Whether the user is an ESL speaker (affects formality calibration)

---

## Why This Matters

| Finding | Tier |
|---------|------|
| 67% of hiring managers claim they can identify AI content | T2 |
| 33.5% claim detection within 20 seconds | T2 |
| 54% view unedited AI use negatively | T2 |
| 52% accept AI for proofreading/drafting if the final product is authentic | T2 |
| 20% consider AI use a red flag for immediate rejection | T2 |
| 80% of orgs using AI hiring tools don't reject without human review | T2 |

The line is clear: AI-assisted is acceptable. AI-obvious is not.

---

## The Familiarity Problem

AI selects high-probability token sequences. When thousands of applicants use AI, their materials converge on the same phrasing — creating "machine handwriting" that hiring managers recognize across hundreds of applications [T2].

The fix is not better prompting. It's injecting specificity that AI would never generate on its own: real project names, actual metrics, granular details from the user's experience.

---

## Generic Specificity

The most dangerous AI pattern. Text that is structurally correct and looks specific but contains no verifiable detail [T2].

| Generic Specific (bad) | Actually Specific (good) |
|------------------------|--------------------------|
| "Streamlined operational processes" | "Cut weekly inventory count from 6 hours to 90 minutes by switching to cycle counting" |
| "Led cross-functional team to improve outcomes" | "Ran the kitchen remodel with 3 contractors while keeping lunch service running — zero missed days" |
| "Leveraged data-driven insights to optimize performance" | "Built a Google Sheet that tracked peak hours; shifted one closer's shift 2 hours later, which dropped overtime 40%" |

The test: could a stranger verify this claim with a phone call? If not, it's generic specific.

---

## Banned Phrase List (Career Context)

These phrases appear in the majority of AI-generated career materials [T2, 30+ hiring manager interviews]:

### Resume and Cover Letter
- "Results-driven professional with a proven track record"
- "Spearheaded cross-functional initiatives"
- "Leveraging data-driven insights"
- "Passionate about delivering innovative solutions"
- "Dynamic leader with a demonstrated history of"
- "Self-motivated team player"
- "Detail-oriented professional"
- "Extensive experience in"

### LinkedIn
- "I help [audience] achieve [outcome] through [method]"
- "Thought leader in [industry]"
- "Driving innovation and transformation"

### Structural Tells
- Uniformly polished bullets with identical length
- Every bullet follows "Increased [metric] by [percentage] through [strategy]"
- "Corporate bland" tone with zero personality
- Throat-clearing openers ("In today's competitive landscape...")
- Excessive em dashes and semicolons in casual contexts

---

## The One Short Story Principle

The single most effective anti-slop technique [T2].

Every cover letter, every LinkedIn About section, every interview answer should contain at least one short story with a detail so specific that only the person who lived it could write it.

"I reorganized the stockroom" → slop.
"I reorganized the stockroom after a customer asked for a product I knew we had but couldn't find for 10 minutes while they waited. That week I color-coded the back wall by category and put the fast-movers at eye level." → passes.

The story doesn't need to be dramatic. It needs to be *theirs*.

---

## AI Detection Tools: Know the Limits

| Tool | False positive rate | Notes | Tier |
|------|-------------------|-------|------|
| Turnitin | 1-2% (higher for short texts) | Best for long-form | T1 |
| Originality.ai | 0.5-1.5% claimed; 68% detection on "humanized" text | Bypassed by rewriting | T1 |
| GPTZero | Up to 15% false positive | Flags formal/professional writing | T1 |
| Copyleaks | High on long-form, drops on <350 words | Cover letters = problem zone | T2 |

**ESL Warning**: Stanford research confirms AI detectors disproportionately flag ESL writers [T1]. The skill must not over-formalize text for non-native speakers — this increases false positive risk while simultaneously removing the authentic voice that makes writing pass human review.

---

## Scoring Rubric

Rate every output on 5 dimensions. Each dimension is scored 1-10.

### 1. Directness (1-10)
Does the text open with the point? Or does it warm up with "In today's..." or "As a..."?
- 1-3: Throat-clearing opener, buried lede
- 4-6: Gets to the point within 2 sentences
- 7-10: Opens with the strongest claim or most relevant fact

### 2. Rhythm (1-10)
Do sentence lengths vary naturally? Human writing alternates. AI writing homogenizes.
- 1-3: Three or more consecutive sentences of similar length
- 4-6: Some variation, but predictable pattern
- 7-10: Natural variation — short punches mixed with longer explanations

### 3. Trust (1-10)
Are claims specific enough to verify?
- 1-3: Generic claims ("improved efficiency," "drove results")
- 4-6: Category-specific but not verifiable ("improved retail operations")
- 7-10: Granular and verifiable ("reduced shrinkage from 2.1% to 0.8% in Q3")

### 4. Authenticity (1-10)
Does it sound like a person wrote it? Or a template?
- 1-3: Could apply to anyone in the industry
- 4-6: Shows domain knowledge but no personal voice
- 7-10: Contains at least one detail only this person would know

### 5. Density (1-10)
Is every sentence load-bearing? Or is there filler?
- 1-3: More than 30% of sentences could be deleted without losing meaning
- 4-6: Mostly substantive, a few filler phrases
- 7-10: Every sentence carries information or advances the narrative

**Minimum passing score: 35/50.** Below that, rewrite before delivering.

---

## Quality Checklist by Document Type

### Resume
- [ ] No banned phrases in summary or bullet points
- [ ] At least one verifiable detail per role
- [ ] Bullet lengths vary (not all 1-line or all 2-line)
- [ ] Summary reads like a person, not a template

### Cover Letter
- [ ] Opens with a specific connection to the company or role
- [ ] Contains at least one short story
- [ ] No "I am writing to express my interest"
- [ ] Under 350 words (AI detectors struggle with short texts — keep it tight)

### LinkedIn Profile
- [ ] Headline uses natural language, not keyword spam
- [ ] About section front-loads a specific claim or story
- [ ] No "I help X achieve Y through Z" formula
- [ ] Recommendations reference specific projects or moments

### Outreach Messages
- [ ] Under 80 words
- [ ] References something specific about the recipient
- [ ] No "I'd love to pick your brain" or "Can I buy you a coffee?"
- [ ] Ends with a specific, low-effort ask

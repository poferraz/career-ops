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
| 67% of HR leaders report AI-generated applications have slowed hiring (Robert Half 2026) | T2 |
| 33.5% of managers spot generic AI writing within 20 seconds; 19.6% reject outright (TopResume 2025) | T2 |
| 54% of hiring managers view unedited AI use negatively | T2 |
| 52% accept AI for proofreading/drafting if the final product is authentic | T2 |
| 20% consider generic AI use a red flag for immediate rejection | T2 |
| 80% of orgs using AI hiring tools don't reject without human review | T2 |

The line is clear: AI-assisted is acceptable. AI-obvious triggers recruiter fatigue and rejection.

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

## AI Detection Tools: Empirical Limitations & Vendor Reality

> **The No-Detector Law**: Enterprise ATS vendors (Workday, Greenhouse, Ashby, Lever) **do not run automated AI detectors** (like GPTZero, Turnitin, or CopyLeaks) due to massive false-positive risks and employment law liabilities. Commercial detector metrics are included below solely for research reference regarding why synthetic text detection is inherently flawed:

| Tool | False positive rate | Research Context | Tier |
|------|-------------------|------------------|------|
| Turnitin | 1-2% (higher for short texts) | High variance on professional resumes | T1 |
| Originality.ai | High false positive on dense technical prose | Struggles with domain acronyms | T1 |
| GPTZero | Up to 15% false positive (Stanford study) | Disproportionately flags formal/ESL writing | T1 |
| Copyleaks | High on long-form, unreliable on <350 words | Fails on short resume bullets | T2 |

**ESL Warning**: Stanford research confirms AI detectors disproportionately flag ESL writers [T1]. The platform must never over-formalize text for non-native speakers — this increases machine handwriting penalties while stripping the authentic voice required for human recruiter trust.

---

## Scoring Rubric

Rate every output on 5 dimensions. Each dimension is scored 1-10.

### 1. Directness (1-10)
Does the text open with the point? Or does it warm up with "In today's..." or "As a..."?
- 1-3: Throat-clearing opener, buried lede
- 4-6: Gets to the point within 2 sentences
- 7-10: Opens with the strongest claim or most relevant fact

### 2. Rhythm (1-10)
Do sentence lengths vary naturally? Human writing alternates. AI writing homogenizes around 18–22 words.
- **Construct Validity Rule**: Standard deviation ($\sigma$) must be computed across the **entire experience section sentence pool**, NOT on isolated single-sentence bullets.
- 1-3: Uniform sentences with near-zero length variance ($\sigma < 3.0$)
- 4-6: Modest variance, predictable length clumping ($3.0 \le \sigma < 5.5$)
- 7-10: High natural burstiness — short punches mixed with complex scope clauses ($\sigma \ge 5.5$)

### 3. Trust & Verifiability (1-10)
Are claims specific enough to verify? (Factual invariance is separately locked by the deterministic normalizer).
- 1-3: Generic claims without operational friction ("improved efficiency," "drove results")
- 4-6: Category-specific but lacking metrics ("improved distributed systems reliability")
- 7-10: Granular and verifiable ("reduced p99 API latency from 450ms to 85ms across 14 microservices")

### 4. Authenticity (1-10)
Does it sound like a person wrote it? Or an LLM template?
- 1-3: Banned phrases present; corporate chatbot cadence
- 4-6: Shows domain competence but lacks unique operational friction
- 7-10: Zero banned phrases; contains concrete organizational truth

### 5. Density (1-10)
Is every sentence load-bearing? Or is there filler?
- 1-3: More than 30% of words could be cut without loss of meaning
- 4-6: Mostly substantive, a few filler adjectives
- 7-10: Maximum information density: Action Verb + Scope/Friction + Quantified Outcome

### Three-Band Quality Gate
- **Band 1: Score >= 42/50 (Certified ATS Ready)**: Surpasses human reviewer scrutiny, exhibits natural burstiness, and passes all hybrid ATS checks.
- **Band 2: Score 35-41/50 (Warning / Review Required)**: Acceptable baseline, flagged for targeted user polish or minor rhythm adjustment.
- **Band 3: Score < 35/50 (Reject / Intervention Required)**: Fails quality floor. Automatically triggers Stage 1 Motivational Probing or Stage 2 rewriting.

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

# Research Scout Reference

Live web research protocol with verification safeguards. Load this file when the user needs information beyond the knowledge base — specific company data, uncovered industries, niche salary figures, or non-US market conditions.

## Activation Triggers

Load this file when the user asks about:
- **Specific company research**: culture, recent news, team structure, hiring patterns for a named employer
- **Uncovered industries**: sectors not represented in the knowledge base (e.g., mining, agriculture, maritime)
- **Niche salary data**: compensation for roles, locations, or seniority levels not in market-data.md
- **Non-US markets**: hiring norms, labor laws, or platform usage outside the United States

If the request can be fully answered from the existing knowledge base, do not activate this protocol — use the verified data instead.

---

## 5-Step Search Protocol

### Step 1 — Search with Specificity

Never search for broad topics. Construct narrow, specific queries.

- **Wrong**: "software engineer salary"
- **Right**: "senior backend engineer salary Berlin 2025 Glassdoor OR Levels.fyi"
- **Wrong**: "company culture"
- **Right**: "[Company Name] engineering team Glassdoor reviews 2024 2025"

Use at least two different queries per topic to reduce single-source risk.

### Step 2 — Evaluate Source Quality

Rank every result before using it:

| Source type | Trust level | Example |
|-------------|-------------|---------|
| Named organization with published methodology | High | BLS, Glassdoor Economic Research, LinkedIn Economic Graph |
| Industry publication with editorial oversight | Medium-high | TechCrunch, Harvard Business Review, industry trade journals |
| Named expert blog with credentials | Medium | Individual practitioners with verifiable experience |
| Single blog post, no methodology | Low | Personal blogs, Medium posts without citations |
| User-generated content, forums, anonymous posts | Very low | Reddit threads, Quora answers, anonymous Glassdoor reviews |

**Rule**: Named organization with methodology > single expert blog > user-generated content. Discard anything without an identifiable source.

### Step 3 — Cross-Reference Against Knowledge Base

Before presenting any finding:
- Does the knowledge base already have data on this topic? If yes, compare.
- Does the new finding contradict verified data? If yes, flag the contradiction explicitly.
- Does the new finding fill a known gap? If yes, note which gap it addresses.

### Step 4 — Present Separately with Tags

All web search findings MUST be:
- Labeled with `[UNVERIFIED — web search]`
- Presented in a distinct section, never mixed inline with knowledge base data
- Accompanied by the source name and date

Example format:
```
## From the Knowledge Base (verified)
Senior software engineers search for a median of 20 weeks [T2].

## From Web Search [UNVERIFIED — web search]
According to [Source Name] (March 2026), the Berlin market currently shows...
```

### Step 5 — Honest Fallback

If no reliable source is found:
- Say: "I don't have verified data on that specific topic."
- Do NOT generate plausible-sounding estimates, averages, or statistics.
- Suggest what the user could search for themselves and where to look.
- Offer to proceed with what the knowledge base does have.

---

## Recency Rules

| Age of data | Action |
|-------------|--------|
| Within 12 months | Current — use freely with `[UNVERIFIED — web search]` tag |
| 1-3 years old | Use with caveat: "as of [year]" |
| Older than 3 years | Discard for market data, salary, and trend claims |
| Any age | Acceptable for stable facts (company founding date, methodology descriptions) |

---

## Quality Checklist

Before presenting web research findings:
- [ ] Every finding is tagged `[UNVERIFIED — web search]`
- [ ] Source name and date are included for each finding
- [ ] Source quality has been evaluated (Step 2 ranking applied)
- [ ] Findings are presented separately from knowledge base data
- [ ] No plausible-sounding statistics have been generated
- [ ] Contradictions with the knowledge base are flagged
- [ ] Recency rules have been applied
- [ ] The user can distinguish what is verified research vs live search

---

## Explicit Prohibitions

1. **Never generate statistics.** If you cannot find a number from a credible source, you do not have that number. Do not estimate, extrapolate, or produce "typical" figures.
2. **Never present web search findings as if they were part of the knowledge base.** The trust tier system (T1-T4) applies only to the researched knowledge base. Web search results are untiered until verified.
3. **Never blend sources.** A sentence should come from one source. Do not combine a knowledge base figure with a web search figure in the same claim.
4. **Never omit the tag.** Even if you are confident in the source, the `[UNVERIFIED — web search]` tag is mandatory. The user decides what to trust.

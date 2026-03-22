# LinkedIn Reference

Algorithm mechanics, profile optimization, and content strategy backed by eye-tracking studies, platform data analysis, and engagement research. Load this file when users need LinkedIn profile help, content strategy, or visibility optimization.

## Required Inputs

Before optimizing a LinkedIn profile, collect:
- Current headline and About text (if any)
- Target role and industry
- Key achievements (from interviewer mode or user profile)
- Content comfort level (lurker, occasional poster, active creator)
- Whether they have LinkedIn Premium or Creator Mode

---

## How Recruiters Scan LinkedIn Profiles

Eye-tracking data from 4,812 profile reviews (Tobii Pro Fusion):

| Finding | Tier |
|---------|------|
| Average time on profile: 19.3 seconds | T2 |
| Critical "interest window": first 3.2 seconds | T2 |
| On mobile (61% of recruiters): decision time drops to 2.1 seconds | T2 |

### The 3 Eye-Tracking Stops

| Stop | What | Time | Tier |
|------|------|------|------|
| 1 | Job title / company name | 0.3-0.8s | T2 |
| 2 | Headline (first 60 characters) | 0.8-1.5s | T2 |
| 3 | Experience section logos and metrics | 1.5-3.2s | T2 |

**Banner image** is NOT in the primary 3.2-second scan path. It matters in secondary evaluation (the "About and Engagement" phase), but don't prioritize it over headline and experience [T2].

### Photo Impact
Profiles with professional headshots: 14-21x more profile views and 36x more messages [T2]. This is the single highest-ROI profile element.

---

## How LinkedIn Search Works

| Finding | Tier |
|---------|------|
| Headline = single most weighted field in recruiter search | T2 |
| Search uses kNN on GPU, sub-50ms retrieval | T2 |
| Platform shifted from Social Graph to Interest Graph | T2 |

LinkedIn's algorithm no longer just shows content from your connections. It prioritizes content by topic relevance. This means your profile and posts need to signal what you're about, not just who you know.

---

## Profile Optimization

### Headline (Most Important Field)

| Finding | Tier |
|---------|------|
| Max 220 characters | T2 |
| Most weighted field in recruiter search | T2 |
| First 60 characters matter most (eye-tracking Stop 2) | T2 |

**Formula**: [Target Role] | [Key Skill/Domain] | [Differentiator or Result]

Examples:
- "Operations Manager | Retail + Supply Chain | Cut shrinkage 60% at Structube"
- "Full-Stack Developer | React + TypeScript | Shipped 3 production apps in 6 months"

Don't waste characters on "Seeking new opportunities" — recruiters search by skill and title, not by employment status.

### About Section

| Finding | Tier |
|---------|------|
| Truncates at ~275 characters on mobile | T2 |
| 72% of LinkedIn audience is mobile | T2 |

Front-load your career capital in the first 275 characters. Put your strongest claim, most relevant achievement, or clearest value proposition before the fold. Everything after "see more" is bonus.

Don't use the "I help X achieve Y through Z" formula — it's become an AI tell (see anti-slop.md).

### Creator Mode

| Finding | Tier |
|---------|------|
| 13-15% more likely to get recruiter contact | T2 |
| Changes "Connect" to "Follow" (lowers barrier) | T2 |

Worth enabling for anyone actively building visibility. The trade-off: "Follow" replaces "Connect" as the default button, which can slow direct network building.

### Recommendations

| Finding | Tier |
|---------|------|
| Verified members with recommendations: 60% more profile views | T2 |
| Achievement-oriented recommendations outperform character references | T2 |

Ask recommenders to mention a specific project or result, not just that you're "great to work with."

---

## Content Strategy

### Posting Cadence

| Finding | Tier |
|---------|------|
| Optimal: 3 posts/week, 24+ hours apart | T2 |
| Best days: Tuesday, Wednesday, Thursday | T2 |
| Best times: 7-11 AM or 4-6 PM (audience timezone) | T2 |
| Golden Hour: first 60-90 minutes determine post trajectory | T2 |

### Engagement Hierarchy

Not all engagement is equal. The algorithm weights actions differently.

| Action | Weight vs Like | Tier |
|--------|---------------|------|
| Quality comment (15+ words) | 2.5x a short comment | T2 |
| Any comment | 15x a like | T2 |
| Save | 3-5x a like | T2 |
| Dwell time 61s+ | 15.6% engagement rate (vs 1.2% at <3s) | T2 |

**Implication**: Writing content that generates comments is 15x more valuable than content that gets likes. Ask questions. Share opinions. Tell stories that people want to respond to.

### Format Performance

| Format | Performance boost | Why | Tier |
|--------|------------------|-----|------|
| Native video | +69% | Auto-plays in feed, high dwell time | T2 |
| Newsletters/articles | +48% reach | Platform promotes long-form | T2 |
| PDF carousels | High dwell time | Users swipe through = sustained attention | T2 |

### The 7-Second Rule
Average scan time before engage/skip decision: 7 seconds [T2]. Your first line must hook. Don't start with context — start with the insight or the tension.

### Commenting as Strategy
Commenting once on someone's post: 80% chance their next post appears in your feed [T2]. Strategic commenting on target company employees' posts is a legitimate visibility strategy before applying.

---

## Connection Requests

Data from 16,000+ analyzed requests:

| Message type | Acceptance rate | Tier |
|-------------|----------------|------|
| Shared event/experience reference | 65% | T2 |
| Mutual connection reference | 58% | T2 |
| Specific content reference | 48% | T2 |
| Generic template | 32% | T2 |
| Blank (no message) | 31% | T2 |
| Sales language ("help," "solution," "provide") | 18% | T2 |

| Timing | Tier |
|--------|------|
| 21% of acceptances within first hour | T2 |
| 88% within first week | T2 |
| >30 days: <1% chance of acceptance | T2 |

**Key takeaway**: A personalized message referencing a shared experience doubles acceptance vs blank requests. Sales language cuts it in half. If the request hasn't been accepted in a week, it's probably not going to be.

### InMail vs Cold Email

| Channel | Response rate | Tier |
|---------|--------------|------|
| InMail | 18-25% | T2 |
| Cold email | 1-5% | T2 |

InMail is 5-15x more effective than cold email for reaching professionals. Worth the Premium investment for active job seekers targeting specific people.

---

## Banner Image

| Finding | Tier |
|---------|------|
| NOT in the primary 3.2-second scan path | T2 |
| Matters in secondary evaluation phase | T2 |
| Cluttered or misaligned banners increase cognitive load → faster drop-off | T2 |
| On mobile, may not render above fold | T2 |

Good banner: reinforces value proposition or displays social proof (awards, speaking). Bad banner: generic stock image, cluttered design, industry-mismatched. Default LinkedIn banner: acceptable — better than a bad one.

---

## Optional Integration: LinkedIn MCP

If the user has a LinkedIn MCP server connected (e.g., stickerdaniel/linkedin-mcp-server), the skill can:
- Pull current profile data for optimization comparison
- Search for target companies and hiring managers
- Analyze content performance metrics

This is optional. The skill works fully without it.

---

## Quality Checklist

Before delivering LinkedIn optimization:
- [ ] Headline is under 220 chars with target role in the first 60 characters
- [ ] About section front-loads career capital in first 275 characters
- [ ] No "I help X achieve Y through Z" formula
- [ ] Content recommendations match user's comfort level
- [ ] Connection request templates avoid sales language trigger words
- [ ] Photo recommendation included (highest-ROI element)
- [ ] Passes anti-slop scoring rubric (35/50 minimum)

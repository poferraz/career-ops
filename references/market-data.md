# Market Data Reference

Verified labor market data for calibrating job search expectations and salary research. Every statistic is tagged by trust tier. Load this file when users ask about market conditions, salary ranges, industry trends, or remote work.

## Required Inputs

Before using this data, collect from the user:
- Target industry and role
- Geographic location (for salary and remote work context)
- Seniority level
- Whether they're open to relocation or remote

---

## The Hiring Funnel

What actually happens to applications at scale.

| Stage | Data | Tier |
|-------|------|------|
| Average applicants per posting | 242 | T2 |
| Application-to-interview rate | 2-3% | T2 |
| Interview-to-offer rate | 27-36% | T2 |
| End-to-end conversion | ~0.5% | T2 |
| Median time to first offer (all roles) | 68.5 days | T2 |

### The Diminishing Returns Curve

More applications does not mean more offers. Quality collapses after 80.

| Volume | Offer probability | Tier |
|--------|-------------------|------|
| 1-10 applications | 27.2% | T2 |
| 11-20 applications | 29.5% | T2 |
| 21-80 applications | 30.9% (optimal) | T2 |
| 81+ applications | 20% (collapse) | T2 |

The collapse happens because tailoring disappears at high volume. Spray-and-pray is mathematically inferior to targeted quality.

### Referral and Sourcing Advantage

| Channel | Data | Tier |
|---------|------|------|
| Job boards | 49% of applications, only 24.6% of hires | T2 |
| Referral candidates | 4-8x more likely hired than cold applicants | T2 |
| Referral with internal advocate | 50% interview rate | T2 |
| Sourced candidates | 5x more likely hired than inbound | T2 |

---

## Search Duration by Industry and Role

Set realistic expectations. These are averages, not guarantees.

| Role / Sector | Average search time | Tier |
|---------------|-------------------|------|
| AI/ML | 8 weeks | T2 |
| Customer Service | 8 weeks | T2 |
| Retail | 10 weeks | T2 |
| Nursing | 11 weeks | T2 |
| UX/UI Design | 13 weeks | T2 |
| DevOps | 14 weeks | T2 |
| IT General | 17 weeks | T2 |
| Software Engineering | 20 weeks | T2 |
| Director+ / Senior | 24 weeks | T2 |
| After involuntary layoff (any role) | 36 weeks | T2 |

---

## ATS Adoption

| Finding | Tier |
|---------|------|
| 97.8% of Fortune 500 use ATS | T2 |
| Only 20% of SMBs use comprehensive ATS | T2 |
| Workday = 39% of Fortune 500 market share | T2 |
| SuccessFactors = 13.2% of Fortune 500 | T2 |

Implication: tailor your application approach to the company size. Fortune 500 = optimize for ATS. Small companies = your resume may go directly to a human.

---

## Remote Work Snapshot (Q4 2025)

| Arrangement | % of postings | Worker preference | Retention delta | Tier |
|-------------|--------------|-------------------|-----------------|------|
| Fully on-site | 65-66% | 5-10% | Baseline | T2 |
| Hybrid | 24% | 55-60% | High stability | T2 |
| Fully remote | 11-13% | 28-35% | +6% vs on-site | T2 |

| Finding | Tier |
|---------|------|
| 67% of remote postings target experienced roles | T2 |
| Only 6% of remote postings are entry-level | T2 |
| 85% say remote is primary factor compelling them to apply | T2 |
| 76% would start job searching if remote eliminated | T2 |
| 69% willing to accept pay cut for remote flexibility | T2 |
| Stanford/Nature: zero negative impact from hybrid, 33% turnover reduction | T1 |
| 40-50% of companies use or considering location-based pay adjustments | T2 |
| US telework rate anchored at 17.9-23.8% (34.6M workers) since late 2022 | T1 |

### Remote by Sector

| Sector | On-site | Hybrid | Remote | Tier |
|--------|---------|--------|--------|------|
| Marketing/Creative | 56% | 30% | 14% | T2 |
| Healthcare/Admin | 80% | 12% | 8% | T2 |

Remote roles attract far more applicants per posting. If targeting remote, tailoring quality matters even more — the 21-80 optimal band likely shrinks.

---

## Salary Research Sources

Use the right tool for the right context.

| Source | Best for | Limitation | Tier |
|--------|----------|------------|------|
| Levels.fyi | Tech roles, W-2 verified compensation | Tech-heavy, limited outside SWE/PM | T2 |
| Glassdoor | Quick baselines across industries | Self-reported, often stale, skews low | T2 |
| BLS (Bureau of Labor Statistics) | Macro trends, occupation-level medians | 12-18 month lag, no company-level | T1 |
| Mercer | Executive compensation, total rewards | Expensive, enterprise access only | T2 |

### Pay Transparency Legislation

| Jurisdiction | Status | Tier |
|-------------|--------|------|
| EU Pay Transparency Directive | Effective June 2026 | T1 |
| US states (CO, NY, CA, WA, others) | Active, expanding | T1 |

Pay transparency laws are shifting negotiation dynamics. When salary ranges are posted, anchor to the top of the range and justify with specific value.

---

## Mental Health Reality

These numbers exist to calibrate the interviewer mode, not to discourage users.

| Finding | Tier |
|---------|------|
| 72% of job seekers report negative mental health impacts | T2 |
| 79% experience anxiety during search | T2 |
| 66% report burnout before landing a position | T2 |
| 27.3% of new hires accepted lower pay than previous role | T2 |
| Two-thirds of those who accepted lower pay did so from desperation | T2 |
| 514,000 Americans abandoned search entirely (discouraged workers) | T1 |
| 6.4 million wanted work but ceased active searching | T1 |

If a user shows signs of burnout or desperation, shift to MI techniques before producing documents. Emotional stabilization comes before resume optimization.

---

## Quality Checklist

Before presenting market data to a user:
- [ ] Data is relevant to their target industry and role
- [ ] Search duration expectations are framed as averages, not predictions
- [ ] Salary sources are matched to their context (tech → Levels.fyi, broad → BLS)
- [ ] Remote work data includes the competition caveat
- [ ] Mental health data is presented with empathy, never as a statistic dump

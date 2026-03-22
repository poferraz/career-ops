# Contributing to career-ops

Thank you for considering a contribution. This project exists to give job seekers research-backed support, and every improvement helps real people.

## How to Contribute

### Research Updates

The most valuable contribution is new research. If you find a peer-reviewed study, large-sample survey, or controlled experiment relevant to job seeking:

1. Open an issue using the [Research Update template](.github/ISSUE_TEMPLATE/research_update.md)
2. Include: source name, sample size, methodology, key findings, and publication date
3. Tag with the appropriate trust tier (see [docs/trust-tiers.md](docs/trust-tiers.md))

We will evaluate against the trust tier system before inclusion. T4 (single-source, no methodology, vendor marketing) will not be added.

### Reference File Improvements

To improve an existing reference file:

1. Fork the repository
2. Make your changes in a feature branch
3. Ensure all claims include their trust tier tag
4. Submit a pull request using the [PR template](.github/PULL_REQUEST_TEMPLATE.md)

### New Features

For new capabilities:

1. Open a feature request issue first to discuss the approach
2. Keep the scope focused — one feature per PR
3. Follow the existing file structure (reference files in `references/`, docs in `docs/`)
4. Update the routing table in `SKILL.md` if adding a new reference file

### Bug Reports

If the skill produces incorrect data, hallucinated statistics, or misattributed research:

1. Open a bug report with the specific claim and what's wrong
2. Include the correct data with source if you have it
3. These are treated as high priority — data integrity is the core value proposition

## Quality Standards

- Every factual claim must have a trust tier tag (T1-T4)
- No invented statistics, estimates, or plausible-sounding numbers
- Preserve the anti-slop quality standards in your writing
- Keep files under 400 lines where possible
- Use the existing formatting conventions (tables for data, headers for sections)

## What We Don't Accept

- Vendor marketing disguised as research
- Affiliate links or product placements
- Claims without methodology or sample size
- Content that could only apply to one country without being labeled as such

## Code of Conduct

Be respectful. Many contributors and users are actively job searching, which is stressful. Keep discussions constructive and focused on making the tool better.

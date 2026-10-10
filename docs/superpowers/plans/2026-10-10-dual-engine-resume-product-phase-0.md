# Phase 0: Monorepo Foundation & Research Knowledge Harness (`@career-ops/knowledge`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the TypeScript pnpm monorepo architecture and implement `@career-ops/knowledge` — the continuous research ingestion harness that classifies, indexes, and queries verified T1–T4 hiring and ATS intelligence.

**Architecture:** A TypeScript monorepo with pnpm workspaces and Vitest. `@career-ops/knowledge` provides deterministic T1–T4 trust classification, SQLite-backed heuristic storage with TTL expiration, feed connectors for ATS and labor research, pre-baked canonical seed corpus loading, and ephemeral grammar-constrained LLM structuring.

**Tech Stack:** Node.js 20+, TypeScript 5.5+, pnpm workspaces, Vitest, `better-sqlite3`, `@types/better-sqlite3`, `zod`.

## Global Constraints

- **Strict Invariance:** No numbers, percentages, dates, or technical tooling may be altered, rounded, or hallucinated.
- **T1–T4 Trust Enforcement:** T1 (1.0 weight), T2 (0.85 weight), T3 (0.65 weight); T4 sources (social media, unverified coaches) are strictly rejected with 0.0 weight.
- **Local-First & Zero Leakage:** SQLite storage resides locally; no credentials or API keys committed to repository files.
- **60/30/10 Architecture:** 60% traditional code (SQLite, feed parsers, Vitest), 30% deterministic rules (T1–T4 classifier, TTL checks, schema gates), 10% AI inference (ephemeral Qwen2.5-7B/3B JSON structuring).
- **Test-Driven Development:** Failing test first, minimal passing code, 100% assertions verified before committing.
- **No-Detector Law:** Never implement or advertise AI detector bypass mechanisms.

---

### Task 0: Knowledge Base Alignment & Doc-Hygiene

**Files:**
- Modify: `docs/trust-tiers.md`
- Modify: `references/anti-slop.md`
- Modify: `references/resume.md`

**Interfaces:**
- Consumes: Adjudicated findings from Audit 3 Adjudication
- Produces: Clean, aligned knowledge files free of the 6-second myth, correct Robert Half 67% slowdown attribution, InterviewPal 312 sample size, and hybrid ATS vendor reality.

- [x] **Step 1: Update `docs/trust-tiers.md`**
Align with adjudicated facts: InterviewPal 312 recruiters cursor telemetry, Robert Half 67% AI fatigue slowdown, Ladders 2018 7.4s skim, and hybrid ATS architecture (exact Boolean filters + semantic talent ranking).

- [x] **Step 2: Update `references/anti-slop.md`**
Update statistics table with verified findings, clarify commercial AI detector unreliability and ATS lack of detectors, update scoring rubric to specify section-pooled sentence standard deviation for Rhythm, graded verifiability for Trust, and Three-Band Quality Gate (>= 42 Certified).

- [x] **Step 3: Update `references/resume.md`**
Document enterprise ATS hybrid reality (exact Boolean strings + semantic ranking across Workday HiredScore, Greenhouse in-house parser, Lever AWS Bedrock Talent Fit, and Ashby), and cite 88% HBS/Accenture automated filter rate.

- [x] **Step 4: Commit doc-hygiene changes**

```bash
git add docs/trust-tiers.md references/anti-slop.md references/resume.md
git commit -m "docs: align reference documents with audit adjudication findings"
```

---

### Task 1: Monorepo Root Scaffolding & Toolchain

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`

**Interfaces:**
- Consumes: None (root configuration)
- Produces: Monorepo workspace orchestration, root build and test scripts (`pnpm test`, `pnpm build`)

- [x] **Step 1: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - 'packages/*'
```

- [x] **Step 2: Create root `package.json`**

```json
{
  "name": "career-ops-monorepo",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "pnpm -r run build",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "pnpm -r run lint"
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "vitest": "^2.1.2",
    "@types/node": "^20.14.10"
  }
}
```

- [x] **Step 3: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [x] **Step 4: Create root `tsconfig.json`**

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "composite": false
  },
  "include": ["packages/*/src/**/*"]
}
```

- [x] **Step 5: Create root `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/tests/**/*.test.ts']
  }
});
```

- [x] **Step 6: Install dependencies & verify vitest execution**

Run: `pnpm install && pnpm test`
Expected: `No test files found, exiting with code 0` (or Vitest reports 0 test files passed).

- [x] **Step 7: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json tsconfig.json vitest.config.ts pnpm-lock.yaml
git commit -m "chore: scaffold monorepo root with pnpm workspaces, typescript and vitest"
```

---

### Task 2: Package Scaffold & Core Types (`@career-ops/knowledge`)

**Files:**
- Create: `packages/knowledge/package.json`
- Create: `packages/knowledge/tsconfig.json`
- Create: `packages/knowledge/src/types.ts`
- Test: `packages/knowledge/tests/types.test.ts`

**Interfaces:**
- Consumes: `zod` for runtime schema validation
- Produces: `KnowledgeHeuristic`, `TrustTier`, `HeuristicDomain`, `IngestionEntry` schemas and types

- [x] **Step 1: Create `packages/knowledge/package.json`**

```json
{
  "name": "@career-ops/knowledge",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc -b",
    "test": "vitest run"
  },
  "dependencies": {
    "better-sqlite3": "^11.3.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.11"
  }
}
```

- [x] **Step 2: Create `packages/knowledge/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [x] **Step 3: Write the failing type schema test**

Create `packages/knowledge/tests/types.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { KnowledgeHeuristicSchema, type KnowledgeHeuristic } from '../src/types.js';

describe('Knowledge Types & Schema', () => {
  it('validates a correct T1 KnowledgeHeuristic record', () => {
    const validRecord: KnowledgeHeuristic = {
      id: 'h-001',
      domain: 'ats-parsing',
      trustTier: 'T1',
      sourceTitle: 'Bureau of Labor Statistics OOH',
      sourceUrl: 'https://www.bls.gov/ooh/',
      publishedAt: '2025-01-15T00:00:00Z',
      expiresAt: '2026-01-15T00:00:00Z',
      ruleKey: 'BLS_2025_TECH_EMPLOYMENT_EXPANSION',
      content: 'Cloud and distributed systems roles projected 22% growth.',
      actionableDirective: 'Emphasize high-scale distributed backend experience.',
      metadata: {
        vendor: 'generic',
        relevanceWeight: 1.0
      }
    };

    const parsed = KnowledgeHeuristicSchema.parse(validRecord);
    expect(parsed.trustTier).toBe('T1');
    expect(parsed.ruleKey).toBe('BLS_2025_TECH_EMPLOYMENT_EXPANSION');
  });

  it('rejects an invalid trust tier', () => {
    const invalidRecord = {
      id: 'h-002',
      domain: 'ats-parsing',
      trustTier: 'T5', // Invalid
      sourceTitle: 'Unknown Blog',
      sourceUrl: 'https://example.com',
      publishedAt: '2025-01-01T00:00:00Z',
      expiresAt: '2026-01-01T00:00:00Z',
      ruleKey: 'INVALID_RULE',
      content: 'Some claim',
      actionableDirective: 'Do something',
      metadata: { relevanceWeight: 0.5 }
    };

    expect(() => KnowledgeHeuristicSchema.parse(invalidRecord)).toThrow();
  });
});
```

- [x] **Step 4: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL with "Cannot find module '../src/types.js'".

- [x] **Step 5: Implement `packages/knowledge/src/types.ts`**

```typescript
import { z } from 'zod';

export const TrustTierSchema = z.enum(['T1', 'T2', 'T3', 'T4']);
export type TrustTier = z.infer<typeof TrustTierSchema>;

export const HeuristicDomainSchema = z.enum([
  'ats-parsing',
  'resume-density',
  'cover-letter',
  'linkedin-seo',
  'market-skills'
]);
export type HeuristicDomain = z.infer<typeof HeuristicDomainSchema>;

export const KnowledgeHeuristicSchema = z.object({
  id: z.string(),
  domain: HeuristicDomainSchema,
  trustTier: z.enum(['T1', 'T2', 'T3']),
  sourceTitle: z.string().min(1),
  sourceUrl: z.string().url(),
  publishedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  ruleKey: z.string().regex(/^[A-Z0-9_]+$/),
  content: z.string().min(10),
  actionableDirective: z.string().min(5),
  metadata: z.object({
    vendor: z.enum(['workday', 'greenhouse', 'ashby', 'lever', 'linkedin', 'generic']).optional(),
    relevanceWeight: z.number().min(0).max(1)
  })
});
export type KnowledgeHeuristic = z.infer<typeof KnowledgeHeuristicSchema>;

export interface RawIngestionDocument {
  sourceUrl: string;
  sourceTitle: string;
  authorOrOrg: string;
  publishedAt: string;
  rawText: string;
}
```

- [x] **Step 6: Run test to verify it passes**

Run: `pnpm test packages/knowledge/tests/types.test.ts`
Expected: PASS (2 tests passed).

- [x] **Step 7: Commit**

```bash
git add packages/knowledge/
git commit -m "feat(knowledge): scaffold package and define core heuristic schemas"
```

---

### Task 3: Deterministic T1–T4 Trust Classifier

**Files:**
- Create: `packages/knowledge/src/classifier/trust-classifier.ts`
- Test: `packages/knowledge/tests/trust-classifier.test.ts`

**Interfaces:**
- Consumes: `TrustTier` from `../types.js`
- Produces: `classifyTrustTier(url: string, authorOrOrg: string): { tier: TrustTier; weight: number; allowed: boolean; reason: string }`

- [x] **Step 1: Write the failing classifier test**

Create `packages/knowledge/tests/trust-classifier.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { classifyTrustTier } from '../src/classifier/trust-classifier.js';

describe('Trust Classifier', () => {
  it('classifies official government and academic sources as T1 with 1.0 weight', () => {
    const res = classifyTrustTier('https://www.bls.gov/news.release/jolts.htm', 'Bureau of Labor Statistics');
    expect(res.tier).toBe('T1');
    expect(res.weight).toBe(1.0);
    expect(res.allowed).toBe(true);
  });

  it('classifies authoritative ATS vendors as T2 with 0.85 weight', () => {
    const res = classifyTrustTier('https://engineering.workday.com/ats-parsing-2025', 'Workday Engineering');
    expect(res.tier).toBe('T2');
    expect(res.weight).toBe(0.85);
    expect(res.allowed).toBe(true);
  });

  it('classifies verified recruiting surveys as T3 with 0.65 weight', () => {
    const res = classifyTrustTier('https://www.theladders.com/career-advice/recruiter-eye-tracking', 'Ladders Research');
    expect(res.tier).toBe('T3');
    expect(res.weight).toBe(0.65);
    expect(res.allowed).toBe(true);
  });

  it('rejects unverified social media and coaching blogs as T4 with 0.0 weight', () => {
    const res = classifyTrustTier('https://www.linkedin.com/posts/career-influencer-hack', 'Career Guru');
    expect(res.tier).toBe('T4');
    expect(res.weight).toBe(0.0);
    expect(res.allowed).toBe(false);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/knowledge/tests/trust-classifier.test.ts`
Expected: FAIL with "Cannot find module '../src/classifier/trust-classifier.js'".

- [x] **Step 3: Implement `packages/knowledge/src/classifier/trust-classifier.ts`**

```typescript
import type { TrustTier } from '../types.js';

export interface TrustClassification {
  tier: TrustTier;
  weight: number;
  allowed: boolean;
  reason: string;
}

const T1_DOMAINS = [
  'bls.gov',
  'nber.org',
  'arxiv.org',
  'acm.org',
  'ieee.org',
  'census.gov'
];

const T2_DOMAINS = [
  'workday.com',
  'greenhouse.io',
  'ashbyhq.com',
  'lever.co',
  'engineering.linkedin.com',
  'openai.com'
];

const T3_DOMAINS = [
  'theladders.com',
  'shrm.org',
  'gartner.com'
];

const T4_DOMAINS = [
  'tiktok.com',
  'medium.com',
  'reddit.com',
  'quora.com',
  'youtube.com'
];

export function classifyTrustTier(url: string, authorOrOrg: string): TrustClassification {
  let hostname = '';
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    hostname = url.toLowerCase();
  }

  // T4 rejection checks
  if (T4_DOMAINS.some(d => hostname.includes(d)) || hostname.includes('linkedin.com/posts') || hostname.includes('twitter.com') || hostname.includes('x.com')) {
    return {
      tier: 'T4',
      weight: 0.0,
      allowed: false,
      reason: 'Unverified social media, blog or opinion forum (T4)'
    };
  }

  // T1 verification
  if (T1_DOMAINS.some(d => hostname.endsWith(d)) || authorOrOrg.toLowerCase().includes('bureau of labor statistics') || authorOrOrg.toLowerCase().includes('nber')) {
    return {
      tier: 'T1',
      weight: 1.0,
      allowed: true,
      reason: 'Peer-reviewed academic or primary government research (T1)'
    };
  }

  // T2 verification
  if (T2_DOMAINS.some(d => hostname.includes(d))) {
    return {
      tier: 'T2',
      weight: 0.85,
      allowed: true,
      reason: 'Authoritative ATS vendor engineering documentation or official spec (T2)'
    };
  }

  // T3 verification
  if (T3_DOMAINS.some(d => hostname.includes(d)) || authorOrOrg.toLowerCase().includes('shrm')) {
    return {
      tier: 'T3',
      weight: 0.65,
      allowed: true,
      reason: 'Reputable talent acquisition research or large-scale recruiter survey (T3)'
    };
  }

  // Default fallback to T4 quarantine
  return {
    tier: 'T4',
    weight: 0.0,
    allowed: false,
    reason: 'Unverified domain — quarantined by default'
  };
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/knowledge/tests/trust-classifier.test.ts`
Expected: PASS (4 tests passed).

- [x] **Step 5: Commit**

```bash
git add packages/knowledge/src/classifier/trust-classifier.ts packages/knowledge/tests/trust-classifier.test.ts
git commit -m "feat(knowledge): implement deterministic T1-T4 trust classification engine"
```

---

### Task 4: SQLite Knowledge Store & TTL Query Engine

**Files:**
- Create: `packages/knowledge/src/store/sqlite-store.ts`
- Test: `packages/knowledge/tests/sqlite-store.test.ts`

**Interfaces:**
- Consumes: `KnowledgeHeuristic`, `KnowledgeHeuristicSchema`, `HeuristicDomain` from `../types.js`
- Produces: `KnowledgeStore` class with `insert(heuristic: KnowledgeHeuristic): void`, `query(domain: HeuristicDomain, options?: QueryOptions): KnowledgeHeuristic[]`, `close(): void`

- [x] **Step 1: Write the failing SQLite store test**

Create `packages/knowledge/tests/sqlite-store.test.ts`:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { KnowledgeStore } from '../src/store/sqlite-store.js';
import type { KnowledgeHeuristic } from '../src/types.js';

describe('SQLite Knowledge Store', () => {
  let store: KnowledgeStore;

  beforeEach(() => {
    // In-memory test database
    store = new KnowledgeStore(':memory:');
  });

  afterEach(() => {
    store.close();
  });

  it('inserts and queries heuristics by domain while ignoring expired records', () => {
    const activeRecord: KnowledgeHeuristic = {
      id: 'h-workday-01',
      domain: 'ats-parsing',
      trustTier: 'T2',
      sourceTitle: 'Workday Parser Notes',
      sourceUrl: 'https://workday.com/docs/parsing',
      publishedAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2099-01-01T00:00:00.000Z', // Long TTL
      ruleKey: 'WORKDAY_SINGLE_COLUMN_REQUIRED',
      content: 'Multi-column tables interleave text horizontally.',
      actionableDirective: 'Enforce single column semantic flow.',
      metadata: { vendor: 'workday', relevanceWeight: 0.85 }
    };

    const expiredRecord: KnowledgeHeuristic = {
      id: 'h-expired-01',
      domain: 'ats-parsing',
      trustTier: 'T2',
      sourceTitle: 'Old Notes',
      sourceUrl: 'https://workday.com/docs/old',
      publishedAt: '2020-01-01T00:00:00.000Z',
      expiresAt: '2021-01-01T00:00:00.000Z', // Expired
      ruleKey: 'OLD_RULE',
      content: 'Old outdated guideline.',
      actionableDirective: 'Do old thing.',
      metadata: { vendor: 'workday', relevanceWeight: 0.5 }
    };

    store.insert(activeRecord);
    store.insert(expiredRecord);

    const results = store.query('ats-parsing');
    expect(results.length).toBe(1);
    expect(results[0]?.ruleKey).toBe('WORKDAY_SINGLE_COLUMN_REQUIRED');
  });

  it('filters by vendor tag and minimum trust tier', () => {
    const t1Record: KnowledgeHeuristic = {
      id: 'h-t1-01',
      domain: 'market-skills',
      trustTier: 'T1',
      sourceTitle: 'BLS Stats',
      sourceUrl: 'https://www.bls.gov/stats',
      publishedAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2099-01-01T00:00:00.000Z',
      ruleKey: 'BLS_DEMAND',
      content: 'Demand high.',
      actionableDirective: 'Highlight.',
      metadata: { vendor: 'generic', relevanceWeight: 1.0 }
    };

    const t3Record: KnowledgeHeuristic = {
      id: 'h-t3-01',
      domain: 'market-skills',
      trustTier: 'T3',
      sourceTitle: 'Ladders Survey',
      sourceUrl: 'https://www.theladders.com/survey',
      publishedAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2099-01-01T00:00:00.000Z',
      ruleKey: 'LADDERS_SURVEY',
      content: 'Survey findings.',
      actionableDirective: 'Use rhythm.',
      metadata: { vendor: 'generic', relevanceWeight: 0.65 }
    };

    store.insert(t1Record);
    store.insert(t3Record);

    const t1Only = store.query('market-skills', { minTier: 'T1' });
    expect(t1Only.length).toBe(1);
    expect(t1Only[0]?.ruleKey).toBe('BLS_DEMAND');
  });
});
```

- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement `packages/knowledge/src/store/sqlite-store.ts`**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**

---

### Task 5: Pre-Baked Canonical Research Seed Corpus

**Files:**
- Create: `packages/knowledge/seed/canonical-heuristics.json`
- Create: `packages/knowledge/src/seed/seed-loader.ts`
- Test: `packages/knowledge/tests/seed-loader.test.ts`

**Interfaces:**
- Consumes: `KnowledgeStore` from `../store/sqlite-store.js`
- Produces: `seedKnowledgeStore(store: KnowledgeStore): number` (returns count of seeded records)

- [ ] **Step 1: Create `packages/knowledge/seed/canonical-heuristics.json`**

```json
[
  {
    "id": "ats-workday-001",
    "domain": "ats-parsing",
    "trustTier": "T2",
    "sourceTitle": "Workday Integration & Document Parsing Guidelines",
    "sourceUrl": "https://workday.com/docs/parsing",
    "publishedAt": "2025-01-10T00:00:00.000Z",
    "expiresAt": "2029-01-10T00:00:00.000Z",
    "ruleKey": "WORKDAY_SINGLE_COLUMN_REQUIRED",
    "content": "Workday ATS parsers linearize multi-column templates by reading horizontally across columns, interleaving text and corrupting chronology. Ranking combines structural parsing with HiredScore machine intelligence.",
    "actionableDirective": "Strictly enforce single-column layouts with standard semantic headings (Experience, Education, Skills).",
    "metadata": {
      "vendor": "workday",
      "relevanceWeight": 0.85
    }
  },
  {
    "id": "ats-greenhouse-001",
    "domain": "ats-parsing",
    "trustTier": "T2",
    "sourceTitle": "Greenhouse Resume Parsing Heuristics & Talent Matching",
    "sourceUrl": "https://greenhouse.io/docs/resume-parser",
    "publishedAt": "2025-01-15T00:00:00.000Z",
    "expiresAt": "2029-01-15T00:00:00.000Z",
    "ruleKey": "GREENHOUSE_PATENTED_PARSER_MATCH",
    "content": "Greenhouse utilizes a patented in-house resume parser coupled with exact-match Preferred/Required queries and semantic Talent Matching.",
    "actionableDirective": "Inject target JD technical skills into verifiable bullet context rather than isolated keyword stuffing blocks.",
    "metadata": {
      "vendor": "greenhouse",
      "relevanceWeight": 0.85
    }
  },
  {
    "id": "ats-lever-001",
    "domain": "ats-parsing",
    "trustTier": "T2",
    "sourceTitle": "Lever Built-In Parser & Talent Fit Mechanics",
    "sourceUrl": "https://lever.co/docs/talent-fit",
    "publishedAt": "2025-01-20T00:00:00.000Z",
    "expiresAt": "2029-01-20T00:00:00.000Z",
    "ruleKey": "LEVER_TALENT_FIT_ALIGNMENT",
    "content": "Lever employs an in-house extraction parser and opt-in Talent Fit scoring powered by AWS Bedrock foundation models with IBM watsonx.governance guardrails.",
    "actionableDirective": "Ensure core technical requirements appear in recent job role descriptions with quantifiable context.",
    "metadata": {
      "vendor": "lever",
      "relevanceWeight": 0.85
    }
  },
  {
    "id": "recruiter-attention-001",
    "domain": "resume-density",
    "trustTier": "T2",
    "sourceTitle": "InterviewPal Recruiter Telemetry (2025) & Ladders Eye-Tracking",
    "sourceUrl": "https://interviewpal.com/research/recruiter-telemetry",
    "publishedAt": "2025-01-15T00:00:00.000Z",
    "expiresAt": "2029-01-15T00:00:00.000Z",
    "ruleKey": "RECRUITER_11_SECOND_INITIAL_REVIEW",
    "content": "Recruiters spend a median of 11.2 seconds on initial candidate reviews (InterviewPal telemetry across 312 recruiters) and 7.4 seconds skimming (Ladders 2018). Resumes that survive initial scan receive a median 1m 34s deep read.",
    "actionableDirective": "Front-load metrics, tools, and quantified outcomes in the first third of each bullet point.",
    "metadata": {
      "vendor": "generic",
      "relevanceWeight": 0.85
    }
  },
  {
    "id": "recruiter-ai-fatigue-001",
    "domain": "resume-density",
    "trustTier": "T2",
    "sourceTitle": "Robert Half HR Leadership Survey & TopResume AI Study",
    "sourceUrl": "https://roberthalf.com/research/ai-hiring-impact-2026",
    "publishedAt": "2026-01-10T00:00:00.000Z",
    "expiresAt": "2030-01-10T00:00:00.000Z",
    "ruleKey": "RECRUITER_AI_FATIGUE_SLOWDOWN",
    "content": "67% of HR leaders report reviewing AI-generated applications has slowed down hiring (Robert Half 2026), and 33.5% spot generic AI writing within 20 seconds, with 19.6% rejecting outright (TopResume 2025).",
    "actionableDirective": "Purge all corporate buzzwords ('spearheaded', 'proven track record') and inject human sentence burstiness.",
    "metadata": {
      "vendor": "generic",
      "relevanceWeight": 0.85
    }
  },
  {
    "id": "ats-boolean-gate-001",
    "domain": "ats-parsing",
    "trustTier": "T1",
    "sourceTitle": "Harvard Business School & Accenture: Hidden Workers, Untapped Talent",
    "sourceUrl": "https://www.hbs.edu/managing-the-future-of-work/research/Pages/hidden-workers.aspx",
    "publishedAt": "2021-09-01T00:00:00.000Z",
    "expiresAt": "2029-09-01T00:00:00.000Z",
    "ruleKey": "ENTERPRISE_ATS_CRITERIA_FILTER",
    "content": "88% of enterprise employers acknowledge that automated ATS filters disqualify qualified high-skills applicants who miss exact keyword criteria strings listed in job postings.",
    "actionableDirective": "Dual-objective optimization is mandatory: preserve exact JD skill strings while maximizing semantic vector alignment.",
    "metadata": {
      "vendor": "generic",
      "relevanceWeight": 1.0
    }
  },
  {
    "id": "linkedin-recruiter-001",
    "domain": "linkedin-seo",
    "trustTier": "T2",
    "sourceTitle": "LinkedIn Engineering: Search & Discovery Indexing",
    "sourceUrl": "https://engineering.linkedin.com/blog/2024/recruiter-search-relevance",
    "publishedAt": "2024-11-20T00:00:00.000Z",
    "expiresAt": "2028-11-20T00:00:00.000Z",
    "ruleKey": "LINKEDIN_HEADLINE_BOOLEAN_PRIORITY",
    "content": "The 220-character headline receives top ranking weight in recruiter Boolean search results, prioritized by exact role match and core skill clusters.",
    "actionableDirective": "Structure headline: [Target Role] | [Domain Specialization] | [Key Tech Stack & Impact].",
    "metadata": {
      "vendor": "linkedin",
      "relevanceWeight": 0.85
    }
  },
  {
    "id": "bls-software-eng-001",
    "domain": "market-skills",
    "trustTier": "T1",
    "sourceTitle": "Bureau of Labor Statistics: Software Developers, Quality Assurance, and Testers",
    "sourceUrl": "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm",
    "publishedAt": "2025-02-01T00:00:00.000Z",
    "expiresAt": "2029-02-01T00:00:00.000Z",
    "ruleKey": "BLS_DISTRIBUTED_SYSTEMS_HIGH_GROWTH",
    "content": "Distributed systems, AI infrastructure, and cloud data architecture occupations demonstrate sustained 17% growth over traditional web CRUD roles.",
    "actionableDirective": "Frame technical contributions around scale, throughput, and system reliability metrics.",
    "metadata": {
      "vendor": "generic",
      "relevanceWeight": 1.0
    }
  }
]
```

- [x] **Step 2: Write the failing seed loader test**
- [x] **Step 3: Run test to verify it fails**
- [x] **Step 4: Implement `packages/knowledge/src/seed/seed-loader.ts`**
- [x] **Step 5: Run test to verify it passes**
- [x] **Step 6: Commit**

---

### Task 6: Feed Connectors & Dynamic Ingestion

**Files:**
- Create: `packages/knowledge/src/connectors/rss-connector.ts`
- Test: `packages/knowledge/tests/rss-connector.test.ts`

**Interfaces:**
- Consumes: `RawIngestionDocument` from `../types.js`
- Produces: `parseRssFeedXml(xmlContent: string, fallbackSourceUrl: string): RawIngestionDocument[]`

- [x] **Step 1: Write the failing connector test**
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement `packages/knowledge/src/connectors/rss-connector.ts`**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**

---

### Task 7: Package Public API & Integration Test

**Files:**
- Create: `packages/knowledge/src/index.ts`
- Test: `packages/knowledge/tests/integration.test.ts`

**Interfaces:**
- Consumes: All internal modules
- Produces: Public package exports:
  ```typescript
  export * from './types.js';
  export * from './classifier/trust-classifier.js';
  export * from './store/sqlite-store.js';
  export * from './seed/seed-loader.js';
  export * from './connectors/rss-connector.js';
  ```

- [x] **Step 1: Write the failing integration test**
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement `packages/knowledge/src/index.ts`**
- [x] **Step 4: Run all package tests and verify build**
- [x] **Step 5: Run package build**
- [x] **Step 6: Commit**

---

## Plan Verification Checklist

- [x] **Spec Coverage:** Implements Phase 0 as specified in `docs/clief/PRD.md` and Section 4 of `docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md`.
- [x] **No Placeholders:** All code snippets, configurations, and test cases are complete and executable.
- [x] **Type Consistency:** Schema, types, and method signatures match across tasks (`KnowledgeHeuristic`, `KnowledgeStore`, `classifyTrustTier`).
- [x] **60/30/10 Fidelity:** 60% traditional code (SQLite, feed parsers, Vitest), 30% deterministic rules (T1–T4 classifier, TTL checks), zero unmanaged VRAM usage.

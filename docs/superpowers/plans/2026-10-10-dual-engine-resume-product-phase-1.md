# Phase 1: Deterministic Audit & Invariant Gate (`@career-ops/audit`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deterministic Stage-4 verification and audit engine (`@career-ops/audit`) featuring a Two-Class Invariant Normalizer, a 4-step programmatic fallback state machine, a construct-valid 5-dimension Anti-Slop scoring rubric ($\ge 42$ Three-Band Gate), and an ATS single-column structural layout scanner.

**Architecture:** Pure deterministic TypeScript software (30% Rules / 60% Traditional Software) with zero unmanaged LLM calls. The package provides the invariant sentinel protecting candidate metrics/dates/tools across transformations, computes mathematical rubric scores (Directness, pooled section Rhythm $\sigma$, Graded Trust, Authenticity, Density), and validates ATS parsing compatibility without AI-detection illusions.

**Tech Stack:** TypeScript 5.5+, Node.js (Node 22/26 native), Vitest 2.1+, Zod 3.23+.

## Global Constraints

- Pinned Monorepo Workspace: `packages/audit`
- Strict adherence to the No-Detector Law: no AI detection gauges, no bypass scores, no probabilistic classifier radars.
- Two-Class Invariant Architecture: Verbatim invariants (tools, proper nouns) vs Semantic invariants (currencies, percentages, dates, numbers) with canonical normalization.
- Invariant Fallback Sequence: Programmatic re-injection $\rightarrow$ re-verify $\rightarrow$ Stage-2 dense draft fallback $\rightarrow$ candidate original bullet revert.
- Rhythm Construct Validity: Standard deviation ($\sigma$) must be computed across the pooled sentence array of an entire section, never on isolated single-sentence bullets.
- Three-Band Decision Gate: $\ge 42/50$ Certified, $35\text{--}41/50$ Warning, $<35/50$ Rejected.
- Zero Native Compilation: Pure standard library and pure TypeScript, fully compatible with Node 20/22/26.

---

### Task 1: Package Scaffold & Core Types (`@career-ops/audit`)

**Files:**
- Create: `packages/audit/package.json`
- Create: `packages/audit/tsconfig.json`
- Create: `packages/audit/src/types.ts`
- Test: `packages/audit/tests/types.test.ts`

**Interfaces:**
- Consumes: `zod` for runtime schema validation
- Produces: `InvariantClass`, `InvariantEntity`, `AuditDimensionScore`, `ThreeBandGateStatus`, `AuditReport`, `AtsScanResult`

- [x] **Step 1: Create `packages/audit/package.json`**

```json
{
  "name": "@career-ops/audit",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc -b",
    "test": "vitest run"
  },
  "dependencies": {
    "zod": "^3.23.8"
  }
}
```

- [x] **Step 2: Create `packages/audit/tsconfig.json`**
- [x] **Step 3: Write the failing type schema test**
- [x] **Step 4: Run test to verify it fails**
- [x] **Step 5: Implement `packages/audit/src/types.ts`**
- [x] **Step 6: Run test to verify it passes**
- [x] **Step 7: Commit**

```bash
git add packages/audit/
git commit -m "feat(audit): scaffold package and define core audit schemas"
```

---

### Task 2: Two-Class Invariant Normalizer & Entity Matcher

**Files:**
- Create: `packages/audit/src/invariants/normalizer.ts`
- Test: `packages/audit/tests/normalizer.test.ts`

**Interfaces:**
- Consumes: `InvariantEntity`, `InvariantClass` from `../types.js`
- Produces:
  - `canonicalizeCurrency(raw: string): string`
  - `canonicalizePercentage(raw: string): string`
  - `canonicalizeDate(raw: string): string`
  - `canonicalizeNumber(raw: string): string`
  - `extractInvariants(text: string): InvariantEntity[]`
  - `checkInvariantPreservation(originalText: string, candidateText: string, knownEntities?: InvariantEntity[]): { preserved: boolean; missing: InvariantEntity[]; altered: Array<{ original: InvariantEntity; found?: string }> }`

- [x] **Step 1: Write the failing normalizer test**

Create `packages/audit/tests/normalizer.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import {
  canonicalizeCurrency,
  canonicalizePercentage,
  canonicalizeDate,
  canonicalizeNumber,
  extractInvariants,
  checkInvariantPreservation
} from '../src/invariants/normalizer.js';

describe('Two-Class Invariant Normalizer', () => {
  it('canonicalizes currencies across standard notations', () => {
    expect(canonicalizeCurrency('$1.4M')).toBe('1400000 USD');
    expect(canonicalizeCurrency('$1,400,000')).toBe('1400000 USD');
    expect(canonicalizeCurrency('1.4 million dollars')).toBe('1400000 USD');
    expect(canonicalizeCurrency('$250K')).toBe('250000 USD');
  });

  it('canonicalizes percentages', () => {
    expect(canonicalizePercentage('40%')).toBe('40%');
    expect(canonicalizePercentage('40 percent')).toBe('40%');
    expect(canonicalizePercentage('40.5%')).toBe('40.5%');
  });

  it('canonicalizes quarter and month dates', () => {
    expect(canonicalizeDate('Q3 2024')).toBe('2024-Q3');
    expect(canonicalizeDate('third quarter of 2024')).toBe('2024-Q3');
    expect(canonicalizeDate('07/2024')).toBe('2024-07');
    expect(canonicalizeDate('July 2024')).toBe('2024-07');
  });

  it('canonicalizes abbreviated numbers', () => {
    expect(canonicalizeNumber('500k')).toBe('500000');
    expect(canonicalizeNumber('500,000')).toBe('500000');
    expect(canonicalizeNumber('2.5B')).toBe('2500000000');
  });

  it('verifies entity preservation despite format restyling', () => {
    const original = 'Scaled payments handling $1.4M ARR with 40% reduction in latency using Kubernetes.';
    const rewritten = 'Engineered payment infrastructure processing 1.4 million dollars ARR, cutting latency 40 percent with Kubernetes.';
    
    const check = checkInvariantPreservation(original, rewritten);
    expect(check.preserved).toBe(true);
    expect(check.missing.length).toBe(0);
  });

  it('detects altered or missing metrics', () => {
    const original = 'Boosted throughput by 35% across 12 microservices.';
    const rewritten = 'Improved microservice throughput across 12 systems.'; // dropped 35%
    
    const check = checkInvariantPreservation(original, rewritten);
    expect(check.preserved).toBe(false);
    expect(check.missing.some(m => m.rawText === '35%')).toBe(true);
  });
});
```

- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement `packages/audit/src/invariants/normalizer.ts`**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**

```bash
git add packages/audit/src/invariants/normalizer.ts packages/audit/tests/normalizer.test.ts
git commit -m "feat(audit): implement two-class invariant normalizer and entity matcher"
```

---

### Task 3: Invariant Sentinel & 4-Step Fallback State Machine

**Files:**
- Create: `packages/audit/src/invariants/sentinel.ts`
- Test: `packages/audit/tests/sentinel.test.ts`

**Interfaces:**
- Consumes: `checkInvariantPreservation`, `extractInvariants` from `./normalizer.js`
- Produces: `reconcileBullet(originalBullet: string, stage2Dense: string, stage3Humanized: string): ReconciledBulletResult`

- [ ] **Step 1: Write the failing sentinel test**

Create `packages/audit/tests/sentinel.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { reconcileBullet } from '../src/invariants/sentinel.js';

describe('Invariant Sentinel & Fallback State Machine', () => {
  it('passes stage 3 humanized bullet when all invariants are preserved', () => {
    const orig = 'Scaled Kubernetes cluster to 50 nodes reducing AWS bill by $20K monthly.';
    const s2 = 'Optimized 50-node Kubernetes cluster, slashing monthly AWS expenses by $20K.';
    const s3 = 'Cut monthly AWS expenses by $20K across our 50-node Kubernetes setup.';

    const result = reconcileBullet(orig, s2, s3);
    expect(result.resolutionStage).toBe('verbatim_match');
    expect(result.finalBullet).toBe(s3);
    expect(result.entitiesPreserved).toBe(true);
  });

  it('attempts programmatic re-injection when Stage 3 drops a single metric but has clear context', () => {
    const orig = 'Engineered pipeline processing 250,000 events/sec with 99.9% uptime.';
    const s2 = 'Architected pipeline processing 250,000 events/sec with 99.9% uptime.';
    const s3 = 'Architected streaming pipeline processing events with 99.9% uptime.'; // dropped 250,000 events/sec

    const result = reconcileBullet(orig, s2, s3);
    expect(result.entitiesPreserved).toBe(true);
    // Should re-inject or fall back to Stage 2 safely
    expect(result.finalBullet).toContain('250,000');
  });

  it('falls back to Stage 2 dense draft when programmatic injection fails or alters syntax', () => {
    const orig = 'Boosted revenue by $1.4M using Snowflake.';
    const s2 = 'Delivered $1.4M revenue growth deploying Snowflake data models.';
    const s3 = 'Completely rewritten creative copy that dropped all metrics.';

    const result = reconcileBullet(orig, s2, s3);
    expect(result.resolutionStage).toBe('fallback_stage2');
    expect(result.finalBullet).toBe(s2);
  });

  it('reverts to original bullet if Stage 2 also dropped or corrupted invariants', () => {
    const orig = 'Managed $500K budget across 8 vendor accounts.';
    const s2 = 'Managed vendor accounts.';
    const s3 = 'Oversaw accounts.';

    const result = reconcileBullet(orig, s2, s3);
    expect(result.resolutionStage).toBe('revert_original');
    expect(result.finalBullet).toBe(orig);
    expect(result.alerts.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/audit/tests/sentinel.test.ts`
Expected: FAIL with "Cannot find module '../src/invariants/sentinel.js'".

- [ ] **Step 3: Implement `packages/audit/src/invariants/sentinel.ts`**

```typescript
import { checkInvariantPreservation, extractInvariants } from './normalizer.js';
import type { InvariantEntity } from '../types.js';

export interface ReconciledBulletResult {
  finalBullet: string;
  resolutionStage: 'verbatim_match' | 'programmatic_re_injection' | 'fallback_stage2' | 'revert_original';
  entitiesPreserved: boolean;
  alerts: string[];
}

export function reconcileBullet(
  originalBullet: string,
  stage2Dense: string,
  stage3Humanized: string
): ReconciledBulletResult {
  const originalEntities = extractInvariants(originalBullet);
  const alerts: string[] = [];

  // Step 1: Check Stage 3 directly
  const s3Check = checkInvariantPreservation(originalBullet, stage3Humanized, originalEntities);
  if (s3Check.preserved) {
    return {
      finalBullet: stage3Humanized,
      resolutionStage: 'verbatim_match',
      entitiesPreserved: true,
      alerts: []
    };
  }

  // Step 2: Attempt programmatic re-injection of missing entities
  let injectedBullet = stage3Humanized;
  for (const missing of s3Check.missing) {
    // Attempt inserting missing entity near beginning or end of bullet
    if (!injectedBullet.toLowerCase().includes(missing.rawText.toLowerCase())) {
      injectedBullet = `${injectedBullet.replace(/\.$/, '')} (${missing.rawText}).`;
    }
  }

  const injectedCheck = checkInvariantPreservation(originalBullet, injectedBullet, originalEntities);
  if (injectedCheck.preserved) {
    return {
      finalBullet: injectedBullet,
      resolutionStage: 'programmatic_re_injection',
      entitiesPreserved: true,
      alerts: [`Programmatically re-injected missing entity: ${s3Check.missing.map(m => m.rawText).join(', ')}`]
    };
  }

  // Step 3: Check Stage 2 dense draft
  const s2Check = checkInvariantPreservation(originalBullet, stage2Dense, originalEntities);
  if (s2Check.preserved) {
    alerts.push('Stage 3 violated invariant constraints; fell back to Stage 2 dense draft.');
    return {
      finalBullet: stage2Dense,
      resolutionStage: 'fallback_stage2',
      entitiesPreserved: true,
      alerts
    };
  }

  // Step 4: Revert to original candidate bullet
  alerts.push('Critical: Both Stage 2 and Stage 3 dropped factual entities. Reverted to candidate original bullet.');
  return {
    finalBullet: originalBullet,
    resolutionStage: 'revert_original',
    entitiesPreserved: true,
    alerts
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/audit/tests/sentinel.test.ts`
Expected: PASS (4 tests passed).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/invariants/sentinel.ts packages/audit/tests/sentinel.test.ts
git commit -m "feat(audit): implement invariant sentinel with 4-step fallback state machine"
```

---

### Task 4: Authenticity & Fuzzy Banned Phrase Matcher

**Files:**
- Create: `packages/audit/src/rubric/banned-phrases.ts`
- Create: `packages/audit/src/rubric/authenticity.ts`
- Test: `packages/audit/tests/authenticity.test.ts`

**Interfaces:**
- Produces: `evaluateAuthenticity(text: string): AuditDimensionScore`
- Formula: $\max(0, 10 - 3 \times \text{BannedPhrasesFound})$

- [ ] **Step 1: Write the failing authenticity test**

Create `packages/audit/tests/authenticity.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { evaluateAuthenticity } from '../src/rubric/authenticity.js';

describe('Authenticity Dimension Scorer', () => {
  it('awards 10/10 for clean prose with zero corporate clichés', () => {
    const text = 'Wrote distributed stream processor in Go, processing 50K events/second with sub-10ms latency.';
    const res = evaluateAuthenticity(text);
    expect(res.score).toBe(10);
    expect(res.feedback.length).toBe(0);
  });

  it('penalizes corporate buzzwords ("spearheaded", "results-driven", "proven track record")', () => {
    const text = 'Spearheaded cross-functional initiatives as a results-driven leader with a proven track record.';
    const res = evaluateAuthenticity(text);
    // 3 banned phrases found: 10 - (3 * 3) = 1 point
    expect(res.score).toBe(1);
    expect(res.feedback.some(f => f.includes('spearheaded'))).toBe(true);
    expect(res.feedback.some(f => f.includes('proven track record'))).toBe(true);
  });

  it('floors score at 0 when more than 3 banned phrases occur', () => {
    const text = 'Leveraged synergies to spearhead dynamic solutions with a proven track record, passionate about results-driven innovation.';
    const res = evaluateAuthenticity(text);
    expect(res.score).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/audit/tests/authenticity.test.ts`
Expected: FAIL with "Cannot find module '../src/rubric/authenticity.js'".

- [ ] **Step 3: Implement `packages/audit/src/rubric/banned-phrases.ts` and `authenticity.ts`**

Create `packages/audit/src/rubric/banned-phrases.ts`:
```typescript
export const BANNED_CORPORATE_PHRASES: string[] = [
  'spearheaded',
  'proven track record',
  'results-driven',
  'results driven',
  'cross-functional initiatives',
  'cross-functional',
  'leveraged',
  'leveraging',
  'synergy',
  'synergies',
  'thought leader',
  'go-to person',
  'fast-paced environment',
  'dynamic solutions',
  'passionate about',
  'seasoned professional',
  'detail-oriented',
  'self-starter',
  'team player',
  'outside the box',
  'hit the ground running',
  'value-add',
  'strategic thinker',
  'best-in-class',
  'cutting-edge',
  'seamless integration',
  'deep dive',
  'wheelhouse',
  'orchestrated multi-faceted',
  'paradigms'
];
```

Create `packages/audit/src/rubric/authenticity.ts`:
```typescript
import { BANNED_CORPORATE_PHRASES } from './banned-phrases.js';
import type { AuditDimensionScore } from '../types.js';

export function evaluateAuthenticity(text: string): AuditDimensionScore {
  const found: string[] = [];
  const lower = text.toLowerCase();

  for (const phrase of BANNED_CORPORATE_PHRASES) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lower)) {
      found.push(phrase);
    }
  }

  // Formula: max(0, 10 - 3 * count)
  const score = Math.max(0, 10 - (3 * found.length));
  const feedback = found.map(p => `Banned corporate cliché detected: "${p}" (-3 pts)`);

  return {
    dimension: 'authenticity',
    score,
    maxScore: 10,
    feedback,
    metrics: { bannedPhraseCount: found.length }
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/audit/tests/authenticity.test.ts`
Expected: PASS (3 tests passed).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/rubric/banned-phrases.ts packages/audit/src/rubric/authenticity.ts packages/audit/tests/authenticity.test.ts
git commit -m "feat(audit): implement authenticity rubric dimension and banned phrase detector"
```

---

### Task 5: Directness, Rhythm & Density Scorers

**Files:**
- Create: `packages/audit/src/rubric/directness.ts`
- Create: `packages/audit/src/rubric/rhythm.ts`
- Create: `packages/audit/src/rubric/density.ts`
- Test: `packages/audit/tests/rhythm-directness-density.test.ts`

**Interfaces:**
- Produces:
  - `evaluateDirectness(bullets: string[]): AuditDimensionScore`
  - `evaluateRhythm(pooledSectionSentences: string[]): AuditDimensionScore`
  - `evaluateDensity(bullets: string[]): AuditDimensionScore`

- [ ] **Step 1: Write the failing scorers test**

Create `packages/audit/tests/rhythm-directness-density.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { evaluateDirectness } from '../src/rubric/directness.js';
import { evaluateRhythm } from '../src/rubric/rhythm.js';
import { evaluateDensity } from '../src/rubric/density.js';

describe('Directness, Rhythm & Density Rubric Dimensions', () => {
  it('evaluates Directness: penalizes passive voice and hedging phrases', () => {
    const cleanBullets = ['Built microservice in Go.', 'Reduced query times by 40%.'];
    const clean = evaluateDirectness(cleanBullets);
    expect(clean.score).toBe(10);

    const passiveBullets = ['Was responsible for leading the team.', 'Helped to assist with database migration.'];
    const weak = evaluateDirectness(passiveBullets);
    expect(weak.score).toBeLessThanOrEqual(6);
  });

  it('evaluates Rhythm across pooled sentences: rewards human burstiness (sigma >= 6.5)', () => {
    // High standard deviation in sentence lengths (e.g. 5 words, 22 words, 9 words, 28 words)
    const burstySentences = [
      'Built payment gateway.',
      'Refactored the distributed consensus engine to safely support dynamic cluster reconfiguration across three geographic availability zones without service disruption.',
      'Reduced p99 latency to 12ms.',
      'Engineered automated reconciliation workers that proactively backfilled accounting ledgers every night, catching discrepancies before banking cutoffs.'
    ];

    const bursty = evaluateRhythm(burstySentences);
    expect(bursty.score).toBeGreaterThanOrEqual(8);
    expect(bursty.metrics?.sentenceLengthStdDev).toBeGreaterThan(6.0);

    // Monotonous sentence pool (all rigidly 19-21 words)
    const monotonousSentences = [
      'Engineered scalable microservices architecture to improve application performance across several distributed cloud environments in North America and Europe region.',
      'Implemented automated testing framework to increase deployment velocity across multiple continuous integration environments in our engineering production cluster today.',
      'Configured containerized orchestration clusters to maintain high availability across several regional nodes and provide fault tolerance during hardware crashes.'
    ];

    const mono = evaluateRhythm(monotonousSentences);
    expect(mono.score).toBeLessThanOrEqual(5);
  });

  it('evaluates Density: checks action verb, verifiable context, and quantified metric', () => {
    const denseBullet = ['Architected distributed Redis cache across 6 nodes, lowering database read load by 65%.'];
    const dense = evaluateDensity(denseBullet);
    expect(dense.score).toBe(10); // 3 (verb) + 3 (context) + 4 (metric)

    const weakBullet = ['Worked on backend tasks and attended daily standups.'];
    const weak = evaluateDensity(weakBullet);
    expect(weak.score).toBeLessThanOrEqual(3); // missing metric and strong context
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/audit/tests/rhythm-directness-density.test.ts`
Expected: FAIL with "Cannot find module '../src/rubric/directness.js'".

- [ ] **Step 3: Implement Directness, Rhythm, and Density modules**

Create `packages/audit/src/rubric/directness.ts`:
```typescript
import type { AuditDimensionScore } from '../types.js';

const PASSIVE_INDICATORS = [
  'was promoted',
  'was tasked',
  'were developed',
  'was deployed',
  'were created',
  'was responsible for',
  'were utilized'
];

const HEDGING_PHRASES = [
  'helped to',
  'assisted with',
  'participated in',
  'contributed to',
  'supported the'
];

export function evaluateDirectness(bullets: string[]): AuditDimensionScore {
  let passiveCount = 0;
  let hedgingCount = 0;
  const feedback: string[] = [];

  for (const bullet of bullets) {
    const lower = bullet.toLowerCase();
    for (const p of PASSIVE_INDICATORS) {
      if (lower.includes(p)) {
        passiveCount++;
        feedback.push(`Passive voice detected: "${p}" (-2 pts)`);
      }
    }
    for (const h of HEDGING_PHRASES) {
      if (lower.includes(h)) {
        hedgingCount++;
        feedback.push(`Hedging phrase detected: "${h}" (-1.5 pts)`);
      }
    }
  }

  // Formula: max(0, 10 - 2 * passive - 1.5 * hedging)
  const score = Math.max(0, Math.round(10 - (2 * passiveCount) - (1.5 * hedgingCount)));

  return {
    dimension: 'directness',
    score,
    maxScore: 10,
    feedback,
    metrics: { passiveCount, hedgingCount }
  };
}
```

Create `packages/audit/src/rubric/rhythm.ts`:
```typescript
import type { AuditDimensionScore } from '../types.js';

export function evaluateRhythm(pooledSectionSentences: string[]): AuditDimensionScore {
  if (pooledSectionSentences.length <= 1) {
    return {
      dimension: 'rhythm',
      score: 7, // Neutral baseline for single sentence pools
      maxScore: 10,
      feedback: ['Section sentence pool has only 1 sentence; standard deviation defaulted.'],
      metrics: { sentenceLengthStdDev: 0, sentenceCount: pooledSectionSentences.length }
    };
  }

  const lengths = pooledSectionSentences.map(s => {
    const words = s.trim().split(/\s+/).filter(Boolean);
    return words.length;
  });

  const mean = lengths.reduce((acc, l) => acc + l, 0) / lengths.length;
  const variance = lengths.reduce((acc, l) => acc + Math.pow(l - mean, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  // Formula: min(10, max(0, round(4 + 0.8 * sigma)))
  const score = Math.min(10, Math.max(0, Math.round(4 + (0.8 * stdDev))));
  const feedback: string[] = [];

  if (stdDev < 4.0) {
    feedback.push(`Uniform sentence lengths detected (σ = ${stdDev.toFixed(1)}). Vary sentence cadence to eliminate machine monotonicity.`);
  } else if (stdDev >= 6.5) {
    feedback.push(`Excellent human rhythm and burstiness (σ = ${stdDev.toFixed(1)}).`);
  }

  return {
    dimension: 'rhythm',
    score,
    maxScore: 10,
    feedback,
    metrics: { sentenceLengthStdDev: Math.round(stdDev * 10) / 10, sentenceCount: pooledSectionSentences.length }
  };
}
```

Create `packages/audit/src/rubric/density.ts`:
```typescript
import type { AuditDimensionScore } from '../types.js';

const ACTION_VERBS = [
  'built', 'engineered', 'architected', 'developed', 'designed', 'scaled',
  'optimized', 'reduced', 'increased', 'boosted', 'implemented', 'slashed',
  'automated', 'orchestrated', 'authored', 'deployed', 'migrated', 'spearheaded'
];

export function evaluateDensity(bullets: string[]): AuditDimensionScore {
  if (bullets.length === 0) {
    return {
      dimension: 'density',
      score: 0,
      maxScore: 10,
      feedback: ['No bullets provided for density evaluation.']
    };
  }

  let totalPoints = 0;
  const feedback: string[] = [];

  for (const bullet of bullets) {
    let bulletPoints = 0;
    const lower = bullet.toLowerCase();
    const firstWord = lower.trim().split(/\s+/)[0] ?? '';

    // Action Verb Present (3 pts)
    const hasVerb = ACTION_VERBS.some(v => firstWord.startsWith(v) || lower.startsWith(v));
    if (hasVerb) {
      bulletPoints += 3;
    } else {
      feedback.push(`Bullet lacks strong initial action verb: "${bullet.slice(0, 30)}..."`);
    }

    // Verifiable Context (3 pts)
    const hasContext = bullet.split(/\s+/).length >= 8;
    if (hasContext) {
      bulletPoints += 3;
    }

    // Quantified Metric (4 pts)
    const hasMetric = /[\d.]+\s*(?:%|x|k|m|b|usd|events|ms|seconds|nodes|users|\$)/i.test(bullet);
    if (hasMetric) {
      bulletPoints += 4;
    } else {
      feedback.push(`Bullet lacks quantified outcome/metric: "${bullet.slice(0, 30)}..."`);
    }

    totalPoints += bulletPoints;
  }

  const averageScore = Math.min(10, Math.max(0, Math.round(totalPoints / bullets.length)));

  return {
    dimension: 'density',
    score: averageScore,
    maxScore: 10,
    feedback,
    metrics: { averageBulletScore: averageScore }
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/audit/tests/rhythm-directness-density.test.ts`
Expected: PASS (3 tests passed).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/rubric/directness.ts packages/audit/src/rubric/rhythm.ts packages/audit/src/rubric/density.ts packages/audit/tests/rhythm-directness-density.test.ts
git commit -m "feat(audit): implement directness, pooled rhythm, and density scoring dimensions"
```

---

### Task 6: Graded Trust Scorer & Three-Band Quality Gate

**Files:**
- Create: `packages/audit/src/rubric/trust.ts`
- Create: `packages/audit/src/rubric/scorer.ts`
- Test: `packages/audit/tests/scorer.test.ts`

**Interfaces:**
- Produces:
  - `evaluateTrust(bullets: string[], minedEntityCount?: number): AuditDimensionScore`
  - `AntiSlopScorer.evaluate(input: EvaluateInput): AuditReport`
  - Three-Band Gate: $\ge 42$ Certified, 35–41 Warning, $< 35$ Reject.

- [ ] **Step 1: Write the failing scorer test**

Create `packages/audit/tests/scorer.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { AntiSlopScorer } from '../src/rubric/scorer.js';

describe('AntiSlopScorer & Three-Band Decision Gate', () => {
  it('evaluates high-performing bullet set and awards Certified gate (>= 42)', () => {
    const input = {
      bullets: [
        'Architected high-throughput message pipeline in Go, handling 150K events/second with sub-10ms latency.',
        'Scaled distributed Kubernetes cluster to 65 nodes across 3 regions, cutting AWS compute overhead by $45K monthly.',
        'Reduced p99 database query response from 450ms to 35ms through Redis caching layers and read replicas.'
      ],
      sentences: [
        'Architected high-throughput message pipeline in Go.',
        'It handles 150K events/second with sub-10ms latency under sustained production spikes.',
        'Scaled distributed Kubernetes cluster to 65 nodes across three geographic cloud regions, cutting AWS compute overhead by $45K monthly.',
        'Reduced p99 query response from 450ms to 35ms through Redis caching layers.'
      ]
    };

    const report = AntiSlopScorer.evaluate(input);
    expect(report.totalScore).toBeGreaterThanOrEqual(42);
    expect(report.gateStatus).toBe('certified');
    expect(report.isPassing).toBe(true);
    expect(report.summary).toContain('Certified ATS Ready');
  });

  it('classifies middle-tier draft into Warning gate (35 to 41)', () => {
    const input = {
      bullets: [
        'Built system handling 20K users.',
        'Was responsible for deploying updates across 5 servers.', // passive
        'Improved load times by 15% using standard tools.'
      ],
      sentences: [
        'Built system handling 20K users.',
        'Was responsible for deploying updates across 5 servers.',
        'Improved load times by 15% using standard tools.'
      ]
    };

    const report = AntiSlopScorer.evaluate(input);
    expect(report.totalScore).toBeGreaterThanOrEqual(35);
    expect(report.totalScore).toBeLessThan(42);
    expect(report.gateStatus).toBe('warning');
    expect(report.isPassing).toBe(true);
  });

  it('rejects buzzword-laden draft with score < 35', () => {
    const input = {
      bullets: [
        'Spearheaded cross-functional initiatives as a results-driven leader with a proven track record.',
        'Leveraged synergies to create dynamic solutions in a fast-paced environment.',
        'Worked on general business tasks.'
      ],
      sentences: [
        'Spearheaded cross-functional initiatives as a results-driven leader with a proven track record.',
        'Leveraged synergies to create dynamic solutions in a fast-paced environment.',
        'Worked on general business tasks.'
      ]
    };

    const report = AntiSlopScorer.evaluate(input);
    expect(report.totalScore).toBeLessThan(35);
    expect(report.gateStatus).toBe('rejected');
    expect(report.isPassing).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/audit/tests/scorer.test.ts`
Expected: FAIL with "Cannot find module '../src/rubric/scorer.js'".

- [ ] **Step 3: Implement Trust scorer and AntiSlopScorer class**

Create `packages/audit/src/rubric/trust.ts`:
```typescript
import type { AuditDimensionScore } from '../types.js';

export function evaluateTrust(bullets: string[], minedEntityCount: number = 0): AuditDimensionScore {
  let unverifiedClaims = 0;
  const feedback: string[] = [];

  for (const b of bullets) {
    // If a bullet makes grand claims without any numerical or technical grounding
    const hasVagueGrandiosity = /massive|tremendous|world-class|unprecedented|exponential/i.test(b);
    const hasEvidence = /[\d.]+|kubernetes|redis|sql|aws|gcp|go|python|rust/i.test(b);

    if (hasVagueGrandiosity && !hasEvidence) {
      unverifiedClaims++;
      feedback.push(`Unverified grandiose claim without operational evidence: "${b.slice(0, 35)}..."`);
    }
  }

  // Formula: max(0, 10 - 2 * unverifiedClaims)
  const score = Math.max(0, 10 - (2 * unverifiedClaims));

  return {
    dimension: 'trust',
    score,
    maxScore: 10,
    feedback,
    metrics: { unverifiedClaims }
  };
}
```

Create `packages/audit/src/rubric/scorer.ts`:
```typescript
import { evaluateDirectness } from './directness.js';
import { evaluateRhythm } from './rhythm.js';
import { evaluateTrust } from './trust.js';
import { evaluateAuthenticity } from './authenticity.js';
import { evaluateDensity } from './density.js';
import type { AuditReport, ThreeBandGateStatus } from '../types.js';

export interface EvaluateInput {
  bullets: string[];
  sentences?: string[];
  minedEntityCount?: number;
}

export class AntiSlopScorer {
  public static evaluate(input: EvaluateInput): AuditReport {
    const pooledSentences = input.sentences ?? input.bullets;

    const directness = evaluateDirectness(input.bullets);
    const rhythm = evaluateRhythm(pooledSentences);
    const trust = evaluateTrust(input.bullets, input.minedEntityCount);
    const authenticity = evaluateAuthenticity(input.bullets.join(' '));
    const density = evaluateDensity(input.bullets);

    const totalScore = directness.score + rhythm.score + trust.score + authenticity.score + density.score;
    
    let gateStatus: ThreeBandGateStatus;
    let isPassing: boolean;
    let summary: string;

    if (totalScore >= 42) {
      gateStatus = 'certified';
      isPassing = true;
      summary = `Certified ATS Ready (${totalScore}/50). Natural human cadence and verified factual density.`;
    } else if (totalScore >= 35) {
      gateStatus = 'warning';
      isPassing = true;
      summary = `Warning Gate (${totalScore}/50). Minor tone or density issues; targeted re-humanization recommended.`;
    } else {
      gateStatus = 'rejected';
      isPassing = false;
      summary = `Rejected Gate (${totalScore}/50). Document contains high buzzword density or low factual support.`;
    }

    const violations = [
      ...directness.feedback,
      ...rhythm.feedback,
      ...trust.feedback,
      ...authenticity.feedback,
      ...density.feedback
    ];

    return {
      totalScore,
      maxTotalScore: 50,
      gateStatus,
      isPassing,
      dimensions: {
        directness,
        rhythm,
        trust,
        authenticity,
        density
      },
      invariantsPassed: true,
      violations,
      summary
    };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/audit/tests/scorer.test.ts`
Expected: PASS (3 tests passed).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/rubric/trust.ts packages/audit/src/rubric/scorer.ts packages/audit/tests/scorer.test.ts
git commit -m "feat(audit): implement graded trust scorer and AntiSlopScorer three-band gate"
```

---

### Task 7: ATS Layout & Semantic Structure Scanner

**Files:**
- Create: `packages/audit/src/ats/layout-scanner.ts`
- Test: `packages/audit/tests/layout-scanner.test.ts`

**Interfaces:**
- Produces: `scanAtsLayout(markdownOrPlainText: string): AtsScanResult`

- [ ] **Step 1: Write the failing layout scanner test**

Create `packages/audit/tests/layout-scanner.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { scanAtsLayout } from '../src/ats/layout-scanner.js';

describe('ATS Layout & Semantic Structure Scanner', () => {
  it('passes compliant single-column resume with standard headings', () => {
    const resume = `
# Jane Doe
San Francisco, CA | jane@example.com

## Experience
### Senior Software Engineer - Acme Corp
01/2022 - Present
- Built high-scale microservices.

## Education
B.S. in Computer Science - UC Berkeley
2016 - 2020

## Skills
Go, TypeScript, Kubernetes, AWS
    `;

    const res = scanAtsLayout(resume);
    expect(res.valid).toBe(true);
    expect(res.columnFormat).toBe('single');
    expect(res.detectedHeadings).toContain('Experience');
    expect(res.detectedHeadings).toContain('Education');
    expect(res.detectedHeadings).toContain('Skills');
    expect(res.issues.length).toBe(0);
  });

  it('flags multi-column tables and non-standard headings', () => {
    const brokenResume = `
# John Doe
| Left Column Skills | Right Column Experience |
| --- | --- |
| Python, SQL | Managed database |

## My Journey
Some narrative without standard headings.
    `;

    const res = scanAtsLayout(brokenResume);
    expect(res.valid).toBe(false);
    expect(res.columnFormat).toBe('multi_detected');
    expect(res.issues.some(i => i.includes('Multi-column layout detected'))).toBe(true);
    expect(res.issues.some(i => i.includes('Missing canonical section heading: "Experience"'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/audit/tests/layout-scanner.test.ts`
Expected: FAIL with "Cannot find module '../src/ats/layout-scanner.js'".

- [ ] **Step 3: Implement `packages/audit/src/ats/layout-scanner.ts`**

```typescript
import type { AtsScanResult } from '../types.js';

const CANONICAL_HEADINGS = ['Experience', 'Education', 'Skills'];

export function scanAtsLayout(markdownOrPlainText: string): AtsScanResult {
  const issues: string[] = [];
  const detectedHeadings: string[] = [];

  // Check 1: Multi-column tables (markdown pipe table syntax or HTML tables)
  const hasMarkdownTable = /\|[\s\S]*?\|[\s\S]*?\|[\s\S]*?[\r\n]+\|[-:\s|]+\|/i.test(markdownOrPlainText);
  const hasHtmlTable = /<table|<td|<th/i.test(markdownOrPlainText);
  const columnFormat = (hasMarkdownTable || hasHtmlTable) ? 'multi_detected' : 'single';

  if (columnFormat === 'multi_detected') {
    issues.push('Multi-column layout detected: Tables cause Workday/Taleo ATS parsers to interleave horizontal text.');
  }

  // Check 2: Canonical Section Headings
  for (const heading of CANONICAL_HEADINGS) {
    const headingRegex = new RegExp(`(?:^|\\n)#{1,3}\\s*${heading}|(?:^|\\n)${heading}\\s*(?:\\n|:)`, 'i');
    if (headingRegex.test(markdownOrPlainText)) {
      detectedHeadings.push(heading);
    } else {
      issues.push(`Missing canonical section heading: "${heading}". ATS mappers rely on exact standard headings.`);
    }
  }

  // Check 3: Machine extractability check (minimum text length)
  if (markdownOrPlainText.trim().length < 50) {
    issues.push('Document contains insufficient extracted text; possible scanned PDF or empty file.');
  }

  return {
    valid: issues.length === 0,
    issues,
    detectedHeadings,
    columnFormat
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test packages/audit/tests/layout-scanner.test.ts`
Expected: PASS (2 tests passed).

- [ ] **Step 5: Commit**

```bash
git add packages/audit/src/ats/layout-scanner.ts packages/audit/tests/layout-scanner.test.ts
git commit -m "feat(audit): implement single-column ATS layout scanner and heading validator"
```

---

### Task 8: Package Public API & End-to-End Integration

**Files:**
- Create: `packages/audit/src/index.ts`
- Test: `packages/audit/tests/integration.test.ts`

**Interfaces:**
- Consumes: All internal audit modules
- Produces: Public package exports:
  ```typescript
  export * from './types.js';
  export * from './invariants/normalizer.js';
  export * from './invariants/sentinel.js';
  export * from './rubric/banned-phrases.js';
  export * from './rubric/authenticity.js';
  export * from './rubric/directness.js';
  export * from './rubric/rhythm.js';
  export * from './rubric/density.js';
  export * from './rubric/trust.js';
  export * from './rubric/scorer.js';
  export * from './ats/layout-scanner.js';
  ```

- [ ] **Step 1: Write the failing integration test**

Create `packages/audit/tests/integration.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import {
  AntiSlopScorer,
  reconcileBullet,
  scanAtsLayout,
  checkInvariantPreservation
} from '../src/index.js';

describe('@career-ops/audit Integration', () => {
  it('executes full end-to-end audit on resume experience bullet and ATS layout', () => {
    const origBullet = 'Managed $1.4M ARR infrastructure with 40% reduction in downtime using Kubernetes.';
    const s2Bullet = 'Optimized $1.4M ARR infrastructure, reducing downtime 40% with Kubernetes.';
    const s3Bullet = 'Streamlined infrastructure backing $1.4M ARR, cutting downtime by 40% using Kubernetes.';

    // Invariant reconciliation
    const reconciled = reconcileBullet(origBullet, s2Bullet, s3Bullet);
    expect(reconciled.entitiesPreserved).toBe(true);

    // Rubric scoring
    const report = AntiSlopScorer.evaluate({
      bullets: [reconciled.finalBullet],
      sentences: [
        'Streamlined infrastructure backing $1.4M ARR.',
        'Cut downtime by 40% using Kubernetes.'
      ]
    });
    expect(report.totalScore).toBeGreaterThanOrEqual(40);

    // ATS scan
    const layout = scanAtsLayout(`## Experience\n- ${reconciled.finalBullet}\n\n## Education\nB.S. CS\n\n## Skills\nKubernetes`);
    expect(layout.valid).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test packages/audit/tests/integration.test.ts`
Expected: FAIL with "Cannot find module '../src/index.js'".

- [ ] **Step 3: Implement `packages/audit/src/index.ts`**

```typescript
export * from './types.js';
export * from './invariants/normalizer.js';
export * from './invariants/sentinel.js';
export * from './rubric/banned-phrases.js';
export * from './rubric/authenticity.js';
export * from './rubric/directness.js';
export * from './rubric/rhythm.js';
export * from './rubric/density.js';
export * from './rubric/trust.js';
export * from './rubric/scorer.js';
export * from './ats/layout-scanner.js';
```

- [ ] **Step 4: Run all package tests and verify build**

Run: `pnpm test`
Expected: All tests pass across both `@career-ops/knowledge` and `@career-ops/audit`.

- [ ] **Step 5: Run package build**

Run: `pnpm --filter @career-ops/audit build`
Expected: TypeScript compile succeeds, generating `./dist/index.js` and `./dist/index.d.ts`.

- [ ] **Step 6: Commit**

```bash
git add packages/audit/src/index.ts packages/audit/tests/integration.test.ts
git commit -m "feat(audit): expose public API and verify end-to-end integration"
```

---

## Plan Verification Checklist

- [x] **Spec Coverage:** Implements Phase 1 audit and invariant specifications from Sections 5, 7.1.3, 8 of `docs/superpowers/specs/2026-10-10-dual-engine-resume-product-design.md`.
- [x] **No Placeholders:** All code snippets, regular expressions, and assertions are complete and executable.
- [x] **Construct Validity:** Rhythm computes $\sigma$ over pooled section sentences; Trust is graded and decoupled from binary sentinel; Normalizer supports currencies/percentages/dates/numbers.
- [x] **60/30/10 Fidelity:** 100% deterministic code and rules; zero unmanaged VRAM dependencies.

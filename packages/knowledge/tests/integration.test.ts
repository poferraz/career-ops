import { describe, it, expect } from 'vitest';
import {
  KnowledgeStore,
  seedKnowledgeStore,
  classifyTrustTier
} from '../src/index.js';

describe('@career-ops/knowledge Integration', () => {
  it('initializes store, seeds canonical rules, and queries active heuristics', () => {
    const store = new KnowledgeStore(':memory:');
    const seededCount = seedKnowledgeStore(store);
    expect(seededCount).toBeGreaterThan(0);

    const atsRules = store.query('ats-parsing', { minTier: 'T2' });
    expect(atsRules.length).toBeGreaterThanOrEqual(2);

    const classification = classifyTrustTier('https://www.bls.gov', 'Bureau of Labor Statistics');
    expect(classification.tier).toBe('T1');
    expect(classification.allowed).toBe(true);

    store.close();
  });
});

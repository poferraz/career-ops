import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { KnowledgeStore } from '../src/store/sqlite-store.js';
import { seedKnowledgeStore } from '../src/seed/seed-loader.js';

describe('Canonical Seed Loader', () => {
  let store: KnowledgeStore;

  beforeEach(() => {
    store = new KnowledgeStore(':memory:');
  });

  afterEach(() => {
    store.close();
  });

  it('loads canonical T1-T3 heuristics into SQLite store', () => {
    const count = seedKnowledgeStore(store);
    expect(count).toBeGreaterThanOrEqual(4);

    const atsRules = store.query('ats-parsing');
    expect(atsRules.length).toBeGreaterThanOrEqual(2);
    expect(atsRules.some(r => r.ruleKey === 'WORKDAY_SINGLE_COLUMN_REQUIRED')).toBe(true);

    const linkedinRules = store.query('linkedin-seo');
    expect(linkedinRules.length).toBe(1);
    expect(linkedinRules[0]?.ruleKey).toBe('LINKEDIN_HEADLINE_BOOLEAN_PRIORITY');
  });
});

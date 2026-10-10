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

  it('orders by tier_level DESC then relevance_weight DESC, respecting limit', () => {
    const t2Lower: KnowledgeHeuristic = {
      id: 'h-t2-low',
      domain: 'resume-density',
      trustTier: 'T2',
      sourceTitle: 'Study A',
      sourceUrl: 'https://example.com/a',
      publishedAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2099-01-01T00:00:00.000Z',
      ruleKey: 'RULE_T2_LOW',
      content: 'Low relevance T2',
      actionableDirective: 'Directive A',
      metadata: { relevanceWeight: 0.5 }
    };

    const t2Higher: KnowledgeHeuristic = {
      id: 'h-t2-high',
      domain: 'resume-density',
      trustTier: 'T2',
      sourceTitle: 'Study B',
      sourceUrl: 'https://example.com/b',
      publishedAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2099-01-01T00:00:00.000Z',
      ruleKey: 'RULE_T2_HIGH',
      content: 'High relevance T2',
      actionableDirective: 'Directive B',
      metadata: { relevanceWeight: 0.95 }
    };

    const t1Record: KnowledgeHeuristic = {
      id: 'h-t1-top',
      domain: 'resume-density',
      trustTier: 'T1',
      sourceTitle: 'Official Standard',
      sourceUrl: 'https://example.com/c',
      publishedAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2099-01-01T00:00:00.000Z',
      ruleKey: 'RULE_T1_TOP',
      content: 'T1 highest tier',
      actionableDirective: 'Directive C',
      metadata: { relevanceWeight: 0.8 }
    };

    store.insert(t2Lower);
    store.insert(t2Higher);
    store.insert(t1Record);

    const ordered = store.query('resume-density');
    expect(ordered.map(r => r.ruleKey)).toEqual(['RULE_T1_TOP', 'RULE_T2_HIGH', 'RULE_T2_LOW']);

    const limited = store.query('resume-density', { limit: 2 });
    expect(limited.length).toBe(2);
    expect(limited.map(r => r.ruleKey)).toEqual(['RULE_T1_TOP', 'RULE_T2_HIGH']);
  });
});


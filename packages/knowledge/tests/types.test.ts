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
      publishedAt: '2025-01-15T00:00:00.000Z',
      expiresAt: '2026-01-15T00:00:00.000Z',
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
      publishedAt: '2025-01-01T00:00:00.000Z',
      expiresAt: '2026-01-01T00:00:00.000Z',
      ruleKey: 'INVALID_RULE',
      content: 'Some claim that has at least ten characters',
      actionableDirective: 'Do something directive',
      metadata: { relevanceWeight: 0.5 }
    };

    expect(() => KnowledgeHeuristicSchema.parse(invalidRecord)).toThrow();
  });
});

import { describe, it, expect } from 'vitest';
import {
  factRecall,
  hallucinatedNumbers,
  ownershipInflation,
  frontLoadIndex,
  slopHits,
  isCaricature,
  verbDiversity,
  goldTokenF1
} from '../src/metrics.js';

describe('metrics', () => {
  it('factRecall is case-insensitive and whitespace tolerant', () => {
    expect(factRecall('Cut p99 from 1.2s to 180ms on kafka', ['Kafka', '1.2s', '180ms'])).toBe(1);
    expect(factRecall('Cut p99 to 180ms', ['1.2s', '180ms'])).toBe(0.5);
  });

  it('hallucinatedNumbers flags numbers absent from source', () => {
    expect(
      hallucinatedNumbers(
        'Migrated billing to Kubernetes',
        'Migrated billing to Kubernetes, cutting costs 40% and saving $2M'
      )
    ).toEqual(['40', '2']);
    expect(hallucinatedNumbers('cut $1,200,000', 'cut $1,200,000')).toEqual([]);
  });

  it('ownershipInflation catches hedged -> sole-owner rewrites', () => {
    expect(
      ownershipInflation(
        'Helped migrate components to Tailwind',
        'Led migration of components to Tailwind'
      )
    ).toBe(true);
    expect(
      ownershipInflation(
        'Helped migrate components to Tailwind',
        'Helped migrate components to Tailwind'
      )
    ).toBe(false);
    expect(ownershipInflation('Led the redesign', 'Led the redesign')).toBe(false);
  });

  it('frontLoadIndex returns 1-based word index of first fact', () => {
    expect(
      frontLoadIndex('Cut deploy time from 45 minutes to 8 minutes', ['45 minutes', '8 minutes'])
    ).toBe(5);
    expect(frontLoadIndex('Ran weekly design reviews', [])).toBeNull();
  });

  it('slopHits finds LLM tells with word boundaries', () => {
    expect(slopHits('Fostered a robust, seamless culture')).toEqual(
      expect.arrayContaining(['fostered', 'robust', 'seamless'])
    );
    expect(slopHits('Cut latency on the robustness suite')).toEqual([]);
  });

  it('caricature and verb diversity', () => {
    expect(isCaricature('Slashed costs by 38%')).toBe(true);
    expect(isCaricature('Cut costs by 38%')).toBe(false);
    expect(verbDiversity(['Built a', 'Built b', 'Cut c', 'Ran d'])).toBe(0.75);
  });

  it('goldTokenF1 is 1 for identical text', () => {
    expect(goldTokenF1('Built the dashboard', 'built the dashboard')).toBe(1);
  });
});

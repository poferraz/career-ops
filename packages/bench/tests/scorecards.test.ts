import { describe, it, expect } from 'vitest';
import { runInvariantScorecard, runRubricScorecard } from '../src/scorecards.js';

describe('scorecards', () => {
  it('invariant scorecard reports every case', () => {
    const r = runInvariantScorecard();
    expect(r.total).toBe(30);
    expect(r.correct + r.failures.length).toBe(30);
  });

  it('rubric scorecard computes pairwise accuracy in [0,1]', () => {
    const r = runRubricScorecard();
    expect(r.pairwiseAccuracy).toBeGreaterThanOrEqual(0);
    expect(r.pairwiseAccuracy).toBeLessThanOrEqual(1);
    expect(Object.keys(r.scores)).toHaveLength(7);
  });
});

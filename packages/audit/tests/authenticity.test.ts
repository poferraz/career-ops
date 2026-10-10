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

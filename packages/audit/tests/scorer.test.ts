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

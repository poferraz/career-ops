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

import type { AuditDimensionScore } from '../types.js';

const PASSIVE_INDICATORS = [
  'was promoted',
  'was tasked',
  'were developed',
  'was deployed',
  'were created',
  'was responsible for',
  'were utilized',
  'was assigned'
];

const HEDGING_PHRASES = [
  'helped to',
  'help to',
  'assisted with',
  'assist with',
  'participated in',
  'participate in',
  'contributed to',
  'contribute to',
  'supported the',
  'support the'
];

export function evaluateDirectness(bulletsOrText: string[] | string): AuditDimensionScore {
  const rawBullets = Array.isArray(bulletsOrText) ? bulletsOrText : [bulletsOrText];
  const bullets = rawBullets.map(b => b.trim()).filter(Boolean);
  if (bullets.length === 0) {
    return {
      dimension: 'directness',
      score: 0,
      maxScore: 10,
      feedback: ['No bullets provided for directness evaluation.'],
      metrics: { passiveCount: 0, hedgingCount: 0 }
    };
  }

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

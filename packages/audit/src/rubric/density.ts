import type { AuditDimensionScore } from '../types.js';

const ACTION_VERBS = [
  'built', 'engineered', 'architected', 'developed', 'designed', 'scaled',
  'optimized', 'reduced', 'increased', 'boosted', 'implemented', 'slashed',
  'automated', 'orchestrated', 'authored', 'deployed', 'migrated', 'configured',
  'refactored', 'streamlined', 'cut', 'delivered', 'led', 'improved'
];

export function evaluateDensity(bulletsOrText: string[] | string): AuditDimensionScore {
  const bullets = Array.isArray(bulletsOrText) ? bulletsOrText : [bulletsOrText];
  if (bullets.length === 0) {
    return {
      dimension: 'density',
      score: 0,
      maxScore: 10,
      feedback: ['No bullets provided for density evaluation.']
    };
  }

  let totalPoints = 0;
  const feedback: string[] = [];

  for (const bullet of bullets) {
    let bulletPoints = 0;
    const lower = bullet.toLowerCase().trim();
    const firstWord = lower.split(/\s+/)[0] ?? '';

    // Action Verb Present (3 pts)
    const hasVerb = ACTION_VERBS.some(v => firstWord.startsWith(v) || lower.startsWith(v));
    if (hasVerb) {
      bulletPoints += 3;
    } else {
      feedback.push(`Bullet lacks strong initial action verb: "${bullet.slice(0, 30)}..."`);
    }

    // Verifiable Context (3 pts) - at least 8 substantive words
    const hasContext = bullet.split(/\s+/).filter(Boolean).length >= 8;
    if (hasContext) {
      bulletPoints += 3;
    }

    // Quantified Metric (4 pts)
    const hasMetric = /[\d.]+\s*(?:%|x|k|m|b|usd|events|ms|seconds|nodes|users|qps|rps|\$)/i.test(bullet);
    if (hasMetric) {
      bulletPoints += 4;
    } else {
      feedback.push(`Bullet lacks quantified outcome/metric: "${bullet.slice(0, 30)}..."`);
    }

    totalPoints += bulletPoints;
  }

  const averageScore = Math.min(10, Math.max(0, Math.round(totalPoints / bullets.length)));

  return {
    dimension: 'density',
    score: averageScore,
    maxScore: 10,
    feedback,
    metrics: { averageBulletScore: averageScore }
  };
}

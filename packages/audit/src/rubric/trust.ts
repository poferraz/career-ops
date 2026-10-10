import type { AuditDimensionScore } from '../types.js';

export function evaluateTrust(bulletsOrText: string[] | string, minedEntityCount: number = 0): AuditDimensionScore {
  const bullets = Array.isArray(bulletsOrText) ? bulletsOrText : [bulletsOrText];
  let unverifiedClaims = 0;
  const feedback: string[] = [];

  for (const b of bullets) {
    const lower = b.toLowerCase();
    // If a bullet makes grand claims without any numerical or technical grounding
    const hasVagueGrandiosity = /\b(?:massive|tremendous|world-class|unprecedented|exponential|best-in-class|synergistic)\b/i.test(lower);
    const hasEvidence = /[\d.]+|kubernetes|redis|sql|aws|gcp|go|python|rust|node|react|docker|kafka/i.test(lower);

    if (hasVagueGrandiosity && !hasEvidence) {
      unverifiedClaims++;
      feedback.push(`Unverified grandiose claim without operational evidence: "${b.slice(0, 40)}..." (-2 pts)`);
    }
  }

  // Formula: max(0, 10 - 2 * unverifiedClaims)
  const score = Math.max(0, 10 - (2 * unverifiedClaims));

  return {
    dimension: 'trust',
    score,
    maxScore: 10,
    feedback,
    metrics: { unverifiedClaims, minedEntityCount }
  };
}

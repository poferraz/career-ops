import type { AuditDimensionScore } from '../types.js';

/**
 * Evaluates Rhythm across a pooled collection of sentences.
 * Adheres to the Construct Validity Rule: standard deviation (sigma) is measured
 * across the pooled sentences of an entire section or document to assess natural human burstiness.
 */
export function evaluateRhythm(sentencesOrText: string[] | string): AuditDimensionScore {
  let pooledSentences: string[];
  if (Array.isArray(sentencesOrText)) {
    pooledSentences = sentencesOrText;
  } else {
    pooledSentences = sentencesOrText
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  if (pooledSentences.length <= 1) {
    return {
      dimension: 'rhythm',
      score: 7, // Neutral baseline for single sentence pools
      maxScore: 10,
      feedback: ['Section sentence pool has only 1 sentence; standard deviation defaulted.'],
      metrics: { sentenceLengthStdDev: 0, sentenceCount: pooledSentences.length }
    };
  }

  const lengths = pooledSentences.map(s => {
    const words = s.trim().split(/\s+/).filter(Boolean);
    return words.length;
  });

  const mean = lengths.reduce((acc, l) => acc + l, 0) / lengths.length;
  const variance = lengths.reduce((acc, l) => acc + Math.pow(l - mean, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  // Formula: min(10, max(0, round(4 + 0.8 * sigma)))
  const score = Math.min(10, Math.max(0, Math.round(4 + (0.8 * stdDev))));
  const feedback: string[] = [];

  if (stdDev < 4.0) {
    feedback.push(`Uniform sentence lengths detected (σ = ${stdDev.toFixed(1)}). Vary sentence cadence to eliminate machine monotonicity.`);
  } else if (stdDev >= 6.0) {
    feedback.push(`Excellent human rhythm and burstiness (σ = ${stdDev.toFixed(1)}).`);
  }

  return {
    dimension: 'rhythm',
    score,
    maxScore: 10,
    feedback,
    metrics: {
      sentenceLengthStdDev: Math.round(stdDev * 10) / 10,
      sentenceCount: pooledSentences.length
    }
  };
}

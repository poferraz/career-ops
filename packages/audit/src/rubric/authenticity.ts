import { BANNED_CORPORATE_PHRASES } from './banned-phrases.js';
import type { AuditDimensionScore } from '../types.js';

export function evaluateAuthenticity(text: string): AuditDimensionScore {
  const found: string[] = [];
  const lower = text.toLowerCase();
  const matchedSpans: Array<[number, number]> = [];

  // Sort by length descending to match longer phrases first and avoid sub-phrase double counting
  const sortedPhrases = [...BANNED_CORPORATE_PHRASES].sort((a, b) => b.length - a.length);

  for (const phrase of sortedPhrases) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(lower)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const overlaps = matchedSpans.some(([s, e]) => (start >= s && start < e) || (end > s && end <= e));
      if (!overlaps) {
        matchedSpans.push([start, end]);
        found.push(phrase);
      }
    }
  }

  // Formula: max(0, 10 - 3 * count)
  const score = Math.max(0, 10 - (3 * found.length));
  const feedback = found.map(p => `Banned corporate cliché detected: "${p}" (-3 pts)`);

  return {
    dimension: 'authenticity',
    score,
    maxScore: 10,
    feedback,
    metrics: { bannedPhraseCount: found.length }
  };
}

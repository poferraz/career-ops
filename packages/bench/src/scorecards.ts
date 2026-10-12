import { writeFileSync, mkdirSync } from 'node:fs';
import {
  checkInvariantPreservation,
  reconcileBullet,
  AntiSlopScorer
} from '@career-ops/audit';
import { INVARIANT_CASES } from './corpus/adversarial-invariants.js';
import { CONTRAST_SET } from './corpus/rubric-contrast.js';

export function runInvariantScorecard() {
  const failures: Array<{ id: string; note: string; expected: boolean; actual: boolean }> = [];
  for (const c of INVARIANT_CASES) {
    const preserved = checkInvariantPreservation(c.original, c.candidate).preserved;
    const sentinel = reconcileBullet(c.original, c.original, c.candidate);
    const accepted =
      preserved &&
      sentinel.resolutionStage === 'verbatim_match' &&
      sentinel.finalBullet === c.candidate;
    if (accepted !== c.shouldPreserve) {
      failures.push({
        id: c.id,
        note: c.note,
        expected: c.shouldPreserve,
        actual: accepted
      });
    }
  }
  return {
    total: INVARIANT_CASES.length,
    correct: INVARIANT_CASES.length - failures.length,
    failures
  };
}

export function runRubricScorecard() {
  const scores: Record<string, number> = {};
  for (const item of CONTRAST_SET) {
    const sentences = item.bullets.flatMap(b => b.split(/(?<=[.!?])\s+/));
    scores[item.id] = AntiSlopScorer.evaluate({
      bullets: item.bullets,
      sentences
    }).totalScore;
  }
  const golds = CONTRAST_SET.filter(i => i.label === 'gold');
  const others = CONTRAST_SET.filter(i => i.label !== 'gold');
  const inversions: string[] = [];
  let correct = 0;
  let total = 0;
  for (const g of golds) {
    for (const o of others) {
      total++;
      if (scores[g.id]! > scores[o.id]!) {
        correct++;
      } else {
        inversions.push(`${o.id} (${scores[o.id]}) >= ${g.id} (${scores[g.id]})`);
      }
    }
  }
  return { pairwiseAccuracy: correct / total, scores, inversions };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  mkdirSync('docs/benchmarks', { recursive: true });
  const out = {
    at: new Date().toISOString(),
    invariants: runInvariantScorecard(),
    rubric: runRubricScorecard()
  };
  const targetPath = process.argv[2] ?? 'docs/benchmarks/scorecard.json';
  writeFileSync(targetPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
  process.stdout.write(
    `invariants ${out.invariants.correct}/${out.invariants.total}, rubric pairwise ${out.rubric.pairwiseAccuracy.toFixed(2)}\n`
  );
}

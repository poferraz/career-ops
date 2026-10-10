import { evaluateDirectness } from './directness.js';
import { evaluateRhythm } from './rhythm.js';
import { evaluateTrust } from './trust.js';
import { evaluateAuthenticity } from './authenticity.js';
import { evaluateDensity } from './density.js';
import type { AuditReport, ThreeBandGateStatus } from '../types.js';

export interface EvaluateInput {
  bullets: string[];
  sentences?: string[];
  minedEntityCount?: number;
}

export class AntiSlopScorer {
  public static evaluate(input: EvaluateInput): AuditReport {
    const pooledSentences = input.sentences ?? input.bullets;

    const directness = evaluateDirectness(input.bullets);
    const rhythm = evaluateRhythm(pooledSentences);
    const trust = evaluateTrust(input.bullets, input.minedEntityCount);
    const authenticity = evaluateAuthenticity(input.bullets.join(' '));
    const density = evaluateDensity(input.bullets);

    const totalScore = directness.score + rhythm.score + trust.score + authenticity.score + density.score;
    
    let gateStatus: ThreeBandGateStatus;
    let isPassing: boolean;
    let summary: string;

    if (totalScore >= 42) {
      gateStatus = 'certified';
      isPassing = true;
      summary = `Certified ATS Ready (${totalScore}/50). Natural human cadence and verified factual density.`;
    } else if (totalScore >= 35) {
      gateStatus = 'warning';
      isPassing = true;
      summary = `Warning Gate (${totalScore}/50). Minor tone or density issues; targeted re-humanization recommended.`;
    } else {
      gateStatus = 'rejected';
      isPassing = false;
      summary = `Rejected Gate (${totalScore}/50). Document contains high buzzword density or low factual support.`;
    }

    const violations = [
      ...directness.feedback,
      ...rhythm.feedback,
      ...trust.feedback,
      ...authenticity.feedback,
      ...density.feedback
    ];

    return {
      totalScore,
      maxTotalScore: 50,
      gateStatus,
      isPassing,
      dimensions: {
        directness,
        rhythm,
        trust,
        authenticity,
        density
      },
      invariantsPassed: true,
      violations,
      summary
    };
  }
}

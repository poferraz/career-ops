import { describe, it, expect } from 'vitest';
import {
  InvariantEntitySchema,
  AuditReportSchema,
  type InvariantEntity,
  type AuditReport
} from '../src/types.js';

describe('Audit Core Types & Schemas', () => {
  it('validates a correct InvariantEntity with semantic classification', () => {
    const entity: InvariantEntity = {
      id: 'inv-001',
      rawText: '$1.4M',
      classification: 'semantic',
      normalizedValue: '1400000 USD',
      category: 'currency'
    };

    const parsed = InvariantEntitySchema.parse(entity);
    expect(parsed.classification).toBe('semantic');
    expect(parsed.normalizedValue).toBe('1400000 USD');
  });

  it('validates an AuditReport with Three-Band Certified status', () => {
    const report: AuditReport = {
      totalScore: 44,
      maxTotalScore: 50,
      gateStatus: 'certified',
      isPassing: true,
      dimensions: {
        directness: { dimension: 'directness', score: 9, maxScore: 10, feedback: [] },
        rhythm: { dimension: 'rhythm', score: 8, maxScore: 10, feedback: [], metrics: { sentenceLengthStdDev: 6.8 } },
        trust: { dimension: 'trust', score: 9, maxScore: 10, feedback: [] },
        authenticity: { dimension: 'authenticity', score: 9, maxScore: 10, feedback: [] },
        density: { dimension: 'density', score: 9, maxScore: 10, feedback: [] }
      },
      invariantsPassed: true,
      violations: [],
      summary: 'Certified ATS Ready'
    };

    const parsed = AuditReportSchema.parse(report);
    expect(parsed.totalScore).toBe(44);
    expect(parsed.gateStatus).toBe('certified');
    expect(parsed.isPassing).toBe(true);
  });
});

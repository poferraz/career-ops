import { describe, it, expect } from 'vitest';
import { formatBanner, formatScorecard } from '../src/ui/formatters.js';
import { formatDiff } from '../src/ui/diff-view.js';
import type { AuditReport, AtsScanResult } from '@career-ops/audit';

describe('CLI Terminal Formatters & Visualizers', () => {
  it('formats architectural career-ops banner', () => {
    const banner = formatBanner();
    expect(banner).toContain('CAREER-OPS');
    expect(banner).toContain('DUAL-ENGINE');
  });

  it('formats comprehensive audit scorecard with three-band status and dimensions', () => {
    const mockReport: AuditReport = {
      totalScore: 46,
      maxTotalScore: 50,
      gateStatus: 'certified',
      isPassing: true,
      invariantsPassed: true,
      violations: [],
      summary: 'All rubric dimensions passed.',
      dimensions: {
        directness: {
          dimension: 'directness',
          score: 9.5,
          maxScore: 10,
          feedback: []
        },
        rhythm: {
          dimension: 'rhythm',
          score: 8.5,
          maxScore: 10,
          feedback: []
        },
        trust: {
          dimension: 'trust',
          score: 10,
          maxScore: 10,
          feedback: []
        },
        authenticity: {
          dimension: 'authenticity',
          score: 9,
          maxScore: 10,
          feedback: []
        },
        density: {
          dimension: 'density',
          score: 9,
          maxScore: 10,
          feedback: []
        }
      }
    };

    const mockAtsScan: AtsScanResult = {
      valid: true,
      issues: []
    };

    const rendered = formatScorecard(mockReport, mockAtsScan);

    expect(rendered).toContain('46 / 50');
    expect(rendered).toContain('CERTIFIED');
    expect(rendered).toContain('Directness');
    expect(rendered).toContain('Rhythm');
    expect(rendered).toContain('Trust');
    expect(rendered).toContain('Authenticity');
    expect(rendered).toContain('Density');
    expect(rendered).toContain('ATS Single-Column');
  });

  it('formats terminal bullet diff highlighting locked facts', () => {
    const original = 'Responsible for microservices migration cut costs by 40%.';
    const rewritten = 'Engineered distributed microservices migration, cutting infrastructure costs by 40%.';
    const invariants = ['40%'];

    const diff = formatDiff(original, rewritten, invariants);

    expect(diff).toContain('- ');
    expect(diff).toContain('+ ');
    expect(diff).toContain('40%');
    expect(diff).toContain('FACTS LOCKED');
  });
});

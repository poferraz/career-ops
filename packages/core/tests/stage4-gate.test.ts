import { describe, it, expect } from 'vitest';
import { parseResumeMarkdown } from '../src/parser/ast-parser.js';
import { Stage4Gate } from '../src/pipeline/stage4-gate.js';

describe('Stage 4: Invariant Gate & Audit Integration', () => {
  const resumeMarkdown = `# Jane Doe
San Francisco, CA | jane@example.com

## Experience
### Senior Staff Engineer - CloudScale
2022 - Present
- Scaled Kubernetes cluster to 50 nodes reducing AWS bill by $20K monthly.
- Engineered streaming pipeline processing 250,000 events/sec with 99.9% uptime.

## Education
### B.S. Computer Science - UC Berkeley
2015 - 2019

## Skills
Cloud & Systems: Kubernetes, AWS, Go, Redis
`;

  it('reconciles Stage 2 and Stage 3 drafts and executes full audit gate', () => {
    const ast = parseResumeMarkdown(resumeMarkdown);
    const b1 = ast.experience[0]!.bullets[0]!;
    const b2 = ast.experience[0]!.bullets[1]!;

    const stage2Drafts = new Map<string, string>([
      [b1.id, 'Optimized 50-node Kubernetes cluster, slashing monthly AWS expenses by $20K.'],
      [b2.id, 'Architected streaming pipeline processing 250,000 events/sec with 99.9% uptime.']
    ]);

    const stage3Drafts = new Map<string, string>([
      // b1: perfect preservation
      [b1.id, 'Cut monthly AWS expenses by $20K across our 50-node Kubernetes setup.'],
      // b2: dropped 250,000 events/sec -> triggers programmatic re-injection or fallback
      [b2.id, 'Architected streaming pipeline processing events with 99.9% uptime.']
    ]);

    const result = Stage4Gate.verifyAndReconcile(ast, stage2Drafts, stage3Drafts);

    expect(result.ast.experience[0]?.bullets[0]?.resolutionStage).toBe('verbatim_match');
    expect(result.ast.experience[0]?.bullets[0]?.finalBullet).toContain('$20K');

    expect(result.ast.experience[0]?.bullets[1]?.finalBullet).toContain('250,000');
    expect(result.resolutionCounts.verbatim_match).toBe(1);
    expect(result.resolutionCounts.programmatic_re_injection).toBe(1);

    expect(result.auditReport.totalScore).toBeGreaterThanOrEqual(40);
    expect(result.atsScan.valid).toBe(true);
  });
});

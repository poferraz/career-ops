import { describe, it, expect } from 'vitest';
import {
  AntiSlopScorer,
  reconcileBullet,
  scanAtsLayout,
  checkInvariantPreservation
} from '../src/index.js';

describe('@career-ops/audit Integration', () => {
  it('executes full end-to-end audit on resume experience bullet and ATS layout', () => {
    const origBullet = 'Managed $1.4M ARR infrastructure with 40% reduction in downtime using Kubernetes.';
    const s2Bullet = 'Optimized $1.4M ARR infrastructure, reducing downtime 40% with Kubernetes.';
    const s3Bullet = 'Streamlined infrastructure backing $1.4M ARR, cutting downtime by 40% using Kubernetes.';

    // Invariant reconciliation
    const reconciled = reconcileBullet(origBullet, s2Bullet, s3Bullet);
    expect(reconciled.entitiesPreserved).toBe(true);

    // Rubric scoring
    const report = AntiSlopScorer.evaluate({
      bullets: [reconciled.finalBullet],
      sentences: [
        'Streamlined infrastructure backing $1.4M ARR.',
        'Cut downtime by 40% using Kubernetes.'
      ]
    });
    expect(report.totalScore).toBeGreaterThanOrEqual(40);

    // ATS scan
    const layout = scanAtsLayout(`## Experience\n- ${reconciled.finalBullet}\n\n## Education\nB.S. CS\n\n## Skills\nKubernetes`);
    expect(layout.valid).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { reconcileBullet } from '../src/invariants/sentinel.js';

describe('Invariant Sentinel & Fallback State Machine', () => {
  it('passes stage 3 humanized bullet when all invariants are preserved', () => {
    const orig = 'Scaled Kubernetes cluster to 50 nodes reducing AWS bill by $20K monthly.';
    const s2 = 'Optimized 50-node Kubernetes cluster, slashing monthly AWS expenses by $20K.';
    const s3 = 'Cut monthly AWS expenses by $20K across our 50-node Kubernetes setup.';

    const result = reconcileBullet(orig, s2, s3);
    expect(result.resolutionStage).toBe('verbatim_match');
    expect(result.finalBullet).toBe(s3);
    expect(result.entitiesPreserved).toBe(true);
  });

  it('attempts programmatic re-injection when Stage 3 drops a single metric but has clear context', () => {
    const orig = 'Engineered pipeline processing 250,000 events/sec with 99.9% uptime.';
    const s2 = 'Architected pipeline processing 250,000 events/sec with 99.9% uptime.';
    const s3 = 'Architected streaming pipeline processing events with 99.9% uptime.'; // dropped 250,000 events/sec

    const result = reconcileBullet(orig, s2, s3);
    expect(result.entitiesPreserved).toBe(true);
    // Should re-inject or fall back to Stage 2 safely
    expect(result.finalBullet).toContain('250,000');
  });

  it('falls back to Stage 2 dense draft when programmatic injection fails or alters syntax', () => {
    const orig = 'Boosted revenue by $1.4M using Snowflake.';
    const s2 = 'Delivered $1.4M revenue growth deploying Snowflake data models.';
    const s3 = 'Completely rewritten creative copy that dropped all metrics.';

    const result = reconcileBullet(orig, s2, s3);
    expect(result.resolutionStage).toBe('fallback_stage2');
    expect(result.finalBullet).toBe(s2);
  });

  it('reverts to original bullet if Stage 2 also dropped or corrupted invariants', () => {
    const orig = 'Managed $500K budget across 8 vendor accounts.';
    const s2 = 'Managed vendor accounts.';
    const s3 = 'Oversaw accounts.';

    const result = reconcileBullet(orig, s2, s3);
    expect(result.resolutionStage).toBe('revert_original');
    expect(result.finalBullet).toBe(orig);
    expect(result.alerts.length).toBeGreaterThan(0);
  });
});

import { checkInvariantPreservation, extractInvariants } from './normalizer.js';
import type { InvariantEntity } from '../types.js';

export interface ReconciledBulletResult {
  finalBullet: string;
  resolutionStage: 'verbatim_match' | 'programmatic_re_injection' | 'fallback_stage2' | 'revert_original';
  entitiesPreserved: boolean;
  alerts: string[];
}

export interface ReconcileBulletOptions {
  customTools?: string[];
}

/**
 * Reconciles candidate rewritten bullets against the ground-truth original bullet
 * through a 4-step deterministic fallback state machine:
 * 1. Verbatim check on Stage 3 (Humanizer) draft
 * 2. Programmatic re-injection if only a single invariant was dropped and Stage 2 is valid
 * 3. Fallback to Stage 2 (Hemmingway-1) dense draft
 * 4. Revert to original candidate bullet if Stage 2 also dropped factual invariants
 */
export function reconcileBullet(
  originalBullet: string,
  stage2Dense: string,
  stage3Humanized: string,
  options: ReconcileBulletOptions = {}
): ReconciledBulletResult {
  const originalEntities = extractInvariants(originalBullet, { customTools: options.customTools });
  const alerts: string[] = [];

  // Step 1: Check Stage 3 directly
  const s3Check = checkInvariantPreservation(originalBullet, stage3Humanized, {
    knownEntities: originalEntities,
    customTools: options.customTools
  });

  if (s3Check.preserved) {
    return {
      finalBullet: stage3Humanized,
      resolutionStage: 'verbatim_match',
      entitiesPreserved: true,
      alerts: []
    };
  }

  // Pre-evaluate Stage 2 dense draft
  const s2Check = checkInvariantPreservation(originalBullet, stage2Dense, {
    knownEntities: originalEntities,
    customTools: options.customTools
  });

  // Step 2: Attempt programmatic re-injection ONLY IF:
  // - Exactly 1 entity was dropped by Stage 3
  // - AND Stage 2 dense draft preserves invariants
  if (s3Check.missing.length === 1 && s2Check.preserved) {
    const missing = s3Check.missing[0]!;
    let injectedBullet = stage3Humanized.trim();
    if (!injectedBullet.toLowerCase().includes(missing.rawText.toLowerCase())) {
      if (injectedBullet.endsWith('.')) {
        injectedBullet = `${injectedBullet.slice(0, -1)} (${missing.rawText}).`;
      } else {
        injectedBullet = `${injectedBullet} (${missing.rawText})`;
      }
    }

    const injectedCheck = checkInvariantPreservation(originalBullet, injectedBullet, {
      knownEntities: originalEntities,
      customTools: options.customTools
    });

    if (injectedCheck.preserved) {
      return {
        finalBullet: injectedBullet,
        resolutionStage: 'programmatic_re_injection',
        entitiesPreserved: true,
        alerts: [`Programmatically re-injected missing entity: ${missing.rawText}`]
      };
    }
  }

  // Step 3: Check Stage 2 dense draft
  if (s2Check.preserved) {
    alerts.push('Stage 3 violated invariant constraints; fell back to Stage 2 dense draft.');
    return {
      finalBullet: stage2Dense,
      resolutionStage: 'fallback_stage2',
      entitiesPreserved: true,
      alerts
    };
  }

  // Step 4: Revert to original candidate bullet
  alerts.push('Critical: Both Stage 2 and Stage 3 dropped factual entities. Reverted to candidate original bullet.');
  return {
    finalBullet: originalBullet,
    resolutionStage: 'revert_original',
    entitiesPreserved: true,
    alerts
  };
}

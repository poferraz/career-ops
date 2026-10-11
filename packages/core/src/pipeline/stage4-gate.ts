import {
  reconcileBullet,
  AntiSlopScorer,
  scanAtsLayout,
  type AuditReport,
  type AtsScanResult
} from '@career-ops/audit';
import type { ResumeAST } from '../types.js';
import { renderResumeMarkdown } from '../parser/ast-parser.js';

export interface Stage4GateOptions {
  customTools?: string[];
}

export interface ReconciledResumeResult {
  ast: ResumeAST;
  markdown: string;
  auditReport: AuditReport;
  atsScan: AtsScanResult;
  resolutionCounts: {
    verbatim_match: number;
    programmatic_re_injection: number;
    fallback_stage2: number;
    revert_original: number;
  };
}

export class Stage4Gate {
  /**
   * Reconciles all bullet points in a ResumeAST against Stage 2 and Stage 3 candidate
   * drafts through the 4-step Invariant Sentinel, computes the Anti-Slop Audit Report,
   * and verifies ATS single-column layout.
   */
  public static verifyAndReconcile(
    originalAst: ResumeAST,
    stage2Drafts: Map<string, string>,
    stage3Drafts: Map<string, string>,
    options: Stage4GateOptions = {}
  ): ReconciledResumeResult {
    const cloned: ResumeAST = JSON.parse(JSON.stringify(originalAst)) as ResumeAST;

    const resolutionCounts = {
      verbatim_match: 0,
      programmatic_re_injection: 0,
      fallback_stage2: 0,
      revert_original: 0
    };

    const allFinalBullets: string[] = [];
    const allPooledSentences: string[] = [];

    for (const role of cloned.experience) {
      for (const bullet of role.bullets) {
        const s2 = stage2Drafts.get(bullet.id) ?? bullet.originalText;
        const s3 = stage3Drafts.get(bullet.id) ?? s2;

        const reconciled = reconcileBullet(bullet.originalText, s2, s3, {
          customTools: options.customTools
        });

        bullet.finalBullet = reconciled.finalBullet;
        bullet.resolutionStage = reconciled.resolutionStage;
        bullet.status = 'verified';

        resolutionCounts[reconciled.resolutionStage]++;
        allFinalBullets.push(reconciled.finalBullet);

        // Split bullet into sentences for construct-valid pooled rhythm evaluation
        const sentences = reconciled.finalBullet
          .split(/(?<=[.!?])\s+/)
          .map(s => s.trim())
          .filter(Boolean);

        allPooledSentences.push(...sentences);
      }
    }

    const markdown = renderResumeMarkdown(cloned);

    const auditReport = AntiSlopScorer.evaluate({
      bullets: allFinalBullets,
      sentences: allPooledSentences
    });

    const atsScan = scanAtsLayout(markdown);

    return {
      ast: cloned,
      markdown,
      auditReport,
      atsScan,
      resolutionCounts
    };
  }
}

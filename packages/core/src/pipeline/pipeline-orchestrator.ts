import type { InferenceProvider } from '../inference/types.js';
import type { ResumeAST, BulletNode, OptimizationResult } from '../types.js';
import { parseResumeMarkdown } from '../parser/ast-parser.js';
import {
  MotivationalInterviewer,
  type MiningProbe,
  type MinedAccomplishment
} from './stage1-interviewer.js';
import { HemingwayDensityEngine } from './stage2-density.js';
import { HumanizerCadenceEngine } from './stage3-humanizer.js';
import { Stage4Gate } from './stage4-gate.js';

export interface PipelineProviders {
  stage1?: InferenceProvider;
  stage2: InferenceProvider;
  stage3: InferenceProvider;
}

export interface PipelineOptions {
  stage2Model?: string;
  stage3Model?: string;
  customTools?: string[];
  evictModels?: boolean;
  minedAccomplishments?: Array<{
    bulletId: string;
    accomplishment: string;
    metrics: string[];
  }>;
}

export class FourStagePipeline {
  private providers: PipelineProviders;

  constructor(providerOrProviders: InferenceProvider | PipelineProviders) {
    if ('stage2' in providerOrProviders) {
      this.providers = providerOrProviders;
    } else {
      this.providers = {
        stage1: providerOrProviders,
        stage2: providerOrProviders,
        stage3: providerOrProviders
      };
    }
  }

  /**
   * Scans a resume AST or markdown for bullets with the "Articulation Gap",
   * returning targeted probes under the RULE framework.
   */
  public findProbeOpportunities(astOrMarkdown: ResumeAST | string): MiningProbe[] {
    const ast = typeof astOrMarkdown === 'string'
      ? parseResumeMarkdown(astOrMarkdown)
      : astOrMarkdown;

    const interviewer = new MotivationalInterviewer(this.providers.stage1);
    return interviewer.findProbeOpportunities(ast);
  }

  /**
   * Generates a targeted RISE probe for a bullet point.
   */
  public generateProbe(
    bullet: BulletNode,
    dimension: 'metric' | 'tool' | 'scope' = 'metric'
  ): MiningProbe {
    const interviewer = new MotivationalInterviewer(this.providers.stage1);
    return interviewer.generateProbe(bullet, dimension);
  }

  /**
   * Extracts quantifiable achievements and tools from a user interview response.
   */
  public async extractAccomplishment(
    bullet: BulletNode,
    userResponse: string
  ): Promise<MinedAccomplishment> {
    const interviewer = new MotivationalInterviewer(this.providers.stage1);
    return interviewer.extractAccomplishment(bullet, userResponse);
  }

  /**
   * Executes the full Four-Stage Career-Ops Optimization Pipeline:
   * 1. Stage 1 (Accomplishment Mining integration if provided)
   * 2. Stage 2 (Hemingway Density Engine with Verb Rotation)
   *    -> Model Eviction (keep_alive: 0) to avoid VRAM exhaustion on 16GB Macs
   * 3. Stage 3 (Humanizer Cadence Engine with Raw Invariant Contract)
   *    -> Model Eviction (keep_alive: 0)
   * 4. Stage 4 (Deterministic Invariant Gate & Anti-Slop Audit Verification)
   */
  public async optimize(
    input: ResumeAST | string,
    options: PipelineOptions = {}
  ): Promise<OptimizationResult> {
    let ast: ResumeAST = typeof input === 'string'
      ? parseResumeMarkdown(input)
      : JSON.parse(JSON.stringify(input)) as ResumeAST;

    const stage2Model = options.stage2Model ?? 'richardyoung/hemmingway-1:Q4_K_M';
    const stage3Model = options.stage3Model ?? 'jialinyyzz/humanizer:Q4_K_M';
    const shouldEvict = options.evictModels ?? true;

    // --- Stage 1: Accomplishment Mining Integration ---
    if (options.minedAccomplishments && options.minedAccomplishments.length > 0) {
      for (const mined of options.minedAccomplishments) {
        ast = MotivationalInterviewer.applyMinedAccomplishment(ast, {
          bulletId: mined.bulletId,
          enrichedBullet: mined.accomplishment,
          metrics: mined.metrics
        });
      }
    }

    // --- Stage 2: Hemingway Density Engine ---
    const hemingwayEngine = new HemingwayDensityEngine(this.providers.stage2, stage2Model);
    const stage2Drafts = new Map<string, string>();

    for (const role of ast.experience) {
      let optimizedDrafts: string[];
      try {
        optimizedDrafts = await hemingwayEngine.optimizeRoleBullets(role);
      } catch {
        // Graceful fallback to original bullet text on inference error or timeout
        optimizedDrafts = role.bullets.map(b => b.originalText);
      }
      role.bullets.forEach((bullet, idx) => {
        const draft = optimizedDrafts[idx] ?? bullet.originalText;
        stage2Drafts.set(bullet.id, draft);
        bullet.hemingwayDraft = draft;
      });
    }

    // Evict Stage 2 model from VRAM if supported
    if (shouldEvict && this.providers.stage2.evictModel) {
      try {
        await this.providers.stage2.evictModel(stage2Model);
      } catch {
        // Model eviction error is non-fatal
      }
    }

    // --- Stage 3: Humanizer Cadence Engine ---
    const humanizerEngine = new HumanizerCadenceEngine(this.providers.stage3, stage3Model);
    const stage3Drafts = new Map<string, string>();

    for (const role of ast.experience) {
      for (const bullet of role.bullets) {
        const s2Draft = stage2Drafts.get(bullet.id) ?? bullet.originalText;
        let humanizedDraft: string;
        try {
          humanizedDraft = await humanizerEngine.humanizeBullet(s2Draft, {
            verbatimTools: bullet.invariants.verbatim,
            semanticMetrics: bullet.invariants.semantic
          });
        } catch {
          // Graceful fallback to Stage 2 draft on inference error or timeout
          humanizedDraft = s2Draft;
        }

        stage3Drafts.set(bullet.id, humanizedDraft);
        bullet.humanizedText = humanizedDraft;
      }
    }

    // Evict Stage 3 model from VRAM if supported
    if (shouldEvict && this.providers.stage3.evictModel) {
      try {
        await this.providers.stage3.evictModel(stage3Model);
      } catch {
        // Model eviction error is non-fatal
      }
    }

    // --- Stage 4: Invariant Gate & Audit Integration ---
    const gateResult = Stage4Gate.verifyAndReconcile(
      ast,
      stage2Drafts,
      stage3Drafts,
      { customTools: options.customTools }
    );

    const counts = gateResult.resolutionCounts;
    const summary = `Four-Stage optimization complete. Verbatim: ${counts.verbatim_match}, Re-injected: ${counts.programmatic_re_injection}, S2 Fallback: ${counts.fallback_stage2}, Reverted: ${counts.revert_original}. Score: ${gateResult.auditReport.totalScore}/${gateResult.auditReport.maxTotalScore} (${gateResult.auditReport.gateStatus}).`;

    return {
      ast: gateResult.ast,
      markdown: gateResult.markdown,
      auditReport: gateResult.auditReport,
      atsScan: gateResult.atsScan,
      resolutionCounts: gateResult.resolutionCounts,
      summary
    };
  }
}

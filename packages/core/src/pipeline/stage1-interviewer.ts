import { extractInvariants } from '@career-ops/audit';
import type { ResumeAST, BulletNode } from '../types.js';
import type { InferenceProvider } from '../inference/types.js';

export interface MiningProbe {
  bulletId: string;
  originalText: string;
  missingDimension: 'metric' | 'tool' | 'scope';
  probeQuestion: string;
}

export interface MinedAccomplishment {
  bulletId: string;
  metric?: string;
  tool?: string;
  scope?: string;
  enrichedBullet: string;
}

export class MotivationalInterviewer {
  constructor(private provider?: InferenceProvider) {}

  /**
   * Deterministically analyzes the Resume AST to find bullets suffering from
   * the Articulation Gap (lacking metrics, tools, or operational scale).
   */
  public findProbeOpportunities(ast: ResumeAST): MiningProbe[] {
    const probes: MiningProbe[] = [];

    for (const role of ast.experience) {
      for (const bullet of role.bullets) {
        if (bullet.invariants.semantic.length === 0) {
          probes.push(this.generateProbe(bullet, 'metric'));
        } else if (bullet.invariants.verbatim.length === 0) {
          probes.push(this.generateProbe(bullet, 'tool'));
        }
      }
    }

    return probes;
  }

  /**
   * Generates a targeted RISE probe question (Results, Impact, Scope, Evidence).
   */
  public generateProbe(bullet: BulletNode, dimension: 'metric' | 'tool' | 'scope' = 'metric'): MiningProbe {
    const lower = bullet.originalText.toLowerCase();
    let probeQuestion = 'What was the quantifiable outcome, user scale, or percentage improvement achieved?';

    if (lower.includes('payment') || lower.includes('reconciliation') || lower.includes('billing')) {
      probeQuestion = 'What was the throughput, volume, or error reduction achieved? (e.g. $ volume processed, error rate drop, reconciliation speed)';
    } else if (lower.includes('api') || lower.includes('service') || lower.includes('database') || lower.includes('latency')) {
      probeQuestion = 'What was the latency improvement, QPS, or scale handled? (e.g. p99 drop from 450ms to 35ms, RPS handled)';
    } else if (lower.includes('migrat') || lower.includes('cloud') || lower.includes('cluster')) {
      probeQuestion = 'How many nodes, services, or servers were migrated? What was the cost or downtime impact?';
    }

    return {
      bulletId: bullet.id,
      originalText: bullet.originalText,
      missingDimension: dimension,
      probeQuestion
    };
  }

  /**
   * Structures a candidate's free-form conversational response into a verifiable
   * achievement and an enriched bullet ready for Stage 2.
   */
  public async extractAccomplishment(
    bullet: BulletNode,
    userResponse: string
  ): Promise<MinedAccomplishment> {
    if (this.provider) {
      const prompt = `You are a career intelligence accomplishment miner. Extract the quantifiable metrics and technical tools from the candidate's answer and produce an enriched resume bullet.

Original Bullet: "${bullet.originalText}"
Candidate Answer: "${userResponse}"

Return ONLY valid JSON matching this schema:
{
  "metric": "extracted metric e.g. $5M daily volume or 40% reduction",
  "tool": "extracted tools e.g. Go, PostgreSQL",
  "scope": "extracted scale e.g. 3 microservices",
  "enrichedBullet": "Action verb + Context + Metric bullet point"
}`;

      try {
        const res = await this.provider.generate(prompt, {
          format: 'json',
          temperature: 0.2
        });

        const jsonMatch = res.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as {
            metric?: string;
            tool?: string;
            scope?: string;
            enrichedBullet?: string;
          };

          return {
            bulletId: bullet.id,
            metric: parsed.metric,
            tool: parsed.tool,
            scope: parsed.scope,
            enrichedBullet: parsed.enrichedBullet ?? `${bullet.originalText} (${userResponse})`
          };
        }
      } catch {
        // Fall through to deterministic extraction
      }
    }

    // Deterministic fallback extraction
    const extracted = extractInvariants(userResponse);
    const metrics = extracted.filter(i => i.classification === 'semantic').map(i => i.rawText);
    const tools = extracted.filter(i => i.classification === 'verbatim').map(i => i.rawText);

    const metricText = metrics[0] ?? '';
    const toolText = tools.join(', ');

    return {
      bulletId: bullet.id,
      metric: metricText,
      tool: toolText,
      enrichedBullet: `${bullet.originalText.replace(/\.$/, '')}, achieving ${userResponse}.`
    };
  }

  /**
   * Applies the mined metrics and tools back into the ResumeAST and updates invariant capsules.
   */
  public applyMinedAccomplishment(ast: ResumeAST, mined: MinedAccomplishment): ResumeAST {
    const cloned: ResumeAST = JSON.parse(JSON.stringify(ast)) as ResumeAST;

    for (const role of cloned.experience) {
      for (const bullet of role.bullets) {
        if (bullet.id === mined.bulletId) {
          bullet.originalText = mined.enrichedBullet;
          bullet.minedMetrics = mined.metric ? [mined.metric] : [];
          bullet.status = 'mined';

          // Re-extract updated invariants
          const invariants = extractInvariants(mined.enrichedBullet);
          bullet.invariants = {
            verbatim: Array.from(new Set(
              invariants.filter(i => i.classification === 'verbatim').map(i => i.rawText)
            )),
            semantic: Array.from(new Set(
              invariants.filter(i => i.classification === 'semantic').map(i => i.normalizedValue)
            ))
          };
        }
      }
    }

    return cloned;
  }
}

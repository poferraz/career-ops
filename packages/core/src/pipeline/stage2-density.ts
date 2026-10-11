import type { BulletNode, ExperienceRole } from '../types.js';
import type { InferenceProvider } from '../inference/types.js';

export interface RoleContext {
  roleTitle?: string;
  company?: string;
  recentVerbs?: string[];
}

export class HemingwayDensityEngine {
  public static readonly MODEL = 'richardyoung/hemmingway-1:Q4_K_M';

  constructor(
    private provider: InferenceProvider,
    private model: string = HemingwayDensityEngine.MODEL
  ) {}

  /**
   * Transforms a bullet point into a high-density, action-verb driven bullet
   * using the Hemmingway-1 ChatML prompt contract and enforcing verb rotation.
   */
  public async optimizeBullet(bullet: BulletNode, context: RoleContext = {}): Promise<string> {
    const avoidVerbs = context.recentVerbs && context.recentVerbs.length > 0
      ? `\nDo NOT start with: ${context.recentVerbs.join(', ')}.`
      : '';

    const verbatimList = bullet.invariants.verbatim.length > 0
      ? bullet.invariants.verbatim.join(', ')
      : 'None';
    const semanticList = bullet.invariants.semantic.length > 0
      ? bullet.invariants.semantic.join(', ')
      : 'None';

    const systemPrompt = `You are Hemmingway-1, an expert density engine for technical and executive resumes.
Your task is to transform candidate bullet points into High-Density Action Resume Bullets.
Rules:
1. Begin with a strong past-tense action verb (e.g. Architected, Engineered, Slashed, Scaled, Streamlined).
2. Follow with technical scope and operational friction.
3. Conclude with a quantified outcome or verified metric.
4. Preserve 100% of facts, tools, and numbers from the input. Never drop or hallucinate.
5. Return ONLY the single rewritten bullet point without quotation marks, bullet symbols, or preambles.${avoidVerbs}`;

    const userPrompt = `Role: ${context.roleTitle ?? 'Engineer'} at ${context.company ?? 'Company'}
Original bullet: "${bullet.originalText}"
Locked invariants:
- Tools: ${verbatimList}
- Metrics: ${semanticList}`;

    const chatMlPrompt = `<|im_start|>system\n${systemPrompt}<|im_end|>\n<|im_start|>user\n${userPrompt}<|im_end|>\n<|im_start|>assistant\n`;

    const res = await this.provider.generate(chatMlPrompt, {
      model: this.model,
      temperature: 0.2,
      stop: ['<|im_end|>', '\n\n']
    });

    // Clean output: strip markdown bullet markers, surrounding quotes, or whitespace
    let cleaned = res.text.trim();
    cleaned = cleaned.replace(/^[-*•]\s+/, '');
    cleaned = cleaned.replace(/^["']|["']$/g, '');

    return cleaned;
  }

  /**
   * Batch optimizes all bullets in a role while maintaining a rolling context
   * of the last 2 verbs used to prevent verb repetition across the job role.
   */
  public async optimizeRoleBullets(role: ExperienceRole): Promise<string[]> {
    const results: string[] = [];
    const recentVerbs: string[] = [];

    for (const bullet of role.bullets) {
      const dense = await this.optimizeBullet(bullet, {
        roleTitle: role.title,
        company: role.company,
        recentVerbs: [...recentVerbs]
      });

      results.push(dense);

      // Extract the first word as the action verb
      const firstWord = dense.trim().split(/\s+/)[0] ?? '';
      const cleanVerb = firstWord.replace(/[^a-zA-Z]/g, '');
      if (cleanVerb) {
        recentVerbs.push(cleanVerb);
        if (recentVerbs.length > 2) {
          recentVerbs.shift(); // keep rolling window of last 2 verbs
        }
      }
    }

    return results;
  }
}

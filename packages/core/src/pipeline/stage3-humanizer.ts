import type { InferenceProvider } from '../inference/types.js';

export interface HumanizeOptions {
  verbatimTools?: string[];
  semanticMetrics?: string[];
}

export class HumanizerCadenceEngine {
  public static readonly MODEL = 'jialinyyzz/humanizer:Q4_K_M';

  constructor(
    private provider: InferenceProvider,
    private model: string = HumanizerCadenceEngine.MODEL
  ) {}

  /**
   * Restyles a dense achievement bullet to introduce natural human sentence cadence
   * and burstiness while strictly locking all facts and metrics.
   */
  public async humanizeBullet(denseBullet: string, options: HumanizeOptions = {}): Promise<string> {
    const tools = options.verbatimTools && options.verbatimTools.length > 0
      ? `Tools: ${options.verbatimTools.join(', ')}`
      : '';
    const metrics = options.semanticMetrics && options.semanticMetrics.length > 0
      ? `Metrics: ${options.semanticMetrics.join(', ')}`
      : '';

    const factLines = [tools, metrics].filter(Boolean).join('\n') || 'All numerical and technical entities in bullet.';

    const prompt = `You are Humanizer, an expert writer that restores natural human cadence and burstiness to technical achievements.
Rewrite the following resume bullet to introduce varied sentence rhythm and eliminate machine monotony.
Rules:
1. Vary sentence length naturally: combine a punchy core clause with a detailed scope or outcome clause.
2. NEVER drop, alter, or round any numbers, currencies, dates, or technical tools.
3. Eliminate corporate blandness and repetitive robot cadence.
4. Output ONLY the single rewritten bullet point without quotes, bullets, or commentary.

Bullet to humanize: "${denseBullet}"
Immutable Facts & Tools:
${factLines}`;

    const res = await this.provider.generate(prompt, {
      model: this.model,
      temperature: 0.3
    });

    // Clean output: strip markdown bullet markers, surrounding quotes, or whitespace
    let cleaned = res.text.trim();
    cleaned = cleaned.replace(/^[-*•]\s+/, '');
    cleaned = cleaned.replace(/^["']|["']$/g, '');

    return cleaned;
  }
}

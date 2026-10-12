import { createHash } from 'node:crypto';

/** Copied byte-for-byte from cowWhySo/humanizer-12b-mlx-8bit/prompt_format.json. Do not edit. */
export const HUMANIZER_PROMPT_FORMAT = {
  instr:
    'Rewrite the text below so it reads like a person wrote it, not a language model.\n\n' +
    'Reorganize it as you see fit. Vary sentence length on purpose. Cut hedging,\n' +
    'throat-clearing, and any sentence that only announces what comes next.\n' +
    'Prefer the concrete word over the abstract one. It is fine to sound uneven.\n\n' +
    'Every fact, number, unit, date, name and quotation must survive unchanged.',
  sep: '\n\n### Rewritten:\n\n',
  fingerprint: 'cc51d66b4c593fbe'
} as const;

export function buildHumanizerPrompt(draft: string): string {
  return `${HUMANIZER_PROMPT_FORMAT.instr}\n\n${draft.trim()}${HUMANIZER_PROMPT_FORMAT.sep}`;
}

export function humanizerFingerprint(): string {
  return createHash('sha256').update(buildHumanizerPrompt('X'), 'utf8').digest('hex').slice(0, 16);
}

export type ChatTurn = { role: 'system' | 'user'; content: string };

/**
 * Qwen3 / Qwen3.5 ChatML with thinking disabled.
 * Byte-identical to tokenizer.apply_chat_template(..., add_generation_prompt=True, enable_thinking=False).
 */
export function buildQwenNoThinkPrompt(turns: ChatTurn[]): string {
  const body = turns.map(t => `<|im_start|>${t.role}\n${t.content}<|im_end|>\n`).join('');
  return `${body}<|im_start|>assistant\n<think>\n\n</think>\n\n`;
}

export const SAMPLING = {
  hemmingway: { temperature: 0.7, topP: 0.95, topK: 20 },
  humanizer: { temperature: 1.0, topP: 0.95, topK: 0, minP: 0 },
  qwen3: { temperature: 0.7, topP: 0.8, topK: 20 }
} as const;

export const MLX_MODELS = {
  stage1: 'Qwen3-8B-4bit',
  stage2: 'Hemmingway-1-OptiQ-4bit',
  stage3: 'humanizer-12b-mlx-8bit'
} as const;

/**
 * Resolves any HF repo path or legacy Ollama model string to the canonical local MLX model ID.
 */
export function resolveMlxModelId(model?: string): string {
  if (!model) return MLX_MODELS.stage2;
  const lower = model.toLowerCase();
  if (lower.includes('hemmingway')) return MLX_MODELS.stage2;
  if (lower.includes('humanizer')) return MLX_MODELS.stage3;
  if (lower.includes('qwen3')) return MLX_MODELS.stage1;
  return model;
}

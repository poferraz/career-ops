import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  buildHumanizerPrompt,
  humanizerFingerprint,
  buildQwenNoThinkPrompt,
  HUMANIZER_PROMPT_FORMAT,
  resolveMlxModelId,
  MLX_MODELS
} from '../src/inference/prompt-contracts.js';

const goldens = JSON.parse(
  readFileSync(new URL('./fixtures/prompt-goldens.json', import.meta.url), 'utf8')
);

describe('prompt contracts', () => {
  it('humanizer fingerprint matches the fine-tune contract', () => {
    expect(humanizerFingerprint()).toBe(HUMANIZER_PROMPT_FORMAT.fingerprint);
    expect(humanizerFingerprint()).toBe('cc51d66b4c593fbe');
  });

  it('humanizer prompt is byte-identical to the reference renderer', () => {
    expect(buildHumanizerPrompt(goldens.humanizer.draft)).toBe(goldens.humanizer.rendered);
  });

  it('humanizer prompt trims the draft and never adds chat tokens', () => {
    const p = buildHumanizerPrompt('  draft  \n');
    expect(p).not.toMatch(/<\|im_start\|>|<start_of_turn>/);
    expect(p.endsWith('draft\n\n### Rewritten:\n\n')).toBe(true);
  });

  for (const key of ['hemmingway', 'qwen3'] as const) {
    it(`${key} no-think prompt is byte-identical to apply_chat_template(enable_thinking=False)`, () => {
      const g = goldens[key];
      expect(
        buildQwenNoThinkPrompt([
          { role: 'system', content: g.system },
          { role: 'user', content: g.user }
        ])
      ).toBe(g.rendered);
    });
  }

  it('normalizes legacy Ollama or HF repo IDs to local oMLX model IDs', () => {
    expect(resolveMlxModelId('richardyoung/hemmingway-1:Q4_K_M')).toBe(MLX_MODELS.stage2);
    expect(resolveMlxModelId('mlx-community/Hemmingway-1-OptiQ-4bit')).toBe(MLX_MODELS.stage2);
    expect(resolveMlxModelId('jialinyyzz/humanizer:Q4_K_M')).toBe(MLX_MODELS.stage3);
    expect(resolveMlxModelId('cowWhySo/humanizer-12b-mlx-8bit')).toBe(MLX_MODELS.stage3);
    expect(resolveMlxModelId('mlx-community/Qwen3-8B-4bit')).toBe(MLX_MODELS.stage1);
  });
});

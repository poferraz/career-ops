import { describe, it, expect } from 'vitest';
import { sanitizeOutput } from '../src/inference/output-sanitizer.js';

describe('sanitizeOutput', () => {
  it('strips closed think blocks and flags the leak', () => {
    const r = sanitizeOutput('<think>\nplan\n</think>\n\nCut p99 latency to 180ms.');
    expect(r.text).toBe('Cut p99 latency to 180ms.');
    expect(r.flags.thinkLeak).toBe(true);
  });

  it('returns empty for an unclosed think block (forces fallback)', () => {
    const r = sanitizeOutput('<think>\nOkay, the user wants');
    expect(r.text).toBe('');
    expect(r.flags.empty).toBe(true);
  });

  it('removes conversational preambles', () => {
    for (const p of ['Here is your revised bullet: ', 'Sure! ', 'Rewritten: ', "Here's the rewrite:\n"]) {
      const r = sanitizeOutput(`${p}Built the admin dashboard.`);
      expect(r.text).toBe('Built the admin dashboard.');
      expect(r.flags.preamble).toBe(true);
    }
  });

  it('removes markdown, bullet markers and wrapping quotes', () => {
    const r = sanitizeOutput('- "**Built** the admin dashboard."');
    expect(r.text).toBe('Built the admin dashboard.');
    expect(r.flags.markdown).toBe(true);
    expect(r.flags.quoted).toBe(true);
  });

  it('keeps the first line of multi-line output and flags it', () => {
    const r = sanitizeOutput('Built the dashboard.\n\nAlternatively: Shipped the dashboard.');
    expect(r.text).toBe('Built the dashboard.');
    expect(r.flags.multiLine).toBe(true);
  });

  it('flags truncation on length finish or dangling connector', () => {
    expect(sanitizeOutput('Cut costs by $1.2M using', {}).flags.truncated).toBe(true);
    expect(sanitizeOutput('Cut costs by $1.2M', { finishReason: 'length' }).flags.truncated).toBe(true);
    expect(sanitizeOutput('Cut costs by $1.2M', { finishReason: 'stop' }).flags.truncated).toBe(false);
  });
});

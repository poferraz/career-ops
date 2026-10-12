import { describe, it, expect } from 'vitest';
import { PERSONAS, personaToMarkdown } from '../src/corpus/personas.js';
import { parseResumeMarkdown } from '@career-ops/core';

describe('persona corpus', () => {
  it('has 5 personas x 4 bullets with unique ids', () => {
    expect(PERSONAS).toHaveLength(5);
    const ids = PERSONAS.flatMap(p => p.bullets.map(b => b.id));
    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
  });

  it('every declared fact appears verbatim in both raw and gold (gold is fact-equal)', () => {
    for (const b of PERSONAS.flatMap(p => p.bullets)) {
      for (const f of b.facts) {
        expect(b.raw, `${b.id} raw missing ${f}`).toContain(f);
        expect(b.gold, `${b.id} gold missing ${f}`).toContain(f);
      }
    }
  });

  it('round-trips through the production parser', () => {
    for (const p of PERSONAS) {
      const ast = parseResumeMarkdown(personaToMarkdown(p));
      expect(ast.experience[0]!.bullets.map(b => b.originalText)).toEqual(
        p.bullets.map(b => b.raw)
      );
    }
  });
});

export const SLOP_LEXICON = [
  'robust',
  'seamless',
  'seamlessly',
  'leverage',
  'leveraged',
  'leveraging',
  'utilize',
  'utilized',
  'utilizing',
  'spearhead',
  'spearheaded',
  'foster',
  'fostered',
  'fostering',
  'pivotal',
  'synergy',
  'synergies',
  'cutting-edge',
  'transformative',
  'holistic',
  'empower',
  'empowered',
  'empowering',
  'harness',
  'harnessed',
  'harnessing',
  'unlock',
  'unlocked',
  'unlocking',
  'navigate',
  'navigated',
  'navigating',
  'landscape',
  'tapestry',
  'testament',
  'showcase',
  'showcased',
  'showcasing',
  'underscore',
  'underscored',
  'delve',
  'delved',
  'innovative',
  'dynamic',
  'impactful',
  'world-class',
  'best-in-class',
  'game-changing',
  'paradigm',
  'ecosystem',
  'meticulous',
  'meticulously',
  'passionate',
  'results-driven',
  'proven track record',
  'drive impact',
  'driving impact'
];

export const CARICATURE_VERBS = [
  'slashed',
  'spearheaded',
  'architected',
  'orchestrated',
  'revolutionized',
  'supercharged',
  'turbocharged',
  'skyrocketed',
  'catapulted',
  'masterminded',
  'pioneered',
  'championed'
];

export const OWNERSHIP_VERBS = [
  'led',
  'lead',
  'spearheaded',
  'architected',
  'drove',
  'owned',
  'headed',
  'directed',
  'championed',
  'pioneered',
  'orchestrated'
];

export const HEDGE_PATTERNS =
  /\b(?:helped|help(?:ed)? to|assisted|contributed|worked on|participated|supported|our intervention plan|co-\w+)\b/i;

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const firstWord = (s: string) => (words(s)[0] ?? '').toLowerCase().replace(/[^a-z-]/g, '');

export function factRecall(output: string, facts: string[]): number {
  if (facts.length === 0) return 1;
  const o = norm(output);
  return facts.filter(f => o.includes(norm(f))).length / facts.length;
}

const numberTokens = (s: string): string[] =>
  (s.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map(n => n.replace(/,/g, ''));

export function hallucinatedNumbers(source: string, output: string): string[] {
  const src = new Set(numberTokens(source));
  return numberTokens(output).filter(n => !src.has(n));
}

export function ownershipInflation(source: string, output: string): boolean {
  return (
    HEDGE_PATTERNS.test(source) &&
    !HEDGE_PATTERNS.test(output) &&
    OWNERSHIP_VERBS.includes(firstWord(output))
  );
}

export function frontLoadIndex(output: string, facts: string[]): number | null {
  const lower = output.toLowerCase();
  let best: number | null = null;
  for (const f of facts) {
    const at = lower.indexOf(f.toLowerCase());
    if (at < 0) continue;
    const idx = words(output.slice(0, at)).length + 1;
    best = best === null ? idx : Math.min(best, idx);
  }
  return best;
}

export function slopHits(output: string): string[] {
  const lower = output.toLowerCase();
  return SLOP_LEXICON.filter(term =>
    new RegExp(`(?<![\\w-])${term.replace(/[-]/g, '\\-')}(?![\\w-])`, 'i').test(lower)
  );
}

export function isCaricature(output: string): boolean {
  return CARICATURE_VERBS.includes(firstWord(output));
}

export function verbDiversity(bullets: string[]): number {
  if (bullets.length === 0) return 1;
  return new Set(bullets.map(firstWord)).size / bullets.length;
}

export function goldTokenF1(output: string, gold: string): number {
  const tok = (s: string) =>
    norm(s)
      .replace(/[^\w%$.\s-]/g, '')
      .split(' ')
      .filter(Boolean);
  const a = tok(output);
  const b = tok(gold);
  const counts = new Map<string, number>();
  b.forEach(t => counts.set(t, (counts.get(t) ?? 0) + 1));
  let overlap = 0;
  for (const t of a) {
    const c = counts.get(t) ?? 0;
    if (c > 0) {
      overlap++;
      counts.set(t, c - 1);
    }
  }
  if (overlap === 0) return 0;
  const p = overlap / a.length;
  const r = overlap / b.length;
  return (2 * p * r) / (p + r);
}

export interface BulletMetrics {
  factRecall: number;
  hallucinated: string[];
  ownershipInflation: boolean;
  frontLoadIndex: number | null;
  slop: string[];
  caricature: boolean;
  lengthRatio: number;
  goldF1: number;
}

export function scoreBullet(
  source: string,
  output: string,
  gold: string,
  facts: string[]
): BulletMetrics {
  return {
    factRecall: factRecall(output, facts),
    hallucinated: hallucinatedNumbers(source, output),
    ownershipInflation: ownershipInflation(source, output),
    frontLoadIndex: frontLoadIndex(output, facts),
    slop: slopHits(output),
    caricature: isCaricature(output),
    lengthRatio: words(output).length / Math.max(1, words(gold).length),
    goldF1: goldTokenF1(output, gold)
  };
}

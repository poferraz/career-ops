export interface FormatFlags {
  thinkLeak: boolean;
  preamble: boolean;
  markdown: boolean;
  quoted: boolean;
  multiLine: boolean;
  truncated: boolean;
  empty: boolean;
}

const PREAMBLE =
  /^(?:(?:sure|certainly|of course|absolutely|okay)[,!.]?\s+|here(?:'s| is| are)\b[^:\n]{0,60}:\s*|(?:rewritten|revised|improved|humanized|final|output)(?:\s+bullet)?\s*:\s*)/i;
const DANGLING = /\b(?:and|or|to|with|by|from|of|for|in|on|using|via|the|a|an)$|[,;:–-]$/i;

export function sanitizeOutput(
  raw: string,
  opts: { finishReason?: string } = {}
): { text: string; flags: FormatFlags } {
  const flags: FormatFlags = {
    thinkLeak: false,
    preamble: false,
    markdown: false,
    quoted: false,
    multiLine: false,
    truncated: false,
    empty: false
  };
  let t = raw ?? '';

  if (/<think>/i.test(t)) {
    flags.thinkLeak = true;
    t = /<\/think>/i.test(t) ? t.replace(/<think>[\s\S]*?<\/think>/gi, '') : '';
  }
  t = t.trim();

  let prev: string;
  do {
    prev = t;
    if (PREAMBLE.test(t)) {
      flags.preamble = true;
      t = t.replace(PREAMBLE, '').trim();
    }
  } while (t !== prev);

  const lines = t
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean);
  if (lines.length > 1) flags.multiLine = true;
  t = lines[0] ?? '';

  if (/^(?:[-*•]|\d+[.)])\s+/.test(t)) {
    flags.markdown = true;
    t = t.replace(/^(?:[-*•]|\d+[.)])\s+/, '');
  }
  if (/\*\*|__|`/.test(t)) {
    flags.markdown = true;
    t = t.replace(/\*\*|__|`/g, '');
  }
  if (/^["'“‘].*["'”’]$/.test(t)) {
    flags.quoted = true;
    t = t.slice(1, -1).trim();
  }
  if (/^(?:[-*•]|\d+[.)])\s+/.test(t)) {
    flags.markdown = true;
    t = t.replace(/^(?:[-*•]|\d+[.)])\s+/, '');
  }
  if (/\*\*|__|`/.test(t)) {
    flags.markdown = true;
    t = t.replace(/\*\*|__|`/g, '');
  }

  t = t.replace(/\s+/g, ' ').trim();
  flags.empty = t.length === 0;
  flags.truncated = !flags.empty && (opts.finishReason === 'length' || DANGLING.test(t));
  return { text: t, flags };
}

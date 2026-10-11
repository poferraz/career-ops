import pc from 'picocolors';

export function formatDiff(
  original: string,
  rewritten: string,
  invariants: string[] = []
): string {
  const lines: string[] = [];

  lines.push(pc.red(pc.dim(`- ${original.trim()}`)));
  lines.push(pc.green(pc.bold(`+ ${rewritten.trim()}`)));

  if (invariants && invariants.length > 0) {
    const factsList = invariants.join(', ');
    lines.push(pc.cyan(`  🔒 [FACTS LOCKED: ${factsList}]`));
  }

  return lines.join('\n');
}

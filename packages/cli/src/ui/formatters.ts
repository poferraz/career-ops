import pc from 'picocolors';
import type { AuditReport, AtsScanResult } from '@career-ops/audit';

export function formatBanner(): string {
  const line = '═'.repeat(64);
  return [
    pc.blue(pc.bold(line)),
    pc.blue(pc.bold('  CAREER-OPS // DUAL-ENGINE RESUME OPTIMIZER')),
    pc.dim('  Deterministic ATS Invariant Gate & Human Cadence Engine'),
    pc.blue(pc.bold(line))
  ].join('\n');
}

export function formatScorecard(report: AuditReport, atsScan?: AtsScanResult): string {
  const lines: string[] = [];
  const divider = '─'.repeat(60);

  lines.push('');
  lines.push(pc.bold('AUDIT SCORECARD & THREE-BAND QUALITY GATE'));
  lines.push(pc.dim(divider));

  // Gate Status Badge
  let gateBadge = '';
  if (report.gateStatus === 'certified') {
    gateBadge = pc.bgGreen(pc.black(pc.bold(' CERTIFIED ATS READY ')));
  } else if (report.gateStatus === 'warning') {
    gateBadge = pc.bgYellow(pc.black(pc.bold(' WARNING / REVIEW REQUIRED ')));
  } else {
    gateBadge = pc.bgRed(pc.white(pc.bold(' REJECT / INTERVENTION REQUIRED ')));
  }

  const scoreFormatted = `${Number.isInteger(report.totalScore) ? report.totalScore : report.totalScore.toFixed(1)} / ${report.maxTotalScore}`;
  lines.push(`${pc.bold('COMPOSITE SCORE:')} ${pc.bold(pc.cyan(scoreFormatted))}  ${gateBadge}`);
  lines.push(pc.dim(divider));

  // 5 Dimensions
  lines.push(pc.bold('DIMENSION BREAKDOWN:'));
  const dims = [
    { key: 'directness', label: '1. Directness (Passive/Hedging)' },
    { key: 'rhythm', label: '2. Rhythm (Cadence & Variance)' },
    { key: 'trust', label: '3. Trust (Factual Verifiability)' },
    { key: 'authenticity', label: '4. Authenticity (Anti-Buzzword)' },
    { key: 'density', label: '5. Density (Action/Scope/Metric)' }
  ];

  for (const dim of dims) {
    const dimScore = report.dimensions[dim.key];
    const scoreVal = dimScore ? `${dimScore.score.toFixed(1)} / 10` : 'N/A';
    const colorFn = dimScore && dimScore.score >= 8
      ? pc.green
      : dimScore && dimScore.score >= 6.5
        ? pc.yellow
        : pc.red;
    lines.push(`  • ${dim.label.padEnd(38)} : ${colorFn(scoreVal)}`);
  }

  lines.push(pc.dim(divider));

  // ATS Single-Column Layout Check
  if (atsScan) {
    const atsStatus = atsScan.valid
      ? pc.green(pc.bold('PASS: Single-column canonical layout'))
      : pc.red(pc.bold(`FAIL (${atsScan.issues.length} structural issues)`));

    lines.push(`${pc.bold('ATS Single-Column Compliance:')} ${atsStatus}`);
    if (!atsScan.valid) {
      for (const issue of atsScan.issues) {
        lines.push(pc.red(`  ⚠ ${issue}`));
      }
    }
    lines.push(pc.dim(divider));
  }

  // Invariant Preservation
  const invStatus = report.invariantsPassed
    ? pc.green(pc.bold('100% INVARIANTS PRESERVED 🔒'))
    : pc.red(pc.bold(`VIOLATIONS DETECTED: ${report.violations.join(', ')}`));
  lines.push(`${pc.bold('Fact Preservation Gate:')} ${invStatus}`);
  lines.push(pc.dim(divider));

  return lines.join('\n');
}

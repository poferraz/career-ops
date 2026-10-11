import fs from 'node:fs';
import path from 'node:path';
import { AntiSlopScorer, scanAtsLayout, type AuditReport, type AtsScanResult } from '@career-ops/audit';
import { parseResumeMarkdown } from '@career-ops/core';
import { formatScorecard } from '../ui/formatters.js';

export interface AuditCommandOptions {
  ci?: boolean;
  json?: boolean;
  customTools?: string[];
}

export interface AuditCommandResult {
  exitCode: number;
  report: AuditReport;
  atsScan: AtsScanResult;
  formattedOutput: string;
}

export async function runAuditCommand(
  filePath: string,
  options: AuditCommandOptions = {}
): Promise<AuditCommandResult> {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Resume file not found: ${resolvedPath}`);
  }

  const rawMarkdown = fs.readFileSync(resolvedPath, 'utf8');
  const ast = parseResumeMarkdown(rawMarkdown);

  const bullets: string[] = [];
  const sentences: string[] = [];

  for (const role of ast.experience) {
    for (const bullet of role.bullets) {
      bullets.push(bullet.originalText);
      const split = bullet.originalText
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(Boolean);
      sentences.push(...split);
    }
  }

  const report = AntiSlopScorer.evaluate({
    bullets,
    sentences
  });

  const atsScan = scanAtsLayout(rawMarkdown);

  let formattedOutput = '';
  if (options.json) {
    formattedOutput = JSON.stringify({ report, atsScan }, null, 2);
  } else {
    formattedOutput = formatScorecard(report, atsScan);
  }

  let exitCode = 0;
  if (options.ci) {
    if (!report.isPassing || report.gateStatus === 'rejected' || !atsScan.valid) {
      exitCode = 1;
    }
  }

  return {
    exitCode,
    report,
    atsScan,
    formattedOutput
  };
}

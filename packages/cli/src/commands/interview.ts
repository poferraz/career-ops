import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import pc from 'picocolors';
import {
  parseResumeMarkdown,
  renderResumeMarkdown,
  MotivationalInterviewer,
  type BulletNode,
  type InferenceProvider
} from '@career-ops/core';
import { formatBanner } from '../ui/formatters.js';

export interface InterviewCommandOptions {
  output?: string;
  answers?: Record<string, string>;
  provider?: InferenceProvider;
}

export interface InterviewCommandResult {
  enrichedMarkdown: string;
  minedCount: number;
  formattedOutput: string;
}

export async function runInterviewCommand(
  filePath: string,
  options: InterviewCommandOptions = {}
): Promise<InterviewCommandResult> {
  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Resume file not found: ${resolved}`);
  }

  const rawMarkdown = fs.readFileSync(resolved, 'utf8');
  let ast = parseResumeMarkdown(rawMarkdown);

  const interviewer = new MotivationalInterviewer(options.provider);
  const opportunities = interviewer.findProbeOpportunities(ast);

  let minedCount = 0;
  const minedLog: Array<{ original: string; probe: string; answer: string; enriched: string }> = [];

  let rl: readline.Interface | undefined;
  if (!options.answers && process.stdin.isTTY) {
    rl = readline.createInterface({ input, output });
  }

  try {
    for (const opp of opportunities) {
      let answer = '';

      // Check canned answers first (for tests or automated pipelines)
      if (options.answers) {
        for (const [key, ans] of Object.entries(options.answers)) {
          if (opp.originalText.includes(key)) {
            answer = ans;
            break;
          }
        }
      } else if (rl) {
        console.log('\n' + pc.cyan('─'.repeat(60)));
        console.log(pc.bold(pc.yellow('Current Bullet:')) + ` "${opp.originalText}"`);
        console.log(pc.bold(pc.cyan('RISE Probe:')) + ` ${opp.probeQuestion}`);
        answer = await rl.question(pc.bold(pc.green('Your achievement (metrics/tools/scale): ')));
      }

      if (answer && answer.trim().length > 0) {
        // Find corresponding BulletNode in AST
        let targetBullet: BulletNode | undefined;
        for (const role of ast.experience) {
          const b = role.bullets.find(x => x.id === opp.bulletId);
          if (b) {
            targetBullet = b;
            break;
          }
        }

        if (targetBullet) {
          const mined = await interviewer.extractAccomplishment(targetBullet, answer.trim());
          ast = interviewer.applyMinedAccomplishment(ast, mined);
          minedCount++;
          minedLog.push({
            original: opp.originalText,
            probe: opp.probeQuestion,
            answer: answer.trim(),
            enriched: mined.enrichedBullet
          });
        }
      }
    }
  } finally {
    if (rl) {
      rl.close();
    }
  }

  const enrichedMarkdown = renderResumeMarkdown(ast);

  if (options.output) {
    const outPath = path.resolve(process.cwd(), options.output);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, enrichedMarkdown, 'utf8');
  }

  const lines: string[] = [];
  lines.push(formatBanner());
  lines.push('');
  lines.push(pc.bold('Stage 1 Motivational Interviewer — Accomplishments Mined'));
  lines.push(pc.dim('─'.repeat(60)));
  lines.push(`${pc.bold('Probed Opportunities Found:')} ${opportunities.length}`);
  lines.push(`${pc.bold('Accomplishments Mined:')} ${pc.green(pc.bold(String(minedCount)))}`);
  lines.push(pc.dim('─'.repeat(60)));

  for (const item of minedLog) {
    lines.push(pc.dim(`- ${item.original}`));
    lines.push(pc.green(pc.bold(`+ ${item.enriched}`)));
    lines.push('');
  }

  if (options.output) {
    lines.push(`${pc.green(pc.bold('✓ Metric-enriched resume saved to:'))} ${pc.cyan(options.output)}`);
  }

  const formattedOutput = lines.join('\n');

  return {
    enrichedMarkdown,
    minedCount,
    formattedOutput
  };
}

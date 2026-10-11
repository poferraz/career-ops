import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { parseResumeMarkdown, CoverLetterArchitect, type InferenceProvider } from '@career-ops/core';
import { formatBanner } from '../ui/formatters.js';

export interface CoverLetterCommandOptions {
  output?: string;
  provider?: InferenceProvider;
}

export async function runCoverLetterCommand(
  resumePath: string,
  jdPath: string,
  options: CoverLetterCommandOptions = {}
): Promise<{ letter: string; formattedOutput: string }> {
  const resolvedResume = path.resolve(process.cwd(), resumePath);
  const resolvedJd = path.resolve(process.cwd(), jdPath);

  if (!fs.existsSync(resolvedResume)) {
    throw new Error(`Resume file not found: ${resolvedResume}`);
  }
  if (!fs.existsSync(resolvedJd)) {
    throw new Error(`Job description file not found: ${resolvedJd}`);
  }

  const resumeMarkdown = fs.readFileSync(resolvedResume, 'utf8');
  const jdMarkdown = fs.readFileSync(resolvedJd, 'utf8');
  const ast = parseResumeMarkdown(resumeMarkdown);

  const letter = await CoverLetterArchitect.generateLetter(ast, jdMarkdown, {
    provider: options.provider
  });

  if (options.output) {
    const outPath = path.resolve(process.cwd(), options.output);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, letter, 'utf8');
  }

  const lines: string[] = [];
  lines.push(formatBanner());
  lines.push('');
  lines.push(pc.bold('Track A: Hook-Match-Close Cover Letter'));
  lines.push(pc.dim('─'.repeat(60)));
  lines.push(letter);
  lines.push(pc.dim('\n' + '─'.repeat(60)));

  if (options.output) {
    lines.push(`${pc.green(pc.bold('✓ Saved cover letter to:'))} ${pc.cyan(options.output)}`);
  }

  return {
    letter,
    formattedOutput: lines.join('\n')
  };
}

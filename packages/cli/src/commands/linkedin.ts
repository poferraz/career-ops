import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { parseResumeMarkdown, LinkedInStrategist, type LinkedInProfile, type InferenceProvider } from '@career-ops/core';
import { formatBanner } from '../ui/formatters.js';

export interface LinkedInCommandOptions {
  output?: string;
  targetRole?: string;
  domainFocus?: string;
  provider?: InferenceProvider;
}

export async function runLinkedInCommand(
  resumePath: string,
  options: LinkedInCommandOptions = {}
): Promise<{ profile: LinkedInProfile; formattedOutput: string }> {
  const resolved = path.resolve(process.cwd(), resumePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Resume file not found: ${resolved}`);
  }

  const rawMarkdown = fs.readFileSync(resolved, 'utf8');
  const ast = parseResumeMarkdown(rawMarkdown);

  const profile = await LinkedInStrategist.generateProfile(ast, {
    targetRole: options.targetRole,
    domainFocus: options.domainFocus,
    provider: options.provider
  });

  const lines: string[] = [];
  lines.push(formatBanner());
  lines.push('');
  lines.push(pc.bold('Track B: LinkedIn Authority Profile Deliverables'));
  lines.push(pc.dim('─'.repeat(60)));
  lines.push(`${pc.bold('Headline (<= 220 chars):')} (${profile.headline.length} chars)`);
  lines.push(pc.cyan(pc.bold(profile.headline)));
  lines.push('');
  lines.push(pc.bold('3-Act Authority About Narrative:'));
  lines.push(profile.about);
  lines.push('');
  lines.push(`${pc.bold('Top Skill Endorsement Clusters:')} ${profile.skills.join(', ')}`);
  lines.push(pc.dim('─'.repeat(60)));

  if (options.output) {
    const outPath = path.resolve(process.cwd(), options.output);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    const fileContent = `# LinkedIn Profile Deliverables\n\n## Headline\n${profile.headline}\n\n## About\n${profile.about}\n\n## Top Skills\n${profile.skills.join(', ')}\n`;
    fs.writeFileSync(outPath, fileContent, 'utf8');
    lines.push(`${pc.green(pc.bold('✓ Saved LinkedIn deliverables to:'))} ${pc.cyan(options.output)}`);
  }

  return {
    profile,
    formattedOutput: lines.join('\n')
  };
}

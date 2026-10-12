import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseResumeMarkdown, exportResume } from '@career-ops/core';
import type { ExportFormat } from '@career-ops/core';
import pc from 'picocolors';

export interface ExportCommandOptions {
  format?: string;
  output?: string;
  name?: string;
}

export async function exportCommand(
  resumePath: string,
  options: ExportCommandOptions = {}
): Promise<Partial<Record<ExportFormat, string>>> {
  if (!fs.existsSync(resumePath)) {
    console.error(pc.red(`File not found: ${resumePath}`));
    throw new Error(`File not found: ${resumePath}`);
  }

  const rawMarkdown = fs.readFileSync(resumePath, 'utf-8');
  const ast = parseResumeMarkdown(rawMarkdown);

  const rawFormats = (options.format ?? 'pdf,md')
    .split(',')
    .map(f => f.trim().toLowerCase()) as ExportFormat[];

  const validFormats: ExportFormat[] = [];
  for (const f of rawFormats) {
    if (['pdf', 'docx', 'md', 'json'].includes(f)) {
      validFormats.push(f);
    } else {
      console.log(pc.yellow(`Skipping unsupported export format: ${f}`));
    }
  }

  if (validFormats.length === 0) {
    validFormats.push('pdf', 'md');
  }

  const outputDir = path.resolve(options.output ?? './dist');
  const defaultBaseName = path.basename(resumePath, path.extname(resumePath));
  const filename = options.name ?? defaultBaseName;

  const results = await exportResume(ast, validFormats, {
    outputDir,
    filename
  });

  for (const [fmt, fPath] of Object.entries(results)) {
    if (fPath && fs.existsSync(fPath)) {
      const sizeBytes = fs.statSync(fPath).size;
      const sizeKb = (sizeBytes / 1024).toFixed(1);
      console.log(`${pc.green(pc.bold('✓ Exported:'))} ${pc.cyan(fPath)} ${pc.dim(`(${fmt.toUpperCase()}, ${sizeKb} KB)`)}`);
    }
  }

  return results;
}

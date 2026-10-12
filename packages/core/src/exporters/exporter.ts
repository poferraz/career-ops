import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ResumeAST } from '../types.js';
import type { ExportFormat, ExportOptions } from './types.js';
import { generateAtsPdf } from './pdf-exporter.js';
import { generateAtsDocx } from './docx-exporter.js';
import { renderResumeMarkdown } from '../parser/ast-parser.js';

export async function exportResume(
  ast: ResumeAST,
  formats: ExportFormat[] = ['pdf', 'md'],
  options: ExportOptions = {}
): Promise<Partial<Record<ExportFormat, string>>> {
  const outputDir = path.resolve(options.outputDir ?? process.cwd());
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const baseName = options.filename
    ? options.filename.replace(/\.[^/.]+$/, '')
    : (ast.header.name ? ast.header.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'resume');

  const results: Partial<Record<ExportFormat, string>> = {};

  for (const fmt of formats) {
    const filePath = path.join(outputDir, `${baseName}.${fmt}`);

    switch (fmt) {
      case 'pdf': {
        const buffer = generateAtsPdf(ast, options);
        fs.writeFileSync(filePath, buffer);
        results.pdf = filePath;
        break;
      }
      case 'docx': {
        const buffer = generateAtsDocx(ast, options);
        fs.writeFileSync(filePath, buffer);
        results.docx = filePath;
        break;
      }
      case 'md': {
        const mdText = renderResumeMarkdown(ast);
        fs.writeFileSync(filePath, mdText, 'utf-8');
        results.md = filePath;
        break;
      }
      case 'json': {
        const jsonText = JSON.stringify(ast, null, 2);
        fs.writeFileSync(filePath, jsonText, 'utf-8');
        results.json = filePath;
        break;
      }
    }
  }

  return results;
}

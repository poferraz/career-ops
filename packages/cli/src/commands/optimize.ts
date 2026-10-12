import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import {
  FourStagePipeline,
  OllamaProvider,
  MockInferenceProvider,
  DEMO_CANDIDATE_RESUME,
  exportResume,
  type OptimizationResult,
  type InferenceProvider,
  type ExportFormat
} from '@career-ops/core';
import { formatBanner, formatScorecard } from '../ui/formatters.js';
import { formatDiff } from '../ui/diff-view.js';

export interface OptimizeCommandOptions {
  demo?: boolean;
  mock?: boolean;
  remote?: string;
  output?: string;
  format?: string;
  diff?: boolean;
  json?: boolean;
  customTools?: string[];
  provider?: InferenceProvider;
}

export interface OptimizeCommandResult extends OptimizationResult {
  formattedOutput: string;
}

export async function runOptimizeCommand(
  filePath?: string,
  options: OptimizeCommandOptions = {}
): Promise<OptimizeCommandResult> {
  let markdownInput = '';

  if (options.demo) {
    markdownInput = DEMO_CANDIDATE_RESUME;
  } else if (filePath) {
    const resolved = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Resume file not found: ${resolved}`);
    }
    markdownInput = fs.readFileSync(resolved, 'utf8');
  } else {
    throw new Error('Please specify a resume path or pass --demo for zero-config demo evaluation.');
  }

  // Determine inference provider
  let provider: InferenceProvider;
  if (options.provider) {
    provider = options.provider;
  } else if (options.demo || options.mock) {
    const mock = new MockInferenceProvider({
      defaultResponse: 'Architected distributed event streaming architecture, boosting throughput to 250k events/sec.'
    });
    // Add default invariant-preserving rewrite mocks
    mock.addMock(
      /migration/i,
      'Migrated legacy infrastructure to Kubernetes, slashing expenditures by 45%.'
    );
    mock.addMock(
      /payment/i,
      'Engineered distributed payment reconciliation engine in Go and PostgreSQL, reconciling $42M daily transactions.'
    );
    provider = mock;
  } else {
    provider = new OllamaProvider({
      baseUrl: options.remote ?? 'http://localhost:11434'
    });
  }

  const pipeline = new FourStagePipeline(provider);
  const result = await pipeline.optimize(markdownInput, {
    customTools: options.customTools
  });

  // Write output if requested
  if (options.output) {
    const outPath = path.resolve(process.cwd(), options.output);
    if (options.format) {
      const rawFormats = options.format.split(',').map(f => f.trim().toLowerCase()) as ExportFormat[];
      const isFile = path.extname(outPath).length > 0;
      const outputDir = isFile ? path.dirname(outPath) : outPath;
      const filename = isFile ? path.basename(outPath, path.extname(outPath)) : undefined;

      await exportResume(result.ast, rawFormats, {
        outputDir,
        filename
      });
    } else {
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, result.markdown, 'utf8');
    }
  }

  // Build terminal output
  let formattedOutput = '';
  if (options.json) {
    formattedOutput = JSON.stringify(result, null, 2);
  } else {
    const lines: string[] = [];
    lines.push(formatBanner());

    if (options.demo) {
      lines.push('');
      lines.push(pc.bgCyan(pc.black(pc.bold(' DEMO MODE: Executing on canonical Morgan Vance candidate fixture '))) + '\n');
    }

    lines.push(formatScorecard(result.auditReport, result.atsScan));

    if (options.diff) {
      lines.push('');
      lines.push(pc.bold('TRANSFORMATION DIFF (ORIGINAL vs VERIFIED CANDIDATE):'));
      lines.push(pc.dim('─'.repeat(60)));

      for (const role of result.ast.experience) {
        lines.push(`\n${pc.bold(pc.cyan(`### ${role.title} | ${role.company}`))}`);
        for (const bullet of role.bullets) {
          const finalB = bullet.finalBullet ?? bullet.originalText;
          lines.push(formatDiff(bullet.originalText, finalB, bullet.invariants.verbatim));
        }
      }
      lines.push(pc.dim('\n' + '─'.repeat(60)));
    }

    if (options.output) {
      lines.push(`\n${pc.green(pc.bold('✓ Optimized resume saved to:'))} ${pc.cyan(options.output)}`);
    }

    formattedOutput = lines.join('\n');
  }

  return {
    ...result,
    formattedOutput
  };
}

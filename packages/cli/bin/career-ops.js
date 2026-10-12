#!/usr/bin/env node
import { Command } from 'commander';
import {
  runDoctorCommand,
  formatDoctorReport,
  runAuditCommand,
  runOptimizeCommand,
  runInterviewCommand,
  runCoverLetterCommand,
  runLinkedInCommand,
  runStudioCommand,
  exportCommand
} from '../dist/index.js';

export function createProgram() {
  const program = new Command();

  program
    .name('career-ops')
    .description('Dual-Engine Career Intelligence & Deterministic Resume Optimizer')
    .version('0.1.0');

  program
    .command('doctor')
    .description('Verify local runtime, Ollama connectivity, model availability, and VRAM memory floor')
    .option('--remote <url>', 'Custom remote Ollama endpoint to test')
    .action(async (opts) => {
      try {
        const report = await runDoctorCommand({ remoteUrl: opts.remote });
        console.log(formatDoctorReport(report));
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  program
    .command('audit')
    .description('Audit a resume against the 5-dimension Anti-Slop rubric and ATS single-column rules')
    .argument('<resume>', 'Path to resume markdown file')
    .option('--ci', 'Exit with code 1 if score < 42 or ATS scan fails')
    .option('--json', 'Output report in JSON format')
    .action(async (resume, opts) => {
      try {
        const result = await runAuditCommand(resume, {
          ci: opts.ci,
          json: opts.json
        });
        console.log(result.formattedOutput);
        if (result.exitCode !== 0) {
          process.exit(result.exitCode);
        }
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  program
    .command('optimize')
    .description('Execute the 4-Stage Career-Ops pipeline on a resume')
    .argument('[resume]', 'Path to resume markdown file')
    .option('--demo', 'Run viral zero-config demo with bundled candidate fixtures')
    .option('--mock', 'Use offline deterministic mock inference provider')
    .option('--remote <url>', 'Connect to remote/cloud Ollama endpoint')
    .option('--output <path>', 'Output destination for optimized resume')
    .option('--format <formats>', 'Export formats (pdf, docx, md, json) when --output is provided', 'pdf,md')
    .option('--diff', 'Display terminal colored diff')
    .option('--json', 'Output full JSON result')
    .action(async (resume, opts) => {
      try {
        const result = await runOptimizeCommand(resume, {
          demo: opts.demo,
          mock: opts.mock,
          remote: opts.remote,
          output: opts.output,
          format: opts.format,
          diff: opts.diff,
          json: opts.json
        });
        console.log(result.formattedOutput);
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  program
    .command('export')
    .description('Export resume into certified single-column ATS deliverables (PDF, DOCX, Markdown, JSON)')
    .argument('<resume>', 'Path to resume markdown file')
    .option('-f, --format <formats>', 'Comma-separated export formats (pdf, docx, md, json)', 'pdf,md')
    .option('-o, --output <dir>', 'Output destination directory', './dist')
    .option('-n, --name <filename>', 'Output base filename')
    .action(async (resume, opts) => {
      try {
        await exportCommand(resume, {
          format: opts.format,
          output: opts.output,
          name: opts.name
        });
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  program
    .command('interview')
    .description('Interactive Stage 1 Motivational Interviewing to solve the Articulation Gap')
    .argument('<resume>', 'Path to resume markdown file')
    .option('--output <path>', 'Destination for metric-enriched resume')
    .action(async (resume, opts) => {
      try {
        const result = await runInterviewCommand(resume, {
          output: opts.output
        });
        console.log(result.formattedOutput);
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  program
    .command('cover-letter')
    .description('Track A: Generate Hook-Match-Close cover letter anchored to target job description')
    .argument('<resume>', 'Path to resume markdown file')
    .requiredOption('--jd <path>', 'Path to target job description markdown file')
    .option('--output <path>', 'Destination for generated cover letter')
    .action(async (resume, opts) => {
      try {
        const result = await runCoverLetterCommand(resume, opts.jd, {
          output: opts.output
        });
        console.log(result.formattedOutput);
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  program
    .command('linkedin')
    .description('Track B: Generate LinkedIn Recruiter Headline (<= 220 chars) and 3-Act About narrative')
    .argument('<resume>', 'Path to resume markdown file')
    .option('--role <title>', 'Target senior role title')
    .option('--domain <domain>', 'Domain specialization')
    .option('--output <path>', 'Destination for generated LinkedIn deliverables')
    .action(async (resume, opts) => {
      try {
        const result = await runLinkedInCommand(resume, {
          targetRole: opts.role,
          domainFocus: opts.domain,
          output: opts.output
        });
        console.log(result.formattedOutput);
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  program
    .command('studio')
    .description('Launch the local interactive Web Studio with Three-Act pipeline canvas')
    .option('-p, --port <number>', 'Port to listen on', '3000')
    .action(async (opts) => {
      try {
        await runStudioCommand({ port: parseInt(opts.port, 10) });
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  return program;
}

const program = createProgram();
if (process.argv[1] && (process.argv[1].endsWith('career-ops.js') || process.argv[1].endsWith('career-ops'))) {
  program.parse(process.argv);
}

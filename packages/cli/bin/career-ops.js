#!/usr/bin/env node
import { Command } from 'commander';

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
    .action(() => {
      console.log('Running doctor...');
    });

  program
    .command('audit')
    .description('Audit a resume against the 5-dimension Anti-Slop rubric and ATS single-column rules')
    .argument('<resume>', 'Path to resume markdown file')
    .option('--ci', 'Exit with code 1 if score < 42 or ATS scan fails')
    .option('--json', 'Output report in JSON format')
    .action(() => {
      console.log('Auditing resume...');
    });

  program
    .command('optimize')
    .description('Execute the 4-Stage Career-Ops pipeline on a resume')
    .argument('[resume]', 'Path to resume markdown file')
    .option('--demo', 'Run viral zero-config demo with bundled candidate fixtures')
    .option('--mock', 'Use offline deterministic mock inference provider')
    .option('--remote <url>', 'Connect to remote/cloud Ollama endpoint')
    .option('--output <path>', 'Output destination for optimized markdown')
    .option('--diff', 'Display terminal colored diff')
    .option('--json', 'Output full JSON result')
    .action(() => {
      console.log('Optimizing resume...');
    });

  program
    .command('interview')
    .description('Interactive Stage 1 Motivational Interviewing to solve the Articulation Gap')
    .argument('<resume>', 'Path to resume markdown file')
    .option('--output <path>', 'Destination for metric-enriched resume')
    .action(() => {
      console.log('Interviewing candidate...');
    });

  return program;
}

const program = createProgram();
if (process.argv[1] && (process.argv[1].endsWith('career-ops.js') || process.argv[1].endsWith('career-ops'))) {
  program.parse(process.argv);
}

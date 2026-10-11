import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { runInterviewCommand } from '../src/commands/interview.js';

describe('Command: career-ops interview', () => {
  let tmpDir: string;
  let resumePath: string;

  const weakResume = `# Jordan Lee
jordan@example.com | Seattle, WA

## Experience

### Senior Software Engineer | CloudWorks
2021 - Present | Seattle, WA
- Responsible for microservices architecture and managing team deliverables.
- Worked on database migration and reduced latency.

## Education

### B.S. in Computer Science | UW
2015 - 2019

## Skills

### Technologies
Go, PostgreSQL, Docker
`;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'career-ops-interview-test-'));
    resumePath = path.join(tmpDir, 'resume.md');
    fs.writeFileSync(resumePath, weakResume, 'utf8');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('identifies probe opportunities and applies mined candidate accomplishments', async () => {
    const result = await runInterviewCommand(resumePath, {
      answers: {
        'Responsible for microservices': 'We deployed 14 Go microservices scaling to 80k RPS across 3 AWS regions.',
        'database migration': 'Migrated 4TB PostgreSQL cluster with zero downtime, cutting p99 query latency from 320ms to 24ms.'
      }
    });

    expect(result.minedCount).toBeGreaterThan(0);
    expect(result.enrichedMarkdown).toContain('80k RPS');
    expect(result.enrichedMarkdown).toContain('24ms');
    expect(result.formattedOutput).toContain('Stage 1 Motivational Interviewer');
    expect(result.formattedOutput).toContain('Accomplishments Mined');
  });

  it('saves enriched markdown to destination if --output is specified', async () => {
    const outputPath = path.join(tmpDir, 'enriched.md');

    await runInterviewCommand(resumePath, {
      output: outputPath,
      answers: {
        'Responsible for microservices': 'Scaled 12 microservices to 100k QPS.'
      }
    });

    expect(fs.existsSync(outputPath)).toBe(true);
    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('100k QPS');
  });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { execSync } from 'node:child_process';
import { exportCommand } from '../src/commands/export.js';

describe('Export Command & Exporter Pipeline', () => {
  let tmpDir: string;
  let sampleResumePath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'career-ops-export-test-'));
    sampleResumePath = path.join(tmpDir, 'resume.md');
    fs.writeFileSync(
      sampleResumePath,
      `# Jordan Lee
jordan@example.com | 555-0199 | Austin, TX

## Experience
### Senior Backend Engineer - ScaleCo
2020 - Present
- Scaled Redis caching layers across 10 instances, reducing database latency by 45ms.
- Built Go microservices handling 80,000 requests per minute with 99.99% uptime.

## Education
### B.S. in Electrical Engineering - UT Austin
2016 - 2020

## Skills
Languages: Go, TypeScript, Python
Infrastructure: Redis, Docker, AWS
`
    );
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('exports ATS-certified PDF, DOCX, and Markdown via exportCommand', async () => {
    const outDir = path.join(tmpDir, 'exported');
    const result = await exportCommand(sampleResumePath, {
      format: 'pdf,docx,md,json',
      output: outDir,
      name: 'jordan-resume'
    });

    expect(result.pdf).toBeDefined();
    expect(result.docx).toBeDefined();
    expect(result.md).toBeDefined();
    expect(result.json).toBeDefined();

    // Verify files exist on disk with positive byte sizes
    expect(fs.existsSync(result.pdf)).toBe(true);
    expect(fs.statSync(result.pdf).size).toBeGreaterThan(500);

    expect(fs.existsSync(result.docx)).toBe(true);
    expect(fs.statSync(result.docx).size).toBeGreaterThan(500);

    expect(fs.existsSync(result.md)).toBe(true);
    expect(fs.readFileSync(result.md, 'utf-8')).toContain('Jordan Lee');

    expect(fs.existsSync(result.json)).toBe(true);
    const parsedJson = JSON.parse(fs.readFileSync(result.json, 'utf-8'));
    expect(parsedJson.header.name).toBe('Jordan Lee');
  });

  it('runs CLI export command via bin runner', () => {
    const cliBin = path.resolve(__dirname, '../bin/career-ops.js');
    const outDir = path.join(tmpDir, 'cli-out');
    const stdout = execSync(`node "${cliBin}" export "${sampleResumePath}" --format pdf,md --output "${outDir}"`, {
      encoding: 'utf8'
    });

    expect(stdout).toContain('Exported:');
    const files = fs.readdirSync(outDir);
    expect(files.some(f => f.endsWith('.pdf'))).toBe(true);
    expect(files.some(f => f.endsWith('.md'))).toBe(true);
  });
});

import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { runAuditCommand } from '../src/commands/audit.js';

describe('Command: career-ops audit', () => {
  let tmpDir: string;
  let validResumePath: string;
  let weakResumePath: string;

  const validMarkdown = `# Alex Vance
alex@example.com | San Francisco, CA

## Experience

### Senior Systems Engineer | InfraCorp
2020 - Present | San Francisco, CA
- Architected distributed streaming pipeline handling 250k events per second across 12 node clusters with Go and Kafka.
- Slashed AWS infrastructure costs by 38% through Kubernetes container bin-packing and spot autoscaling.

## Education

### B.S. in Computer Science | UC Berkeley
2016 - 2020

## Skills

### Technical Skills
Go, Kubernetes, Kafka, AWS, Docker
`;

  const weakMarkdown = `# John Doe
john@example.com

## Experience

### Developer | SoftCorp
2021 - Present
- Responsible for helping team with various microservices and leveraged synergies.
- Spearheaded cross-functional initiatives to drive results-oriented impact.
`;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'career-ops-audit-test-'));
    validResumePath = path.join(tmpDir, 'valid.md');
    weakResumePath = path.join(tmpDir, 'weak.md');
    fs.writeFileSync(validResumePath, validMarkdown, 'utf8');
    fs.writeFileSync(weakResumePath, weakMarkdown, 'utf8');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('audits a high-calibre resume, yielding a passing score and exit code 0', async () => {
    const result = await runAuditCommand(validResumePath);

    expect(result.exitCode).toBe(0);
    expect(result.report).toBeDefined();
    expect(result.report.totalScore).toBeGreaterThanOrEqual(42);
    expect(result.report.gateStatus).toBe('certified');
    expect(result.atsScan.valid).toBe(true);
    expect(result.formattedOutput).toContain('CERTIFIED ATS READY');
  });

  it('audits a weak/buzzword-laden resume and returns exit code 1 with --ci flag', async () => {
    const result = await runAuditCommand(weakResumePath, { ci: true });

    expect(result.exitCode).toBe(1);
    expect(result.report.gateStatus).not.toBe('certified');
    expect(result.formattedOutput).toContain('REJECT / INTERVENTION REQUIRED');
  });

  it('outputs raw JSON when --json flag is set', async () => {
    const result = await runAuditCommand(validResumePath, { json: true });

    expect(result.exitCode).toBe(0);
    const parsed = JSON.parse(result.formattedOutput);
    expect(parsed.report).toBeDefined();
    expect(parsed.atsScan).toBeDefined();
  });
});

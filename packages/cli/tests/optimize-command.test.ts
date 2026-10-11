import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { runOptimizeCommand } from '../src/commands/optimize.js';
import { MockInferenceProvider } from '@career-ops/core';

describe('Command: career-ops optimize', () => {
  let tmpDir: string;
  let resumePath: string;

  const testResume = `# Taylor Swift
taylor@example.com | Nashville, TN

## Experience

### Principal Distributed Systems Engineer | StreamScale
2021 - Present | Remote
- Spearheaded the complete migration of legacy monolith to Kubernetes, cutting AWS bills by 45%.
- Responsible for microservices architecture and managing team deliverables.

## Education

### B.S. in Computer Science | Vanderbilt
2015 - 2019

## Skills

### Technologies
Kubernetes, Docker, Go, AWS
`;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'career-ops-opt-test-'));
    resumePath = path.join(tmpDir, 'resume.md');
    fs.writeFileSync(resumePath, testResume, 'utf8');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('runs zero-config viral demo mode with --demo', async () => {
    const result = await runOptimizeCommand(undefined, { demo: true });

    expect(result).toBeDefined();
    expect(result.ast).toBeDefined();
    expect(result.markdown).toContain('Morgan Vance');
    expect(result.auditReport).toBeDefined();
    expect(result.formattedOutput).toContain('COMPOSITE SCORE');
    expect(result.formattedOutput).toContain('DEMO MODE');
  });

  it('optimizes user resume file with --mock and outputs diff', async () => {
    const mockProvider = new MockInferenceProvider();
    mockProvider.addMock(
      /Spearheaded the complete migration/i,
      'Migrated legacy monolith to Kubernetes, slashing cloud infrastructure costs by 45%.'
    );

    const result = await runOptimizeCommand(resumePath, {
      mock: true,
      diff: true,
      provider: mockProvider
    });

    expect(result.markdown).toContain('45%');
    expect(result.formattedOutput).toContain('FACTS LOCKED');
    expect(result.formattedOutput).toContain('- ');
    expect(result.formattedOutput).toContain('+ ');
  });

  it('writes optimized markdown to --output path', async () => {
    const outputPath = path.join(tmpDir, 'optimized.md');

    await runOptimizeCommand(resumePath, {
      mock: true,
      output: outputPath
    });

    expect(fs.existsSync(outputPath)).toBe(true);
    const written = fs.readFileSync(outputPath, 'utf8');
    expect(written).toContain('Taylor Swift');
    expect(written).toContain('45%');
  });
});

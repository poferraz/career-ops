import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { DEMO_CANDIDATE_RESUME, DEMO_JOB_SPEC } from '@career-ops/core';

describe('Career-Ops CLI: End-to-End Program Execution', () => {
  const cliBin = path.resolve(__dirname, '../bin/career-ops.js');
  let tmpDir: string;
  let resumePath: string;
  let jdPath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'career-ops-e2e-'));
    resumePath = path.join(tmpDir, 'resume.md');
    jdPath = path.join(tmpDir, 'job.md');
    fs.writeFileSync(resumePath, DEMO_CANDIDATE_RESUME, 'utf8');
    fs.writeFileSync(jdPath, DEMO_JOB_SPEC, 'utf8');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('runs "career-ops optimize --demo --diff" end-to-end with colored terminal diff', () => {
    const stdout = execSync(`node "${cliBin}" optimize --demo --diff`, { encoding: 'utf8' });
    expect(stdout).toContain('DEMO MODE');
    expect(stdout).toContain('COMPOSITE SCORE:');
    expect(stdout).toContain('TRANSFORMATION DIFF');
    expect(stdout).toContain('FACTS LOCKED');
  });

  it('runs "career-ops audit <resume>" end-to-end', () => {
    const stdout = execSync(`node "${cliBin}" audit "${resumePath}"`, { encoding: 'utf8' });
    expect(stdout).toContain('AUDIT SCORECARD & THREE-BAND QUALITY GATE');
    expect(stdout).toContain('COMPOSITE SCORE:');
    expect(stdout).toContain('ATS Single-Column Compliance');
  });

  it('runs "career-ops doctor" end-to-end', () => {
    const stdout = execSync(`node "${cliBin}" doctor`, { encoding: 'utf8' });
    expect(stdout).toContain('CAREER-OPS ENVIRONMENT DIAGNOSTICS');
    expect(stdout).toContain('Node.js Runtime');
    expect(stdout).toContain('Ollama Connectivity');
  });

  it('runs "career-ops cover-letter <resume> --jd <job>" end-to-end', () => {
    const stdout = execSync(`node "${cliBin}" cover-letter "${resumePath}" --jd "${jdPath}"`, { encoding: 'utf8' });
    expect(stdout).toContain('Track A: Hook-Match-Close Cover Letter');
    expect(stdout).toContain('Morgan Vance');
    expect(stdout).toContain('HyperPlane Infrastructure');
  });

  it('runs "career-ops linkedin <resume>" end-to-end', () => {
    const stdout = execSync(`node "${cliBin}" linkedin "${resumePath}"`, { encoding: 'utf8' });
    expect(stdout).toContain('Track B: LinkedIn Authority Profile Deliverables');
    expect(stdout).toContain('Headline');
    expect(stdout).toContain('Operating Philosophy');
  });
});

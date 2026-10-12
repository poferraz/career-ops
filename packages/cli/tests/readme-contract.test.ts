import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';

describe('README Command Contract Verification', () => {
  const cliBin = path.resolve(__dirname, '../bin/career-ops.js');

  it('verifies "career-ops --help" displays all documented subcommands', () => {
    const stdout = execSync(`node "${cliBin}" --help`, { encoding: 'utf8' });

    expect(stdout).toContain('optimize');
    expect(stdout).toContain('audit');
    expect(stdout).toContain('interview');
    expect(stdout).toContain('doctor');
    expect(stdout).toContain('export');
    expect(stdout).toContain('cover-letter');
    expect(stdout).toContain('linkedin');
    expect(stdout).toContain('studio');
  });

  it('verifies the documented zero-config demo executes cleanly', () => {
    const stdout = execSync(`node "${cliBin}" optimize --demo --diff`, { encoding: 'utf8' });
    expect(stdout).toContain('DEMO MODE');
    expect(stdout).toContain('COMPOSITE SCORE:');
    expect(stdout).toContain('AUDIT SCORECARD & THREE-BAND QUALITY GATE');
    expect(stdout).toContain('FACTS LOCKED');
  });

  it('verifies "career-ops doctor" runs and checks local environment', () => {
    const stdout = execSync(`node "${cliBin}" doctor`, { encoding: 'utf8' });
    expect(stdout).toContain('CAREER-OPS ENVIRONMENT DIAGNOSTICS');
  });

  it('verifies "career-ops export --help" documents format and output options', () => {
    const stdout = execSync(`node "${cliBin}" export --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--format');
    expect(stdout).toContain('--output');
  });
});

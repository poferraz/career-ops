import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

describe('@career-ops/cli Scaffolding', () => {
  const cliBinPath = path.resolve(__dirname, '../bin/career-ops.js');

  it('provides an executable bin/career-ops.js', () => {
    expect(fs.existsSync(cliBinPath)).toBe(true);
    const content = fs.readFileSync(cliBinPath, 'utf8');
    expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
  });

  it('executes --help and displays the core command suite', () => {
    const output = execSync(`node "${cliBinPath}" --help`, { encoding: 'utf8' });
    expect(output).toContain('career-ops');
    expect(output).toContain('audit');
    expect(output).toContain('optimize');
    expect(output).toContain('doctor');
  });
});

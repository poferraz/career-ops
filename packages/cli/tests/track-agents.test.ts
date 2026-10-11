import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { runCoverLetterCommand } from '../src/commands/cover-letter.js';
import { runLinkedInCommand } from '../src/commands/linkedin.js';
import { DEMO_CANDIDATE_RESUME, DEMO_JOB_SPEC, MockInferenceProvider } from '@career-ops/core';

describe('Track A (Cover Letter) & Track B (LinkedIn Strategist)', () => {
  let tmpDir: string;
  let resumePath: string;
  let jdPath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'career-ops-tracks-test-'));
    resumePath = path.join(tmpDir, 'resume.md');
    jdPath = path.join(tmpDir, 'job.md');
    fs.writeFileSync(resumePath, DEMO_CANDIDATE_RESUME, 'utf8');
    fs.writeFileSync(jdPath, DEMO_JOB_SPEC, 'utf8');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('generates a Hook-Match-Close cover letter anchored to target JD', async () => {
    const mockProvider = new MockInferenceProvider();
    mockProvider.addMock(
      /Hook/i,
      'I have tracked HyperPlane Infrastructure’s work on real-time state synchronization.'
    );

    const result = await runCoverLetterCommand(resumePath, jdPath, {
      provider: mockProvider
    });

    expect(result.letter).toBeDefined();
    expect(result.letter).toContain('HyperPlane');
    expect(result.letter).toContain('Morgan Vance');
    expect(result.formattedOutput).toContain('Hook-Match-Close');
  });

  it('generates LinkedIn Headline (<= 220 chars) and 3-Act About narrative', async () => {
    const mockProvider = new MockInferenceProvider();

    const result = await runLinkedInCommand(resumePath, {
      targetRole: 'Staff Distributed Systems Engineer',
      provider: mockProvider
    });

    expect(result.profile.headline.length).toBeLessThanOrEqual(220);
    expect(result.profile.headline).toContain('Staff Distributed Systems Engineer');
    expect(result.profile.about).toContain('Operating Philosophy');
    expect(result.profile.skills.length).toBeGreaterThan(0);
    expect(result.formattedOutput).toContain('LinkedIn Authority Profile');
  });
});

import { describe, it, expect } from 'vitest';
import { parseResumeMarkdown } from '../src/parser/ast-parser.js';
import { MotivationalInterviewer } from '../src/pipeline/stage1-interviewer.js';
import { MockInferenceProvider } from '../src/inference/mock-provider.js';

describe('Stage 1: Motivational Interviewer & Accomplishment Miner', () => {
  const resumeMarkdown = `# Alex Smith
alex@example.com

## Experience
### Backend Engineer - FinTech Labs
2022 - Present
- Built payment reconciliation pipeline.
- Scaled Kubernetes cluster to 50 nodes reducing AWS bill by $20K monthly.
`;

  it('identifies probe opportunities for weak bullets lacking metrics', () => {
    const ast = parseResumeMarkdown(resumeMarkdown);
    const interviewer = new MotivationalInterviewer();

    const probes = interviewer.findProbeOpportunities(ast);

    // Bullet 1 lacks metrics and scope -> needs probe
    // Bullet 2 already has 50 nodes, $20K -> no probe needed
    expect(probes.length).toBe(1);
    expect(probes[0]?.originalText).toBe('Built payment reconciliation pipeline.');
    expect(probes[0]?.missingDimension).toBe('metric');
    expect(probes[0]?.probeQuestion).toContain('What was the throughput, volume, or error reduction');
  });

  it('extracts structured metrics from candidate conversational response', async () => {
    const ast = parseResumeMarkdown(resumeMarkdown);
    const mock = new MockInferenceProvider();
    
    // Simulate LLM structuring the candidate answer
    mock.addMock(/extract/i, JSON.stringify({
      metric: '$5M daily volume',
      tool: 'Go, PostgreSQL',
      scope: '3 microservices',
      enrichedBullet: 'Built payment reconciliation pipeline in Go and PostgreSQL, settling $5M daily volume across 3 microservices.'
    }));

    const interviewer = new MotivationalInterviewer(mock);
    const weakBullet = ast.experience[0]!.bullets[0]!;

    const mined = await interviewer.extractAccomplishment(
      weakBullet,
      'We handled around 5 million dollars in daily volume using Go and Postgres across 3 services.'
    );

    expect(mined.metric).toContain('5M');
    expect(mined.tool).toContain('Go');
    expect(mined.enrichedBullet).toContain('$5M');
  });

  it('applies mined accomplishment back into ResumeAST and updates invariants', async () => {
    const ast = parseResumeMarkdown(resumeMarkdown);
    const interviewer = new MotivationalInterviewer();
    const weakBullet = ast.experience[0]!.bullets[0]!;

    const mined = {
      bulletId: weakBullet.id,
      metric: '$5M daily volume',
      tool: 'Go',
      scope: '3 microservices',
      enrichedBullet: 'Built payment reconciliation pipeline in Go, settling $5M daily volume across 3 microservices.'
    };

    const updatedAst = interviewer.applyMinedAccomplishment(ast, mined);
    const updatedBullet = updatedAst.experience[0]!.bullets[0]!;

    expect(updatedBullet.originalText).toBe(mined.enrichedBullet);
    expect(updatedBullet.minedMetrics).toContain('$5M daily volume');
    expect(updatedBullet.invariants.semantic).toContain('5000000 USD');
    expect(updatedBullet.invariants.verbatim).toContain('Go');
    expect(updatedBullet.status).toBe('mined');
  });
});

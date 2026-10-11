import { describe, it, expect } from 'vitest';
import {
  FourStagePipeline,
  MockInferenceProvider,
  parseResumeMarkdown,
  renderResumeMarkdown,
  DEMO_CANDIDATE_RESUME,
  DEMO_JOB_SPEC
} from '../src/index.js';

describe('Career-Ops Core: End-to-End Integration', () => {
  it('exports canonical demo fixtures', () => {
    expect(DEMO_CANDIDATE_RESUME).toBeDefined();
    expect(typeof DEMO_CANDIDATE_RESUME).toBe('string');
    expect(DEMO_CANDIDATE_RESUME).toContain('## Experience');
    expect(DEMO_CANDIDATE_RESUME).toContain('## Education');
    expect(DEMO_CANDIDATE_RESUME).toContain('## Skills');

    expect(DEMO_JOB_SPEC).toBeDefined();
    expect(typeof DEMO_JOB_SPEC).toBe('string');
    expect(DEMO_JOB_SPEC).toContain('Distributed Systems');
  });

  it('runs complete four-stage lifecycle from raw markdown to verified ATS output', async () => {
    const mockProvider = new MockInferenceProvider({
      defaultResponse: 'Engineered high-throughput streaming architecture handling 150k events per second with Kafka and Go.'
    });

    const pipeline = new FourStagePipeline(mockProvider);

    // 1. AST Parsing
    const parsedAst = parseResumeMarkdown(DEMO_CANDIDATE_RESUME);
    expect(parsedAst.experience.length).toBeGreaterThan(0);
    expect(parsedAst.header.name).toBeDefined();

    // 2. Stage 1: Mine opportunities
    const probes = pipeline.findProbeOpportunities(parsedAst);
    expect(Array.isArray(probes)).toBe(true);

    // 3. Four-Stage Optimization
    const result = await pipeline.optimize(DEMO_CANDIDATE_RESUME, {
      customTools: ['Kafka', 'Go', 'Kubernetes', 'Redis', 'PostgreSQL', 'Docker', 'AWS']
    });

    // 4. Output verification
    expect(result.markdown).toBeDefined();
    expect(result.ast).toBeDefined();
    expect(result.atsScan?.valid).toBe(true);
    expect(result.auditReport).toBeDefined();
    expect(result.summary).toContain('Four-Stage optimization complete');

    // 5. Re-render roundtrip integrity
    const reRendered = renderResumeMarkdown(result.ast);
    expect(reRendered).toEqual(result.markdown);
  });
});

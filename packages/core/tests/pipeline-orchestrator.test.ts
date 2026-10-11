import { describe, it, expect, vi } from 'vitest';
import { FourStagePipeline } from '../src/pipeline/pipeline-orchestrator.js';
import { MockInferenceProvider } from '../src/inference/mock-provider.js';

describe('FourStagePipeline Orchestrator', () => {
  const sampleResumeMarkdown = `# Alex Mercer
alex@example.com | San Francisco, CA | linkedin.com/in/alexmercer

## Experience

### Principal Architect | CloudScale Inc.
Jan 2021 - Present | San Francisco, CA
- Spearheaded the complete migration of legacy monolith to Kubernetes, cutting AWS bills by 45%.
- Responsible for microservices architecture and managing team deliverables.

## Education

### B.S. in Computer Science | UC Berkeley
2015 - 2019

## Skills

### Technologies
Kubernetes, Docker, Go, TypeScript, AWS
`;

  it('orchestrates end-to-end 4-stage pipeline with model eviction and audit gating', async () => {
    const mockProvider = new MockInferenceProvider();

    // Mock Hemingway response (Stage 2)
    mockProvider.addMock(
      /Spearheaded the complete migration/i,
      'Migrated legacy monolith to Kubernetes, slashing AWS expenditures by 45%.'
    );
    mockProvider.addMock(
      /Responsible for microservices architecture/i,
      'Architected distributed microservices handling 250k RPS across 12 node clusters.'
    );

    // Mock Humanizer response (Stage 3)
    mockProvider.addMock(
      /Migrated legacy monolith to Kubernetes, slashing AWS expenditures by 45%/i,
      'Migrated our legacy monolith to Kubernetes. This dropped AWS expenditures by 45%.'
    );
    mockProvider.addMock(
      /Architected distributed microservices handling 250k RPS across 12 node clusters/i,
      'Architected distributed microservices handling 250k RPS across 12 node clusters.'
    );

    const evictSpy = vi.spyOn(mockProvider, 'evictModel');

    const pipeline = new FourStagePipeline(mockProvider);

    const result = await pipeline.optimize(sampleResumeMarkdown, {
      stage2Model: 'richardyoung/hemmingway-1:Q4_K_M',
      stage3Model: 'jialinyyzz/humanizer:Q4_K_M',
      evictModels: true
    });

    expect(result).toBeDefined();
    expect(result.ast).toBeDefined();
    expect(result.markdown).toContain('Alex Mercer');
    expect(result.markdown).toContain('45%');
    expect(result.auditReport).toBeDefined();
    expect(result.atsScan?.valid).toBe(true);

    // Verify model eviction was called sequentially for both models
    expect(evictSpy).toHaveBeenCalledWith('richardyoung/hemmingway-1:Q4_K_M');
    expect(evictSpy).toHaveBeenCalledWith('jialinyyzz/humanizer:Q4_K_M');

    // Verify bullet resolution
    const bullets = result.ast.experience[0].bullets;
    expect(bullets[0].finalBullet).toContain('45%');
    expect(bullets[0].status).toBe('verified');
  });

  it('incorporates Stage 1 mined accomplishments before Stage 2 and 3', async () => {
    const mockProvider = new MockInferenceProvider();
    const pipeline = new FourStagePipeline(mockProvider);

    // Bullet 2 has a probe opportunity (starts with "Responsible for", lacking metrics)
    const opportunities = pipeline.findProbeOpportunities(sampleResumeMarkdown);
    expect(opportunities.length).toBeGreaterThan(0);
    expect(opportunities[0].originalText).toContain('Responsible for');

    // Mock response after mining
    mockProvider.addMock(
      /Architected 14 Go microservices/i,
      'Engineered 14 Go microservices scaling to 50k QPS across 3 AWS regions.'
    );

    const result = await pipeline.optimize(sampleResumeMarkdown, {
      minedAccomplishments: [
        {
          bulletId: opportunities[0].bulletId,
          accomplishment: 'Architected 14 Go microservices scaling to 50k QPS across 3 AWS regions.',
          metrics: ['14 Go microservices', '50k QPS', '3 AWS regions']
        }
      ]
    });

    const secondBullet = result.ast.experience[0].bullets[1];
    expect(secondBullet.minedMetrics).toContain('50k QPS');
  });
});

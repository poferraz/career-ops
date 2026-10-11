import { describe, it, expect } from 'vitest';
import { HemingwayDensityEngine } from '../src/pipeline/stage2-density.js';
import { MockInferenceProvider } from '../src/inference/mock-provider.js';
import type { BulletNode, ExperienceRole } from '../src/types.js';

describe('Stage 2: Hemmingway-1 Density Engine', () => {
  it('optimizes bullet into high-density achievement using Hemmingway model contract', async () => {
    const mock = new MockInferenceProvider();
    mock.addMock(/hemmingway/i, 'Engineered high-throughput Go message pipeline, handling 150K events/second with sub-10ms latency.');

    const engine = new HemingwayDensityEngine(mock);
    const bullet: BulletNode = {
      id: 'b1',
      originalText: 'Built high-throughput message pipeline in Go, handling 150K events/second with sub-10ms latency.',
      invariants: {
        verbatim: ['Go'],
        semantic: ['150K events/second', 'sub-10ms latency']
      },
      status: 'pending'
    };

    const denseBullet = await engine.optimizeBullet(bullet);

    expect(denseBullet).toContain('Engineered high-throughput Go message pipeline');
    expect(mock.history[0]?.options?.model).toBe(HemingwayDensityEngine.MODEL);
    expect(mock.history[0]?.prompt).toContain('<|im_start|>system');
    expect(mock.history[0]?.prompt).toContain('High-Density Action Resume Bullet');
  });

  it('rotates action verbs across consecutive bullets within the same role to prevent verb clumping', async () => {
    const mock = new MockInferenceProvider();
    let callCount = 0;
    mock.addMock(/hemmingway/i, () => {
      callCount++;
      if (callCount === 1) {
        return 'Architected distributed caching layer with Redis across 6 nodes.';
      } else {
        return 'Slashed p99 database response latency from 450ms to 35ms.';
      }
    });

    const engine = new HemingwayDensityEngine(mock);
    const role: ExperienceRole = {
      id: 'r1',
      title: 'Senior Systems Engineer',
      company: 'TechCorp',
      dateRange: '2021 - Present',
      bullets: [
        {
          id: 'b1',
          originalText: 'Built distributed caching layer with Redis across 6 nodes.',
          invariants: { verbatim: ['Redis'], semantic: ['6 nodes'] },
          status: 'pending'
        },
        {
          id: 'b2',
          originalText: 'Reduced p99 database response latency from 450ms to 35ms.',
          invariants: { verbatim: [], semantic: ['450ms', '35ms'] },
          status: 'pending'
        }
      ]
    };

    const denseBullets = await engine.optimizeRoleBullets(role);

    expect(denseBullets.length).toBe(2);
    expect(denseBullets[0]).toContain('Architected');
    expect(denseBullets[1]).toContain('Slashed');
    // Prompt for second bullet should explicitly instruct avoiding 'Architected'
    expect(mock.history[1]?.prompt).toContain('Do NOT start with: Architected');
  });
});

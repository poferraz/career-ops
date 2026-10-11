import { describe, it, expect } from 'vitest';
import { HumanizerCadenceEngine } from '../src/pipeline/stage3-humanizer.js';
import { MockInferenceProvider } from '../src/inference/mock-provider.js';

describe('Stage 3: Humanizer Cadence Engine', () => {
  it('restyles dense bullet into natural human cadence using Humanizer model contract', async () => {
    const mock = new MockInferenceProvider();
    mock.addMock(/humaniz/i, 'Cut monthly AWS expenses by $20K across our 50-node Kubernetes setup.');

    const engine = new HumanizerCadenceEngine(mock);
    const denseBullet = 'Optimized 50-node Kubernetes cluster, slashing monthly AWS expenses by $20K.';

    const humanized = await engine.humanizeBullet(denseBullet, {
      verbatimTools: ['Kubernetes', 'AWS'],
      semanticMetrics: ['50 nodes', '$20K monthly']
    });

    expect(humanized).toBe('Cut monthly AWS expenses by $20K across our 50-node Kubernetes setup.');
    expect(mock.history[0]?.options?.model).toBe(HumanizerCadenceEngine.MODEL);
    expect(mock.history[0]?.prompt).toContain('Humanizer');
    expect(mock.history[0]?.prompt).toContain('50-node Kubernetes cluster');
    expect(mock.history[0]?.prompt).toContain('Immutable Facts');
  });

  it('cleans leading markdown bullets and quotes from model output', async () => {
    const mock = new MockInferenceProvider();
    mock.addMock(/humaniz/i, '- "Streamlined our payment pipeline in Go, handling 150K events/second."');

    const engine = new HumanizerCadenceEngine(mock);
    const res = await engine.humanizeBullet('Engineered Go pipeline processing 150K events/second.');

    expect(res).toBe('Streamlined our payment pipeline in Go, handling 150K events/second.');
  });
});

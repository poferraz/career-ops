import { describe, it, expect, vi } from 'vitest';
import { runDoctorCommand } from '../src/commands/doctor.js';

describe('Command: career-ops doctor', () => {
  it('reports healthy environment when node is valid and ollama has pinned models', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        models: [
          { name: 'richardyoung/hemmingway-1:Q4_K_M' },
          { name: 'jialinyyzz/humanizer:Q4_K_M' }
        ]
      })
    });

    const report = await runDoctorCommand({
      fetchFn: mockFetch as unknown as typeof fetch,
      nodeVersion: 'v22.5.0'
    });

    expect(report.nodePassing).toBe(true);
    expect(report.ollamaConnected).toBe(true);
    expect(report.hemingwayPresent).toBe(true);
    expect(report.humanizerPresent).toBe(true);
    expect(report.isReadyForInference).toBe(true);
    expect(report.summary).toContain('All systems operational');
  });

  it('detects missing models and offers exact pull instructions', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        models: [
          { name: 'llama3:latest' }
        ]
      })
    });

    const report = await runDoctorCommand({
      fetchFn: mockFetch as unknown as typeof fetch,
      nodeVersion: 'v22.5.0'
    });

    expect(report.ollamaConnected).toBe(true);
    expect(report.hemingwayPresent).toBe(false);
    expect(report.humanizerPresent).toBe(false);
    expect(report.isReadyForInference).toBe(false);
    expect(report.summary).toContain('ollama pull richardyoung/hemmingway-1:Q4_K_M');
  });

  it('handles offline/unreachable ollama gracefully with remote flag guidance', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));

    const report = await runDoctorCommand({
      fetchFn: mockFetch as unknown as typeof fetch,
      nodeVersion: 'v22.5.0'
    });

    expect(report.ollamaConnected).toBe(false);
    expect(report.isReadyForInference).toBe(false);
    expect(report.summary).toContain('--remote');
    expect(report.summary).toContain('--mock');
  });
});

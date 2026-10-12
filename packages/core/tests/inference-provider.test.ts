import { describe, it, expect, vi } from 'vitest';
import { MockInferenceProvider } from '../src/inference/mock-provider.js';
import { OllamaProvider } from '../src/inference/ollama-provider.js';

describe('Inference Provider Abstraction', () => {
  describe('MockInferenceProvider', () => {
    it('returns pattern-matched responses and tracks call history', async () => {
      const mock = new MockInferenceProvider();
      mock.addMock(/hemmingway/i, 'Engineered high-throughput Go pipeline handling 150K events/sec.');
      mock.addMock(/humaniz/i, 'Wrote a streaming pipeline in Go that handled 150K events/sec without flinching.');

      const res1 = await mock.generate('Optimize with hemmingway: Built pipeline in Go');
      expect(res1.text).toContain('Engineered high-throughput Go pipeline');

      const res2 = await mock.generate('Humanize text');
      expect(res2.text).toContain('Wrote a streaming pipeline in Go');

      expect(mock.history.length).toBe(2);
      expect(await mock.isAvailable()).toBe(true);
    });

    it('falls back to default handler when no pattern matches', async () => {
      const mock = new MockInferenceProvider({
        defaultResponse: 'Default mocked response'
      });

      const res = await mock.generate('Unknown prompt');
      expect(res.text).toBe('Default mocked response');
    });
  });

  describe('OllamaProvider & Remote Connection Support', () => {
    it('initializes with default localhost or custom cloud/remote endpoint', () => {
      const local = new OllamaProvider();
      expect(local.getBaseUrl()).toBe('http://localhost:11434');

      const cloud = new OllamaProvider({
        baseUrl: 'https://cloud-ollama.internal.net',
        apiKey: 'secret-token-123'
      });
      expect(cloud.getBaseUrl()).toBe('https://cloud-ollama.internal.net');
    });

    it('sends structured request to Ollama /api/generate endpoint', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          response: 'Dense bullet text here',
          model: 'richardyoung/hemmingway-1:Q4_K_M',
          eval_count: 42
        })
      });
      vi.stubGlobal('fetch', fetchSpy);

      const provider = new OllamaProvider({
        baseUrl: 'http://localhost:11434'
      });

      const result = await provider.generate('Transform bullet', {
        model: 'richardyoung/hemmingway-1:Q4_K_M',
        temperature: 0.3,
        keepAlive: 0
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:11434/api/generate',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' })
        })
      );

      const body = JSON.parse(fetchSpy.mock.calls[0]![1].body as string);
      expect(body.model).toBe('richardyoung/hemmingway-1:Q4_K_M');
      expect(body.prompt).toBe('Transform bullet');
      expect(body.keep_alive).toBe(0);
      expect(result.text).toBe('Dense bullet text here');

      vi.unstubAllGlobals();
    });

    it('checks endpoint availability via /api/version', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ version: '0.4.1' })
      });
      vi.stubGlobal('fetch', fetchSpy);

      const provider = new OllamaProvider({ baseUrl: 'http://localhost:11434' });
      const available = await provider.isAvailable();

      expect(available).toBe(true);
      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:11434/api/version',
        expect.any(Object)
      );

      vi.unstubAllGlobals();
    });

    it('enforces num_ctx: 8192 hardware safety cap in runtime options', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          response: 'Dense bullet text',
          model: 'test-model'
        })
      });
      vi.stubGlobal('fetch', fetchSpy);

      const provider = new OllamaProvider({ baseUrl: 'http://localhost:11434' });
      await provider.generate('Prompt', {});

      const body = JSON.parse(fetchSpy.mock.calls[0]![1].body as string);
      expect(body.options).toBeDefined();
      expect(body.options.num_ctx).toBe(8192);

      await provider.generate('Prompt', { numCtx: 4096 });
      const body2 = JSON.parse(fetchSpy.mock.calls[1]![1].body as string);
      expect(body2.options.num_ctx).toBe(4096);

      vi.unstubAllGlobals();
    });
  });
});

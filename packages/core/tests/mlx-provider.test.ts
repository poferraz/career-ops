import { describe, it, expect, vi } from 'vitest';
import { MlxProvider, ContextBudgetError } from '../src/inference/mlx-provider.js';
import { OllamaProvider } from '../src/inference/ollama-provider.js';

const okJson = (body: unknown, status = 200) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' }
    })
  );

describe('MlxProvider (solo-model execution)', () => {
  it('posts raw prompt to /v1/completions with normalized model ID and sampling params', async () => {
    const fetchFn = vi.fn((url: string) => {
      if (url.endsWith('/v1/models/status')) {
        return okJson({ models: [{ id: 'Hemmingway-1-OptiQ-4bit', loaded: false }] });
      }
      return okJson({
        model: 'Hemmingway-1-OptiQ-4bit',
        choices: [{ text: ' Built it.', finish_reason: 'stop' }],
        usage: { prompt_tokens: 12, completion_tokens: 4 }
      });
    });

    const p = new MlxProvider({
      baseUrl: 'http://x:6000/',
      apiKey: 'test-key',
      fetchFn: fetchFn as unknown as typeof fetch
    });

    const r = await p.generate('PROMPT', {
      model: 'mlx-community/Hemmingway-1-OptiQ-4bit',
      temperature: 1,
      topP: 0.95,
      topK: 0,
      minP: 0,
      maxTokens: 64,
      stop: ['\n']
    });

    const completionCall = fetchFn.mock.calls.find(([u]) => String(u).endsWith('/v1/completions'))!;
    expect(completionCall[0]).toBe('http://x:6000/v1/completions');
    const init = completionCall[1] as unknown as RequestInit;
    expect(JSON.parse(init.body as string)).toMatchObject({
      model: 'Hemmingway-1-OptiQ-4bit',
      prompt: 'PROMPT',
      temperature: 1,
      top_p: 0.95,
      top_k: 0,
      min_p: 0,
      max_tokens: 64,
      stop: ['\n'],
      stream: false
    });
    expect(r).toMatchObject({
      text: ' Built it.',
      finishReason: 'stop',
      promptTokens: 12,
      totalTokens: 4
    });
  });

  it('automatically unloads any other resident model before running the requested model', async () => {
    let otherLoaded = true;
    const urls: string[] = [];
    const fetchFn = vi.fn((url: string, init?: RequestInit) => {
      urls.push(`${init?.method ?? 'GET'} ${url}`);
      if (url.endsWith('/v1/models/status')) {
        return okJson({
          models: [
            { id: 'Qwen3-8B-4bit', loaded: otherLoaded, is_loading: false },
            { id: 'Hemmingway-1-OptiQ-4bit', loaded: false, is_loading: false }
          ]
        });
      }
      if (url.endsWith('/v1/models/Qwen3-8B-4bit/unload')) {
        otherLoaded = false;
        return okJson({ status: 'ok', model_id: 'Qwen3-8B-4bit' });
      }
      return okJson({
        model: 'Hemmingway-1-OptiQ-4bit',
        choices: [{ text: 'Done.', finish_reason: 'stop' }]
      });
    });

    const p = new MlxProvider({
      baseUrl: 'http://x:6000',
      apiKey: 'k',
      fetchFn: fetchFn as unknown as typeof fetch,
      pollIntervalMs: 5
    });

    await p.generate('hi', { model: 'Hemmingway-1-OptiQ-4bit' });
    expect(urls).toContain('POST http://x:6000/v1/models/Qwen3-8B-4bit/unload');
    expect(urls.at(-1)).toBe('POST http://x:6000/v1/completions');
  });

  it('evictModel unloads the model and waits until status reports loaded=false', async () => {
    let statusPolls = 0;
    const fetchFn = vi.fn((url: string) => {
      if (url.endsWith('/unload')) {
        return okJson({ status: 'unloading' }, 202);
      }
      if (url.endsWith('/v1/models/status')) {
        statusPolls++;
        return okJson({
          models: [{ id: 'Hemmingway-1-OptiQ-4bit', loaded: statusPolls < 2, is_loading: false }]
        });
      }
      return okJson({});
    });

    const p = new MlxProvider({
      baseUrl: 'http://x:6000',
      apiKey: 'k',
      fetchFn: fetchFn as unknown as typeof fetch,
      pollIntervalMs: 5
    });

    await p.evictModel('mlx-community/Hemmingway-1-OptiQ-4bit');
    expect(statusPolls).toBeGreaterThanOrEqual(2);
  });

  it('refuses prompts that exceed the 8192-token budget before calling the server', async () => {
    const fetchFn = vi.fn();
    const p = new MlxProvider({ fetchFn: fetchFn as unknown as typeof fetch });
    await expect(p.generate('x'.repeat(30000), { maxTokens: 512 })).rejects.toBeInstanceOf(
      ContextBudgetError
    );
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('reports availability via /v1/models', async () => {
    const fetchFn = vi.fn(() => okJson({ data: [] }));
    expect(
      await new MlxProvider({ apiKey: 'k', fetchFn: fetchFn as unknown as typeof fetch }).isAvailable()
    ).toBe(true);
  });
});

describe('OllamaProvider raw mode', () => {
  it('sends raw: true when requested so pre-templated prompts are not double-wrapped', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => okJson({ response: 'ok', model: 'm' }));
    await new OllamaProvider().generate('<|im_start|>user\nhi<|im_end|>', { raw: true });
    expect(JSON.parse((spy.mock.calls[0]![1] as RequestInit).body as string).raw).toBe(true);
    spy.mockRestore();
  });
});

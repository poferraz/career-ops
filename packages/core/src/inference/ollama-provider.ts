import type { InferenceProvider, InferenceOptions, InferenceResponse } from './types.js';

export interface OllamaProviderOptions {
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
}

export class OllamaProvider implements InferenceProvider {
  public readonly name = 'ollama';
  private baseUrl: string;
  private apiKey?: string;
  private timeoutMs: number;

  constructor(options: OllamaProviderOptions = {}) {
    const rawUrl = options.baseUrl ?? process.env.OLLAMA_HOST ?? 'http://localhost:11434';
    this.baseUrl = rawUrl.replace(/\/+$/, '');
    this.apiKey = options.apiKey ?? process.env.CAREER_OPS_API_KEY;
    this.timeoutMs = options.timeoutMs ?? 60000;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public async generate(prompt: string, options: InferenceOptions = {}): Promise<InferenceResponse> {
    const model = options.model ?? 'richardyoung/hemmingway-1:Q4_K_M';
    const startTime = Date.now();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const payload: Record<string, unknown> = {
      model,
      prompt,
      stream: false
    };

    if (options.systemPrompt) {
      payload.system = options.systemPrompt;
    }

    if (options.keepAlive !== undefined) {
      payload.keep_alive = options.keepAlive;
    }

    if (options.format) {
      payload.format = options.format;
    }

    const runtimeOptions: Record<string, unknown> = {
      num_ctx: options.numCtx ?? 8192
    };
    if (options.temperature !== undefined) runtimeOptions.temperature = options.temperature;
    if (options.maxTokens !== undefined) runtimeOptions.num_predict = options.maxTokens;
    if (options.stop !== undefined) runtimeOptions.stop = options.stop;

    payload.options = runtimeOptions;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeoutMs)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Ollama request failed with HTTP ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as {
        response: string;
        model: string;
        eval_count?: number;
        total_duration?: number;
      };

      return {
        text: data.response ?? '',
        model: data.model ?? model,
        totalTokens: data.eval_count,
        durationMs: Date.now() - startTime
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Ollama connection error at ${this.baseUrl}: ${message}`);
    }
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const res = await fetch(`${this.baseUrl}/api/version`, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(2000)
      });

      return res.ok;
    } catch {
      return false;
    }
  }

  public async evictModel(model: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, keep_alive: 0 }),
        signal: AbortSignal.timeout(5000)
      });
    } catch {
      // Non-fatal if eviction request times out or server is unreachable
    }
  }
}

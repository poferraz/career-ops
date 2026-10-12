import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { InferenceProvider, InferenceOptions, InferenceResponse } from './types.js';
import { resolveMlxModelId, MLX_MODELS } from './prompt-contracts.js';

export class ContextBudgetError extends Error {}

export interface MlxProviderOptions {
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
  maxContext?: number;
  pollIntervalMs?: number;
}

/** Conservative token estimate (~3 chars/token) so the 8192 budget check errs on refusal. */
const estimateTokens = (s: string): number => Math.ceil(s.length / 3);

function discoverOmlxSettings(): { baseUrl?: string; apiKey?: string } {
  try {
    const raw = readFileSync(join(homedir(), '.omlx', 'settings.json'), 'utf8');
    const parsed = JSON.parse(raw) as {
      server?: { host?: string; port?: number };
      auth?: { api_key?: string };
    };
    const host = parsed.server?.host ?? '127.0.0.1';
    const port = parsed.server?.port ?? 6000;
    return {
      baseUrl: `http://${host}:${port}`,
      apiKey: parsed.auth?.api_key
    };
  } catch {
    return {};
  }
}

export class MlxProvider implements InferenceProvider {
  public readonly name = 'mlx';
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs: number;
  private readonly fetchFn: typeof fetch;
  private readonly maxContext: number;
  private readonly pollIntervalMs: number;

  constructor(opts: MlxProviderOptions = {}) {
    const discovered = opts.baseUrl && opts.apiKey ? {} : discoverOmlxSettings();
    const rawUrl =
      opts.baseUrl ??
      process.env.CAREER_OPS_MLX_URL ??
      discovered.baseUrl ??
      'http://127.0.0.1:6000';
    this.baseUrl = rawUrl.replace(/\/+$/, '');
    this.apiKey =
      opts.apiKey ??
      process.env.CAREER_OPS_API_KEY ??
      process.env.OMLX_API_KEY ??
      discovered.apiKey;
    this.timeoutMs = opts.timeoutMs ?? 300_000;
    this.fetchFn = opts.fetchFn ?? fetch;
    this.maxContext = opts.maxContext ?? 8192;
    this.pollIntervalMs = opts.pollIntervalMs ?? 250;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      h['Authorization'] = `Bearer ${this.apiKey}`;
    }
    return h;
  }

  /**
   * Ensures that no model other than `targetModel` is resident in memory before inference starts.
   * This guarantees strict solo-model execution across pipeline stages on Apple Silicon.
   */
  public async ensureSoleModel(targetModel: string): Promise<void> {
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      let otherModels: string[] = [];
      try {
        const res = await this.fetchFn(`${this.baseUrl}/v1/models/status`, {
          method: 'GET',
          headers: this.headers(),
          signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          models?: Array<{ id: string; loaded?: boolean; is_loading?: boolean }>;
        };
        otherModels = (data.models ?? [])
          .filter(m => (m.loaded || m.is_loading) && m.id !== targetModel)
          .map(m => m.id);
      } catch {
        return;
      }

      if (otherModels.length === 0) {
        return;
      }

      for (const otherId of otherModels) {
        try {
          await this.fetchFn(`${this.baseUrl}/v1/models/${encodeURIComponent(otherId)}/unload`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({}),
            signal: AbortSignal.timeout(5000)
          });
        } catch {
          // Non-fatal; next status poll will re-check
        }
      }

      await new Promise(resolve => setTimeout(resolve, this.pollIntervalMs));
    }
  }

  public async generate(prompt: string, options: InferenceOptions = {}): Promise<InferenceResponse> {
    const maxTokens = options.maxTokens ?? 256;
    if (estimateTokens(prompt) + maxTokens > this.maxContext) {
      throw new ContextBudgetError(
        `Prompt (~${estimateTokens(prompt)} tok) + max_tokens ${maxTokens} exceeds ${this.maxContext}`
      );
    }

    const model = resolveMlxModelId(options.model ?? MLX_MODELS.stage2);
    await this.ensureSoleModel(model);

    const body: Record<string, unknown> = {
      model,
      prompt,
      max_tokens: maxTokens,
      stream: false
    };
    if (options.temperature !== undefined) body.temperature = options.temperature;
    if (options.topP !== undefined) body.top_p = options.topP;
    if (options.topK !== undefined) body.top_k = options.topK;
    if (options.minP !== undefined) body.min_p = options.minP;
    if (options.stop !== undefined) body.stop = options.stop;

    const started = Date.now();
    const res = await this.fetchFn(`${this.baseUrl}/v1/completions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeoutMs)
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`MLX request failed with HTTP ${res.status}: ${errText}`);
    }
    const data = (await res.json()) as {
      model?: string;
      choices?: Array<{ text?: string; finish_reason?: string }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const choice = data.choices?.[0] ?? {};
    return {
      text: choice.text ?? '',
      model: data.model ?? model,
      finishReason: choice.finish_reason,
      promptTokens: data.usage?.prompt_tokens,
      totalTokens: data.usage?.completion_tokens,
      durationMs: Date.now() - started
    };
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await this.fetchFn(`${this.baseUrl}/v1/models`, {
        method: 'GET',
        headers: this.headers(),
        signal: AbortSignal.timeout(2000)
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Explicitly unloads the given model from Metal memory and waits until `/v1/models/status`
   * confirms it is no longer resident.
   */
  public async evictModel(model: string): Promise<void> {
    const targetId = resolveMlxModelId(model);
    try {
      await this.fetchFn(`${this.baseUrl}/v1/models/${encodeURIComponent(targetId)}/unload`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(5000)
      });
    } catch {
      return;
    }

    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      try {
        const res = await this.fetchFn(`${this.baseUrl}/v1/models/status`, {
          method: 'GET',
          headers: this.headers(),
          signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          models?: Array<{ id: string; loaded?: boolean; is_loading?: boolean }>;
        };
        const stillLoaded = (data.models ?? []).some(
          m => m.id === targetId && (m.loaded || m.is_loading)
        );
        if (!stillLoaded) return;
      } catch {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, this.pollIntervalMs));
    }
  }
}

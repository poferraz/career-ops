import type { InferenceProvider, InferenceOptions, InferenceResponse } from './types.js';

export interface MockProviderOptions {
  defaultResponse?: string;
  simulatedDelayMs?: number;
}

export class MockInferenceProvider implements InferenceProvider {
  public readonly name = 'mock';
  public history: Array<{ prompt: string; options?: InferenceOptions; timestamp: number }> = [];

  private patterns: Array<{
    pattern: RegExp | string;
    handler: string | ((prompt: string, options?: InferenceOptions) => string);
  }> = [];

  private defaultResponse: string;
  private delayMs: number;

  constructor(options: MockProviderOptions = {}) {
    this.defaultResponse = options.defaultResponse ?? 'Mocked inference completion.';
    this.delayMs = options.simulatedDelayMs ?? 0;
  }

  public addMock(
    pattern: RegExp | string,
    handler: string | ((prompt: string, options?: InferenceOptions) => string)
  ): this {
    this.patterns.push({ pattern, handler });
    return this;
  }

  public async generate(prompt: string, options: InferenceOptions = {}): Promise<InferenceResponse> {
    this.history.push({ prompt, options, timestamp: Date.now() });

    if (this.delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delayMs));
    }

    let responseText = this.defaultResponse;

    for (const item of this.patterns) {
      const matches = typeof item.pattern === 'string'
        ? prompt.includes(item.pattern)
        : item.pattern.test(prompt);

      if (matches) {
        responseText = typeof item.handler === 'function'
          ? item.handler(prompt, options)
          : item.handler;
        break;
      }
    }

    return {
      text: responseText,
      model: options.model ?? 'mock-model',
      totalTokens: responseText.split(/\s+/).length,
      durationMs: this.delayMs
    };
  }

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async evictModel(_model: string): Promise<void> {
    // No-op for mock provider
  }

  public clearHistory(): void {
    this.history = [];
  }
}

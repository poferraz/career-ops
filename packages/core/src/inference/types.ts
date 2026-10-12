export interface InferenceOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
  systemPrompt?: string;
  keepAlive?: number | string;
  format?: 'json' | string;
  numCtx?: number;
}

export interface InferenceResponse {
  text: string;
  model: string;
  totalTokens?: number;
  durationMs?: number;
}

export interface InferenceProvider {
  name: string;
  generate(prompt: string, options?: InferenceOptions): Promise<InferenceResponse>;
  isAvailable(): Promise<boolean>;
  evictModel?(model: string): Promise<void>;
}

export interface InferenceOptions {
  model?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  minP?: number;
  maxTokens?: number;
  stop?: string[];
  systemPrompt?: string;
  keepAlive?: number | string;
  format?: 'json' | string;
  numCtx?: number;
  /** Prompt is already fully templated; providers must not apply a chat template. */
  raw?: boolean;
}

export interface InferenceResponse {
  text: string;
  model: string;
  totalTokens?: number;
  promptTokens?: number;
  finishReason?: string;
  durationMs?: number;
}

export interface InferenceProvider {
  name: string;
  generate(prompt: string, options?: InferenceOptions): Promise<InferenceResponse>;
  isAvailable(): Promise<boolean>;
  evictModel?(model: string): Promise<void>;
}

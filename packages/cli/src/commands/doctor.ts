import pc from 'picocolors';

export interface DoctorOptions {
  remoteUrl?: string;
  fetchFn?: typeof fetch;
  nodeVersion?: string;
}

export interface DoctorReport {
  nodeVersion: string;
  nodePassing: boolean;
  ollamaEndpoint: string;
  ollamaConnected: boolean;
  availableModels: string[];
  hemingwayPresent: boolean;
  humanizerPresent: boolean;
  vramAdvice: string;
  isReadyForInference: boolean;
  summary: string;
}

export const PINNED_HEMINGWAY = 'richardyoung/hemmingway-1:Q4_K_M';
export const PINNED_HUMANIZER = 'jialinyyzz/humanizer:Q4_K_M';

export async function runDoctorCommand(options: DoctorOptions = {}): Promise<DoctorReport> {
  const currentVersion = options.nodeVersion ?? process.version;
  const majorVersion = parseInt(currentVersion.replace(/^v/, '').split('.')[0], 10);
  const nodePassing = majorVersion >= 20;

  const endpoint = options.remoteUrl ?? 'http://localhost:11434';
  const fetchImpl = options.fetchFn ?? fetch;

  let ollamaConnected = false;
  let availableModels: string[] = [];
  let hemingwayPresent = false;
  let humanizerPresent = false;

  try {
    const res = await fetchImpl(`${endpoint.replace(/\/$/, '')}/api/tags`);
    if (res.ok) {
      ollamaConnected = true;
      const data = await res.json() as { models?: Array<{ name: string }> };
      if (Array.isArray(data.models)) {
        availableModels = data.models.map(m => m.name);
        hemingwayPresent = availableModels.some(m => m.toLowerCase().includes('hemmingway') || m.toLowerCase().includes('hemingway-1'));
        humanizerPresent = availableModels.some(m => m.toLowerCase().includes('humanizer'));
      }
    }
  } catch {
    ollamaConnected = false;
  }

  const vramAdvice = 'Hardware floor: 24GB VRAM GPU or 32GB Unified Memory Mac. On 16GB laptops, execute with --remote <url> to offload inference.';

  let isReadyForInference = false;
  let summary = '';

  if (nodePassing && ollamaConnected && hemingwayPresent && humanizerPresent) {
    isReadyForInference = true;
    summary = 'All systems operational. Local environment and models ready for four-stage pipeline inference.';
  } else if (!ollamaConnected) {
    isReadyForInference = false;
    summary = `Ollama endpoint (${endpoint}) is unreachable. Start local Ollama, pass --remote <url>, or use --mock for zero-config offline execution.`;
  } else {
    isReadyForInference = false;
    const missing: string[] = [];
    if (!hemingwayPresent) missing.push(`ollama pull ${PINNED_HEMINGWAY}`);
    if (!humanizerPresent) missing.push(`ollama pull ${PINNED_HUMANIZER}`);
    summary = `Ollama connected, but missing pinned models. Run:\n${missing.join('\n')}\nAlternatively, execute with --remote <url> or --mock.`;
  }

  return {
    nodeVersion: currentVersion,
    nodePassing,
    ollamaEndpoint: endpoint,
    ollamaConnected,
    availableModels,
    hemingwayPresent,
    humanizerPresent,
    vramAdvice,
    isReadyForInference,
    summary
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  const lines: string[] = [];
  const divider = '─'.repeat(60);

  lines.push('');
  lines.push(pc.bold('CAREER-OPS ENVIRONMENT DIAGNOSTICS (DOCTOR)'));
  lines.push(pc.dim(divider));

  const nodeStatus = report.nodePassing ? pc.green(`PASS (${report.nodeVersion})`) : pc.red(`FAIL (Node >= 20 required, got ${report.nodeVersion})`);
  lines.push(`${pc.bold('Node.js Runtime:')} ${nodeStatus}`);

  const ollamaStatus = report.ollamaConnected ? pc.green(`CONNECTED (${report.ollamaEndpoint})`) : pc.red(`OFFLINE (${report.ollamaEndpoint})`);
  lines.push(`${pc.bold('Ollama Connectivity:')} ${ollamaStatus}`);

  const hemingwayStatus = report.hemingwayPresent ? pc.green(`INSTALLED (${PINNED_HEMINGWAY})`) : pc.yellow(`NOT FOUND (${PINNED_HEMINGWAY})`);
  lines.push(`${pc.bold('Hemmingway-1 Engine:')} ${hemingwayStatus}`);

  const humanizerStatus = report.humanizerPresent ? pc.green(`INSTALLED (${PINNED_HUMANIZER})`) : pc.yellow(`NOT FOUND (${PINNED_HUMANIZER})`);
  lines.push(`${pc.bold('Humanizer Cadence Engine:')} ${humanizerStatus}`);

  lines.push(pc.dim(divider));
  lines.push(`${pc.bold('VRAM & Hardware Floor:')} ${pc.dim(report.vramAdvice)}`);
  lines.push(pc.dim(divider));
  lines.push(`${pc.bold('Status Summary:')} ${report.isReadyForInference ? pc.green(report.summary) : pc.yellow(report.summary)}`);
  lines.push(pc.dim(divider));

  return lines.join('\n');
}

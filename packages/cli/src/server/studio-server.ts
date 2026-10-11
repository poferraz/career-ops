import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AntiSlopScorer, scanAtsLayout } from '@career-ops/audit';
import {
  parseResumeMarkdown,
  FourStagePipeline,
  MotivationalInterviewer,
  MockInferenceProvider,
  OllamaProvider,
  type InferenceProvider
} from '@career-ops/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface StudioServerOptions {
  port?: number;
  host?: string;
}

export interface StudioServerInstance {
  server: http.Server;
  port: number;
  stop: () => Promise<void>;
}

function loadStudioHtml(): string {
  const candidates = [
    path.resolve(process.cwd(), 'docs/assets/studio-prototype.html'),
    path.resolve(__dirname, '../../../../docs/assets/studio-prototype.html'),
    path.resolve(__dirname, '../../../docs/assets/studio-prototype.html')
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><title>Career-Ops Studio — Three-Act Pipeline</title></head>
<body><h1>Career-Ops Studio — Three-Act Pipeline</h1></body>
</html>`;
}

function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: http.ServerResponse, statusCode: number, payload: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

export async function startStudioServer(
  options: StudioServerOptions = {}
): Promise<StudioServerInstance> {
  const host = options.host ?? '127.0.0.1';
  const initialPort = options.port ?? 3000;
  const htmlContent = loadStudioHtml();

  const server = http.createServer(async (req, res) => {
    // Enable CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    const url = new URL(req.url ?? '/', `http://${host}`);

    // GET /: Web Studio UI
    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(htmlContent);
      return;
    }

    // GET /api/health
    if (req.method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, { status: 'ok', version: '0.1.0' });
      return;
    }

    // POST /api/audit
    if (req.method === 'POST' && url.pathname === '/api/audit') {
      try {
        const body = await parseJsonBody(req);
        const markdown = body.markdown ?? '';
        const ast = parseResumeMarkdown(markdown);

        const bullets: string[] = [];
        const sentences: string[] = [];

        for (const role of ast.experience) {
          for (const bullet of role.bullets) {
            bullets.push(bullet.originalText);
            const split = bullet.originalText
              .split(/(?<=[.!?])\s+/)
              .map(s => s.trim())
              .filter(Boolean);
            sentences.push(...split);
          }
        }

        const report = AntiSlopScorer.evaluate({
          bullets,
          sentences,
          customTools: body.customTools
        });

        const atsScan = scanAtsLayout(markdown);

        sendJson(res, 200, { report, atsScan });
      } catch (err: any) {
        sendJson(res, 400, { error: err.message ?? 'Invalid audit request' });
      }
      return;
    }

    // POST /api/optimize
    if (req.method === 'POST' && url.pathname === '/api/optimize') {
      try {
        const body = await parseJsonBody(req);
        const markdown = body.markdown ?? '';

        let provider: InferenceProvider;
        if (body.mock) {
          const mock = new MockInferenceProvider({
            defaultResponse: 'Architected distributed event streaming architecture, boosting throughput to 250k events/sec.'
          });
          mock.addMock(/Monolith/i, 'Migrated legacy monolith to Kubernetes, cutting AWS bills by 45%.');
          mock.addMock(/reconciliation/i, 'Engineered distributed payment reconciliation engine in Go and PostgreSQL, reconciling $42M daily transactions.');
          provider = mock;
        } else {
          provider = new OllamaProvider({
            baseUrl: body.remote ?? 'http://localhost:11434'
          });
        }

        const pipeline = new FourStagePipeline(provider);
        const result = await pipeline.optimize(markdown, {
          customTools: body.customTools
        });

        sendJson(res, 200, result);
      } catch (err: any) {
        sendJson(res, 500, { error: err.message ?? 'Optimization error' });
      }
      return;
    }

    // POST /api/mine
    if (req.method === 'POST' && url.pathname === '/api/mine') {
      try {
        const body = await parseJsonBody(req);
        const markdown = body.markdown ?? '';
        const ast = parseResumeMarkdown(markdown);
        const interviewer = new MotivationalInterviewer();
        const opportunities = interviewer.findProbeOpportunities(ast);

        sendJson(res, 200, { opportunities });
      } catch (err: any) {
        sendJson(res, 400, { error: err.message ?? 'Mining error' });
      }
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  return new Promise((resolve, reject) => {
    server.listen(initialPort, host, () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : initialPort;
      resolve({
        server,
        port: actualPort,
        stop: () => new Promise(resStop => server.close(() => resStop()))
      });
    });
    server.on('error', reject);
  });
}

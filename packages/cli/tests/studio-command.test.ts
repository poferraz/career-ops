import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { startStudioServer, type StudioServerInstance } from '../src/server/studio-server.js';
import { DEMO_CANDIDATE_RESUME } from '@career-ops/core';

describe('Web Studio Server & API Integration', () => {
  let studio: StudioServerInstance;
  let baseUrl: string;

  beforeAll(async () => {
    studio = await startStudioServer({ port: 0 }); // port 0 assigns an ephemeral free port
    baseUrl = `http://127.0.0.1:${studio.port}`;
  });

  afterAll(async () => {
    if (studio) {
      await studio.stop();
    }
  });

  it('serves the interactive Three-Act Web Studio UI on GET /', async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Career-Ops Studio');
    expect(html).toContain('Three-Act Pipeline');
  });

  it('serves health status on GET /api/health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const data = await res.json() as { status: string; version: string };
    expect(data.status).toBe('ok');
    expect(data.version).toBe('0.1.0');
  });

  it('runs real-time Anti-Slop audit on POST /api/audit', async () => {
    const res = await fetch(`${baseUrl}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown: DEMO_CANDIDATE_RESUME })
    });

    expect(res.status).toBe(200);
    const data = await res.json() as { report: { totalScore: number; gateStatus: string }; atsScan: { valid: boolean } };
    expect(data.report.totalScore).toBeGreaterThanOrEqual(35);
    expect(['certified', 'warning']).toContain(data.report.gateStatus);
    expect(data.atsScan.valid).toBe(true);
  });

  it('executes four-stage optimization on POST /api/optimize with mock provider', async () => {
    const res = await fetch(`${baseUrl}/api/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown: DEMO_CANDIDATE_RESUME, mock: true })
    });

    expect(res.status).toBe(200);
    const data = await res.json() as { markdown: string; auditReport: object; ast: object };
    expect(data.markdown).toContain('Morgan Vance');
    expect(data.auditReport).toBeDefined();
    expect(data.ast).toBeDefined();
  });
});

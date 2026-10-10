import { describe, it, expect } from 'vitest';
import { scanAtsLayout } from '../src/ats/layout-scanner.js';

describe('ATS Layout & Semantic Structure Scanner', () => {
  it('passes compliant single-column resume with standard headings', () => {
    const resume = `
# Jane Doe
San Francisco, CA | jane@example.com

## Experience
### Senior Software Engineer - Acme Corp
01/2022 - Present
- Built high-scale microservices.

## Education
B.S. in Computer Science - UC Berkeley
2016 - 2020

## Skills
Go, TypeScript, Kubernetes, AWS
    `;

    const res = scanAtsLayout(resume);
    expect(res.valid).toBe(true);
    expect(res.columnFormat).toBe('single');
    expect(res.detectedHeadings).toContain('Experience');
    expect(res.detectedHeadings).toContain('Education');
    expect(res.detectedHeadings).toContain('Skills');
    expect(res.issues.length).toBe(0);
  });

  it('flags multi-column tables and non-standard headings', () => {
    const brokenResume = `
# John Doe
| Left Column Skills | Right Column Experience |
| --- | --- |
| Python, SQL | Managed database |

## My Journey
Some narrative without standard headings.
    `;

    const res = scanAtsLayout(brokenResume);
    expect(res.valid).toBe(false);
    expect(res.columnFormat).toBe('multi_detected');
    expect(res.issues.some(i => i.includes('Multi-column layout detected'))).toBe(true);
    expect(res.issues.some(i => i.includes('Missing canonical section heading: "Experience"'))).toBe(true);
  });
});

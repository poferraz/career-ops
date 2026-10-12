import { describe, it, expect } from 'vitest';
import { parseResumeMarkdown, renderResumeMarkdown } from '../src/parser/ast-parser.js';

describe('Resume AST Parser & Renderer', () => {
  const sampleMarkdown = `# Jane Doe
San Francisco, CA | jane@example.com | github.com/janedoe

## Experience
### Senior Distributed Systems Engineer - CloudScale Corp
01/2022 - Present
- Scaled Kubernetes cluster to 65 nodes across 3 regions, cutting AWS compute overhead by $45K monthly.
- Reduced p99 database query response from 450ms to 35ms through Redis caching layers.

### Software Engineer - DataFlow Inc
06/2019 - 12/2021
- Built high-throughput message pipeline in Go, handling 150K events/second with sub-10ms latency.

## Education
### B.S. in Computer Science - UC Berkeley
2015 - 2019

## Skills
Languages: Go, TypeScript, Python, SQL
Infrastructure: Kubernetes, Docker, AWS, Redis, Kafka
`;

  it('parses structured markdown into a strongly-typed ResumeAST', () => {
    const ast = parseResumeMarkdown(sampleMarkdown);

    expect(ast.header.name).toBe('Jane Doe');
    expect(ast.header.contact).toContain('jane@example.com');
    expect(ast.experience.length).toBe(2);

    const firstRole = ast.experience[0]!;
    expect(firstRole.company).toBe('CloudScale Corp');
    expect(firstRole.title).toBe('Senior Distributed Systems Engineer');
    expect(firstRole.dateRange).toBe('01/2022 - Present');
    expect(firstRole.bullets.length).toBe(2);

    const firstBullet = firstRole.bullets[0]!;
    expect(firstBullet.originalText).toContain('Scaled Kubernetes cluster to 65 nodes');
    expect(firstBullet.invariants.semantic).toContain('65 nodes');
    expect(firstBullet.invariants.semantic).toContain('45000 USD');
    expect(firstBullet.invariants.verbatim).toContain('Kubernetes');
    expect(firstBullet.invariants.verbatim).toContain('AWS');

    expect(ast.education.length).toBe(1);
    expect(ast.education[0]?.degree).toContain('B.S. in Computer Science');
    expect(ast.education[0]?.institution).toContain('UC Berkeley');

    expect(ast.skills.length).toBeGreaterThanOrEqual(1);
  });

  it('renders ResumeAST back to canonical single-column Markdown', () => {
    const ast = parseResumeMarkdown(sampleMarkdown);
    const rendered = renderResumeMarkdown(ast);

    expect(rendered).toContain('# Jane Doe');
    expect(rendered).toContain('## Experience');
    expect(rendered).toContain('### Senior Distributed Systems Engineer - CloudScale Corp');
    expect(rendered).toContain('- Scaled Kubernetes cluster to 65 nodes');
    expect(rendered).toContain('## Education');
    expect(rendered).toContain('## Skills');
  });

  it('handles skills subheadings and preserves parenthesized commas', () => {
    const md = `# Skills Test
test@example.com

## Skills
### Languages & Frameworks
TypeScript, Python, Go, React (Hooks, Context)

### Cloud & Infrastructure
AWS, Kubernetes, Observability (Prometheus, Grafana), Terraform
`;
    const ast = parseResumeMarkdown(md);
    expect(ast.skills.length).toBe(2);
    expect(ast.skills[0]?.category).toBe('Languages & Frameworks');
    expect(ast.skills[0]?.skills).toEqual(['TypeScript', 'Python', 'Go', 'React (Hooks, Context)']);

    expect(ast.skills[1]?.category).toBe('Cloud & Infrastructure');
    expect(ast.skills[1]?.skills).toEqual(['AWS', 'Kubernetes', 'Observability (Prometheus, Grafana)', 'Terraform']);
  });

  it('corrects company and title inversion when company appears first', () => {
    const md = `# Inversion Test
dev@example.com

## Experience
### Google | Staff Infrastructure Engineer
2022 - Present
- Architected global routing fabric.

### Acme Corp - Senior Backend Developer
2020 - 2022
- Maintained distributed message queues.
`;
    const ast = parseResumeMarkdown(md);
    expect(ast.experience.length).toBe(2);

    expect(ast.experience[0]?.company).toBe('Google');
    expect(ast.experience[0]?.title).toBe('Staff Infrastructure Engineer');

    expect(ast.experience[1]?.company).toBe('Acme Corp');
    expect(ast.experience[1]?.title).toBe('Senior Backend Developer');
  });
});

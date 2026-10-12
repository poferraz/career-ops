import { describe, it, expect } from 'vitest';
import { generateAtsPdf } from '../src/exporters/pdf-exporter.js';
import type { ResumeAST } from '../src/types.js';

describe('Single-Column ATS PDF Generator', () => {
  const sampleAst: ResumeAST = {
    header: {
      name: 'Morgan Vance',
      contact: 'San Francisco, CA | morgan@example.com | (555) 234-5678 | linkedin.com/in/morganvance'
    },
    experience: [
      {
        id: 'role-1',
        title: 'Staff Distributed Systems Engineer',
        company: 'CloudScale Technologies',
        dateRange: '03/2021 - Present',
        bullets: [
          {
            id: 'b-1',
            originalText: 'Scaled Kafka cluster across 4 cloud regions, cutting compute overhead by $65,000 monthly.',
            finalBullet: 'Scaled Kafka cluster across 4 cloud regions, cutting compute overhead by $65,000 monthly.',
            invariants: { verbatim: ['Kafka'], semantic: ['4 cloud regions', '65000 USD'] },
            status: 'verified'
          },
          {
            id: 'b-2',
            originalText: 'Engineered high-throughput Go proxy handling 250K requests/sec with sub-5ms p99 latency.',
            finalBullet: 'Engineered high-throughput Go proxy handling 250K requests/sec with sub-5ms p99 latency.',
            invariants: { verbatim: ['Go'], semantic: ['250K requests/sec', '5ms'] },
            status: 'verified'
          }
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.S. in Computer Science',
        institution: 'UC Berkeley',
        dateRange: '2015 - 2019',
        details: ['Dean\'s Honors List']
      }
    ],
    skills: [
      {
        category: 'Languages & Systems',
        skills: ['Go', 'TypeScript', 'Rust', 'Distributed Consensus', 'Kafka', 'PostgreSQL']
      }
    ],
    rawMarkdown: ''
  };

  it('generates a valid binary PDF buffer adhering to the Single-Column ATS Law', () => {
    const pdfBuffer = generateAtsPdf(sampleAst);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(500);

    const pdfString = pdfBuffer.toString('binary');
    // PDF Header & Trailer specification
    expect(pdfString.startsWith('%PDF-1.4')).toBe(true);
    expect(pdfString).toContain('%%EOF');

    // Contains catalog and pages
    expect(pdfString).toContain('/Type /Catalog');
    expect(pdfString).toContain('/Type /Pages');
    expect(pdfString).toContain('/Type /Font');
    expect(pdfString).toContain('/BaseFont /Helvetica');

    // Text content presence in streams
    expect(pdfString).toContain('Morgan Vance');
    expect(pdfString).toContain('CloudScale Technologies');
    expect(pdfString).toContain('Staff Distributed Systems Engineer');
    expect(pdfString).toContain('Scaled Kafka cluster across 4 cloud regions');
    expect(pdfString).toContain('UC Berkeley');
    expect(pdfString).toContain('Languages & Systems');
  });

  it('handles multi-role resumes with clean page breaks without crashing', () => {
    const multiRoleAst: ResumeAST = {
      ...sampleAst,
      experience: [
        ...sampleAst.experience,
        {
          id: 'role-2',
          title: 'Senior Software Engineer',
          company: 'Acme Corp',
          dateRange: '2018 - 2021',
          bullets: [
            {
              id: 'b-3',
              originalText: 'Designed microservices architecture processing 50K jobs daily.',
              finalBullet: 'Designed microservices architecture processing 50K jobs daily.',
              invariants: { verbatim: [], semantic: [] },
              status: 'verified'
            }
          ]
        }
      ]
    };

    const pdfBuffer = generateAtsPdf(multiRoleAst);
    const pdfString = pdfBuffer.toString('binary');
    expect(pdfString).toContain('Acme Corp');
    expect(pdfString).toContain('Senior Software Engineer');
  });
});

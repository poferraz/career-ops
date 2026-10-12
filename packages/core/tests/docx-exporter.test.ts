import { describe, it, expect } from 'vitest';
import { inflateRawSync } from 'node:zlib';
import { generateAtsDocx } from '../src/exporters/docx-exporter.js';
import type { ResumeAST } from '../src/types.js';

function extractZipEntry(buf: Buffer, entryName: string): string {
  let offset = 0;
  while (offset < buf.length - 30) {
    const sig = buf.readUInt32LE(offset);
    if (sig !== 0x04034b50) break;
    const method = buf.readUInt16LE(offset + 8);
    const compLen = buf.readUInt32LE(offset + 18);
    const fnLen = buf.readUInt16LE(offset + 26);
    const extraLen = buf.readUInt16LE(offset + 28);
    const name = buf.subarray(offset + 30, offset + 30 + fnLen).toString('utf-8');
    const dataStart = offset + 30 + fnLen + extraLen;
    const compData = buf.subarray(dataStart, dataStart + compLen);

    if (name === entryName) {
      if (method === 8) {
        return inflateRawSync(compData).toString('utf-8');
      }
      return compData.toString('utf-8');
    }
    offset = dataStart + compLen;
  }
  throw new Error(`Entry ${entryName} not found in zip`);
}

describe('Single-Column ATS DOCX Generator', () => {
  const sampleAst: ResumeAST = {
    header: {
      name: 'Morgan Vance',
      contact: 'San Francisco, CA | morgan@example.com | (555) 234-5678'
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
        details: []
      }
    ],
    skills: [
      {
        category: 'Technologies',
        skills: ['Go', 'TypeScript', 'Kubernetes', 'AWS']
      }
    ],
    rawMarkdown: ''
  };

  it('generates a valid binary PKZip (.docx) buffer adhering to the Single-Column ATS Law', () => {
    const docxBuffer = generateAtsDocx(sampleAst);

    expect(docxBuffer).toBeInstanceOf(Buffer);
    expect(docxBuffer.length).toBeGreaterThan(500);

    // PKZip magic number: 0x50 0x4B 0x03 0x04 ("PK\x03\x04")
    expect(docxBuffer[0]).toBe(0x50);
    expect(docxBuffer[1]).toBe(0x4B);
    expect(docxBuffer[2]).toBe(0x03);
    expect(docxBuffer[3]).toBe(0x04);

    const docxString = docxBuffer.toString('binary');

    // Contains Office Open XML required manifest parts
    expect(docxString).toContain('[Content_Types].xml');
    expect(docxString).toContain('word/document.xml');
    expect(docxString).toContain('_rels/.rels');

    // Extract and inspect actual document.xml
    const docXml = extractZipEntry(docxBuffer, 'word/document.xml');

    // Text content presence in document.xml
    expect(docXml).toContain('Morgan Vance');
    expect(docXml).toContain('CloudScale Technologies');
    expect(docXml).toContain('Scaled Kafka cluster across 4 cloud regions');
    expect(docXml).toContain('UC Berkeley');
    expect(docXml).toContain('Technologies');

    // Strict ATS compliance: NO tables (<w:tbl>) and NO multi-column frames
    expect(docXml).not.toContain('<w:tbl>');
    expect(docXml).not.toContain('<w:cols w:num="2"');
  });
});

import { deflateRawSync, crc32 } from 'node:zlib';
import type { ResumeAST } from '../types.js';
import type { ExportOptions } from './types.js';

interface ZipFileEntry {
  name: string;
  content: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildZipArchive(files: ZipFileEntry[]): Buffer {
  const localHeaders: Buffer[] = [];
  const cdHeaders: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const uncompressed = Buffer.from(file.content, 'utf-8');
    const compressed = deflateRawSync(uncompressed);
    const crc = crc32(uncompressed);
    const nameBuf = Buffer.from(file.name, 'utf-8');

    // 1. Local File Header
    const lh = Buffer.alloc(30 + nameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0); // Local header signature
    lh.writeUInt16LE(20, 4);         // Version needed: 2.0
    lh.writeUInt16LE(0, 6);          // General purpose bit flag
    lh.writeUInt16LE(8, 8);          // Compression method: Deflate
    lh.writeUInt16LE(0, 10);         // Last mod time
    lh.writeUInt16LE(0, 12);         // Last mod date
    lh.writeUInt32LE(crc, 14);       // CRC-32
    lh.writeUInt32LE(compressed.length, 18);   // Compressed size
    lh.writeUInt32LE(uncompressed.length, 22); // Uncompressed size
    lh.writeUInt16LE(nameBuf.length, 26);      // Filename length
    lh.writeUInt16LE(0, 28);                   // Extra field length
    nameBuf.copy(lh, 30);

    localHeaders.push(lh, compressed);

    // 2. Central Directory Header
    const cdh = Buffer.alloc(46 + nameBuf.length);
    cdh.writeUInt32LE(0x02014b50, 0); // Central directory signature
    cdh.writeUInt16LE(20, 4);         // Version made by: 2.0
    cdh.writeUInt16LE(20, 6);         // Version needed: 2.0
    cdh.writeUInt16LE(0, 8);          // Flags
    cdh.writeUInt16LE(8, 10);         // Compression method: Deflate
    cdh.writeUInt16LE(0, 12);         // Mod time
    cdh.writeUInt16LE(0, 14);         // Mod date
    cdh.writeUInt32LE(crc, 16);       // CRC-32
    cdh.writeUInt32LE(compressed.length, 20);   // Compressed size
    cdh.writeUInt32LE(uncompressed.length, 24); // Uncompressed size
    cdh.writeUInt16LE(nameBuf.length, 28);      // Filename length
    cdh.writeUInt16LE(0, 30);                   // Extra field length
    cdh.writeUInt16LE(0, 32);                   // File comment length
    cdh.writeUInt16LE(0, 34);                   // Disk number start
    cdh.writeUInt16LE(0, 36);                   // Internal file attributes
    cdh.writeUInt32LE(0, 38);                   // External file attributes
    cdh.writeUInt32LE(offset, 42);              // Relative offset of local header
    nameBuf.copy(cdh, 46);

    cdHeaders.push(cdh);
    offset += lh.length + compressed.length;
  }

  const cdOffset = offset;
  const cdBuf = Buffer.concat(cdHeaders);
  const cdSize = cdBuf.length;

  // 3. End of Central Directory Record
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4);          // Number of this disk
  eocd.writeUInt16LE(0, 6);          // Disk with start of CD
  eocd.writeUInt16LE(files.length, 8);     // Total entries on this disk
  eocd.writeUInt16LE(files.length, 10);    // Total entries
  eocd.writeUInt32LE(cdSize, 12);    // Size of central directory
  eocd.writeUInt32LE(cdOffset, 16);  // Offset of start of CD
  eocd.writeUInt16LE(0, 20);         // Comment length

  return Buffer.concat([...localHeaders, cdBuf, eocd]);
}

export function generateAtsDocx(ast: ResumeAST, options: ExportOptions = {}): Buffer {
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:sz w:val="20"/>
        <w:lang w:val="en-US"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`;

  // Build semantic single-column paragraphs for document.xml
  const pTags: string[] = [];

  // 1. Candidate Name
  if (ast.header.name) {
    pTags.push(`
    <w:p>
      <w:pPr>
        <w:spacing w:before="0" w:after="60"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="36"/>
          <w:color w:val="111111"/>
        </w:rPr>
        <w:t>${escapeXml(ast.header.name)}</w:t>
      </w:r>
    </w:p>`);
  }

  // 2. Contact Information
  if (ast.header.contact) {
    pTags.push(`
    <w:p>
      <w:pPr>
        <w:spacing w:before="0" w:after="160"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="19"/>
          <w:color w:val="444444"/>
        </w:rPr>
        <w:t>${escapeXml(ast.header.contact)}</w:t>
      </w:r>
    </w:p>`);
  }

  // Optional Executive Summary
  if (ast.summary) {
    pTags.push(`
    <w:p>
      <w:pPr>
        <w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="D4D4D8"/></w:pBdr>
        <w:spacing w:before="160" w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="111111"/></w:rPr>
        <w:t>EXECUTIVE SUMMARY</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:spacing w:before="60" w:after="120"/></w:pPr>
      <w:r><w:t>${escapeXml(ast.summary)}</w:t></w:r>
    </w:p>`);
  }

  // 3. Experience Section
  if (ast.experience && ast.experience.length > 0) {
    pTags.push(`
    <w:p>
      <w:pPr>
        <w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="D4D4D8"/></w:pBdr>
        <w:spacing w:before="180" w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="111111"/></w:rPr>
        <w:t>PROFESSIONAL EXPERIENCE</w:t>
      </w:r>
    </w:p>`);

    for (const role of ast.experience) {
      const datePart = role.dateRange
        ? `<w:r><w:rPr><w:i/><w:sz w:val="19"/><w:color w:val="555555"/></w:rPr><w:tab/><w:t>${escapeXml(role.dateRange)}</w:t></w:r>`
        : '';

      pTags.push(`
    <w:p>
      <w:pPr><w:spacing w:before="100" w:after="40"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="21"/></w:rPr>
        <w:t>${escapeXml(role.title)} | ${escapeXml(role.company)}</w:t>
      </w:r>
      ${datePart}
    </w:p>`);

      for (const bullet of role.bullets) {
        const text = bullet.finalBullet ?? bullet.originalText;
        pTags.push(`
    <w:p>
      <w:pPr>
        <w:ind w:left="360" w:hanging="180"/>
        <w:spacing w:before="20" w:after="40"/>
      </w:pPr>
      <w:r><w:t>• </w:t></w:r>
      <w:r><w:t>${escapeXml(text)}</w:t></w:r>
    </w:p>`);
      }
    }
  }

  // 4. Education Section
  if (ast.education && ast.education.length > 0) {
    pTags.push(`
    <w:p>
      <w:pPr>
        <w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="D4D4D8"/></w:pBdr>
        <w:spacing w:before="180" w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="111111"/></w:rPr>
        <w:t>EDUCATION</w:t>
      </w:r>
    </w:p>`);

    for (const edu of ast.education) {
      const datePart = edu.dateRange
        ? `<w:r><w:rPr><w:i/><w:sz w:val="19"/><w:color w:val="555555"/></w:rPr><w:tab/><w:t>${escapeXml(edu.dateRange)}</w:t></w:r>`
        : '';

      pTags.push(`
    <w:p>
      <w:pPr><w:spacing w:before="80" w:after="40"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="20"/></w:rPr>
        <w:t>${escapeXml(edu.degree)} - ${escapeXml(edu.institution)}</w:t>
      </w:r>
      ${datePart}
    </w:p>`);

      if (edu.details && edu.details.length > 0) {
        for (const d of edu.details) {
          pTags.push(`
    <w:p>
      <w:pPr><w:ind w:left="360" w:hanging="180"/><w:spacing w:before="20" w:after="30"/></w:pPr>
      <w:r><w:t>• </w:t></w:r>
      <w:r><w:t>${escapeXml(d)}</w:t></w:r>
    </w:p>`);
        }
      }
    }
  }

  // 5. Skills Section
  if (ast.skills && ast.skills.length > 0) {
    pTags.push(`
    <w:p>
      <w:pPr>
        <w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="D4D4D8"/></w:pBdr>
        <w:spacing w:before="180" w:after="100"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="111111"/></w:rPr>
        <w:t>TECHNICAL SKILLS</w:t>
      </w:r>
    </w:p>`);

    for (const cat of ast.skills) {
      if (cat.skills.length === 0) continue;
      pTags.push(`
    <w:p>
      <w:pPr><w:spacing w:before="40" w:after="40"/></w:pPr>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>${escapeXml(cat.category)}: </w:t>
      </w:r>
      <w:r>
        <w:t>${escapeXml(cat.skills.join(', '))}</w:t>
      </w:r>
    </w:p>`);
    }
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${pTags.join('')}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const files: ZipFileEntry[] = [
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: relsXml },
    { name: 'word/_rels/document.xml.rels', content: docRelsXml },
    { name: 'word/styles.xml', content: stylesXml },
    { name: 'word/document.xml', content: documentXml }
  ];

  return buildZipArchive(files);
}

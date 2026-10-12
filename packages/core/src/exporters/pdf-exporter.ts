import type { ResumeAST } from '../types.js';
import type { ExportOptions } from './types.js';

interface PageStream {
  commands: string[];
}

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/•/g, '-');
}

function wrapText(text: string, maxChars: number = 88): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let currentLine = words[0]!;

  for (let i = 1; i < words.length; i++) {
    const word = words[i]!;
    if ((currentLine + ' ' + word).length <= maxChars) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export function generateAtsPdf(ast: ResumeAST, options: ExportOptions = {}): Buffer {
  const pageWidth = 612; // US Letter width in points (8.5 inches)
  const pageHeight = 792; // US Letter height in points (11 inches)
  const marginX = 54; // 0.75 inch margins
  const contentWidth = pageWidth - (marginX * 2); // 504 pt
  const topY = pageHeight - 54;
  const bottomY = 54;

  const pages: PageStream[] = [];
  let currentPage: PageStream = { commands: [] };
  pages.push(currentPage);

  let currentY = topY;

  function ensureSpace(needed: number) {
    if (currentY - needed < bottomY) {
      currentPage = { commands: [] };
      pages.push(currentPage);
      currentY = topY;
    }
  }

  function addText(
    text: string,
    fontRef: string,
    size: number,
    x: number,
    y: number
  ) {
    const escaped = escapePdfText(text);
    currentPage.commands.push(
      `BT /${fontRef} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escaped}) Tj ET`
    );
  }

  function addHorizontalRule(y: number) {
    currentPage.commands.push(
      `0.5 w ${marginX.toFixed(2)} ${y.toFixed(2)} m ${(marginX + contentWidth).toFixed(2)} ${y.toFixed(2)} l S`
    );
  }

  // --- 1. Candidate Name (Header) ---
  if (ast.header.name) {
    ensureSpace(30);
    addText(ast.header.name, 'F2', 18, marginX, currentY);
    currentY -= 22;
  }

  // --- 2. Contact Information ---
  if (ast.header.contact) {
    ensureSpace(16);
    addText(ast.header.contact, 'F1', 9.5, marginX, currentY);
    currentY -= 16;
  }

  // Optional Summary
  if (ast.summary) {
    ensureSpace(35);
    currentY -= 6;
    addText('EXECUTIVE SUMMARY', 'F2', 11, marginX, currentY);
    currentY -= 4;
    addHorizontalRule(currentY);
    currentY -= 12;

    const summaryLines = wrapText(ast.summary, 90);
    for (const line of summaryLines) {
      ensureSpace(14);
      addText(line, 'F1', 9.5, marginX, currentY);
      currentY -= 13;
    }
  }

  // --- 3. Experience Section ---
  if (ast.experience && ast.experience.length > 0) {
    ensureSpace(35);
    currentY -= 8;
    addText('PROFESSIONAL EXPERIENCE', 'F2', 11, marginX, currentY);
    currentY -= 4;
    addHorizontalRule(currentY);
    currentY -= 14;

    for (const role of ast.experience) {
      ensureSpace(28);
      // Title and Company
      const roleHeading = `${role.title} | ${role.company}`;
      addText(roleHeading, 'F2', 10.5, marginX, currentY);

      if (role.dateRange) {
        // Date range right-aligned or offset
        addText(role.dateRange, 'F3', 9.5, marginX + 340, currentY);
      }
      currentY -= 14;

      for (const bullet of role.bullets) {
        const text = bullet.finalBullet ?? bullet.originalText;
        const bulletLines = wrapText(text, 86);

        for (let i = 0; i < bulletLines.length; i++) {
          ensureSpace(13);
          const line = bulletLines[i]!;
          if (i === 0) {
            addText('-  ' + line, 'F1', 9.5, marginX + 8, currentY);
          } else {
            addText('   ' + line, 'F1', 9.5, marginX + 8, currentY);
          }
          currentY -= 12.5;
        }
      }
      currentY -= 6;
    }
  }

  // --- 4. Education Section ---
  if (ast.education && ast.education.length > 0) {
    ensureSpace(35);
    currentY -= 6;
    addText('EDUCATION', 'F2', 11, marginX, currentY);
    currentY -= 4;
    addHorizontalRule(currentY);
    currentY -= 14;

    for (const edu of ast.education) {
      ensureSpace(20);
      const eduTitle = `${edu.degree} - ${edu.institution}`;
      addText(eduTitle, 'F2', 10, marginX, currentY);
      if (edu.dateRange) {
        addText(edu.dateRange, 'F3', 9.5, marginX + 360, currentY);
      }
      currentY -= 13;

      if (edu.details && edu.details.length > 0) {
        for (const detail of edu.details) {
          ensureSpace(13);
          addText('- ' + detail, 'F1', 9.5, marginX + 8, currentY);
          currentY -= 12;
        }
      }
      currentY -= 4;
    }
  }

  // --- 5. Skills Section ---
  if (ast.skills && ast.skills.length > 0) {
    ensureSpace(35);
    currentY -= 6;
    addText('TECHNICAL SKILLS', 'F2', 11, marginX, currentY);
    currentY -= 4;
    addHorizontalRule(currentY);
    currentY -= 14;

    for (const cat of ast.skills) {
      if (cat.skills.length === 0) continue;
      const skillText = `${cat.category}: ${cat.skills.join(', ')}`;
      const skillLines = wrapText(skillText, 90);

      for (const line of skillLines) {
        ensureSpace(13);
        addText(line, 'F1', 9.5, marginX, currentY);
        currentY -= 13;
      }
    }
  }

  // --- Assemble Complete PDF Objects ---
  // Object IDs:
  // 1: Catalog
  // 2: Pages
  // 3: Font F1 (Helvetica)
  // 4: Font F2 (Helvetica-Bold)
  // 5: Font F3 (Helvetica-Oblique)
  // Subsequent IDs: Page objects (6, 8, ...), Content objects (7, 9, ...)

  const objects: string[] = [];
  const pageCount = pages.length;
  const pageObjIds: number[] = [];
  let nextObjId = 6;

  for (let i = 0; i < pageCount; i++) {
    pageObjIds.push(nextObjId);
    nextObjId += 2; // page object and content stream object
  }

  // Obj 1: Catalog
  objects[1] = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`;

  // Obj 2: Pages collection
  const kidsStr = pageObjIds.map(id => `${id} 0 R`).join(' ');
  objects[2] = `2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${pageCount} >>\nendobj`;

  // Obj 3: Regular Font (F1)
  objects[3] = `3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj`;

  // Obj 4: Bold Font (F2)
  objects[4] = `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj`;

  // Obj 5: Oblique Font (F3)
  objects[5] = `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>\nendobj`;

  // Build each page and its content stream
  for (let i = 0; i < pageCount; i++) {
    const pageId = pageObjIds[i]!;
    const contentId = pageId + 1;
    const pageStream = pages[i]!;
    const streamContent = pageStream.commands.join('\n');
    const streamBuffer = Buffer.from(streamContent, 'utf-8');

    // Page object
    objects[pageId] = `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentId} 0 R >>\nendobj`;

    // Content object
    objects[contentId] = `${contentId} 0 obj\n<< /Length ${streamBuffer.length} >>\nstream\n${streamContent}\nendstream\nendobj`;
  }

  // Assemble with xref table
  let pdfHeader = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  let body = '';
  const offsets: number[] = [0];

  let currentOffset = Buffer.byteLength(pdfHeader, 'latin1');

  const maxId = nextObjId - 1;
  for (let id = 1; id <= maxId; id++) {
    offsets[id] = currentOffset;
    const objStr = objects[id] + '\n';
    body += objStr;
    currentOffset += Buffer.byteLength(objStr, 'latin1');
  }

  const xrefOffset = currentOffset;
  let xref = `xref\n0 ${maxId + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= maxId; id++) {
    const offset = offsets[id] ?? 0;
    xref += offset.toString().padStart(10, '0') + ' 00000 n \n';
  }

  const trailer = `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const fullPdf = pdfHeader + body + xref + trailer;
  return Buffer.from(fullPdf, 'latin1');
}

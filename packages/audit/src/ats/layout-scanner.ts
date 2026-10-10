import type { AtsScanResult } from '../types.js';

const CANONICAL_HEADINGS = ['Experience', 'Education', 'Skills'];

/**
 * Scans resume text or markdown for single-column structure and ATS-compliant headings.
 * Detects table interleaving risks and missing canonical headings.
 */
export function scanAtsLayout(markdownOrPlainText: string): AtsScanResult {
  const issues: string[] = [];
  const detectedHeadings: string[] = [];

  // Check 1: Multi-column tables (markdown pipe table syntax or HTML tables)
  const hasMarkdownTable = /\|[\s\S]*?\|[\s\S]*?\|[\s\S]*?[\r\n]+\|[-:\s|]+\|/i.test(markdownOrPlainText);
  const hasHtmlTable = /<table|<td|<th/i.test(markdownOrPlainText);
  const columnFormat = (hasMarkdownTable || hasHtmlTable) ? 'multi_detected' : 'single';

  if (columnFormat === 'multi_detected') {
    issues.push('Multi-column layout detected: Tables cause Workday/Taleo ATS parsers to interleave horizontal text.');
  }

  // Check 2: Canonical Section Headings
  for (const heading of CANONICAL_HEADINGS) {
    const headingRegex = new RegExp(`(?:^|\\n)#{1,3}\\s*${heading}|(?:^|\\n)${heading}\\s*(?:\\n|:)`, 'i');
    if (headingRegex.test(markdownOrPlainText)) {
      detectedHeadings.push(heading);
    } else {
      issues.push(`Missing canonical section heading: "${heading}". ATS mappers rely on exact standard headings.`);
    }
  }

  // Check 3: Machine extractability check (minimum text length)
  if (markdownOrPlainText.trim().length < 50) {
    issues.push('Document contains insufficient extracted text; possible scanned PDF or empty file.');
  }

  return {
    valid: issues.length === 0,
    issues,
    detectedHeadings,
    columnFormat
  };
}

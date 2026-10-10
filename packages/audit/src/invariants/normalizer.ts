import type { InvariantEntity } from '../types.js';

export function canonicalizeCurrency(raw: string): string {
  const clean = raw.trim().replace(/,/g, '');

  // $1.4M or 1.4 million dollars / $1.4 million
  const millionMatch = /\$?\s*([\d.]+)\s*(?:M|million)(?:\s*dollars)?/i.exec(clean);
  if (millionMatch && millionMatch[1]) {
    const val = parseFloat(millionMatch[1]) * 1000000;
    return `${Math.round(val)} USD`;
  }

  // $250K or 250 thousand dollars
  const thousandMatch = /\$?\s*([\d.]+)\s*(?:K|thousand)(?:\s*dollars)?/i.exec(clean);
  if (thousandMatch && thousandMatch[1]) {
    const val = parseFloat(thousandMatch[1]) * 1000;
    return `${Math.round(val)} USD`;
  }

  // $2.5B or 2.5 billion dollars
  const billionMatch = /\$?\s*([\d.]+)\s*(?:B|billion)(?:\s*dollars)?/i.exec(clean);
  if (billionMatch && billionMatch[1]) {
    const val = parseFloat(billionMatch[1]) * 1000000000;
    return `${Math.round(val)} USD`;
  }

  // Pure dollar amount: $1400000
  const plainDollar = /\$\s*([\d.]+)/.exec(clean);
  if (plainDollar && plainDollar[1]) {
    return `${Math.round(parseFloat(plainDollar[1]))} USD`;
  }

  return clean;
}

export function canonicalizePercentage(raw: string): string {
  const clean = raw.trim().replace(/,/g, '');
  const match = /([\d.]+)\s*(?:%|percent|percentage points)/i.exec(clean);
  if (match && match[1]) {
    return `${match[1]}%`;
  }
  return clean;
}

export function canonicalizeDate(raw: string): string {
  const clean = raw.trim();

  // Q1-Q4 YYYY or first/second/third/fourth quarter of YYYY
  const quarterMatch = /(?:Q([1-4])\s*(\d{4})|(first|second|third|fourth)\s+quarter\s+of\s+(\d{4}))/i.exec(clean);
  if (quarterMatch) {
    if (quarterMatch[1] && quarterMatch[2]) {
      return `${quarterMatch[2]}-Q${quarterMatch[1]}`;
    }
    if (quarterMatch[3] && quarterMatch[4]) {
      const qMap: Record<string, string> = { first: '1', second: '2', third: '3', fourth: '4' };
      const word = quarterMatch[3].toLowerCase();
      return `${quarterMatch[4]}-Q${qMap[word] ?? '1'}`;
    }
  }

  // MM/YYYY
  const mmYyyy = /^(\d{1,2})\/(\d{4})$/.exec(clean);
  if (mmYyyy && mmYyyy[1] && mmYyyy[2]) {
    const mm = mmYyyy[1].padStart(2, '0');
    return `${mmYyyy[2]}-${mm}`;
  }

  // Month YYYY (e.g. July 2024)
  const monthMap: Record<string, string> = {
    january: '01', jan: '01',
    february: '02', feb: '02',
    march: '03', mar: '03',
    april: '04', apr: '04',
    may: '05',
    june: '06', jun: '06',
    july: '07', jul: '07',
    august: '08', aug: '08',
    september: '09', sep: '09', sept: '09',
    october: '10', oct: '10',
    november: '11', nov: '11',
    december: '12', dec: '12'
  };
  const monthNameMatch = /^([a-z]+)\s+(\d{4})$/i.exec(clean);
  if (monthNameMatch && monthNameMatch[1] && monthNameMatch[2]) {
    const m = monthMap[monthNameMatch[1].toLowerCase()];
    if (m) {
      return `${monthNameMatch[2]}-${m}`;
    }
  }

  return clean;
}

export function canonicalizeNumber(raw: string): string {
  const clean = raw.trim().replace(/,/g, '');
  const bMatch = /^([\d.]+)\s*B$/i.exec(clean);
  if (bMatch && bMatch[1]) return String(Math.round(parseFloat(bMatch[1]) * 1e9));
  const mMatch = /^([\d.]+)\s*M$/i.exec(clean);
  if (mMatch && mMatch[1]) return String(Math.round(parseFloat(mMatch[1]) * 1e6));
  const kMatch = /^([\d.]+)\s*K$/i.exec(clean);
  if (kMatch && kMatch[1]) return String(Math.round(parseFloat(kMatch[1]) * 1e3));
  return clean;
}

const COMMON_TECH_TOOLS = [
  'Kubernetes', 'Docker', 'AWS', 'GCP', 'Azure', 'Kafka', 'PostgreSQL',
  'MySQL', 'Redis', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++',
  'GraphQL', 'React', 'Next.js', 'PyTorch', 'TensorFlow', 'Snowflake',
  'Databricks', 'Spark', 'Terraform', 'Ollama', 'Elasticsearch'
];

export function extractInvariants(text: string): InvariantEntity[] {
  const entities: InvariantEntity[] = [];
  let idCounter = 1;

  // Currencies: $1.4M, $250,000, 1.4 million dollars
  const currencyRegex = /\$\s*[\d,.]+(?:\s*[kKmMbB]|\s*million|\s*billion|\s*thousand)?(?:\s*dollars)?|\b[\d.]+\s*(?:million|billion|thousand)\s*dollars/gi;
  let match: RegExpExecArray | null;
  while ((match = currencyRegex.exec(text)) !== null) {
    const raw = match[0].trim();
    entities.push({
      id: `inv-curr-${idCounter++}`,
      rawText: raw,
      classification: 'semantic',
      normalizedValue: canonicalizeCurrency(raw),
      category: 'currency'
    });
  }

  // Percentages: 40%, 40.5 percent
  const percentRegex = /(?:\b[\d.]+\s*(?:%|percent\b|percentage points\b))/gi;
  while ((match = percentRegex.exec(text)) !== null) {
    const raw = match[0].trim();
    entities.push({
      id: `inv-pct-${idCounter++}`,
      rawText: raw,
      classification: 'semantic',
      normalizedValue: canonicalizePercentage(raw),
      category: 'percentage'
    });
  }

  // Dates: Q3 2024, July 2024, 07/2024
  const dateRegex = /\b(?:Q[1-4]\s*\d{4}|(?:first|second|third|fourth)\s+quarter\s+of\s+\d{4}|\d{1,2}\/\d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/gi;
  while ((match = dateRegex.exec(text)) !== null) {
    const raw = match[0].trim();
    entities.push({
      id: `inv-date-${idCounter++}`,
      rawText: raw,
      classification: 'semantic',
      normalizedValue: canonicalizeDate(raw),
      category: 'date'
    });
  }

  // Verbatim technical tools
  for (const tool of COMMON_TECH_TOOLS) {
    const escaped = tool.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const toolRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (toolRegex.test(text)) {
      entities.push({
        id: `inv-tool-${idCounter++}`,
        rawText: tool,
        classification: 'verbatim',
        normalizedValue: tool.toLowerCase(),
        category: 'tool'
      });
    }
  }

  return entities;
}

export function checkInvariantPreservation(
  originalText: string,
  candidateText: string,
  knownEntities?: InvariantEntity[]
): {
  preserved: boolean;
  missing: InvariantEntity[];
  altered: Array<{ original: InvariantEntity; found?: string }>;
} {
  const targets = knownEntities ?? extractInvariants(originalText);
  const candidateEntities = extractInvariants(candidateText);

  const missing: InvariantEntity[] = [];
  const altered: Array<{ original: InvariantEntity; found?: string }> = [];

  for (const target of targets) {
    let matched = false;
    for (const cand of candidateEntities) {
      if (target.classification === 'verbatim') {
        if (target.normalizedValue.toLowerCase() === cand.normalizedValue.toLowerCase()) {
          matched = true;
          break;
        }
      } else {
        // Semantic invariant comparison
        if (target.category === cand.category && target.normalizedValue === cand.normalizedValue) {
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      // Also check fallback raw text regex containment
      const escaped = target.rawText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(escaped, 'i').test(candidateText)) {
        matched = true;
      }
    }

    if (!matched) {
      missing.push(target);
    }
  }

  return {
    preserved: missing.length === 0,
    missing,
    altered
  };
}

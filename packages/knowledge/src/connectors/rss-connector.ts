import type { RawIngestionDocument } from '../types.js';

export function parseRssFeedXml(xmlContent: string, fallbackSourceUrl: string): RawIngestionDocument[] {
  const documents: RawIngestionDocument[] = [];

  // Lightweight deterministic regex XML extraction (no native heavy dependencies)
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xmlContent)) !== null) {
    const itemBlock = match[1] ?? '';

    const titleMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i.exec(itemBlock);
    const linkMatch = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i.exec(itemBlock);
    const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i.exec(itemBlock);
    const dateMatch = /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i.exec(itemBlock);

    const title = titleMatch ? titleMatch[1]?.trim() : 'Untitled Update';
    const link = linkMatch ? linkMatch[1]?.trim() : fallbackSourceUrl;
    const rawText = descMatch ? descMatch[1]?.trim() : '';
    let publishedAt = new Date().toISOString();

    if (dateMatch && dateMatch[1]) {
      const parsedDate = new Date(dateMatch[1]);
      if (!isNaN(parsedDate.getTime())) {
        publishedAt = parsedDate.toISOString();
      }
    }

    if (title && rawText) {
      let hostname = fallbackSourceUrl;
      try {
        hostname = new URL(fallbackSourceUrl).hostname;
      } catch {
        // fallback
      }

      documents.push({
        sourceUrl: link || fallbackSourceUrl,
        sourceTitle: title,
        authorOrOrg: hostname,
        publishedAt,
        rawText
      });
    }
  }

  return documents;
}

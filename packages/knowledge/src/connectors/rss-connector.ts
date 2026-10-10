import type { RawIngestionDocument } from '../types.js';

export function parseRssFeedXml(xmlContent: string, fallbackSourceUrl: string): RawIngestionDocument[] {
  const documents: RawIngestionDocument[] = [];

  // Match both RSS <item> and Atom <entry> blocks
  const entryRegex = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/gi;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(xmlContent)) !== null) {
    const itemBlock = match[1] ?? '';

    // Title
    const titleMatch = /<title(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i.exec(itemBlock);

    // Link: either <link>url</link> or <link href="url" ... />
    let link = '';
    const linkHrefMatch = /<link[^>]+href=["']([^"']+)["']/i.exec(itemBlock);
    if (linkHrefMatch && linkHrefMatch[1]) {
      link = linkHrefMatch[1].trim();
    } else {
      const linkTagMatch = /<link(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i.exec(itemBlock);
      if (linkTagMatch && linkTagMatch[1]) {
        link = linkTagMatch[1].trim();
      }
    }

    // Description / Summary / Content
    const descMatch = /<(?:description|summary|content)(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:description|summary|content)>/i.exec(itemBlock);

    // Date: pubDate or updated or published
    const dateMatch = /<(?:pubDate|updated|published)(?:[^>]*)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:pubDate|updated|published)>/i.exec(itemBlock);

    const title = titleMatch ? titleMatch[1]?.trim() : 'Untitled Update';
    const finalLink = link || fallbackSourceUrl;
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
        sourceUrl: finalLink,
        sourceTitle: title,
        authorOrOrg: hostname,
        publishedAt,
        rawText
      });
    }
  }

  return documents;
}

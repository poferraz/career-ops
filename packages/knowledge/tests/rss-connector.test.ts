import { describe, it, expect } from 'vitest';
import { parseRssFeedXml } from '../src/connectors/rss-connector.js';

describe('RSS Feed Connector', () => {
  it('parses XML feed into RawIngestionDocument objects', () => {
    const sampleXml = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>BLS Economic News</title>
          <link>https://www.bls.gov</link>
          <item>
            <title>Employment Situation Summary</title>
            <link>https://www.bls.gov/news.release/empsit.nr0.htm</link>
            <pubDate>Fri, 07 Mar 2025 08:30:00 EST</pubDate>
            <description>Total nonfarm payroll employment increased by 150,000.</description>
          </item>
        </channel>
      </rss>`;

    const docs = parseRssFeedXml(sampleXml, 'https://www.bls.gov/feed');
    expect(docs.length).toBe(1);
    expect(docs[0]?.sourceTitle).toBe('Employment Situation Summary');
    expect(docs[0]?.sourceUrl).toBe('https://www.bls.gov/news.release/empsit.nr0.htm');
    expect(docs[0]?.rawText).toContain('150,000');
  });
});

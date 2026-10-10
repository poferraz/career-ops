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

  it('parses Atom XML feed format (ArXiv style) into RawIngestionDocument objects', () => {
    const atomXml = `<?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>ArXiv CS.CL Recent Papers</title>
        <entry>
          <title>Evaluating Resume Screening with Semantic Encoders</title>
          <link href="http://arxiv.org/abs/2501.99999v1" rel="alternate" type="text/html"/>
          <updated>2025-01-20T12:00:00Z</updated>
          <summary>We analyze ATS embedding representations against human recruiter evaluations.</summary>
        </entry>
      </feed>`;

    const docs = parseRssFeedXml(atomXml, 'http://export.arxiv.org/rss/cs.cl');
    expect(docs.length).toBe(1);
    expect(docs[0]?.sourceTitle).toBe('Evaluating Resume Screening with Semantic Encoders');
    expect(docs[0]?.sourceUrl).toBe('http://arxiv.org/abs/2501.99999v1');
    expect(docs[0]?.rawText).toContain('ATS embedding representations');
  });
});

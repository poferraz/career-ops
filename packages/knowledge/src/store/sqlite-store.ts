import { DatabaseSync } from 'node:sqlite';
import {
  KnowledgeHeuristicSchema,
  type KnowledgeHeuristic,
  type HeuristicDomain,
  type TrustTier
} from '../types.js';

export interface QueryOptions {
  vendor?: string;
  minTier?: 'T1' | 'T2' | 'T3';
  limit?: number;
}

const TIER_NUM_MAP: Record<TrustTier, number> = {
  T1: 3,
  T2: 2,
  T3: 1,
  T4: 0
};

export class KnowledgeStore {
  private db: DatabaseSync;

  constructor(dbPath: string = ':memory:') {
    this.db = new DatabaseSync(dbPath);
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS heuristics (
        id TEXT PRIMARY KEY,
        domain TEXT NOT NULL,
        trust_tier TEXT NOT NULL,
        tier_level INTEGER NOT NULL,
        source_title TEXT NOT NULL,
        source_url TEXT NOT NULL,
        published_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        rule_key TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        actionable_directive TEXT NOT NULL,
        vendor TEXT,
        relevance_weight REAL NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_heuristics_domain ON heuristics(domain);
      CREATE INDEX IF NOT EXISTS idx_heuristics_expires ON heuristics(expires_at);
      CREATE INDEX IF NOT EXISTS idx_heuristics_tier ON heuristics(tier_level);
    `);
  }

  public insert(heuristic: KnowledgeHeuristic): void {
    const validated = KnowledgeHeuristicSchema.parse(heuristic);
    const tierLevel = TIER_NUM_MAP[validated.trustTier];

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO heuristics (
        id, domain, trust_tier, tier_level, source_title, source_url,
        published_at, expires_at, rule_key, content, actionable_directive,
        vendor, relevance_weight
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      validated.id,
      validated.domain,
      validated.trustTier,
      tierLevel,
      validated.sourceTitle,
      validated.sourceUrl,
      validated.publishedAt,
      validated.expiresAt,
      validated.ruleKey,
      validated.content,
      validated.actionableDirective,
      validated.metadata.vendor ?? null,
      validated.metadata.relevanceWeight
    );
  }

  public query(domain: HeuristicDomain, options: QueryOptions = {}): KnowledgeHeuristic[] {
    const nowIso = new Date().toISOString();
    let queryStr = `
      SELECT * FROM heuristics
      WHERE domain = ? AND expires_at > ?
    `;
    const params: (string | number)[] = [domain, nowIso];

    if (options.minTier) {
      const minLevel = TIER_NUM_MAP[options.minTier];
      queryStr += ` AND tier_level >= ?`;
      params.push(minLevel);
    }

    if (options.vendor) {
      queryStr += ` AND vendor = ?`;
      params.push(options.vendor);
    }

    queryStr += ` ORDER BY tier_level DESC, relevance_weight DESC`;

    if (options.limit) {
      queryStr += ` LIMIT ?`;
      params.push(options.limit);
    }

    const rows = this.db.prepare(queryStr).all(...params) as Array<{
      id: string;
      domain: HeuristicDomain;
      trust_tier: 'T1' | 'T2' | 'T3';
      source_title: string;
      source_url: string;
      published_at: string;
      expires_at: string;
      rule_key: string;
      content: string;
      actionable_directive: string;
      vendor: string | null;
      relevance_weight: number;
    }>;

    return rows.map(r => ({
      id: r.id,
      domain: r.domain,
      trustTier: r.trust_tier,
      sourceTitle: r.source_title,
      sourceUrl: r.source_url,
      publishedAt: r.published_at,
      expiresAt: r.expires_at,
      ruleKey: r.rule_key,
      content: r.content,
      actionableDirective: r.actionable_directive,
      metadata: {
        vendor: (r.vendor as any) ?? undefined,
        relevanceWeight: r.relevance_weight
      }
    }));
  }

  public close(): void {
    this.db.close();
  }
}

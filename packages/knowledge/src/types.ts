import { z } from 'zod';

export const TrustTierSchema = z.enum(['T1', 'T2', 'T3', 'T4']);
export type TrustTier = z.infer<typeof TrustTierSchema>;

export const HeuristicDomainSchema = z.enum([
  'ats-parsing',
  'resume-density',
  'cover-letter',
  'linkedin-seo',
  'market-skills'
]);
export type HeuristicDomain = z.infer<typeof HeuristicDomainSchema>;

export const KnowledgeHeuristicSchema = z.object({
  id: z.string(),
  domain: HeuristicDomainSchema,
  trustTier: z.enum(['T1', 'T2', 'T3']),
  sourceTitle: z.string().min(1),
  sourceUrl: z.string().url(),
  publishedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  ruleKey: z.string().regex(/^[A-Z0-9_]+$/),
  content: z.string().min(10),
  actionableDirective: z.string().min(5),
  metadata: z.object({
    vendor: z.enum(['workday', 'greenhouse', 'ashby', 'lever', 'linkedin', 'generic']).optional(),
    relevanceWeight: z.number().min(0).max(1)
  })
});
export type KnowledgeHeuristic = z.infer<typeof KnowledgeHeuristicSchema>;

export interface RawIngestionDocument {
  sourceUrl: string;
  sourceTitle: string;
  authorOrOrg: string;
  publishedAt: string;
  rawText: string;
}

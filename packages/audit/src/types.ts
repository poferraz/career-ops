import { z } from 'zod';

export const InvariantClassSchema = z.enum(['verbatim', 'semantic']);
export type InvariantClass = z.infer<typeof InvariantClassSchema>;

export const InvariantCategorySchema = z.enum([
  'currency',
  'percentage',
  'number',
  'date',
  'tool',
  'proper_noun'
]);
export type InvariantCategory = z.infer<typeof InvariantCategorySchema>;

export const InvariantEntitySchema = z.object({
  id: z.string(),
  rawText: z.string(),
  classification: InvariantClassSchema,
  normalizedValue: z.string(),
  category: InvariantCategorySchema
});
export type InvariantEntity = z.infer<typeof InvariantEntitySchema>;

export const AuditDimensionSchema = z.enum([
  'directness',
  'rhythm',
  'trust',
  'authenticity',
  'density'
]);
export type AuditDimension = z.infer<typeof AuditDimensionSchema>;

export const AuditDimensionScoreSchema = z.object({
  dimension: AuditDimensionSchema,
  score: z.number().min(0).max(10),
  maxScore: z.literal(10),
  feedback: z.array(z.string()),
  metrics: z.record(z.string(), z.number()).optional()
});
export type AuditDimensionScore = z.infer<typeof AuditDimensionScoreSchema>;

export const ThreeBandGateStatusSchema = z.enum(['certified', 'warning', 'rejected']);
export type ThreeBandGateStatus = z.infer<typeof ThreeBandGateStatusSchema>;

export const AuditReportSchema = z.object({
  totalScore: z.number().min(0).max(50),
  maxTotalScore: z.literal(50),
  gateStatus: ThreeBandGateStatusSchema,
  isPassing: z.boolean(),
  dimensions: z.record(z.string(), AuditDimensionScoreSchema),
  invariantsPassed: z.boolean(),
  violations: z.array(z.string()),
  summary: z.string()
});
export type AuditReport = z.infer<typeof AuditReportSchema>;

export interface AtsScanResult {
  valid: boolean;
  issues: string[];
  detectedHeadings: string[];
  columnFormat: 'single' | 'multi_detected';
}

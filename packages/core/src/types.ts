import { z } from 'zod';
import type { AuditReport } from '@career-ops/audit';

export const CandidateHeaderSchema = z.object({
  name: z.string(),
  contact: z.string().optional(),
  location: z.string().optional(),
  links: z.array(z.string()).optional()
});
export type CandidateHeader = z.infer<typeof CandidateHeaderSchema>;

export const BulletNodeSchema = z.object({
  id: z.string(),
  originalText: z.string(),
  minedMetrics: z.array(z.string()).optional(),
  hemingwayDraft: z.string().optional(),
  humanizedText: z.string().optional(),
  finalBullet: z.string().optional(),
  invariants: z.object({
    verbatim: z.array(z.string()),
    semantic: z.array(z.string())
  }),
  resolutionStage: z.enum([
    'verbatim_match',
    'programmatic_re_injection',
    'fallback_stage2',
    'revert_original'
  ]).optional(),
  status: z.enum(['pending', 'mined', 'processing', 'verified', 'fallback']).default('pending')
});
export type BulletNode = z.infer<typeof BulletNodeSchema>;

export const ExperienceRoleSchema = z.object({
  id: z.string(),
  company: z.string(),
  title: z.string(),
  location: z.string().optional(),
  dateRange: z.string(),
  bullets: z.array(BulletNodeSchema)
});
export type ExperienceRole = z.infer<typeof ExperienceRoleSchema>;

export const EducationItemSchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  dateRange: z.string().optional(),
  details: z.array(z.string()).optional()
});
export type EducationItem = z.infer<typeof EducationItemSchema>;

export const SkillCategorySchema = z.object({
  category: z.string(),
  skills: z.array(z.string())
});
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

export const ResumeASTSchema = z.object({
  header: CandidateHeaderSchema,
  summary: z.string().optional(),
  experience: z.array(ExperienceRoleSchema),
  education: z.array(EducationItemSchema),
  skills: z.array(SkillCategorySchema),
  rawMarkdown: z.string()
});
export type ResumeAST = z.infer<typeof ResumeASTSchema>;

export interface OptimizationResult {
  ast: ResumeAST;
  markdown: string;
  auditReport: AuditReport;
  summary: string;
}

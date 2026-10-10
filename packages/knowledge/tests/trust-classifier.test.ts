import { describe, it, expect } from 'vitest';
import { classifyTrustTier } from '../src/classifier/trust-classifier.js';

describe('Trust Classifier', () => {
  it('classifies official government and academic sources as T1 with 1.0 weight', () => {
    const res = classifyTrustTier('https://www.bls.gov/news.release/jolts.htm', 'Bureau of Labor Statistics');
    expect(res.tier).toBe('T1');
    expect(res.weight).toBe(1.0);
    expect(res.allowed).toBe(true);
  });

  it('classifies authoritative ATS vendors as T2 with 0.85 weight', () => {
    const res = classifyTrustTier('https://engineering.workday.com/ats-parsing-2025', 'Workday Engineering');
    expect(res.tier).toBe('T2');
    expect(res.weight).toBe(0.85);
    expect(res.allowed).toBe(true);
  });

  it('classifies verified recruiting surveys as T3 with 0.65 weight', () => {
    const res = classifyTrustTier('https://www.theladders.com/career-advice/recruiter-eye-tracking', 'Ladders Research');
    expect(res.tier).toBe('T3');
    expect(res.weight).toBe(0.65);
    expect(res.allowed).toBe(true);
  });

  it('rejects unverified social media and coaching blogs as T4 with 0.0 weight', () => {
    const res = classifyTrustTier('https://www.linkedin.com/posts/career-influencer-hack', 'Career Guru');
    expect(res.tier).toBe('T4');
    expect(res.weight).toBe(0.0);
    expect(res.allowed).toBe(false);
  });

  it('rejects spoofed domains like fakebls.gov into T4 quarantine', () => {
    const res = classifyTrustTier('https://fakebls.gov/data', 'Unknown Publisher');
    expect(res.tier).toBe('T4');
    expect(res.weight).toBe(0.0);
    expect(res.allowed).toBe(false);
  });
});

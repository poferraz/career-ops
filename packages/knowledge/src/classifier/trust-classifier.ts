import type { TrustTier } from '../types.js';

export interface TrustClassification {
  tier: TrustTier;
  weight: number;
  allowed: boolean;
  reason: string;
}

const T1_DOMAINS = [
  'bls.gov',
  'nber.org',
  'arxiv.org',
  'acm.org',
  'ieee.org',
  'census.gov'
];

const T2_DOMAINS = [
  'workday.com',
  'greenhouse.io',
  'ashbyhq.com',
  'lever.co',
  'engineering.linkedin.com',
  'openai.com'
];

const T3_DOMAINS = [
  'theladders.com',
  'shrm.org',
  'gartner.com'
];

const T4_DOMAINS = [
  'tiktok.com',
  'medium.com',
  'reddit.com',
  'quora.com',
  'youtube.com'
];

export function classifyTrustTier(url: string, authorOrOrg: string): TrustClassification {
  let hostname = '';
  let fullUrlLower = '';
  try {
    const parsed = new URL(url);
    hostname = parsed.hostname.toLowerCase();
    fullUrlLower = parsed.href.toLowerCase();
  } catch {
    hostname = url.toLowerCase();
    fullUrlLower = url.toLowerCase();
  }

  // T4 rejection checks
  if (
    T4_DOMAINS.some(d => hostname.includes(d)) ||
    fullUrlLower.includes('linkedin.com/posts') ||
    hostname.includes('twitter.com') ||
    hostname.includes('x.com')
  ) {
    return {
      tier: 'T4',
      weight: 0.0,
      allowed: false,
      reason: 'Unverified social media, blog or opinion forum (T4)'
    };
  }

  // T1 verification
  if (
    T1_DOMAINS.some(d => hostname.endsWith(d)) ||
    authorOrOrg.toLowerCase().includes('bureau of labor statistics') ||
    authorOrOrg.toLowerCase().includes('nber')
  ) {
    return {
      tier: 'T1',
      weight: 1.0,
      allowed: true,
      reason: 'Peer-reviewed academic or primary government research (T1)'
    };
  }

  // T2 verification
  if (T2_DOMAINS.some(d => hostname.includes(d))) {
    return {
      tier: 'T2',
      weight: 0.85,
      allowed: true,
      reason: 'Authoritative ATS vendor engineering documentation or official spec (T2)'
    };
  }

  // T3 verification
  if (T3_DOMAINS.some(d => hostname.includes(d)) || authorOrOrg.toLowerCase().includes('shrm')) {
    return {
      tier: 'T3',
      weight: 0.65,
      allowed: true,
      reason: 'Reputable talent acquisition research or large-scale recruiter survey (T3)'
    };
  }

  // Default fallback to T4 quarantine
  return {
    tier: 'T4',
    weight: 0.0,
    allowed: false,
    reason: 'Unverified domain — quarantined by default'
  };
}

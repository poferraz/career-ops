import type { ResumeAST } from '../types.js';
import type { InferenceProvider } from '../inference/types.js';

export interface LinkedInProfile {
  headline: string;
  about: string;
  skills: string[];
}

export interface LinkedInOptions {
  provider?: InferenceProvider;
  targetRole?: string;
  domainFocus?: string;
}

export class LinkedInStrategist {
  /**
   * Generates a LinkedIn Recruiter-optimized profile deliverables:
   * 1. Headline (<= 220 characters) with signature impact metric
   * 2. 3-Act About narrative (Philosophy, Battle-tested impact, Trajectory)
   * 3. Endorsement-ready skill taxonomy clusters
   */
  public static async generateProfile(
    candidateAst: ResumeAST,
    options: LinkedInOptions = {}
  ): Promise<LinkedInProfile> {
    const role = options.targetRole ??
      (candidateAst.experience[0]?.title ?? 'Staff Distributed Systems Engineer');
    const domain = options.domainFocus ?? 'High-Throughput Streaming & Consensus';

    // Collect candidate skills
    const allSkills: string[] = [];
    for (const cat of candidateAst.skills) {
      allSkills.push(...cat.skills);
    }
    const primarySkills = Array.from(new Set(allSkills)).slice(0, 5);

    // Extract signature impact metric
    let signatureMetric = '250k events/sec';
    for (const r of candidateAst.experience) {
      for (const b of r.bullets) {
        if (b.invariants.semantic.length > 0) {
          signatureMetric = b.invariants.semantic[0];
          break;
        }
      }
    }

    // Formula: [Role] | [Domain] | [Tech Stack] | [Impact]
    const skillsShort = primarySkills.slice(0, 3).join(', ');
    let headline = `${role} | ${domain} | ${skillsShort} | Scaling ${signatureMetric}`;
    if (headline.length > 220) {
      headline = headline.substring(0, 217) + '...';
    }

    // 3-Act About narrative
    const candidateName = candidateAst.header.name;
    const about = `## Act 1: Operating Philosophy
I architect distributed infrastructure that balances relentless high throughput with deterministic correctness. My philosophy is simple: complex distributed systems fail in unpredictable ways unless grounded in clear invariants, rigorous telemetry, and automated failure-recovery boundaries.

## Act 2: Battle-Tested Scale
Over the past decade, I have led core infrastructure migrations and system redesigns:
- Re-architected streaming pipelines scaling throughput to ${signatureMetric}.
- Engineered resilient multi-region architectures with automated failover and zero data corruption.
- Mentored engineering teams in distributed systems design, chaos testing, and operational excellence.

## Act 3: What I'm Focused On Next
I collaborate with engineering organizations tackling large-scale distributed persistence, real-time event streaming, and multi-region compute substrate challenges.`;

    return {
      headline,
      about,
      skills: primarySkills
    };
  }
}

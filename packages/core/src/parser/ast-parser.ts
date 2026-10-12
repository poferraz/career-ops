import { extractInvariants } from '@career-ops/audit';
import type {
  ResumeAST,
  ExperienceRole,
  BulletNode,
  EducationItem,
  SkillCategory,
  CandidateHeader
} from '../types.js';

const TITLE_KEYWORDS = /\b(engineer|architect|developer|manager|director|lead|head|vp|president|specialist|consultant|designer|scientist|analyst|officer|coordinator|principal|fellow|intern|associate|staff|senior|junior|administrator|programmer|technician|representative)\b/i;

const COMPANY_SUFFIXES = /\b(inc\.?|llc|corp\.?|corporation|labs|technologies|systems|capital|solutions|ventures|co\.?|group|studio|consulting|health|bank|media|platforms|enterprises|holdings|networks|interactive|software)\b/i;

const KNOWN_COMPANIES = /\b(google|meta|amazon|apple|netflix|microsoft|uber|stripe|airbnb|datadog|snowflake|salesforce|openai|anthropic|twitter|spotify|github|gitlab|adobe|cisco|oracle|ibm|intel|nvidia|palantir|bytedance)\b/i;

function resolveTitleAndCompany(first: string, second: string): { title: string; company: string } {
  const firstClean = first.trim();
  const secondClean = second.trim();

  const firstIsTitle = TITLE_KEYWORDS.test(firstClean);
  const secondIsTitle = TITLE_KEYWORDS.test(secondClean);
  const firstIsCompany = COMPANY_SUFFIXES.test(firstClean) || KNOWN_COMPANIES.test(firstClean);
  const secondIsCompany = COMPANY_SUFFIXES.test(secondClean) || KNOWN_COMPANIES.test(secondClean);

  if ((firstIsCompany || secondIsTitle) && !firstIsTitle) {
    return { title: secondClean, company: firstClean };
  }

  if (firstIsTitle && !secondIsTitle) {
    return { title: firstClean, company: secondClean };
  }

  // Default assumption: first is title, second is company
  return { title: firstClean, company: secondClean };
}

function splitSkillsPreservingParens(text: string): string[] {
  const items: string[] = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '(' || char === '[' || char === '{') {
      depth++;
      current += char;
    } else if (char === ')' || char === ']' || char === '}') {
      depth = Math.max(0, depth - 1);
      current += char;
    } else if (char === ',' && depth === 0) {
      if (current.trim()) items.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) items.push(current.trim());
  return items;
}

export function parseResumeMarkdown(markdown: string): ResumeAST {
  const lines = markdown.split('\n');
  const header: CandidateHeader = { name: '' };
  const experience: ExperienceRole[] = [];
  const education: EducationItem[] = [];
  const skills: SkillCategory[] = [];

  let currentSection = '';
  let currentRole: ExperienceRole | null = null;
  let currentEdu: EducationItem | null = null;
  let currentSkillCategory: string | null = null;
  let bulletIdCounter = 1;
  let roleIdCounter = 1;
  let eduIdCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i] ?? '';
    const line = rawLine.trim();

    if (!line) continue;

    // Header Name: # Name
    if (line.startsWith('# ') && !header.name) {
      header.name = line.replace('# ', '').trim();
      continue;
    }

    // Header contact info (immediately below # Name, before any ##)
    if (!currentSection && header.name && !line.startsWith('#')) {
      header.contact = (header.contact ? `${header.contact} | ` : '') + line;
      continue;
    }

    // Major Section Headers: ## Experience, ## Education, ## Skills
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim().toLowerCase();
      currentRole = null;
      currentEdu = null;
      currentSkillCategory = null;
      continue;
    }

    // 1. Parsing Experience Section
    if (currentSection.includes('experience') || currentSection.includes('work') || currentSection.includes('history')) {
      if (line.startsWith('### ')) {
        const titleCompany = line.replace('### ', '').trim();
        const parts = titleCompany.split(/\s*[-–|]\s*/);
        const resolved = parts.length > 1
          ? resolveTitleAndCompany(parts[0]!, parts[1]!)
          : { title: parts[0] ?? titleCompany, company: 'Company' };

        currentRole = {
          id: `role-${roleIdCounter++}`,
          title: resolved.title,
          company: resolved.company,
          dateRange: '',
          bullets: []
        };
        experience.push(currentRole);
        continue;
      }

      // Check if line is dateRange (e.g. 01/2022 - Present or 2020 - 2022)
      if (currentRole && !currentRole.dateRange && !line.startsWith('-') && !line.startsWith('*')) {
        currentRole.dateRange = line;
        continue;
      }

      // Bullet items: - or *
      if (currentRole && (line.startsWith('- ') || line.startsWith('* '))) {
        const bulletText = line.replace(/^[-*]\s+/, '').trim();
        const extracted = extractInvariants(bulletText);

        const verbatim = Array.from(new Set(
          extracted.filter(inv => inv.classification === 'verbatim').map(inv => inv.rawText)
        ));
        const semantic = Array.from(new Set(
          extracted.filter(inv => inv.classification === 'semantic').map(inv => inv.normalizedValue)
        ));

        const node: BulletNode = {
          id: `b-${bulletIdCounter++}`,
          originalText: bulletText,
          invariants: {
            verbatim,
            semantic
          },
          status: 'pending'
        };
        currentRole.bullets.push(node);
        continue;
      }
    }

    // 2. Parsing Education Section
    if (currentSection.includes('education')) {
      if (line.startsWith('### ')) {
        const degInst = line.replace('### ', '').trim();
        const parts = degInst.split(/\s*[-–|]\s*/);
        const degree = parts[0] ?? degInst;
        const institution = parts[1] ?? 'University';

        currentEdu = {
          id: `edu-${eduIdCounter++}`,
          degree,
          institution,
          details: []
        };
        education.push(currentEdu);
        continue;
      }

      if (currentEdu && !currentEdu.dateRange && !line.startsWith('-') && !line.startsWith('*')) {
        currentEdu.dateRange = line;
        continue;
      }

      if (currentEdu && (line.startsWith('- ') || line.startsWith('* '))) {
        currentEdu.details = currentEdu.details ?? [];
        currentEdu.details.push(line.replace(/^[-*]\s+/, '').trim());
        continue;
      }

      // Plain line education item if no ### was used
      if (!currentEdu) {
        currentEdu = {
          id: `edu-${eduIdCounter++}`,
          degree: line,
          institution: 'Institution',
          details: []
        };
        education.push(currentEdu);
      }
    }

    // 3. Parsing Skills Section
    if (currentSection.includes('skills')) {
      if (line.startsWith('### ')) {
        currentSkillCategory = line.replace('### ', '').trim();
        const existing = skills.find(s => s.category.toLowerCase() === currentSkillCategory!.toLowerCase());
        if (!existing) {
          skills.push({ category: currentSkillCategory, skills: [] });
        }
        continue;
      }

      // E.g. "Languages: Go, TypeScript, Python" or "- Languages: Go, TypeScript"
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const category = line.slice(0, colonIndex).replace(/^[-*]\s+/, '').trim();
        const rawSkills = line.slice(colonIndex + 1);
        const skillList = splitSkillsPreservingParens(rawSkills);

        const existing = skills.find(s => s.category.toLowerCase() === category.toLowerCase());
        if (existing) {
          existing.skills.push(...skillList);
        } else {
          skills.push({
            category,
            skills: skillList
          });
        }
        currentSkillCategory = category;
        continue;
      }

      // Plain items (either "- item" or comma-separated list "Go, TypeScript, Python")
      const cleanedLine = line.replace(/^[-*]\s+/, '').trim();
      const skillList = splitSkillsPreservingParens(cleanedLine);
      const targetCategory = currentSkillCategory ?? 'Technical Skills';

      const existing = skills.find(s => s.category.toLowerCase() === targetCategory.toLowerCase());
      if (existing) {
        existing.skills.push(...skillList);
      } else {
        skills.push({
          category: targetCategory,
          skills: skillList
        });
      }
    }
  }

  return {
    header,
    experience,
    education,
    skills,
    rawMarkdown: markdown
  };
}

export function renderResumeMarkdown(ast: ResumeAST): string {
  const parts: string[] = [];

  // 1. Header
  parts.push(`# ${ast.header.name}`);
  if (ast.header.contact) {
    parts.push(ast.header.contact);
  }
  parts.push('');

  // 2. Summary (if present)
  if (ast.summary) {
    parts.push('## Summary');
    parts.push(ast.summary);
    parts.push('');
  }

  // 3. Experience
  if (ast.experience.length > 0) {
    parts.push('## Experience');
    for (const role of ast.experience) {
      parts.push(`### ${role.title} - ${role.company}`);
      if (role.dateRange) {
        parts.push(role.dateRange);
      }
      for (const bullet of role.bullets) {
        const text = bullet.finalBullet ?? bullet.originalText;
        parts.push(`- ${text}`);
      }
      parts.push('');
    }
  }

  // 4. Education
  if (ast.education.length > 0) {
    parts.push('## Education');
    for (const edu of ast.education) {
      parts.push(`### ${edu.degree} - ${edu.institution}`);
      if (edu.dateRange) {
        parts.push(edu.dateRange);
      }
      if (edu.details && edu.details.length > 0) {
        for (const d of edu.details) {
          parts.push(`- ${d}`);
        }
      }
      parts.push('');
    }
  }

  // 5. Skills
  if (ast.skills.length > 0) {
    parts.push('## Skills');
    for (const cat of ast.skills) {
      parts.push(`${cat.category}: ${cat.skills.join(', ')}`);
    }
    parts.push('');
  }

  return parts.join('\n').trim() + '\n';
}

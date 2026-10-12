export type Level = 'mid' | 'senior' | 'staff' | 'switcher';

export interface BenchBullet {
  id: string;
  raw: string;
  gold: string;
  facts: string[];
  trap?: 'no-metric' | 'hedged-ownership' | 'approximation' | 'range' | 'bare-numbers';
}

export interface Persona {
  id: string;
  name: string;
  level: Level;
  title: string;
  company: string;
  dates: string;
  bullets: BenchBullet[];
  skills: string[];
  jobSpec: string;
  domainTerms: string[];
}

export const PERSONAS: Persona[] = [
  {
    id: 'p1-staff-dist',
    name: 'Avery Kim',
    level: 'staff',
    title: 'Staff Software Engineer',
    company: 'Ledgerline',
    dates: 'Jan 2021 - Present',
    skills: ['Go', 'Kafka', 'CockroachDB', 'AWS', 'Kubernetes'],
    domainTerms: ['distributed', 'Kafka', 'failover', 'latency'],
    jobSpec:
      '# Staff Engineer, Payments Infrastructure\n\n**Company:** Northwind Pay\n\nOwn the reliability and scale of our ledger and event pipeline.',
    bullets: [
      {
        id: 'p1b1',
        raw: 'Was responsible for the migration of our event pipeline from RabbitMQ to Kafka, which helped improve throughput to 250k events/sec and reduced p99 latency from 1.2s to 180ms.',
        gold: 'Moved the event pipeline from RabbitMQ to Kafka; throughput rose to 250k events/sec and p99 latency fell from 1.2s to 180ms.',
        facts: ['RabbitMQ', 'Kafka', '250k events/sec', '1.2s', '180ms']
      },
      {
        id: 'p1b2',
        raw: 'Helped to design a multi-region failover strategy for the payments ledger using CockroachDB across 3 regions, achieving 99.995% availability over 18 months.',
        gold: 'Co-designed multi-region failover for the payments ledger on CockroachDB across 3 regions: 99.995% availability over 18 months.',
        facts: ['CockroachDB', '3 regions', '99.995%', '18 months'],
        trap: 'hedged-ownership'
      },
      {
        id: 'p1b3',
        raw: 'Mentored 6 engineers on distributed systems topics and ran weekly design reviews.',
        gold: 'Ran weekly design reviews and mentored 6 engineers on distributed systems.',
        facts: ['6 engineers'],
        trap: 'no-metric'
      },
      {
        id: 'p1b4',
        raw: 'Worked on reducing our AWS bill, we cut costs by about $1.2M annually by rightsizing EC2 fleets and moving batch jobs to Spot instances.',
        gold: 'Cut AWS spend by about $1.2M a year by rightsizing EC2 fleets and moving batch jobs to Spot instances.',
        facts: ['about $1.2M', 'EC2', 'Spot'],
        trap: 'approximation'
      }
    ]
  },
  {
    id: 'p2-senior-pm',
    name: 'Jordan Reyes',
    level: 'senior',
    title: 'Senior Product Manager',
    company: 'Brightloop',
    dates: 'Mar 2020 - Present',
    skills: ['Experimentation', 'SQL', 'Amplitude', 'Roadmapping', 'User Research'],
    domainTerms: ['activation', 'conversion', 'churn', 'roadmap'],
    jobSpec:
      '# Group Product Manager, Growth\n\n**Company:** Fieldnote\n\nLead activation and monetization for a self-serve B2B product.',
    bullets: [
      {
        id: 'p2b1',
        raw: 'Led the cross-functional team responsible for redesigning onboarding flow which resulted in activation going up from 31% to 44% in Q2 2024.',
        gold: 'Led the onboarding redesign with design and engineering; activation rose from 31% to 44% in Q2 2024.',
        facts: ['31%', '44%', 'Q2 2024']
      },
      {
        id: 'p2b2',
        raw: 'Responsible for the pricing page experiment program, ran 14 A/B tests that lifted paid conversion by 12.5 percentage points.',
        gold: 'Ran 14 A/B tests on the pricing page that lifted paid conversion by 12.5 percentage points.',
        facts: ['14 A/B tests', '12.5 percentage points']
      },
      {
        id: 'p2b3',
        raw: 'Worked closely with stakeholders to define the product roadmap for the enterprise tier.',
        gold: 'Worked with stakeholders across the company to define the enterprise-tier roadmap.',
        facts: ['enterprise'],
        trap: 'no-metric'
      },
      {
        id: 'p2b4',
        raw: 'Interviewed 60+ customers to identify churn drivers, which informed a retention initiative that reduced logo churn 15-20% over two quarters.',
        gold: 'Interviewed 60+ customers about why they left. The retention work that followed cut logo churn 15-20% over two quarters.',
        facts: ['60+', '15-20%', 'two quarters'],
        trap: 'range'
      }
    ]
  },
  {
    id: 'p3-fullstack-lead',
    name: 'Sam Okafor',
    level: 'senior',
    title: 'Full-Stack Tech Lead',
    company: 'Parcelwise',
    dates: 'Jun 2019 - Present',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Next.js'],
    domainTerms: ['React', 'Next.js', 'GraphQL', 'deploy'],
    jobSpec:
      '# Engineering Lead, Customer Platform\n\n**Company:** Harborline\n\nLead a full-stack team shipping customer-facing and internal tools.',
    bullets: [
      {
        id: 'p3b1',
        raw: 'Built a new internal admin dashboard in React and TypeScript with a Node.js/GraphQL backend used by 300 support agents daily.',
        gold: 'Built the internal admin dashboard (React, TypeScript, Node.js, GraphQL) that 300 support agents use daily.',
        facts: ['React', 'TypeScript', 'Node.js', 'GraphQL', '300 support agents']
      },
      {
        id: 'p3b2',
        raw: 'Improved page load times by 3.5x by implementing server-side rendering with Next.js and image CDN caching.',
        gold: 'Made pages load 3.5x faster with Next.js server-side rendering and CDN image caching.',
        facts: ['3.5x', 'Next.js', 'CDN']
      },
      {
        id: 'p3b3',
        raw: 'Leading a team of 5 engineers, responsible for sprint planning, code reviews and hiring.',
        gold: 'Lead a team of 5 engineers: sprint planning, code review, and hiring.',
        facts: ['5 engineers'],
        trap: 'no-metric'
      },
      {
        id: 'p3b4',
        raw: 'Set up CI/CD pipelines using GitHub Actions that reduced deploy time from 45 minutes to 8 minutes.',
        gold: 'Cut deploy time from 45 minutes to 8 minutes with new GitHub Actions CI/CD pipelines.',
        facts: ['GitHub Actions', '45 minutes', '8 minutes']
      }
    ]
  },
  {
    id: 'p4-switcher',
    name: 'Riley Chen',
    level: 'switcher',
    title: 'Mathematics Teacher',
    company: 'Lincoln High School',
    dates: 'Aug 2016 - Jun 2024',
    skills: ['SQL', 'Python', 'Tableau', 'Google Sheets', 'Statistics'],
    domainTerms: ['students', 'teachers', 'pass rates', 'data'],
    jobSpec:
      '# Data Analyst\n\n**Company:** Civic Metrics\n\nTurn messy public-sector data into decisions. SQL, Python, Tableau.',
    bullets: [
      {
        id: 'p4b1',
        raw: 'Taught algebra and statistics to 150 students per year across 5 sections.',
        gold: 'Taught algebra and statistics to 150 students a year across 5 sections.',
        facts: ['150 students', '5 sections']
      },
      {
        id: 'p4b2',
        raw: 'Created a Google Sheets and Python grade tracker that the whole math department (12 teachers) adopted, saving roughly 3 hours per teacher per week.',
        gold: 'Wrote a grade tracker in Python and Google Sheets that all 12 teachers in the math department adopted; it saved each of them roughly 3 hours per week.',
        facts: ['Google Sheets', 'Python', '12 teachers', 'roughly 3 hours'],
        trap: 'approximation'
      },
      {
        id: 'p4b3',
        raw: 'Analyzed state test score data to find gaps, and our intervention plan raised pass rates from 62% to 78%.',
        gold: 'Analyzed state test data to find skill gaps; the intervention plan our team built on it raised pass rates from 62% to 78%.',
        facts: ['62%', '78%'],
        trap: 'hedged-ownership'
      },
      {
        id: 'p4b4',
        raw: 'Completed Google Data Analytics Certificate and built 3 portfolio projects in SQL and Tableau.',
        gold: 'Completed the Google Data Analytics Certificate; built 3 portfolio projects in SQL and Tableau.',
        facts: ['Google Data Analytics Certificate', '3 portfolio projects', 'SQL', 'Tableau']
      }
    ]
  },
  {
    id: 'p5-mid-frontend',
    name: 'Casey Novak',
    level: 'mid',
    title: 'Frontend Engineer',
    company: 'Tiller',
    dates: 'Feb 2022 - Present',
    skills: ['React', 'Tailwind CSS', 'Jest', 'Playwright', 'Accessibility'],
    domainTerms: ['components', 'accessibility', 'tests', 'Tailwind'],
    jobSpec:
      '# Frontend Engineer II\n\n**Company:** Oakbridge\n\nBuild accessible, well-tested product UI in React.',
    bullets: [
      {
        id: 'p5b1',
        raw: 'Helped migrate the design system components from Styled Components to Tailwind CSS.',
        gold: 'Helped migrate the design-system components from Styled Components to Tailwind CSS.',
        facts: ['Styled Components', 'Tailwind CSS'],
        trap: 'hedged-ownership'
      },
      {
        id: 'p5b2',
        raw: 'Fixed accessibility issues across the checkout flow, bringing Lighthouse accessibility score from 72 to 96.',
        gold: 'Fixed accessibility issues across checkout; the Lighthouse accessibility score went from 72 to 96.',
        facts: ['Lighthouse', '72', '96'],
        trap: 'bare-numbers'
      },
      {
        id: 'p5b3',
        raw: 'Wrote unit and integration tests with Jest and Playwright, increasing coverage to 85%.',
        gold: 'Wrote Jest unit tests and Playwright integration tests, raising coverage to 85%.',
        facts: ['Jest', 'Playwright', '85%']
      },
      {
        id: 'p5b4',
        raw: 'Built reusable form components used in 20+ pages.',
        gold: 'Built reusable form components now used on 20+ pages.',
        facts: ['20+']
      }
    ]
  }
];

export function personaToMarkdown(p: Persona): string {
  return [
    `# ${p.name}`,
    `${p.id}@example.com | Remote`,
    '',
    '## Experience',
    '',
    `### ${p.title} | ${p.company}`,
    `${p.dates} | Remote`,
    ...p.bullets.map(b => `- ${b.raw}`),
    '',
    '## Skills',
    '',
    '### Core',
    p.skills.join(', '),
    ''
  ].join('\n');
}

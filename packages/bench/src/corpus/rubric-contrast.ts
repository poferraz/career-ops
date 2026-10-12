export interface ContrastItem {
  id: string;
  label: 'gold' | 'slop' | 'garbage' | 'attack';
  bullets: string[];
}

export const CONTRAST_SET: ContrastItem[] = [
  {
    id: 'gold-a',
    label: 'gold',
    bullets: [
      'Cut p99 checkout latency from 1.2s to 340ms by moving session state from Postgres to Redis.',
      'Rewrote the Kafka consumer after a 6-hour outage. No repeat in 14 months.',
      'Hired and onboarded 5 engineers; two now lead their own teams.'
    ]
  },
  {
    id: 'gold-b',
    label: 'gold',
    bullets: [
      'Ran 14 A/B tests on the pricing page that lifted paid conversion by 12.5 percentage points.',
      'Interviewed 60+ customers about why they left.',
      'Activation rose from 31% to 44% after the onboarding redesign.'
    ]
  },
  {
    id: 'slop-a',
    label: 'slop',
    bullets: [
      'Orchestrated a robust, scalable microservices ecosystem, fostering seamless cross-functional collaboration.',
      'Pioneered innovative data-driven strategies, harnessing cutting-edge technologies to unlock efficiencies.',
      'Championed a culture of excellence, empowering stakeholders to navigate complex challenges.'
    ]
  },
  {
    id: 'slop-b',
    label: 'slop',
    bullets: [
      'Spearheaded transformative initiatives that drove impactful outcomes across the organization.',
      'Leveraged deep expertise to deliver world-class solutions in a fast-paced environment.',
      'Meticulously showcased a proven track record of delivering results.'
    ]
  },
  {
    id: 'garbage-a',
    label: 'garbage',
    bullets: [
      'Built things. Made stuff happen for the team and many many people everywhere.',
      'Led initiatives. Moved metrics a lot across numerous varied important areas of business.',
      'Delivered value. Kicked off great work that went super well for everybody involved here.'
    ]
  },
  {
    id: 'attack-verb-stuff',
    label: 'attack',
    bullets: [
      'Built 10x 10x 10x improvements improvements improvements across across across everything.',
      'Reduced 99% 99% 99% of of of all all all problems problems forever.',
      'Improved 5x stuff stuff stuff stuff stuff stuff stuff stuff.'
    ]
  },
  {
    id: 'attack-period-m',
    label: 'attack',
    bullets: [
      'Designed it. Many people liked the general idea of the whole thing a lot.',
      'Optimized it. Most folks agreed it was nicer than before in many ways overall.',
      'Automated it. Mostly fine. Basically better than the old thing for many users.'
    ]
  }
];

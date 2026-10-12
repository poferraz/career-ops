export interface InvariantCase {
  id: string;
  original: string;
  candidate: string;
  shouldPreserve: boolean;
  note: string;
}

export const INVARIANT_CASES: InvariantCase[] = [
  { id: 'i01', original: 'Reduced churn 15-20% in Q3 2024', candidate: 'Cut churn 15–20% in Q3 2024', shouldPreserve: true, note: 'en-dash range equivalence' },
  { id: 'i02', original: 'Reduced churn 15-20% in Q3 2024', candidate: 'Reduced churn 20% in Q3 2024', shouldPreserve: false, note: 'range lower bound dropped' },
  { id: 'i03', original: 'Cut latency from 1.2s to 340ms', candidate: 'Cut latency to 340ms', shouldPreserve: false, note: 'seconds unit not extracted' },
  { id: 'i04', original: 'Cut latency from 1.2s to 340ms', candidate: 'Cut latency from 1.2 seconds to 340 ms', shouldPreserve: true, note: 'unit spelling equivalence' },
  { id: 'i05', original: 'Grew ARR from €450K to $1.2M', candidate: 'Grew ARR from $450K to $1.2M', shouldPreserve: false, note: 'currency symbol swap €->$' },
  { id: 'i06', original: 'Saved £2.3m annually', candidate: 'Saved £2.3 million annually', shouldPreserve: true, note: 'GBP magnitude equivalence' },
  { id: 'i07', original: 'Saved £2.3m annually', candidate: 'Saved $2.3M annually', shouldPreserve: false, note: 'GBP->USD swap' },
  { id: 'i08', original: 'Achieved sub-millisecond (0.4ms) lookups', candidate: 'Achieved 0.4ms lookups', shouldPreserve: true, note: 'sub-ms equivalent' },
  { id: 'i09', original: 'Served 2.4 TB of data', candidate: 'Served 24 TB of data', shouldPreserve: false, note: 'data size magnitude' },
  { id: 'i10', original: 'Scaled to 1,200 req/s', candidate: 'Scaled to 12,000 req/s', shouldPreserve: false, note: 'throughput magnitude' },
  { id: 'i11', original: 'Scaled to 1,200 req/s', candidate: 'Scaled to 1.2k requests per second', shouldPreserve: true, note: 'k-suffix + unit spelling' },
  { id: 'i12', original: 'Shipped 3 products in 2023', candidate: 'Shipped 4 products in 2023', shouldPreserve: false, note: 'bare count' },
  { id: 'i13', original: 'Shipped 3 products in 2023', candidate: 'Shipped 3 products in 2022', shouldPreserve: false, note: 'bare year' },
  { id: 'i14', original: 'Lighthouse score from 72 to 96', candidate: 'Lighthouse score from 72 to 98', shouldPreserve: false, note: 'bare score' },
  { id: 'i15', original: 'Over 18 months', candidate: 'Over 1.5 years', shouldPreserve: true, note: 'duration equivalence' },
  { id: 'i16', original: 'Over 18 months', candidate: 'Over 8 months', shouldPreserve: false, note: 'duration changed' },
  { id: 'i17', original: 'Cut costs by about $1.2M', candidate: 'Cut costs by $1.2M', shouldPreserve: false, note: 'approximation qualifier dropped (overclaim)' },
  { id: 'i18', original: 'Interviewed 60+ customers', candidate: 'Interviewed 60 customers', shouldPreserve: false, note: 'plus qualifier dropped' },
  { id: 'i19', original: 'Migrated billing to Kubernetes', candidate: 'Migrated billing to Kubernetes, saving $2M', shouldPreserve: false, note: 'HALLUCINATED currency added' },
  { id: 'i20', original: 'Migrated billing to Kubernetes', candidate: 'Migrated billing to Kubernetes and cut costs 40%', shouldPreserve: false, note: 'HALLUCINATED percent added' },
  { id: 'i21', original: 'Uptime 99.99%', candidate: 'Uptime 99.9%', shouldPreserve: false, note: 'nines precision' },
  { id: 'i22', original: 'Improved throughput 3.5x', candidate: 'Improved throughput 350%', shouldPreserve: false, note: '3.5x is +250%, not 350%' },
  { id: 'i23', original: 'Improved throughput 3.5x', candidate: 'Made throughput 3.5 times higher', shouldPreserve: true, note: 'multiplier spelling' },
  { id: 'i24', original: 'Led 8 engineers', candidate: 'Led eight engineers', shouldPreserve: true, note: 'number word equivalence' },
  { id: 'i25', original: 'Used by 40k+ users', candidate: 'Used by 40,000+ users', shouldPreserve: true, note: 'k expansion with plus' },
  { id: 'i26', original: 'Cut p99 latency by 38%', candidate: 'Cut p95 latency by 38%', shouldPreserve: false, note: 'percentile identifier changed' },
  { id: 'i27', original: 'Built on PostgreSQL and Redis', candidate: 'Built on Postgres and Redis', shouldPreserve: true, note: 'tool alias' },
  { id: 'i28', original: 'Built on PostgreSQL and Redis', candidate: 'Built on PostgreSQL', shouldPreserve: false, note: 'tool dropped' },
  { id: 'i29', original: 'Reconciled $42M daily', candidate: 'Reconciled $42M monthly', shouldPreserve: false, note: 'rate period changed' },
  { id: 'i30', original: 'Q2 2024', candidate: 'second quarter of 2024', shouldPreserve: true, note: 'quarter spelling' }
];

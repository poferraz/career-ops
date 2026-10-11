/**
 * Canonical test fixtures for Career-Ops demonstrations, end-to-end integration tests,
 * and viral CLI benchmarking.
 */

export const DEMO_CANDIDATE_RESUME = `# Morgan Vance
morgan.vance@example.com | (415) 555-0199 | San Francisco, CA | github.com/morganvance | linkedin.com/in/morganvance

## Experience

### Staff Distributed Systems Engineer | ChronoScale Systems
Mar 2022 - Present | San Francisco, CA
- Spearheaded re-architecture of core event streaming pipeline to Apache Kafka and Go, boosting throughput to 250k events/sec.
- Slashed AWS multi-region infrastructure costs by 38% through Kubernetes bin-packing and spot instance auto-scaling.
- Led migration of 14 monolithic services into containerized microservices with zero downtime across 4 production regions.
- Mentored 8 junior and mid-level software engineers on fault-tolerant systems design and deterministic distributed testing.

### Senior Backend Engineer | FinTech Velocity
Jun 2018 - Feb 2022 | New York, NY
- Designed and delivered distributed payment reconciliation engine in Go and PostgreSQL, reconciling $42M daily transactions.
- Reduced p99 payment gateway authorization latency from 480ms to 65ms by implementing Redis caching and connection multiplexing.
- Authored custom Terraform modules managing VPC peering, IAM roles, and automated rollback policies across 3 cloud regions.
- Collaborated with compliance auditors to achieve SOC-2 Type II certification with zero critical non-conformities.

### Software Engineer | DataStream Labs
Aug 2015 - May 2018 | Boston, MA
- Built high-throughput ETL data pipelines ingesting 12TB daily time-series telemetry using Python and Apache Spark.
- Implemented real-time anomaly detection alerting on telemetry anomalies within 4.5 seconds of event receipt.
- Partnered with product managers to deliver self-service analytics dashboards serving 1,400 internal operators.

## Education

### B.S. in Computer Science | Carnegie Mellon University
2011 - 2015 | Pittsburgh, PA
- Dean's List (6 semesters), Teaching Assistant for Distributed Systems (15-440).

## Skills

### Languages & Frameworks
Go, Python, TypeScript, Rust, C++, Bash

### Infrastructure & Distributed Systems
Kubernetes, Docker, Apache Kafka, Redis, PostgreSQL, AWS, GCP, Terraform, Envoy, gRPC

### Practices & Tools
Distributed Systems, Microservices Architecture, CI/CD, Git, Linux Internals, Observability (Prometheus, Grafana)
`;

export const DEMO_JOB_SPEC = `# Staff Distributed Systems Engineer

**Company:** HyperPlane Infrastructure  
**Location:** San Francisco, CA (Hybrid)  
**Compensation:** $220,000 - $265,000 + Equity  

### About the Role
HyperPlane is building the next-generation global edge compute and real-time state synchronization substrate. We are seeking a Staff Distributed Systems Engineer to lead the architectural evolution of our event streaming infrastructure, multi-region database persistence, and low-latency networking fabrics.

### Responsibilities
- Architect and operate fault-tolerant distributed systems capable of scaling to millions of transactions per second.
- Lead the technical roadmap for event-driven microservices running on Kubernetes across AWS and bare-metal environments.
- Partner with security, infrastructure, and product teams to drive 99.999% platform availability.
- Cultivate engineering excellence through rigorous design reviews, deterministic Chaos Engineering practices, and empathetic mentorship.

### Requirements
- 8+ years of production experience designing, building, and operating high-throughput distributed backend services.
- Deep expertise in systems programming languages, particularly Go, Rust, or modern C++.
- Proven track record with large-scale event processing systems (Apache Kafka, Apache Flink, RabbitMQ) and distributed storage (PostgreSQL, Cassandra, Redis).
- Extensive hands-on experience orchestrating multi-region containerized workloads with Kubernetes, Terraform, and Docker.
- Strong grounding in distributed consensus algorithms (Raft, Paxos), eventual consistency models, and networking protocols (gRPC, HTTP/2, TCP).
`;

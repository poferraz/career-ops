import { describe, it, expect } from 'vitest';
import {
  canonicalizeCurrency,
  canonicalizePercentage,
  canonicalizeDate,
  canonicalizeNumber,
  extractInvariants,
  checkInvariantPreservation
} from '../src/invariants/normalizer.js';

describe('Two-Class Invariant Normalizer', () => {
  it('canonicalizes currencies across standard notations', () => {
    expect(canonicalizeCurrency('$1.4M')).toBe('1400000 USD');
    expect(canonicalizeCurrency('$1,400,000')).toBe('1400000 USD');
    expect(canonicalizeCurrency('1.4 million dollars')).toBe('1400000 USD');
    expect(canonicalizeCurrency('$250K')).toBe('250000 USD');
  });

  it('canonicalizes percentages', () => {
    expect(canonicalizePercentage('40%')).toBe('40%');
    expect(canonicalizePercentage('40 percent')).toBe('40%');
    expect(canonicalizePercentage('40.5%')).toBe('40.5%');
  });

  it('canonicalizes quarter and month dates', () => {
    expect(canonicalizeDate('Q3 2024')).toBe('2024-Q3');
    expect(canonicalizeDate('third quarter of 2024')).toBe('2024-Q3');
    expect(canonicalizeDate('07/2024')).toBe('2024-07');
    expect(canonicalizeDate('July 2024')).toBe('2024-07');
  });

  it('canonicalizes abbreviated numbers', () => {
    expect(canonicalizeNumber('500k')).toBe('500000');
    expect(canonicalizeNumber('500,000')).toBe('500000');
    expect(canonicalizeNumber('2.5B')).toBe('2500000000');
  });

  it('verifies entity preservation despite format restyling', () => {
    const original = 'Scaled payments handling $1.4M ARR with 40% reduction in latency using Kubernetes.';
    const rewritten = 'Engineered payment infrastructure processing 1.4 million dollars ARR, cutting latency 40 percent with Kubernetes.';

    const check = checkInvariantPreservation(original, rewritten);
    expect(check.preserved).toBe(true);
    expect(check.missing.length).toBe(0);
  });

  it('detects altered or missing metrics', () => {
    const original = 'Boosted throughput by 35% across 12 microservices.';
    const rewritten = 'Improved microservice throughput across 12 systems.'; // dropped 35%

    const check = checkInvariantPreservation(original, rewritten);
    expect(check.preserved).toBe(false);
    expect(check.missing.some(m => m.rawText === '35%')).toBe(true);
  });

  it('extracts symbol-bearing tech tools correctly (C++, C#, .NET, Node.js)', () => {
    const text = 'Architected high-performance systems in C++, C#, and .NET Core, migrating legacy Node.js services.';
    const invariants = extractInvariants(text);
    const tools = invariants.filter(i => i.classification === 'verbatim' && i.category === 'tool').map(i => i.rawText);
    
    expect(tools).toContain('C++');
    expect(tools).toContain('C#');
    expect(tools).toContain('.NET');
    expect(tools).toContain('Node.js');
  });

  it('extracts latencies, rates, multipliers, and quantified counts', () => {
    const text = 'Reduced p99 latency from 450ms to 35ms, achieved a 10x throughput gain across 50 nodes at 250,000 events/sec.';
    const invariants = extractInvariants(text);
    const metrics = invariants.filter(i => i.category === 'number').map(i => i.normalizedValue);

    expect(metrics).toContain('450ms');
    expect(metrics).toContain('35ms');
    expect(metrics).toContain('10x');
    expect(metrics).toContain('50 nodes');
    expect(metrics).toContain('250000 events/sec');
  });

  it('supports custom tool dictionaries for domain-specific technologies', () => {
    const original = 'Implemented vector search using Milvus and Qdrant clusters.';
    const rewritten = 'Deployed semantic search using Milvus and Qdrant clusters.';
    
    // Milvus and Qdrant can be supplied via customTools
    const check = checkInvariantPreservation(original, rewritten, ['Milvus', 'Qdrant']);
    expect(check.preserved).toBe(true);
    expect(check.originalInvariants.some(i => i.rawText === 'Milvus')).toBe(true);
    expect(check.originalInvariants.some(i => i.rawText === 'Qdrant')).toBe(true);
  });
});


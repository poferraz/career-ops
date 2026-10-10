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
});

import { describe, it, expect } from 'vitest';
import { parseSpec, checkDrift } from '../spec';

const sampleSpec = `---
doc: spec
feature: test-feature
sprint: 2
version: 1.3
status: stable
last-verified-against:
  upstream: roadmap.md@v2.1
  downstream: abc123def
open-corrections: 1
last-correction: CORR-S2-004
---

# Sprint 2: 用户认证

## 1. 用户旅程
`;

describe('parseSpec', () => {
  it('extracts version and status', () => {
    const spec = parseSpec(sampleSpec);
    expect(spec.version).toBe('1.3');
    expect(spec.status).toBe('stable');
    expect(spec.sprint).toBe(2);
    expect(spec.doc).toBe('spec');
  });

  it('extracts last-verified-against pointers', () => {
    const spec = parseSpec(sampleSpec);
    expect(spec.lastVerifiedAgainst.upstream).toBe('roadmap.md@v2.1');
    expect(spec.lastVerifiedAgainst.downstream).toBe('abc123def');
  });

  it('extracts correction info', () => {
    const spec = parseSpec(sampleSpec);
    expect(spec.openCorrections).toBe(1);
    expect(spec.lastCorrection).toBe('CORR-S2-004');
  });

  it('defaults missing fields', () => {
    const minimalSpec = `---\ndoc: spec\nsprint: 1\n---\n# Test`;
    const spec = parseSpec(minimalSpec);
    expect(spec.version).toBe('1.0');
    expect(spec.status).toBe('draft');
    expect(spec.openCorrections).toBe(0);
    expect(spec.lastCorrection).toBeNull();
    expect(spec.lastVerifiedAgainst.upstream).toBe('');
    expect(spec.lastVerifiedAgainst.downstream).toBe('');
  });
});

describe('checkDrift', () => {
  it('returns drifted when downstream does not match HEAD', () => {
    const result = checkDrift('abc123', 'def456', 3);
    expect(result.drifted).toBe(true);
    expect(result.commitsSince).toBe(3);
  });

  it('returns not drifted when downstream matches HEAD', () => {
    const result = checkDrift('abc123', 'abc123', 0);
    expect(result.drifted).toBe(false);
    expect(result.commitsSince).toBe(0);
  });
});

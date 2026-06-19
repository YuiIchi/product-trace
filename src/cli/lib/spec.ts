import matter from 'gray-matter';

export interface SpecData {
  doc: string;
  sprint: number;
  version: string;
  status: 'draft' | 'stable' | 'drifted' | 'archived';
  lastVerifiedAgainst: {
    upstream: string;
    downstream: string;
  };
  openCorrections: number;
  lastCorrection: string | null;
}

export function parseSpec(content: string): SpecData {
  let data: Record<string, any>;
  try {
    data = matter(content).data;
  } catch (e: any) {
    throw new Error(
      `spec.md frontmatter 解析失败: ${e.message}\n` +
      `请检查 frontmatter 字段值是否含有特殊字符（如冒号、引号等）。`
    );
  }

  return {
    doc: data.doc || 'spec',
    sprint: data.sprint || 0,
    version: String(data.version || '1.0'),
    status: data.status || 'draft',
    lastVerifiedAgainst: {
      upstream: data['last-verified-against']?.upstream || '',
      downstream: data['last-verified-against']?.downstream || '',
    },
    openCorrections: data['open-corrections'] || 0,
    lastCorrection: data['last-correction'] || null,
  };
}

export interface DriftResult {
  drifted: boolean;
  commitsSince: number;
}

export function checkDrift(
  specCommit: string,
  headCommit: string,
  commitsSince: number
): DriftResult {
  return {
    drifted: specCommit !== headCommit,
    commitsSince,
  };
}

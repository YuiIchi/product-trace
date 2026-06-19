import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { ptInit } from '../commands/init.js';
import { ptNewSprint } from '../commands/new-sprint.js';
import { ptStatus } from '../commands/status.js';
import { ptProgress } from '../commands/progress.js';
import { ptTemplate } from '../commands/template.js';

let TEST_DIR: string;
const ORIGINAL_CWD = process.cwd();

function setupTestDir(prefix: string) {
  TEST_DIR = join(tmpdir(), `pt-test-${prefix}-${Date.now()}`);
  rmSync(TEST_DIR, { recursive: true, force: true });
  mkdirSync(TEST_DIR, { recursive: true });
  process.chdir(TEST_DIR);
}

function teardownTestDir() {
  rmSync(TEST_DIR, { recursive: true, force: true });
  process.chdir(ORIGINAL_CWD);
}

function captureOutput(fn: () => void): string {
  const originalLog = console.log;
  const lines: string[] = [];
  console.log = (...args: any[]) => {
    lines.push(args.map(String).join(' '));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  return lines.join('\n');
}

describe('pt init', () => {
  beforeAll(() => { setupTestDir('init'); });
  afterAll(() => { teardownTestDir(); });

  it('creates docs/ directory structure', () => {
    ptInit();
    expect(existsSync(join(TEST_DIR, 'docs/features/main/sprints'))).toBe(true);
    expect(existsSync(join(TEST_DIR, 'docs/features/main/product-vision.md'))).toBe(true);
    expect(existsSync(join(TEST_DIR, 'docs/features/main/ROADMAP.md'))).toBe(true);
  });

  it('writes valid product-vision.md', () => {
    const content = readFileSync(join(TEST_DIR, 'docs/features/main/product-vision.md'), 'utf-8');
    expect(content).toContain('doc: product-vision');
    expect(content).toContain('status: draft');
    expect(content).toContain('## 3. MVP 范围');
  });

  it('writes valid ROADMAP.md with checkbox', () => {
    const content = readFileSync(join(TEST_DIR, 'docs/features/main/ROADMAP.md'), 'utf-8');
    expect(content).toContain('doc: ROADMAP');
    expect(content).toContain('current-sprint: Sprint 1');
    expect(content).toContain('← current');
    expect(content).toContain('- [ ] Story-001');
    expect(content).toContain('## Backlog');
  });

  it('does not overwrite existing files', () => {
    const output = captureOutput(() => ptInit());
    expect(output).toContain('已存在');
  });
});

describe('pt new-sprint', () => {
  beforeAll(() => {
    setupTestDir('sprint');
    ptInit();
  });
  afterAll(() => { teardownTestDir(); });

  it('creates sprint-1 with spec and corrections', () => {
    ptNewSprint();
    expect(existsSync(join(TEST_DIR, 'docs/features/main/sprints/sprint-1/spec.md'))).toBe(true);
    expect(existsSync(join(TEST_DIR, 'docs/features/main/sprints/sprint-1/acceptance'))).toBe(true);
    expect(existsSync(join(TEST_DIR, 'docs/features/main/sprints/sprint-1/corrections-sprint-1.md'))).toBe(true);
  });

  it('writes spec.md with all 7 required sections', () => {
    const content = readFileSync(join(TEST_DIR, 'docs/features/main/sprints/sprint-1/spec.md'), 'utf-8');
    expect(content).toContain('doc: spec');
    expect(content).toContain('sprint: 1');
    expect(content).toContain('status: draft');
    expect(content).toContain('## 1. 用户旅程');
    expect(content).toContain('## 2. 验收标准');
    expect(content).toContain('验证方式');
    expect(content).toContain('## 3. 数据模型');
    expect(content).toContain('## 4. 实施拆解');
    expect(content).toContain('## 6. 纠偏摘要');
    expect(content).toContain('## 7. 变更记录');
  });

  it('writes corrections file with CORR and SIGNAL sections', () => {
    const content = readFileSync(join(TEST_DIR, 'docs/features/main/sprints/sprint-1/corrections-sprint-1.md'), 'utf-8');
    expect(content).toContain('纠偏日志');
    expect(content).toContain('## CORR 条目');
    expect(content).toContain('## SIGNAL 占位');
  });

  it('increments sprint number', () => {
    ptNewSprint();
    expect(existsSync(join(TEST_DIR, 'docs/features/main/sprints/sprint-2/spec.md'))).toBe(true);
  });
});

describe('pt status', () => {
  beforeAll(() => {
    setupTestDir('status');
    ptInit();
  });
  afterAll(() => { teardownTestDir(); });

  it('displays sprint story status', () => {
    const output = captureOutput(() => ptStatus());
    expect(output).toContain('Sprint 1');
    expect(output).toContain('Story-001');
    expect(output).toContain('[ ]');
  });

  it('shows [x] for completed stories', () => {
    const roadmapPath = join(TEST_DIR, 'docs/features/main/ROADMAP.md');
    let content = readFileSync(roadmapPath, 'utf-8');
    content = content.replace('[ ] Story-001', '[x] Story-001');
    writeFileSync(roadmapPath, content);

    const output = captureOutput(() => ptStatus());
    expect(output).toContain('[x] Story-001');
  });
});

describe('pt progress', () => {
  beforeAll(() => {
    setupTestDir('progress');
    ptInit();
  });
  afterAll(() => { teardownTestDir(); });

  it('shows 0% for fresh project', () => {
    const output = captureOutput(() => ptProgress());
    expect(output).toContain('0%');
    expect(output).toContain('0/1');
  });

  it('shows 100% when all stories done', () => {
    const roadmapPath = join(TEST_DIR, 'docs/features/main/ROADMAP.md');
    let content = readFileSync(roadmapPath, 'utf-8');
    content = content.replace('[ ] Story-001', '[x] Story-001');
    writeFileSync(roadmapPath, content);

    const output = captureOutput(() => ptProgress());
    expect(output).toContain('100%');
    expect(output).toContain('1/1');
  });

  it('shows mixed story states', () => {
    const roadmapPath = join(TEST_DIR, 'docs/features/main/ROADMAP.md');
    let content = readFileSync(roadmapPath, 'utf-8');
    content = content.replace(
      '- [x] Story-001: <标题> — <简述>',
      '- [x] Story-001: 已完成\n- [~] Story-002: 进行中\n- [!] Story-003: 阻塞项 — API 不可用'
    );
    writeFileSync(roadmapPath, content);

    const output = captureOutput(() => ptProgress());
    expect(output).toContain('~1');
    expect(output).toContain('❗1');
  });
});

describe('pt template', () => {
  it('rejects unknown names and lists valid ones', () => {
    const output = captureOutput(() => ptTemplate('unknown-template'));
    expect(output).toContain('未知模板');
    expect(output).toContain('product-vision');
    expect(output).toContain('ROADMAP');
    expect(output).toContain('spec');
  });

  it('outputs spec template with all sections', () => {
    const output = captureOutput(() => ptTemplate('spec'));
    expect(output).toContain('doc: spec');
    expect(output).toContain('## 1. 用户旅程');
    expect(output).toContain('## 2. 验收标准');
  });

  it('returns content for all 7 templates', () => {
    const names = ['product-vision', 'ROADMAP', 'architecture', 'ui-design-system', 'spec', 'acceptance', 'corrections'];
    for (const name of names) {
      const output = captureOutput(() => ptTemplate(name));
      expect(output.length).toBeGreaterThan(0);
    }
  });
});

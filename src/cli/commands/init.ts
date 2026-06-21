import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getTemplateContent } from '../lib/project';

const FEATURE_SLUG = 'main';
const TODAY = new Date().toISOString().split('T')[0];

function fillTemplate(template: string | null, fallback: string): string {
  if (!template) return fallback;
  return template
    .replace(/<feature-slug>/g, FEATURE_SLUG)
    .replace(/YYYY-MM-DD/g, TODAY);
}

export function ptInit(): void {
  const cwd = process.cwd();

  console.log('=== Product Trace 初始化 ===');
  console.log();

  const dirs = [
    `docs/features/${FEATURE_SLUG}/sprints`,
  ];

  for (const dir of dirs) {
    const fullPath = join(cwd, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
      console.log(`  ✅ ${dir}/`);
    } else {
      console.log(`  ⏭️  ${dir}/ (已存在)`);
    }
  }

  const files: Array<{ path: string; templateName: string; fallback: string }> = [
    {
      path: `docs/features/${FEATURE_SLUG}/product-vision.md`,
      templateName: 'product-vision',
      fallback: `---
doc: product-vision
feature: ${FEATURE_SLUG}
version: 1.0
status: draft
last-updated: ${TODAY}
pivot-count: 0
---

# <产品/Feature 名称>

## 1. 问题与机会
## 2. 产品定位
## 3. MVP 范围
## 4. 核心概念模型
## 5. 关键风险与技术可行性
## 6. 变更记录
`,
    },
    {
      path: `docs/features/${FEATURE_SLUG}/ROADMAP.md`,
      templateName: 'ROADMAP',
      fallback: `---
doc: ROADMAP
feature: ${FEATURE_SLUG}
version: 1.0
status: draft
last-updated: ${TODAY}
current-sprint: Sprint 1
open-corrections: 0
---

# ROADMAP — <项目名称>

> 最后更新: ${TODAY}
> 当前 Sprint: Sprint 1 ← current

## 工作流状态
- Discover: ⬜
- Plan: ⬜
- Sprint 1: ← current

## Sprint 1: <Sprint Goal>
- [ ] Story-001: <标题> — <简述>

## Backlog
`,
    },
  ];

  for (const { path: filePath, templateName, fallback } of files) {
    const fullPath = join(cwd, filePath);
    if (!existsSync(fullPath)) {
      const template = getTemplateContent(templateName);
      const content = fillTemplate(template, fallback);
      writeFileSync(fullPath, content);
      console.log(`  ✅ ${filePath}`);
    } else {
      console.log(`  ⏭️  ${filePath} (已存在)`);
    }
  }

  // Create .gitignore to exclude session tracking file
  const gitignorePath = join(cwd, '.gitignore');
  if (!existsSync(gitignorePath)) {
    writeFileSync(gitignorePath, '.pt-session\n');
    console.log('  ✅ .gitignore');
  } else {
    const { readFileSync } = require('fs');
    const existing = readFileSync(gitignorePath, 'utf-8');
    if (!existing.includes('.pt-session')) {
      writeFileSync(gitignorePath, existing.trimEnd() + '\n.pt-session\n');
      console.log('  ✅ .gitignore (已追加 .pt-session)');
    }
  }

  console.log();
  console.log('初始化完成。下一步:');
  console.log('  1. 编辑 product-vision.md');
  console.log('  2. 运行 /product-trace-discover 开始 Discover');
}

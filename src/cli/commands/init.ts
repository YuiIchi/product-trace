import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const FEATURE_SLUG = 'main';
const TODAY = new Date().toISOString().split('T')[0];

function getRoadmapTemplate(): string {
  return `---
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
`;
}

function getVisionTemplate(): string {
  return `---
doc: product-vision
feature: ${FEATURE_SLUG}
version: 1.0
status: draft
last-updated: ${TODAY}
pivot-count: 0
---

# <产品/Feature 名称>

## 1. 问题与机会
- 谁的什么问题
- 他们现在怎么解决的
- 为什么现有方案不够

## 2. 产品定位
- 一句话定位
- 核心价值主张
- 目标用户（一句话画像）

## 3. MVP 范围
| 维度 | 包含 | 不包含 |
|:--|:--|:--|
| 用户 | ... | ... |
| 功能 | ... | ... |
| 平台 | ... | ... |

## 4. 核心概念模型
2-3 个关键领域概念及其关系。

## 5. 关键风险与技术可行性
- 最大的技术/市场/资源风险，附缓解策略
- Go / No-Go / Conditional Go 建议

## 6. 变更记录
| 版本 | 日期 | 变更内容 | 触发原因 |
|:--|:--|:--|:--|
`;
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

  const files: Record<string, string> = {
    [`docs/features/${FEATURE_SLUG}/product-vision.md`]: getVisionTemplate(),
    [`docs/features/${FEATURE_SLUG}/ROADMAP.md`]: getRoadmapTemplate(),
  };

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = join(cwd, filePath);
    if (!existsSync(fullPath)) {
      writeFileSync(fullPath, content);
      console.log(`  ✅ ${filePath}`);
    } else {
      console.log(`  ⏭️  ${filePath} (已存在)`);
    }
  }

  console.log();
  console.log('初始化完成。下一步:');
  console.log('  1. 编辑 product-vision.md');
  console.log('  2. 运行 /product-trace-discover 开始 Discover');
}

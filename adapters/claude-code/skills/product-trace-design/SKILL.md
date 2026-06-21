---
name: product-trace-design
description: Sprint 详细设计。当 ROADMAP 当前 Sprint 有 Story 待展开时 MUST 使用此 SKILL。展开用户旅程、验收标准、数据模型、Task 拆解。产出 sprint-N/spec.md——Sprint 内唯一执行手册。关键词：用户旅程、验收标准、AC、数据模型、Task拆解、Sprint设计。
---

# Product Trace — Design（Sprint 设计）

## 背景知识

Design 是 Product Trace 链条的第三环——把 ROADMAP 中的 Story 展开成可执行、可验收的 spec.md。

```
ROADMAP.md  →  sprint-N/spec.md  →  代码
                  ← 你现在做这个
```

**spec.md 是这个 Sprint 唯一的执行手册**。后续 Build 和 Verify 都只参考这个文件。

## 可用工具

| 命令 | 用途 |
|:--|:--|
| `pt new-sprint` | 创建 sprint-N/ 目录结构（spec.md + corrections 文件） |
| `pt template spec` | 输出 spec.md 模板 |

通过 Write 工具写入 `docs/features/<feature>/sprints/sprint-N/spec.md`。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| 用户旅程 | 从用户视角描述本 Sprint 的完整交互流，每个场景含步骤、状态（Loading/Empty/Error/Edge） |
| 验收标准（AC） | 可测试的完成条件，每条必须附验证方式（命令或手动步骤） |
| 数据模型 | 本 Sprint 新增/变更的实体和字段 |
| Task | 实施拆解的最小单位，一个 Task = 一个可独立验证的功能增量 |

## 执行流程

### Step 1：了解当前状态

运行 `pt session-start` 确认当前 Sprint。读取 ROADMAP 中当前 Sprint 的 Story 列表。如果上一 Sprint 有 corrections 日志，读取其中高频纠偏模式，在本 Sprint 主动强化对应方面。

### Step 2：创建 Sprint 目录

运行 `pt new-sprint`，自动创建 `sprint-N/spec.md` 和 `corrections-sprint-N.md`。

### Step 3：展开用户旅程

从用户视角描述本 Sprint 的交互流。每个场景包含：

```markdown
### 场景: <场景名>
**前置条件**: ...
**步骤**:
1. 用户做 X → 系统显示 Y
   - Loading: <行为>
   - Empty: <行为>
   - Error: <行为>
   - Edge: <边界情况>
```

**分段确认**：每写完一个场景，向用户确认"这个流程对吗？"

### Step 4：展开验收标准

每条 AC 格式：
```markdown
- [ ] AC-1: <可测试的描述>
  验证方式: <命令或手动步骤>
```

例如：
```markdown
- [ ] AC-1: 输入"买牛奶"回车后，任务出现在列表顶部
  验证方式: 单测 `addTask('买牛奶')` + 断言渲染结果第一项
```

覆盖所有状态：Loading / Empty / Error / Edge cases。

### Step 5：设计数据模型

列出本次 Sprint 新增/变更的实体和字段：

```markdown
| 实体 | 字段 | 类型 | 必填 | 说明 |
|:--|:--|:--|:--|:--|
| Task | id | string | ✅ | crypto.randomUUID() |
```

### Step 6：拆解 Task

每个 Story 拆成 1-3 个 Task：
```markdown
### Story-001: <标题>
#### Task 1: <标题>
- 目标: 一句话
- 涉及文件: `src/store.ts`
- 完成标准: 单测 pass，addTask 返回 Task 对象
```

### Step 7：技术方案（如需）

本 Sprint 有架构级决策时写 §5 技术方案。非架构级省略。

### Step 8：交接下一步

spec.md 写完后告知用户下一步用 `/product-trace-build` 开始实现。

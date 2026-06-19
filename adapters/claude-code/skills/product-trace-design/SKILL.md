---
name: product-trace-design
description: 当 ROADMAP 当前 Sprint 有 Story 待展开时使用。展开用户旅程、验收标准、数据模型、Task 拆解。产出 sprint-N/spec.md — Sprint 内唯一执行手册。
---

# Product Trace: Design

## 目标

把 ROADMAP 当前 Sprint 的 Story 展开为 `docs/features/<feature>/sprints/sprint-N/spec.md`。**这是 Sprint 内唯一的执行手册。**

## 你的角色

你是 UX 设计师 + 技术设计。你的任务是定义"怎么做才算对"。**不要写模糊的验收标准。**

## 前置条件

- ROADMAP.md 存在，当前 Sprint 有 Story
- 上一 Sprint 的 corrections-sprint-(N-1).md 可读（用于预防性强化）

## 流程

### Step 1: 预防性强化

读上一 Sprint 的 corrections。如果高频出现同类问题（如 3 个 L1 都是关于错误态遗漏），本 Sprint spec 主动补强。

### Step 2: 展开用户旅程（§1）

从用户视角描述本 Sprint 的完整交互流。一个场景一个场景写：

```markdown
### 场景: <场景名>
**前置条件**: ...
**步骤**:
1. 用户做 X → 系统显示 Y
2. 用户做 A → 系统做 B
   - Loading: <行为>
   - Empty: <行为>
   - Error: <行为>
   - Edge: <边界情况>
```

**分段确认**：每个场景写完后确认。

### Step 3: 展开验收标准（§2）

每条 AC 必须：
- 可测试的描述（不是"用户体验好"）
- 附 `验证方式: <命令或手动步骤>`
- 覆盖所有状态（Loading/Empty/Error/Edge）

### Step 4: 设计数据模型（§3）

只列本次 Sprint 新增/变更的字段。

### Step 5: 拆解实施 Task（§4）

每个 Task 要求：
- **目标一句话**
- **涉及文件路径**（确切路径）
- **完成标准**（可验证）
- 粒度：一个 Task = 一个可独立验证的功能增量，不是 2 分钟的微步骤

### Step 6: 技术方案（§5，如需）

本次有架构级决策时写。非架构级省略本节。

### Step 7: 分段确认

用户旅程 → AC → 数据模型 → Task → 技术方案。每段确认。

## 不使用 SubAgent

spec 内部紧耦合：用户旅程驱动 AC 驱动数据模型驱动 Task。必须一个人写完保证自洽。

## 产出

- `sprint-N/spec.md`（含 7 个章节）
- `sprint-N/corrections-sprint-N.md`（空模板，含 CORR 条目 + SIGNAL 占位段）

## 模板

`pt template spec` / `pt template corrections`

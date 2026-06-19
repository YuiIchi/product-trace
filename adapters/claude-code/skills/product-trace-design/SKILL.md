---
name: product-trace-design
description: 引导 Sprint 设计 — 用户旅程、验收标准、数据模型、Task 拆解。产出 sprint-N/spec.md。
---

# Product Trace: Design

## 目标

把 ROADMAP 当前 Sprint 的 Story 展开为可执行、可验收的 sprint-N/spec.md。

## 你的角色

你是 UX 设计师 + 技术设计。你负责把"做什么"变成"怎么做才算对"。

## 前置条件

- ROADMAP.md 存在，当前 Sprint 有 Story
- corrections-sprint-(N-1).md 可读（预防性强化）

## 流程

### Step 1: 预防性强化

读上一 Sprint 的 corrections。如果高频出现同类问题（如 3 个 L1 都是关于错误态的），本 Sprint spec 主动补强。

### Step 2: 展开用户旅程

从用户视角描述本 Sprint 的完整交互流：
- 场景名 + 前置条件
- 步骤: 用户做 X → 系统显示 Y
- 每步的状态: Loading / Empty / Error / Edge

**这是你内化的 Superpowers brainstorming 技巧**：分段确认，一次只写一个场景。

### Step 3: 展开验收标准

每条 AC 必须：
- 可测试的描述
- 附验证方式（命令或手动步骤）
- 不允许"用户体验好"这种不可测描述

### Step 4: 设计数据模型

只列出本次 Sprint 新增/变更的字段和关系。

### Step 5: 拆解实施 Task

**每个 Task 要求**：
- 目标一句话
- 涉及文件路径（确切）
- 完成标准（可验证）
- 粒度：一个 Task = 一个可独立验证的功能增量（不是 2 分钟的微步骤）

### Step 6: 技术方案（如需）

本次有架构级决策时写，非架构级省略。

### Step 7: 分段确认

用户旅程 → AC → 数据模型 → Task 拆解 → 技术方案。每段确认。

## 不使用 SubAgent

spec 内部紧耦合：用户旅程驱动 AC 驱动数据模型驱动 Task。你一个人写完保证自洽。

## 产出

`docs/features/<feature>/sprints/sprint-N/spec.md` + `corrections-sprint-N.md`(空)。

## 模板

spec.md 和 corrections 模板在 `templates/`。

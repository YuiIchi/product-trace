---
name: product-trace-plan
description: 当 product-vision.md 完成且 Go 决策后使用。功能拆分、优先级排序、Sprint 划分、技术架构设计。产出 ROADMAP.md（含 checkbox 进度）和 architecture.md。
---

# Product Trace: Plan

## 目标

把 product-vision.md 转化为 `docs/features/<feature-slug>/ROADMAP.md` — **全项目唯一的规划和进度真相源**。所有 Story 初始 `[ ]`。

## 你的角色

你是架构师 + PM。你的任务是拆分功能、排优先级、划 Sprint、定架构。**不要一个 Sprint 塞太多**。

## 前置条件

- product-vision.md 存在且 `status: stable`
- 用户已明确说 Go

## 流程

### Step 1: 功能拆分

从 vision 的 MVP 范围提取功能点。每个功能能用一个 Story 描述，含一句话交付物。

### Step 2: 优先级排序

P0/P1/P2/P3 + 依赖关系：
- P0: 不做的代价 > 做的代价
- 有依赖的功能放相邻 Sprint

### Step 3: Sprint 划分

- 按用户体验段组织（每个 Sprint 交付一段可独立验收的体验）
- 每个 Sprint 有明确 Goal（一句话能说清交付后用户能干什么）
- **第一个 Sprint 最小但完整**（能独立演示）
- 2-4 个 Story 一个 Sprint

### Step 4: 分段确认

功能拆分 → 优先级 → Sprint 划分 → 架构，每段确认后再继续。

### Step 5: 写入 ROADMAP.md

- 所有 Story checkbox: `[ ]`
- 更新 `## 工作流状态` 段
- Sprint 1 标记 `← current`

### Step 6: 架构文档（如需）

有技术选型时创建 `architecture.md`，包含技术选型表（选择/理由/备选）和 ADR。无技术选型时跳过。

### Step 7: UI 规范（如需）

有前端时创建 `ui-design-system.md`，定义设计语言和组件库。无前端时跳过。

## Checkbox 语义

| 标记 | 含义 | 何时改 |
|:--|:--|:--|
| `[ ]` | 未开始 | Plan 时初始化 |
| `[~]` | 进行中 | Build 开始处理时 |
| `[x]` | 已完成 | Verify 验收通过后 |
| `[!]` | 阻塞 | 遇到阻塞时附原因 |

## 不使用 SubAgent

Plan 是决策密集型。所有决定互相关联，你一个人拿全貌。

## 模板

`pt template ROADMAP` / `pt template architecture` / `pt template ui-design-system`

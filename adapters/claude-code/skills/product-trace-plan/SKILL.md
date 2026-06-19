---
name: product-trace-plan
description: 引导 ROADMAP 规划 — 功能拆分、优先级排序、Sprint 划分、架构设计。
---

# Product Trace: Plan

## 目标

把 product-vision.md 转化为 ROADMAP.md — 全项目唯一的规划和进度真相源。

## 你的角色

你是架构师 + PM。你的任务是拆分功能、划 Sprint、定架构。

## 前置条件

- product-vision.md 存在且 status: stable
- Go 决策明确

## 流程

### Step 1: 功能拆分

从 vision 的 MVP 范围提取功能点：
- 拆到每个功能能用一个 Story 描述
- 每个 Story 一句话交付物

### Step 2: 优先级排序

按 P0/P1/P2/P3 + 依赖关系排序：
- P0: 不做的代价 > 做的代价
- 依赖链上的功能放相邻 Sprint

### Step 3: Sprint 划分

- 按用户旅程段组织（每个 Sprint 交付一段可验收的体验）
- 每个 Sprint 有明确的 Goal（一句话）
- 第一个 Sprint 最小但完整

### Step 4: 分段确认

功能拆分 → 优先级 → Sprint 划分 → 架构，每段确认。

### Step 5: 写入 ROADMAP.md

所有 Story 初始 checkbox: `[ ]`，工作流状态段更新。

### Step 6: 架构文档（如需）

有技术选型时创建 architecture.md，无技术选型时跳过。

### Step 7: UI 规范（如需）

有前端时创建 ui-design-system.md，无前端时跳过。

## Checkbox 语义

| 标记 | 含义 | 何时改 |
|:--|:--|:--|
| `[ ]` | 未开始 | Plan 时初始化 |
| `[~]` | 进行中 | Build 开始时 |
| `[x]` | 已完成 | Verify 通过后 |
| `[!]` | 阻塞 | 遇到阻塞时附原因 |

## 不使用 SubAgent

Plan 是决策密集型，所有决定互相关联。你一个人拿全貌。

## 模板

ROADMAP.md、architecture.md、ui-design-system.md 模板在 `templates/`。

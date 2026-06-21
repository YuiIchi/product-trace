---
name: product-trace-plan
description: 产品规划。当 product-vision.md status: stable 且用户已说 Go，但还没有 ROADMAP.md 或 ROADMAP 为 draft 时，MUST 使用此 SKILL。功能拆分→优先级排序→Sprint 划分→架构设计。产出 ROADMAP.md（含 checkbox）和 architecture.md。关键词：规划、Roadmap、Sprint、Story、优先级、架构。
---

# Plan — 产品规划

Product Trace 第二环：把 vision 转化为可执行的 ROADMAP.md。ROADMAP 是全项目唯一真相源——同时承担功能清单+优先级+Sprint 划分+进度跟踪四职责。

## 前置条件

- product-vision.md 存在且 status: stable，用户已说 Go
- ROADMAP.md 不存在或为 draft

## 工具

| 命令 | 用途 |
|:--|:--|
| `pt template ROADMAP` | 输出 ROADMAP 模板 |
| `pt template architecture` | 输出 architecture 模板 |

产出：`docs/features/<feature-slug>/ROADMAP.md`、`architecture.md`（如需）

## 关键概念

- Story：可独立交付的功能增量，格式 `Story-001: <标题>`
- Sprint：一组 Story，有明确 Goal（一句话），按用户旅程段组织
- Checkbox：`[ ]` 未开始 / `[~]` 进行中 / `[x]` 已完成 / `[!]` 阻塞

## 执行

**Step 1**：读 vision，确认 status: stable 和 Go。

**Step 2**：功能拆分。从 MVP 范围提取功能点，逐个写成 Story。

**Step 3**：优先级排序 P0/P1/P2/P3。有依赖的放同一或相邻 Sprint。向用户确认。

**Step 4**：Sprint 划分。每 Sprint 2-5 Story，第一 Sprint 最小但完整。向用户确认。

**Step 5**：写入 ROADMAP.md。所有 Story `[ ]`，Sprint 1 heading 加 `← current`，frontmatter `current-sprint: Sprint 1`。

**Step 6**：有技术选型时写 architecture.md（技术选型表 + ADR）。无选型跳过。

## 完成后

ROADMAP 写入且用户确认 → 引导用户进入 `/product-trace-design` 展开当前 Sprint 的 spec.md。

---
name: product-trace-new-requirement
description: 新需求门控。当 Sprint 进行中有新需求到达、不属于当前 Sprint 范围时 MUST 使用此 SKILL。判定增量/新Feature/紧急，插入正确的流程位置。更新 ROADMAP.md。关键词：新需求、增量、紧急、Feature、Backlog、门控。
---

# New Requirement — 新需求门控

Product Trace 旁路：Sprint 进行中来了新需求，分级判定后插入正确位置。不让新需求无声溜进 Sprint。

## 前置条件

- Sprint 正在执行中
- 新需求不属于当前 Sprint 已有 Story

## 三级

| 判定 | 处理 |
|:--|:--|
| **增量**：不改变方向/用户/架构 | 定位归属→加入 Backlog(P1/P2) 或下 Sprint |
| **新 Feature**：独立模块/新用户/架构变 | 开独立 `docs/features/<new>/`→完整 `/product-trace-discover` |
| **紧急**：线上问题/阻塞发布 | 插入当前 Sprint spec→ROADMAP `[!]`→显式记录代价 |

## 执行

**增量**：定位是否已有 Story 可扩展→正常优先级入 Backlog→Edit ROADMAP。

**新 Feature**：`docs/features/<new-slug>/` 创建目录→引导用户 `/product-trace-discover`→在主 ROADMAP 加 Feature Tracks 交叉引用。

**紧急**：spec 加 Story-Hotfix，ROADMAP `[!]` 附原因。必须记录代价——"原 Story-X 延期至 Sprint N+1"。

## 完成后

ROADMAP 更新 → 回到当前 Sprint Build（增量/紧急）或新 Feature Discover 流程。

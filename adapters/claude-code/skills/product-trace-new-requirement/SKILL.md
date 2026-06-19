---
name: product-trace-new-requirement
description: 新需求门控 — 判定增量/新Feature/紧急，插入正确流程位置。
---

# Product Trace: New Requirement

## 目标

新需求到达时，按影响范围分级处理，插入正确的流程位置。

## 你的角色

你是门控。你判断新需求该走哪个流程、插在哪里、代价是什么。

## 三级处理

| 级别 | 判定 | 流程 |
|:--|:--|:--|
| 增量 | 不改变产品方向、不新增用户类型 | 定位归属 Story → Backlog 或下 Sprint |
| 新 Feature | 独立产品模块、新用户类型 | 完整走 Discover → Plan |
| 紧急 | 线上问题、阻塞发布 | 插入当前 Sprint → [!] + 记录代价 |

## 流程

### 增量

1. 定位：对应 ROADMAP 哪个已有 Story？还是新 Story？
2. 正常优先级 → Backlog (P1/P2)
3. 更新 ROADMAP.md

### 新 Feature

1. 完整走 product-trace-discover → product-trace-plan
2. 独立 product-vision.md
3. 更新 ROADMAP（新 Feature 区块）

### 紧急

1. 插入当前 Sprint spec.md
2. ROADMAP 标记 `[!]`
3. **显式记录代价**：原计划 Story-X 延期到 Sprint N+1
4. 更新 ROADMAP + spec

## 不做的事

- 不让增量绕开 Discover（至少轻量判定）
- 不让紧急无声插入（必须记录代价）
- 不在 Sprint 中途随便加 Story（紧急是唯一例外）

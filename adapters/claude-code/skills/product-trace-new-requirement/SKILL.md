---
name: product-trace-new-requirement
description: 当有新需求到达且不属于当前 Sprint 时使用。判定增量/新Feature/紧急，分级处理，插入正确的流程位置。更新 ROADMAP.md。
---

# Product Trace: New Requirement

## 目标

新需求到达时，按影响范围分级，插入正确的流程位置。**不让新需求无声溜进 Sprint。**

## 你的角色

你是门控。判断新需求该走哪个流程、插在哪里、代价是什么。

## 三级处理

| 级别 | 判定 | 流程 |
|:--|:--|:--|
| **增量** | 不改变产品方向、不新增用户类型、不改变架构 | 定位归属 → Backlog 或下 Sprint |
| **新 Feature** | 独立产品模块、新用户类型、架构变化 | 完整 Discover → Plan |
| **紧急** | 线上问题、阻塞发布 | 插入当前 Sprint → [!] + 记录代价 |

## 流程

### 增量处理

1. 定位：对应 ROADMAP 哪个已有 Story？还是新 Story？
2. 正常优先级 → Backlog (P1/P2)
3. 紧急 P0 → 插入当前 Sprint spec.md
4. 更新 ROADMAP.md

### 新 Feature 处理

1. 完整走 **product-trace-discover** → 产出 product-vision.md
2. 走 **product-trace-plan** → 独立 ROADMAP（低耦合时）或合并到现有 ROADMAP

### 紧急处理

1. 插入当前 Sprint spec.md
2. ROADMAP 标记 `[!]`
3. **显式记录代价**："因紧急需求插入，原计划 Story-X 延期到 Sprint N+1"
4. 更新 ROADMAP + spec

## 不做的事

- ❌ 不让增量绕开任何门控（至少轻量判定）
- ❌ 不让紧急需求无声插入（必须记录代价和影响）
- ❌ 不在 Sprint 中途随便加 Story（紧急是唯一例外）

---
name: product-trace-new-requirement
description: 新需求门控。当开发过程中有新需求到达（不属于当前 Sprint）时 MUST 使用此 SKILL。你将判定增量/新Feature/紧急，按级别插入正确的流程位置。更新 ROADMAP.md。关键词：新需求、增量、紧急需求、Feature、Backlog、门控。
---

# Product Trace — New Requirement（新需求门控）

## 背景知识

在 Sprint 进行中，经常会有新需求进来。不是所有新需求都应该直接插入当前 Sprint。New Requirement 是新需求的门控——分级处理。

## 可用工具

| 命令 | 用途 |
|:--|:--|
| `pt session-start` | 读取当前上下文 |
| `pt status` | 查看当前 Sprint 状态 |

通过 Read 工具读取 ROADMAP.md。通过 Edit 工具更新 ROADMAP 和 spec。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| 增量需求 | 不改变产品方向、不新增用户类型、不改变架构。如"加个搜索功能" |
| 新 Feature | 独立产品模块、新用户类型、架构变化。如"加用户认证系统" |
| 紧急需求 | 线上问题、阻塞发布。如"保存按钮不工作了" |
| `[!]` 标记 | ROADMAP 中因阻塞或紧急插入而标记的 Story，需附原因 |

## 执行流程

### Step 1：判定级别

收到新需求后，判断属于哪级：

| 判定条件 | 级别 | 处理方式 |
|:--|:--|:--|
| 不改变产品方向、不新增用户类型、不改变架构 | 增量 | 加入 Backlog 或下个 Sprint |
| 独立模块、新用户类型、架构变化 | 新 Feature | 走完整 Discover → Plan |
| 线上问题、阻塞当前发布 | 紧急 | 插入当前 Sprint，标记 `[!]` |

向用户确认判定结果。

### Step 2：增量处理

1. 定位：对应 ROADMAP 中哪个已有 Story？还是新 Story？
2. 正常优先级 → 加入 Backlog，标注 P1/P2
3. 用 Edit 更新 ROADMAP.md

### Step 3：新 Feature 处理

1. 在 `docs/features/<new-feature-slug>/` 下创建独立文档目录
2. 告知用户用 `/product-trace-discover` 开始新 Feature 的 Discover
3. 在现有 ROADMAP 中加一段 `## Feature Tracks` 交叉引用新 Feature 的 ROADMAP

### Step 4：紧急处理

1. 将需求作为新 Story 插入当前 Sprint 的 spec.md
2. 在 ROADMAP 中标记 `[!]` 并注明阻塞原因
3. 显式记录代价："因紧急需求 Story-Hotfix 插入，原 Story-X 延期到 Sprint N+1"
4. 用 Edit 更新 ROADMAP.md 和 spec.md

---
name: product-trace-new-requirement
description: 新需求门控。当开发过程中有新需求到达（不属于当前 Sprint）时 MUST 使用此 SKILL。你将判定增量/新Feature/紧急，按级别插入正确的流程位置。更新 ROADMAP.md。关键词：新需求、增量、紧急需求、Feature、Backlog、门控。
---

# Product Trace — New Requirement（新需求门控）

## Product Trace 是什么

Product Trace 是一套产品研发追踪框架。它把产品从想法到交付的全过程，用一套相互引用的文档和 CLI 命令串成可追踪的链——任何时候进入会话，Agent 都能自动知道项目是什么、做到哪了、该做什么。

### 完整工作流（7 个 SKILL）

```
  Discover  →  Plan  →  Design  →  Build  →  Verify
  (vision)    (ROADMAP)  (spec)    (代码)    (验收报告)

  旁路 1: Build 中发现设计偏差 → Correct（L0-L3 分级纠偏 + CORR 留痕）
  旁路 2: 任何阶段新需求到达 → New Requirement（增量/Feature/紧急 三级门控）
```

每个 SKILL 有明确的前置条件和交接点。你当前是链条的第一环——**Discover**。

### 文档体系

所有文档存在 `docs/features/<feature-slug>/` 下，一条链递进：

| 文件 | 谁产出 | 作用 | 生存周期 |
|:--|:--|:--|:--|
| `product-vision.md` | Discover | 为什么做：问题、定位、MVP 范围、Go/No-Go | 极少改，pivot 时归档 |
| `ROADMAP.md` | Plan | 做什么+做到哪了：功能和进度的唯一真相源。全项目只有这一份 | 每次会话更新 checkbox |
| `architecture.md` | Plan | 技术架构：选型、数据模型、ADR | 架构变更时更新 |
| `sprint-N/spec.md` | Design | 怎么做才算对：用户旅程、AC、数据模型、Task 拆解 | Sprint 内活跃，完成后归档 |
| `acceptance/vN.md` | Verify | 验收报告：逐 AC 验证结果+证据+漂移审计 | Sprint 完成时产出 |
| `corrections-sprint-N.md` | Build/Verify 中 | 纠偏日志：CORR 条目 + SIGNAL 占位 | Sprint 内追加 |

### pt CLI 命令

所有命令通过 Bash 工具执行。`pt` 已全局安装。

| 命令 | 用途 | 常用场合 |
|:--|:--|:--|
| `pt init` | 初始化项目的 docs/ 目录结构和模板 | 新项目第一步 |
| `pt session-start` | 读取 ROADMAP + spec，输出当前 Sprint/Story/漂移 | 每次进入会话 |
| `pt session-stop` | git diff + 强制对账三问 | 每次退出会话 |
| `pt status` | 展示当前 Sprint、Story checkbox 状态、Backlog | 随时查看进度 |
| `pt progress` | 进度条 + 各 Sprint 完成率统计 | 随时查看进度 |
| `pt new-sprint` | 创建 sprint-N/ 目录 + spec.md + corrections 模板 | 新 Sprint 开始 |
| `pt template <name>` | 输出指定模板内容 | 需要模板参考时 |

### 核心概念

| 概念 | 说明 | 在哪体现 |
|:--|:--|:--|
| Feature | 一个独立的产品模块，用 slug 命名（如 `todo-app`）。docs/ 下一个 feature 一个目录 | `docs/features/<feature-slug>/` |
| ROADMAP | **全项目唯一真相源**。同时承担功能清单+优先级+Sprint划分+进度跟踪四职责 | `ROADMAP.md`，每次 `pt session-start` 读取 |
| Sprint | 一组 Story 的集合，有一个一句话 Goal。按用户旅程段组织 | ROADMAP 的 `## Sprint N:` 段 |
| Story | 一个可独立交付的功能增量，格式 `Story-XXX: <标题>` | ROADMAP 中 `- [ ] Story-XXX: <标题>` |
| Checkbox 四态 | `[ ]` 未开始 → `[~]` 进行中 → `[x]` 已完成 → `[!]` 阻塞 | ROADMAP 每行 Story 前 |
| ← current | 标记当前活跃的 Sprint。frontmatter `current-sprint` 是真相源，heading 标记是装饰 | ROADMAP heading + frontmatter |
| spec.md | Sprint 的唯一执行手册。Build 和 Verify 只参考此文件 | `sprint-N/spec.md` |
| AC | 验收标准，每条必须附验证方式（命令或手动步骤），不可测试的描述不算 AC | spec §2 |
| CORR | 设计偏差记录。L0=技术细节/L1=AC/L2=Scope/L3=方向 | `corrections-sprint-N.md` |
| SIGNAL | Build 中临时标记，会话结束时升级为 CORR 或删除 | corrections 的 `## SIGNAL 占位` |
| Drift | 文档与代码现实之间的偏移。spec `last-verified-against.downstream` vs HEAD | `pt session-start` 自动检测 |
| Front-matter | 每个文档头部的 YAML 元数据，含 version/status/last-verified-against | 所有文档顶部 `---` 块 |


## → 你现在是 New Requirement——旁路门控，产出 ROADMAP.md，新需求到达时分级处理、插入正确流程位置。

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

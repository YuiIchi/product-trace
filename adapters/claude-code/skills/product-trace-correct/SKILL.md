---
name: product-trace-correct
description: 开发中纠偏。当实现过程中发现 spec/ROADMAP/vision 与实际情况不一致时 MUST 使用此 SKILL。按四级纠偏（L0-L3）分级处理，每次留 CORR 记录，按等级上行更新文档。关键词：纠偏、设计变更、CORR、SIGNAL、L0、L1、L2、L3、漂移。
---

# Product Trace — Correct（开发中纠偏）

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


## → 你现在是 Correct——旁路纠偏，产出 corrections-sprint-N.md，发现偏差时分级处理、留痕更新。

## 可用工具

| 命令 | 用途 |
|:--|:--|
| `pt session-start` | 读取上下文 |
| `pt status` | 查看当前 Sprint 状态 |

通过 Write 工具更新受影响的文档（spec.md、ROADMAP.md、product-vision.md）。通过 Edit 工具追加 CORR 条目到 `corrections-sprint-N.md`。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| L0 技术细节 | 字段类型/命名/文件拆分/库选择等技术决策变化。上行到 spec §5 技术方案。30 秒处理，不中断 |
| L1 验收标准 | AC 遗漏或错误、交互状态缺漏、边界条件未覆盖。上行到 spec §1+§2 + 代码 + 测试。完成当前 Task 后处理 |
| L2 功能范围 | Story 拆/合/移、Sprint Goal 不可达成。上行到 ROADMAP Story + spec §4。立即停手 |
| L3 产品方向 | 目标用户错了/问题定义错了/MVP 范围错了。上行到 product-vision 全链路。回 Discover |
| CORR 条目 | 每次纠偏的记录，写在 `corrections-sprint-N.md` |
| SIGNAL 占位 | 临时标记，Build 中记下但不中断。会话结束时升级为 CORR 或删除 |

## CORR 条目格式

在 `corrections-sprint-N.md` 的 `## CORR 条目` 段追加：

```markdown
## CORR-SN-XXX
- 日期: YYYY-MM-DD
- 等级: L0 | L1 | L2 | L3
- 发现于: Task X 实现
- 触发: 一句话描述
- 影响: 文档 + 代码 + 测试
- 状态: applied | deferred | reverted
```

## 执行流程

### 1. CLASSIFY（分类）

问用户三个问题确定等级：
- "这个改动影响验收标准吗？"
- "这个改动影响其他 Story 吗？"
- "这个改动改变产品方向吗？"

全否→L0 / 影响验收→L1 / 影响Story→L2 / 影响方向→L3。**必须等用户确认。**

### 2. GATE（闸门）

按等级执行：
- L0 🟢：继续，30 秒改完 spec §5 + 记 CORR
- L1 🟡：完成当前 Task 到可编译状态，然后处理
- L2 🔴：立即停止编码
- L3 ⚫：退出 Build，回 Discover

### 3. SCOPE（影响范围）

列出受影响文档和代码。向用户确认。

### 4. PROPAGATE（按序更新）

按上游→下游顺序：
- **L0**：更新 spec §5 → 记 CORR
- **L1**：spec §1+§2 → 重构代码/测试 → spec version bump → CORR
- **L2**：ROADMAP 重排 → spec §4 重写 → 已写代码评估 → ROADMAP version bump → CORR
- **L3**：归档旧 vision（加 `-archived` 后缀）→ 重新 product-trace-discover → product-trace-plan

### 5. LOG（留痕）

追加 CORR 条目到 `corrections-sprint-N.md`。

### 6. RE-VALIDATE

列出需要重新验证的 AC。如果已有验收报告，标记受影响的 AC 行。

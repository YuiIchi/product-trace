---
name: product-trace-build
description: Sprint 开发实现。当 sprint-N/spec.md 就绪时 MUST 使用此 SKILL。你将按 spec 的 Task 拆解逐项实现：先写测试→确认失败→最小实现→确认通过→重构。每 Story 完成后自检漂移并审查。更新 ROADMAP checkbox。关键词：TDD、实现、开发、测试、代码审查、checkbox。
---

# Product Trace — Build（Sprint 开发）

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


## → 你现在是 Build——第四环，产出 代码，按 spec.md TDD 实现 Story。

## 可用工具

| 命令 | 用途 |
|:--|:--|
| `pt session-start` | 读取 ROADMAP 和 spec 当前状态 |
| `pt status` | 显示当前 Sprint 的 Story 进度 |
| `pt progress` | 显示进度条和各 Sprint 完成率 |
| `pt session-stop` | 收尾对账——强制三问（进度/纠偏/SIGNAL） |

通过 Bash 运行项目自身的构建/测试命令（如 `npm test`、`npm run build`）。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| TDD 节奏 | 红（写失败测试）→ 绿（最小实现）→ 重构（清理代码）。每一步必须验证 |
| SIGNAL 占位 | 实现中 spec 描述不准确时的临时标记，存在 `corrections-sprint-N.md` 的 `## SIGNAL 占位` 段。会话结束时升级为 CORR 或删除 |
| CORR | 确认的设计偏差记录。L0=技术细节/L1=验收标准/L2=功能范围/L3=产品方向 |
| 审查 | 每个 Story 完成后做两轮：spec 合规（多做少做？）和代码质量（命名/结构/边界） |

## 执行流程

### Step 1：恢复上下文

运行 `pt session-start`。确认当前 Sprint 和进行中的 Story。

### Step 2：按 Task 逐个实现

读取 `sprint-N/spec.md`，找到当前 Story 的第一个未完成 Task。每个 Task 按以下节奏：

1. **写测试**：在 `test/` 下写一个会失败的测试
2. **确认失败**：运行测试，确认它失败
3. **写实现**：在 `src/` 下写最小代码让测试通过
4. **确认通过**：运行测试，确认全部通过
5. **重构**：清理代码结构，保持测试绿
6. **标记完成**：在 spec.md 的 Task 前标记 `[x]`

每个 Task 完成后 git commit，commit message 格式 `feat: <Story-ID> <Task 简述>`。

### Step 3：每个 Story 完成后自检

一个 Story 的所有 Task 完成后：

1. 自检："spec 的用户旅程和验收标准还准吗？"
2. 准 → 更新 ROADMAP 中该 Story 的 checkbox 为 `[x]`
3. 不准 → 触发 `/product-trace-correct` 处理偏差

### Step 4：审查（每个 Story 完成后）

派两个独立 subagent（不继承当前会话上下文）：

- **审查 1 — spec 合规**：只给 spec.md + git diff。判断多做？少做？
- **审查 2 — 代码质量**：只给 git diff。判断命名、结构、边界。

审查发现的问题修复后重新审查。

### Step 5：全部 Story 完成后收尾

运行 `pt session-stop`。它输出本次变更的文件列表和三问：

1. 进度：哪些 checkbox 需要更新？
2. 纠偏：spec 还准吗？（A=准 B=L0 C=L1 D=L2 E=L3）
3. SIGNAL：本次标记的占位是否升级？

必须回答这三问。完成后告知用户下一步用 `/product-trace-verify` 独立验收。

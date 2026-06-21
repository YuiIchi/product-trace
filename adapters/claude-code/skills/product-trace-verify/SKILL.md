---
name: product-trace-verify
description: Sprint 独立验收。当 Sprint 所有 Story [x] 后 MUST 使用此 SKILL，且必须在新会话中运行。你将作为 QA，只对照 spec.md 的验收标准和代码实际行为逐条验证。产出 acceptance/vN.md。关键词：验收、QA、测试、AC、验收报告、漂移审计。
---

# Product Trace — Verify（独立验收）

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


## → 你现在是 Verify——第五环，产出 acceptance/vN.md，独立验收，只看 spec 和代码。

## 可用工具

| 命令 | 用途 |
|:--|:--|
| `pt session-start` | 读取上下文 + 漂移检测 |
| `pt template acceptance` | 输出 acceptance/vN.md 模板 |

通过 Bash 运行项目测试命令和手动验证脚本。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| 漂移审计 | 对比 spec 的 `last-verified-against.downstream` 和当前 HEAD。有差异时逐一检查是否有对应 CORR。无 CORR 的差异是 silent drift——阻塞通过 |
| 逐 AC 验收 | 每条验收标准独立验证，每条必须附证据（命令输出/截图/行为描述） |
| SubAgent 验收 | 每条 AC 派一个独立 subagent，只给 AC 文本+代码，不给 Build 上下文 |

## 执行流程

### Step 1：漂移审计

运行 `pt session-start`。查看漂移警告。

手动检查：spec.md frontmatter 的 `last-verified-against.downstream` vs `git log --oneline`。
- 0 差异 → 无漂移
- N 个 commit → 逐一检查每个 commit 是否有对应 CORR
- 有 CORR → 已记录漂移
- 无 CORR → silent drift → 阻塞通过

### Step 2：CORR 检查

查看 `corrections-sprint-N.md` 和 spec.md frontmatter 的 `open-corrections`。
- `open-corrections > 0` → 拒绝验收，需先关闭所有 CORR

### Step 3：逐条 AC 验收

读取 spec.md §2 的验收标准。每条 AC 启动一个独立 subagent 验证：

- 给 subagent 的内容：AC 文本 + spec 用户旅程背景 + 代码仓库路径
- subagent 输出：通过 / 不通过 + 证据

### Step 4：汇总验收报告

用 Write 写入 `docs/features/<feature>/sprints/sprint-N/acceptance/v1.md`：

```yaml
---
doc: acceptance
feature: <feature-slug>
sprint: N
version: 1
status: draft
spec-version-at-time: spec.md@v1.0
superseded-by: none
---
```

正文包含：
- `## 验收环境` — 分支/commit/日期
- `## 验收结果` — 每条 AC 的通过状态+验证方式+证据
- `## 漂移审计` — 结论
- `## 发现的问题` — 表格：问题/AC/严重度/状态
- `## 结论` — ✅ 通过 / ⚠️ 有条件通过 / ❌ 不通过

### Step 5：结论

全部 AC 通过后，ROADMAP 当前 Sprint 标题后加 `✅`。告知用户进入 Sprint 收尾。

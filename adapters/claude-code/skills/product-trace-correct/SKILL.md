---
name: product-trace-correct
description: 开发中纠偏。当实现过程中发现 spec/ROADMAP/vision 与实际情况不一致时 MUST 使用此 SKILL。按四级纠偏（L0-L3）分级处理，每次留 CORR 记录，按等级上行更新文档。关键词：纠偏、设计变更、CORR、SIGNAL、L0、L1、L2、L3、漂移。
---

# Product Trace — Correct（开发中纠偏）

## 背景知识

Correct 是 Product Trace 的纠偏机制——当实现中发现之前的设计不对时，不是默默改代码让文档烂掉，而是分级处理、留痕更新。

```
代码发现偏差 → CORR 记录 → 按等级上行更新文档
```

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

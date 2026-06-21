---
name: product-trace-design
description: Sprint 设计。当 ROADMAP 当前 Sprint 有 Story [ ] 待展开，但还没有 sprint-N/spec.md 或 spec 为 draft 时，MUST 使用此 SKILL。展开用户旅程→验收标准→数据模型→Task 拆解。产出 sprint-N/spec.md——Sprint 唯一执行手册。关键词：用户旅程、验收标准、AC、数据模型、Task拆解。
---

# Design — Sprint 设计

## 你的位置

前面 Plan 产出了路线图（ROADMAP.md），划分好了 Sprint，每个 Sprint 有一组 Story。现在是第三环——**把当前 Sprint 里那几条 Story，从一句话标题展开成一份详细的执行手册，让接下来做开发的人拿到这份手册就知道到底该做什么、怎么做才算对**。

这份执行手册叫 `docs/features/<feature>/sprints/sprint-N/spec.md`。它包含：用户完整的使用过程是怎样的、每个步骤有哪些状态要注意、做完之后怎么验证、数据要怎么存、代码怎么拆。之后 Build 和 Verify 阶段只参考这一份手册，不回查更上游的文档。

## 什么时候该用我

- ROADMAP 的当前 Sprint 有 Story 还是 `[ ]` 状态
- 对应 sprint-N/spec.md 还不存在或只有初始模板
- 如果 spec 已经写好——引导用户去 `/product-trace-build`

## 核心概念

- **用户旅程**：不是需求列表，是从用户视角走一遍——用户先看到什么、做了什么操作、系统怎么反应。每个场景要覆盖 Loading（加载中）/ Empty（空的）/ Error（出错了）/ Edge（边界情况）四种状态
- **验收标准（AC）**：做完的标准，每条必须可以测试。不能写"用户体验好"——那是意见不是标准。要写"输入'买牛奶'回车后，任务出现在列表顶部"
- **Task**：代码实现的拆分单位。一个 Task = 一个可独立验证的功能增量，通常对应一个函数或一个组件

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt new-sprint` | 创建 sprint-N 目录和 corrections 文件 |
| `pt template spec` | 输出执行手册的标准模板 |

## 一步步做

**1. 看上下文**：`pt session-start` 确认当前 Sprint。如果有上一 Sprint 的 corrections 日志，看里面有没有高频出现的问题——比如"上 Sprint 3 次纠偏都是因为错误态没考虑"，本 Sprint 就要主动补强。

**2. 创建目录**：`pt new-sprint` 自动创建 sprint-N/ 和 corrections 文件。

**3. 写用户旅程**：一个场景一个场景写。每个场景：前置条件是什么、用户一步步做了什么、系统每一步怎么反应。每写完一个场景向用户确认"这个流程对吗？"

**4. 写验收标准**：每条格式 `- [ ] AC-N: <可测试的描述> → 验证方式: <用什么命令或怎么手动验证>`。覆盖所有状态。

**5. 画数据模型**：列一张表——这个 Sprint 新增或修改了哪些数据字段、什么类型、必填吗。

**6. 拆 Task**：每个 Story 拆成 1-3 个 Task。每个 Task 写：目标一句话、改哪个文件、怎么算完成。

**7. 写技术方案**（如果需要）：只有这个 Sprint 涉及架构决策时才写，比如"选 A 库还是 B 库"。普通功能开发不需要这步。

## 做完之后

告诉用户："执行手册已就绪。下一步用 `/product-trace-build` 开始按手册写代码。"

---
name: product-trace-build
description: "Sprint开发阶段。执行手册(spec.md)就绪时 MUST 使用此 SKILL。你将按spec Task逐项开发——先写测试→确认失败→最小实现→确认通过→重构——每完成一个Story自检spec还准吗、派subagent做spec合规+代码质量双审查、更新roadmap checkbox进度。有前端时读ui-design-system用已有组件、读prototype对齐交互流。关键词：实现、开发、TDD、测试、checkbox。"
---

# Build — Sprint 开发

## 你的位置

前面 Design 产出了执行手册（spec.md）和 prototype/，Plan 产出了 UI 设计规范（ui-design-system.md）。现在你是第四环——**按这份手册把代码写出来，每做完一个功能增量就自检一次"手册还准吗"，不准就记录下来而不是偷偷改掉**。

有前端时，读 `ui-design-system.md`——所有组件必须来自组件库，不要自行造轮子。读 prototype/——交互流必须和原型一致。

代码写完不是终点——每个 Story 完成后要更新 roadmap 里的 checkbox（`[ ]` → `[x]`），让路线图的进度永远和现实同步。整个 Sprint 开发完成后退出的那一刻，要对账——改了什么、进度如何、有没有偏差没处理。

**文档链**：我产出代码 + 更新 ROADMAP checkbox + 维护 corrections-sprint-N.md → Verify 阶段读取 spec 验收标准，对照我的代码逐条独立验证。

## 什么时候该用我

- sprint-N/spec.md 已经写好（status: stable）
- ROADMAP 当前 Sprint 标注了 `← current`
- 如果 spec 还是 draft——先回 `/product-trace-design` 设计完
- 如果 Sprint 所有 Story 都 `[x]` 了——你该去 `/product-trace-verify` 验收了

## 核心概念

红→绿→重构——写每一个函数的三步曲：

1. **红**：先写一个会失败的测试。不写测试就不知道实现对不对
2. **绿**：写最少代码让测试通过。不要多写——测试没要求的就不做
3. **重构**：测试绿了之后，清理代码结构、命名、消除重复——保持测试绿

**自检**：每完成一个 Story，对照 spec 问自己"用户旅程还准吗？AC 还覆盖吗？"
**SIGNAL**：实现中发现 spec 描述不够准确时的临时标记，记在 corrections 文件里，不中断开发流程。会话结束时决定是否升级
**审查**：每个 Story 完成派两个独立的 subagent——一个检查"代码是不是按 spec 写的"（多做？少做？），一个检查"代码质量"（命名、结构、边界）

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt session-start` | 进入会话时看上下文 |
| `pt status` | 看 Story 进度 |
| `pt progress` | 看进度条和完成率 |
| `pt session-stop` | 退出会话时对账——改了什么？spec 还准吗？有没处理的偏差吗？ |

Bash 用来跑项目的测试和构建命令。

## 一步步做

**1. 进上下文**：`pt session-start`，确认当前 Sprint 和进行中的 Story。

**2. 按 Task 逐个做**：读 spec.md 找到当前 Story 第一个未完成的 Task。对每个 Task：红→绿→重构→Task [x]→git commit。

**3. 每 Story 完成后自检**：spec 还准吗？准→更新 ROADMAP checkbox `[x]`。不准→触发 `/product-trace-correct`。

**4. 每 Story 完成后审查**：派独立 subagent 做 spec 合规检查（spec+diff，多做/少做？）和代码质量检查（diff，命名/边界）。发现的问题修了再查。

**5. 发现偏差时**：小改动记 SIGNAL 占位；涉及验收标准或范围的大改动立即触发 `/product-trace-correct`。

**6. 全部 Story 完成后**：`pt session-stop`——回答三个必答题：进度更新、spec 还准吗（A=准/B=L0/C=L1/D=L2/E=L3）、SIGNAL 升级吗。

## 做完之后

所有 Story [x] + pt session-stop 对账完成 → 告诉用户："开发完成。下一步在新会话中用 `/product-trace-verify` 做独立验收。"

---
name: product-trace-verify
description: "Sprint验收阶段。Sprint所有Story完成后 MUST 在新会话中使用此SKILL——不得继承Build上下文。六维独立验收：功能正确(逐AC)、方向偏离(spec合规审查)、代码质量(全量测试)、文档漂移(审计)、UI规范(design-system)、原型一致(prototype对比)。先出报告让用户确认，用户确认后才标记Sprint完成。关键词：验收、QA、AC、漂移审计、UI规范、原型验证。"
---

# Verify — Sprint 验收

## 你的位置

前面 Build 已经把 Sprint 的代码写完了。你是最后一环——**以独立 QA 的身份进来，不从开发者那里继承任何上下文**。你的任务不是改代码，而是对照 spec 判断：做对了吗？做全了吗？有悄悄偏离的地方吗？UI 还符不符合规范？跟原型一致吗？

验收通过后 Sprint 才算真正完成。但**你不能替用户决定通过**——先出报告，用户确认。

**文档链**：我产出 acceptance/vN.md + 用户确认后标记 Sprint ✅ → Sprint 关闭。

## 什么时候该用我

- Sprint 所有 Story 都是 `[x]`
- **必须在全新会话中运行**
- spec.md 的 `open-corrections` 必须为 0

## 六维验收

| # | 维度 | 检查什么 | 怎么查 |
|:--|:--|:--|:--|
| 1 | 功能正确 | spec AC 是否通过 | SubAgent 逐 AC 验证，每条附证据 |
| 2 | 方向偏离 | 实现是否和 spec 一致 | spec 合规审查：多做？少做？ |
| 3 | 代码质量 | 测试是否全量通过 | 跑项目全量测试 |
| 4 | 文档漂移 | spec 和代码之间有无未记录差异 | 漂移审计：downstream vs HEAD |
| 5 | UI 规范 | 是否遵守 ui-design-system | 组件/色彩/间距/交互是否符合规范（有前端时） |
| 6 | 原型一致 | 是否和 prototype 一致 | 截图对比原型（有前端时） |

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt session-start` | 进入时看上下文 + 检测漂移 |
| `pt template acceptance` | 输出验收报告模板 |

Bash 跑项目测试命令和手动验证步骤。

## 一步步做

**1. 漂移审计**：`pt session-start` + 手动对比 spec `downstream` vs `git log`。每个新增 commit 都有对应 CORR 吗？没有→silent drift→阻塞，先处理再继续。

**2. CORR 检查**：spec `open-corrections > 0` → 拒绝验收。

**3. 全量测试**：跑项目测试命令。不通过→记录到报告，修复后重跑。

**4. 逐 AC 验收**：每条 AC 派独立 subagent——只给 AC 文本和代码路径，不继承 Build 上下文。输出：通过/不通过 + 证据。

**5. spec 合规审查**：派独立 subagent，给 spec.md + git diff。判断：(a) spec 要求的都实现了吗？(b) 有没有实现 spec 没要求的东西？

**6. UI 规范检查**（有前端时）：对比 ui-design-system.md——组件是否来自组件库、色彩/间距/字体是否在规范内。不通过记录偏差。

**7. 原型对比**（有前端时）：截图当前实现，对比 prototype/ 中的原型。不一致的地方记录到报告。

**8. 出报告**：汇总全部六维结果，写入 `acceptance/v1.md`。内容：验收环境、每个维度结果+证据、发现的问题（严重度/AC/状态）、漂移审计结论、最终建议（✅通过/⚠️有条件通过/❌不通过）。

## 做完之后

将报告呈现给用户。让用户审阅后确认是否通过。**用户确认通过后**才在 roadmap Sprint 标题后面加 `✅`。不通过的 AC 和问题修复后重新验收（出 v2.md）。

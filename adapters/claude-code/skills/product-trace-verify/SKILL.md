---
name: product-trace-verify
description: Sprint 验收。当 Sprint 所有 Story [x] 后必须在新会话中 MUST 使用此 SKILL。独立 QA 视角——只对照 spec.md AC 和代码实际行为判断，不知道实现细节。漂移审计+逐 AC 验收。产出 acceptance/vN.md。关键词：验收、QA、AC、漂移审计、验收报告。
---

# Verify — Sprint 验收

Product Trace 第五环：独立验收。你以 QA 身份进入，不知道代码怎么写的——只对照 spec 描述和代码实际行为。

## 前置条件

- Sprint 所有 Story [x]
- 必须新会话（不继承 Build 上下文）
- spec.md open-corrections 必须为 0

## 工具

`pt session-start`（上下文+漂移）、`pt template acceptance`（模板）。Write 到 `acceptance/v1.md`。

## 关键概念

- 漂移审计：spec `last-verified-against.downstream` vs `git log HEAD`。差异有 CORR→正常，无 CORR→silent drift→阻塞
- 逐 AC：每条 AC 独立 subagent 验证，不继承 Build 上下文
- 零证据不通过：每条 AC 必须有命令输出/截图/行为描述

## 执行

1. **漂移审计**：`pt session-start` + 手动检查 downstream vs HEAD。silent drift 阻塞。
2. **CORR 检查**：spec `open-corrections > 0` → 拒绝。
3. **逐 AC 验收**：每条 AC 派独立 subagent——给 AC 文本+spec 背景+代码仓库，输出通过/不通过+证据。
4. **汇总报告**：写入 `acceptance/v1.md`——环境/逐 AC 结果/漂移审计/问题/结论。
5. **结论**：全部通过 → ROADMAP Sprint 标题后加 `✅`。

## 完成后

全部 AC 通过 + Sprint ✅ → Sprint 收尾。

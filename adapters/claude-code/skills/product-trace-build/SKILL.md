---
name: product-trace-build
description: 当 sprint-N/spec.md ready 时使用。TDD 开发：红→绿→重构。每 Story 自检漂移 + SubAgent 审查（spec 合规 + 代码质量）。发现偏差触发 product-trace-correct。更新 ROADMAP checkbox。
---

# Product Trace: Build

## 目标

按 spec.md 实现代码。TDD 开发，每个 Story 完成后自检漂移并审查，发现偏差走纠偏。

## 你的角色

你是开发者。你的任务是**按 spec 实现，不是质疑 spec**。如果觉得 spec 有问题，走纠偏流程（触发 product-trace-correct），不要自己偷偷改。

## 前置条件

- sprint-N/spec.md 存在，AC 可测试
- ROADMAP 当前 Sprint 标记 `← current`
- 上次退出已通过 pt session-stop 对账

## 流程

### 每个 Task 的 TDD 节奏

1. **读**: 找到当前 Story → 第一个未完成 Task
2. **红**: 写失败的测试
3. **绿**: 写最小实现让测试通过
4. **重构**: 清理代码结构，保持测试绿
5. **完成**: Task [x]

### 偏差发现

实现中 spec 不够准确时：
- 小修（字段改名/文件拆分）→ 标记 **SIGNAL 占位**，不中断流程
- 大修（AC 要改/Story 要拆）→ 暂停，触发 **product-trace-correct**

**SIGNAL 占位**：在 corrections-sprint-N.md 的 `## SIGNAL 占位` 段临时记录，会话结束时升级为 CORR 或删除。

### 每个 Story 完成后的自检

1. **自检**: "spec §1 用户旅程还准吗？§2 AC 还覆盖了吗？"
   - 准 → 更新 ROADMAP checkbox `[x]`
   - 不准 → 触发 product-trace-correct

2. **审查（SubAgent，必须）**:
   - **审查 1 — spec 合规**: 独立 agent，只看 spec.md + git diff。**不继承 Build 会话上下文**。判断：多做？少做？
   - **审查 2 — 代码质量**: 独立 agent，只看 git diff。判断：命名、结构、边界处理。

3. 审查发现的问题 → 修复 → 重新审查

### SubAgent 并行开发（可选）

Story 之间无共享依赖时，并行派 2-3 个 agent 各负责一个 Story。每个 agent 输入：spec.md 中属于它的 Story + Task + 文件路径。

### SessionStop 对账

退出时 **pt session-stop 强制三问**：
1. 进度更新
2. spec/ROADMAP/vision 还准吗？（A/B/C/D/E）
3. SIGNAL 升级？

**不能跳过。** 选 A 也要显式确认。

## 不做的事

- ❌ 不质疑 spec（有疑问走纠偏，不偷偷改）
- ❌ 不让 spec 腐烂（发现偏差必须记录 SIGNAL 或 CORR）
- ❌ 不跳过审查（每个 Story 完成后必须）

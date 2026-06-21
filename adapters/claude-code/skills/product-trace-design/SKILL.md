---
name: product-trace-design
description: Sprint 设计。当 ROADMAP 当前 Sprint 有 Story [ ] 待展开，但还没有 sprint-N/spec.md 或 spec 为 draft 时 MUST 使用此 SKILL。展开用户旅程→验收标准→数据模型→Task 拆解。产出 sprint-N/spec.md——Sprint 唯一执行手册。关键词：用户旅程、验收标准、AC、数据模型、Task拆解。
---

# Design — Sprint 设计

Product Trace 第三环：把 ROADMAP Story 展开成可执行的 spec.md——后续 Build 和 Verify 的唯一参考。

## 前置条件

- ROADMAP 当前 Sprint 有 Story [ ]
- sprint-N/spec.md 不存在或 draft

## 工具

`pt new-sprint`（创建目录）、`pt template spec`（模板）。Write 到 `sprint-N/spec.md`。

## 执行

1. `pt session-start` 确认当前 Sprint。读上一 Sprint corrections 预防强化。
2. `pt new-sprint` 创建目录和 corrections 文件。
3. 展开用户旅程——每个场景：前置条件→步骤→Loading/Empty/Error/Edge。每场景写完确认。
4. 验收标准——每条 `AC-N: <可测试描述> → 验证方式: <命令或手动步骤>`。覆盖全部状态。
5. 数据模型——本次新增/变更的实体字段表。
6. Task 拆解——每 Story 1-3 Task。每个：目标一句话 + 涉及文件 + 完成标准。
7. 有架构决策时写 §5 技术方案，否则省略。

## 完成后

spec.md 写入 → `/product-trace-build`

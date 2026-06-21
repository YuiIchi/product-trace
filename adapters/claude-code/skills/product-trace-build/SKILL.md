---
name: product-trace-build
description: Sprint 开发。当 sprint-N/spec.md status: stable 就绪时 MUST 使用此 SKILL。按 spec Task 拆解逐项：写测试→确认失败→最小实现→确认通过→重构。每 Story 完成自检漂移+审查。更新 ROADMAP checkbox。关键词：实现、开发、TDD、测试、checkbox。
---

# Build — Sprint 开发

Product Trace 第四环：按 spec.md 实现代码。红→绿→重构，每 Story 完成后自检。

## 前置条件

- sprint-N/spec.md 就绪（status: stable）
- ROADMAP 当前 Sprint ← current

## 工具

`pt session-start`（上下文）、`pt status`（进度）、`pt progress`（统计）、`pt session-stop`（收尾）。Bash 跑项目测试/构建命令。

## 关键概念

- CHECKBOX：ROADMAP 中 Story 状态 `[ ]→[~]→[x]`。完成 Story 后更新
- SIGNAL：实现中 spec 不准时的临时标记，在 `corrections-sprint-N.md` 的 `## SIGNAL 占位`
- CORR：确认的偏差记录。偏离 spec 时触发 `/product-trace-correct`

## 执行

**每 Task**：1. 写失败测试 → 2. 确认失败 → 3. 最小实现 → 4. 确认通过 → 5. 重构 → 6. Task [x]，git commit。

**每 Story 完成后**：自检"spec 还准吗？"→ 准则更新 ROADMAP checkbox `[x]`。不准则触发 `/product-trace-correct`。

**审查**（每个 Story 后）：派两个独立 subagent——(1) spec 合规：spec+diff，多做/少做？(2) 代码质量：diff，命名/结构/边界。

**偏差发现**：小修标记 SIGNAL；大修触发 `/product-trace-correct`。

**全部 Story 完成后**：运行 `pt session-stop`——回答进度/纠偏/SIGNAL 三问。

## 完成后

所有 Story [x] + pt session-stop 对账 → `/product-trace-verify`（必须新会话）

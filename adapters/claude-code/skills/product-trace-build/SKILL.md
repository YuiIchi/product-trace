---
name: product-trace-build
description: 引导 TDD 开发 — 红→绿→重构，每 Story 对账漂移，代码审查，纠偏发现。
---

# Product Trace: Build

## 目标

按 spec.md 实现代码。TDD 开发，每 Story 自检漂移，发现偏差走纠偏。

## 你的角色

你是开发者。你的任务是按 spec 实现，不是质疑 spec。有疑问走纠偏流程。

## 前置条件

- sprint-N/spec.md 存在，AC 可测试
- ROADMAP 当前 Sprint 标记 ← current

## 流程

### 每个 Task 的节奏

1. **读**: 读 spec.md 找到当前 Story → 第一个未完成 Task
2. **TDD**:
   - 写测试 → 确认失败 → 写实现 → 确认通过
   - 这是内化的 Superpowers TDD 技巧
3. **Task 完成**: 标记 spec Task [x]
4. **偏差发现**: 如果实现中 spec 不够准确 → 标记 SIGNAL 占位（不中断）

### 每个 Story 完成后的对账

1. **自检**: "spec 还准吗？"
   - 准 → 更新 ROADMAP checkbox [x]，继续
   - 不准 → 触发 product-trace-correct

2. **审查（SubAgent，必须）**:
   - **审查 1 — spec 合规**: 输入 = spec.md + git diff，只判断多做/少做
   - **审查 2 — 代码质量**: 输入 = git diff，判断命名/结构/边界

### 纠偏触发

当我说"等等这个不对"、"应该不是这样"，立即暂停并触发 product-trace-correct:
- L0 技术细节 → 30 秒改 spec §5 + CORR，不中断
- L1 验收标准 → 完成当前 Task 后处理
- L2 功能范围 → 立即停手
- L3 产品方向 → 回 Discover

### SubAgent 并行开发（可选）

当 Story 之间无共享依赖时，并行派 2-3 个 agent 各负责一个 Story。

### SessionStop 对账

退出时 pt session-stop 强制三问，不能跳过。

## 不做的事

- 不质疑 spec（有疑问走纠偏）
- 不让 spec 腐烂（发现偏差必须记录）
- 不跳过审查

---
name: product-trace-discover
description: 引导需求澄清 — 理解问题、分析可行性、Go/No-Go 决策。产出 product-vision.md。
---

# Product Trace: Discover

## 目标

把模糊的想法变成清晰的 product-vision.md，做出 Go/No-Go 决策。

## 你的角色

你是产品总监。你的任务是帮我把问题搞清楚，不是替我做决定。

## 流程

### Step 1: 澄清（一次一个问题）

逐个问清楚：
1. 谁的什么问题？他们现在怎么解决的？
2. 为什么现有方案不够？痛了多久？
3. 最小能验证假设的东西是什么？（MVP 边界）

**原则**：一次只问一个问题。多个选项比开放式好。

### Step 2: 分析

呈现：
- 商业价值判断
- 技术可行性风险点
- Go / No-Go / Conditional Go 建议

### Step 3: 分段确认

写入 `docs/features/<feature-slug>/product-vision.md`。每段写 200-300 字后确认：
1. 问题与机会 → 确认
2. 产品定位 → 确认
3. MVP 范围 → 确认
4. 风险与可行性 → 确认

### Step 4: 门控

呈现最终 Go/No-Go 决策建议，等我说 Go 才能进入 Plan。

## 模板

product-vision.md 完整模板在 `templates/product-vision.md`。

## 并行调研（可选）

如果涉及多个独立维度的调研（市场、技术、竞品），并行派 2-3 个 subagent 各自深挖一个方向，你读结果后写入 vision。

## 不做的事

- 不要在这个阶段写用户旅程（那是 Design 做的事）
- 不要建 feasibility-analysis.md（可行性放在 vision §5）
- 不要替我决定等级或方向

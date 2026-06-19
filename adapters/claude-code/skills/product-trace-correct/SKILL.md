---
name: product-trace-correct
description: 分级纠偏 — 开发中发现 spec/ROADMAP/vision 不准确时，按 L0-L3 等级上行更新文档。
---

# Product Trace: Correct

## 目标

实现中发现设计偏差时，分级处理，确保文档不腐烂。

## 你的角色

你是纠偏引导者。你帮我判断偏差等级、影响范围、按序更新文档。

## 触发方式

- **显式**: 我说"等等这个不对" / "这里设计有问题" / "我改主意了"
- **隐式**: pt session-stop 检测到 spec 影响范围的代码改动
- **隐式**: pt session-start 检测到漂移信号

## 四级纠偏

| 等级 | 触发信号 | 上行到哪 | 闸门 |
|:--|:--|:--|:--|
| L0 | "用 X 库更好" / "字段类型改一下" / "拆成两个文件" | spec §5 | 🟢 不中断 |
| L1 | "loading 缺 retry 态" / "空态没考虑" / "交互流程缺一步" | spec §1+§2 | 🟡 完成当前 Task |
| L2 | "Story 要拆/合" / "依赖没准备好" / "Sprint Goal 达不成" | ROADMAP + spec §4 | 🔴 立即停手 |
| L3 | "用户不是这样的" / "问题定义错了" / "MVP 范围不对" | vision 全链路 | ⚫ 回 Discover |

## 流程

### 1. CLASSIFY（分类）

我问三个关键问题，帮我判断等级：
- "这个改动影响验收标准吗？"
- "这个改动影响其他 Story 吗？"
- "这个改动改变产品方向吗？"

全否 → L0 | 影响验收 → L1 | 影响 Story → L2 | 影响方向 → L3

**必须我确认等级。**

### 2. GATE（闸门）

按等级闸门决定是否中断当前工作。

### 3. SCOPE（影响范围）

列出受影响文档和代码，我确认或编辑。

### 4. PROPAGATE（按序更新）

按上游→下游顺序更新：
- L0: spec §5 only → 记 CORR
- L1: spec §1+§2 → 代码重构 → 测试改写 → spec version bump → CORR
- L2: ROADMAP → spec §4 重写 → 代码评估 → ROADMAP version bump → CORR
- L3: 归档 vision → 重新 Discover → 重新 Plan

### 5. LOG（留痕）

追加 CORR 条目到 `corrections-sprint-N.md`：
```markdown
## CORR-SN-XXX
- 日期: YYYY-MM-DD
- 等级: L0|L1|L2|L3
- 发现于: Task X
- 触发: 一句话
- 影响: 文档 + 代码 + 测试
- 状态: applied | deferred | reverted
```

### 6. RE-VALIDATE

列出需要重新验证的 AC。

## 不做的事

- 不替我决定等级（必须我确认）
- 不在 L0 时打断流程
- 不静默修改文档（每次都要 log）
- 不在 L3 时就地修复（走完整 Discover）

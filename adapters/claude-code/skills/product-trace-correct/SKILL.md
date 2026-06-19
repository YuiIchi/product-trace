---
name: product-trace-correct
description: 当开发者发现 spec/ROADMAP/vision 与实现不一致时使用。触发词："等等这个不对"、"应该是..."、"我改主意了"。分级纠偏 L0-L3，按等级上行更新文档，每次留 CORR 记录。
---

# Product Trace: Correct

## 目标

实现中发现设计偏差时，分级处理，**确保文档不腐烂**。每次纠偏产生一条 CORR 记录。

## 触发方式

| 方式 | 触发 |
|:--|:--|
| 显式 | 用户说"等等这个不对" / "这里设计有问题" / "我改主意了" / "应该是..." |
| Stop hook | pt session-stop 发现 spec 影响范围的代码改动未对账 |
| Start hook | pt session-start 检测到 spec downstream ≠ HEAD |

## 四级纠偏

| 等级 | 触发信号 | 上行到哪 | 闸门 | 耗时 |
|:--|:--|:--|:--|:--|
| **L0** | "用 X 库更好" / "字段类型改一下" / "拆成两个文件" | spec §5 技术方案 | 🟢 不中断 | 30s |
| **L1** | "loading 缺 retry 态" / "空态没考虑" / "交互流程缺一步" | spec §1+§2 + 代码 + 测试 | 🟡 完成当前 Task | 5-30min |
| **L2** | "Story 要拆/合" / "依赖没准备好" / "Sprint Goal 达不成" | ROADMAP Story + spec §4 | 🔴 立即停手 | 30min-2h |
| **L3** | "用户不是这样的" / "问题定义错了" / "MVP 范围不对" | product-vision 全链路 | ⚫ 回 Discover | 1 会话+ |

## 流程

### 1. CLASSIFY（分类）

问三个关键问题帮我判断等级：
- "这个改动影响验收标准吗？"
- "这个改动影响其他 Story 吗？"
- "这个改动改变产品方向吗？"

全否 → L0 | 影响验收 → L1 | 影响 Story → L2 | 影响方向 → L3

**必须我确认等级。不要替我决定。**

### 2. GATE（闸门）

按等级闸门：
- L0 🟢 继续干活，30 秒改完
- L1 🟡 完成当前 Task 到可编译状态，然后处理
- L2 🔴 立即停止编码
- L3 ⚫ 退出 Build，回 Discover

### 3. SCOPE（影响范围）

列出受影响文档和代码，我确认或编辑。

### 4. PROPAGATE（按序更新）

按上游→下游顺序更新：
- **L0**: spec §5 → 记 CORR
- **L1**: spec §1+§2 → 代码重构 → 测试改写 → spec version bump → CORR
- **L2**: ROADMAP 重排 → spec §4 重写 → 已写代码评估 → ROADMAP version bump → CORR
- **L3**: 归档旧 vision（`product-vision-v1-archived.md`）→ 重新 product-trace-discover → product-trace-plan

### 5. LOG（留痕）

追加 CORR 条目到 `corrections-sprint-N.md`：

```markdown
## CORR-SN-XXX
- **日期**: YYYY-MM-DD
- **等级**: L0 | L1 | L2 | L3
- **发现于**: Task X 实现
- **触发**: 一句话描述
- **影响**: 文档 + 代码 + 测试
- **状态**: applied | deferred | reverted
```

### 6. RE-VALIDATE

列出需要重新验证的 AC。如果已有 acceptance/vN.md，标记受影响行为 `superseded-by: CORR-SN-XXX`。

## 不做的事

- ❌ 不替我决定等级（必须我确认）
- ❌ 不在 L0 时打断流程
- ❌ 不静默修改文档（每次都要 log CORR）
- ❌ 不在 L3 时就地修复（必须走完整 Discover）
- ❌ 不把 L2 当 L1 处理（Story 拆合是 Scope 改动，必须停手）

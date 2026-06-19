---
name: product-trace-verify
description: 当 Sprint 所有 Story [x] 后使用。独立验收 — 必须新会话。逐 AC 验证、漂移审计、silent drift 阻塞。产出 acceptance/vN.md + ROADMAP Sprint ✅。
---

# Product Trace: Verify

## 目标

独立验收 Sprint。用**只看 spec.md 和代码**的独立视角，逐条验证验收标准。产出 `acceptance/vN.md`。

## 你的角色

你是 QA。你**只看 spec.md 写了什么**和**代码实际做了什么**。你不知道实现时的讨论、妥协、取舍。**不要因为"代码写得辛苦"而放水。**

## 前置条件

- sprint-N/spec.md 所有 Story checkbox `[x]`
- **必须新会话**（不接受继承 Build 上下文）

## 流程

### Step 1: 漂移审计

- 读 spec.md front-matter `last-verified-against.downstream`（如 `abc123`）
- `git log abc123..HEAD --oneline` 看差异
- 0 commit → ✅ 无漂移
- N commits → 逐一检查：每个 commit 是否有对应 CORR？
- 有 CORR → ✅ 已记录，正常
- 无 CORR → ⚠️ **silent drift，阻塞通过**

### Step 2: CORR 检查

- spec.md `open-corrections > 0` → ❌ 拒绝验收，先关 CORR

### Step 3: 逐 AC 验收（SubAgent，必须）

**每条 AC 派一个独立 subagent**：
- **输入**: spec.md 的那条 AC + 用户旅程背景 + 代码仓库
- **关键**: 不继承任何 Build 会话上下文。不知道实现细节。
- **输出**: 通过/不通过 + **证据**（命令输出 / 截图 / 行为描述）

**这是内化的 verification-before-completion**：零声明不验证。每条 AC 必须有证据才能标记通过。

### Step 4: 汇总报告

- 读所有 subagent 验收结果
- 写 `acceptance/vN.md`
- 如有不通过 → 修复 → 重新验收（`vN+1.md`）
- 全部通过 → ROADMAP Sprint 标记 ✅

### Step 5: 结论

```
- [ ] ✅ 通过，进入 Sprint 收尾
- [ ] ⚠️ 有条件通过（条件: ...）
- [ ] ❌ 不通过（阻塞项: ...）
```

## 门控规则

- ❌ silent drift 未解释 → 拒绝验收
- ❌ open-corrections > 0 → 拒绝验收
- ❌ AC 无证据 → 不算通过

## 不做的事

- ❌ 不要回忆 Build 时知道的信息
- ❌ 不要因为"代码写得辛苦"而放水
- ❌ 不要跳过漂移审计
- ❌ 不要在没有证据的情况下标记 AC 通过

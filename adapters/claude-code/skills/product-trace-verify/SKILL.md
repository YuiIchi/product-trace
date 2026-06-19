---
name: product-trace-verify
description: 独立验收 — 逐 AC 验证，漂移审计。新会话，不继承 Build 上下文。
---

# Product Trace: Verify

## 目标

独立验收 Sprint。用只看 spec.md 和代码的独立视角，逐条验收。**不继承任何 Build 会话上下文。**

## 你的角色

你是 QA。你只看 spec.md 写了什么和代码实际做了什么。你不知道实现时的讨论、妥协、取舍。

## 前置条件

- sprint-N/spec.md 所有 Story [x]
- 必须新会话

## 流程

### Step 1: 漂移审计

- 读 spec.md front-matter `last-verified-against.downstream`
- 对比当前 HEAD
- 0 commit → 无漂移
- N commits → 逐一检查是否有对应 CORR
- 有 CORR → 已记录，正常
- 无 CORR → silent drift ⚠️ 阻塞通过

### Step 2: CORR 检查

- spec.md open-corrections > 0 → 拒绝验收，先关 CORR

### Step 3: 逐 AC 验收（SubAgent，必须）

每条 AC 派一个独立 subagent：
- **输入**: 那条 AC + spec 的用户旅程背景
- **关键**: 不继承 Build 会话上下文
- **输出**: 通过/不通过 + 证据（命令输出或截图/行为描述）

**这是内化的 Superpowers verification-before-completion**：零声明不验证。每条 AC 必须有证据。

### Step 4: 汇总报告

- 读所有 subagent 结果
- 写 `acceptance/vN.md`
- 如有不通过 → 修复 → 重验（vN+1.md）
- 全部通过 → ROADMAP Sprint ✅

### Step 5: 结论

三种结论：
- ✅ 通过，进入 Sprint 收尾
- ⚠️ 有条件通过
- ❌ 不通过（阻塞项列表）

## 门控规则

- silent drift 未解释 → 拒绝验收
- open-corrections > 0 → 拒绝验收

## 不要做的事

- 不要回忆 Build 时知道的信息
- 不要因为"代码写得辛苦"而放水
- 不要跳过漂移审计
- 不要在没有证据的情况下标记 AC 通过

---
name: product-trace-verify
description: "Sprint验收阶段。Sprint所有Story完成后 MUST 在新会话中使用此SKILL——不得继承Build上下文。六维独立验收：功能正确(逐AC)、方向偏离(spec合规审查)、代码质量(全量测试)、文档漂移(审计)、UI规范(design-system)、原型一致(prototype对比)。先出报告让用户确认，用户确认后才标记Sprint完成。关键词：验收、QA、AC、漂移审计、UI规范、原型验证。"
---

# Verify — Sprint 验收

## 你的位置

前面 Build 已经把 Sprint 的代码写完了。你是最后一环——**以独立 QA 身份进来，不从开发者那里继承任何上下文**。你的任务不是改代码，而是对照 spec 判断：做对了吗？做全了吗？有悄悄偏离的地方吗？UI 还符不符合规范？跟原型一致吗？

验收通过后 Sprint 才算真正完成。但**你不能替用户决定通过**——先出报告，用户确认。

**文档链**：我产出 acceptance/vN.md + 用户确认后标记 Sprint ✅ → Sprint 关闭。

## 什么时候该用我

- Sprint 所有 Story 都是 `[x]`
- **必须在全新会话中运行**（不继承 Build 状态的唯一方式）
- spec.md 的 `open-corrections` 必须为 0（有未处理的 CORR → 拒绝验收）

## 你能用的工具

| 工具 | 干什么 |
|:--|:--|
| `pt session-start` | 进上下文 + 检测漂移 |
| `pt template acceptance` | 输出验收报告模板 |
| `Agent()` | 派 subagent 逐 AC 验收、spec 合规审查 |
| Bash | 跑测试、截图对比 |

---

## 六维验收

| # | 维度 | 核心问题 | 谁来查 |
|:--|:--|:--|:--|
| 1 | 功能正确 | 每条 AC 通过了吗？ | subagent 逐 AC |
| 2 | 方向偏离 | 做的是 spec 要求的吗？多做/少做了吗？ | subagent spec 合规审查 |
| 3 | 代码质量 | 测试全量通过吗？ | 你直接跑 |
| 4 | 文档漂移 | spec 和代码之间有未记录的差异吗？ | 你直接审计 |
| 5 | UI 规范 | 遵守 ui-design-system 吗？ | 你逐组件检查 |
| 6 | 原型一致 | 和 prototype 一致吗？ | 你截图对比 |

---

## 一步步做

### Step 1: 漂移审计（先做，可能直接阻塞）

`pt session-start` 会自动比对 spec downstream commit 和当前 HEAD。

**你手动追加**：读 `git log --oneline <spec-downstream>..HEAD`。每一个 commit message：
- 有对应的 CORR 记录或 SIGNAL 吗？
- 没有 → **silent drift** → 阻塞验收。必须先 `/product-trace-correct` 补记录。

同时检查 open-corrections。> 0 → 拒绝验收，先处理所有 CORR。

### Step 2: 全量测试（你做）

跑项目的全量测试命令。必须 100% 通过。

```
<项目的测试命令>   # 例如 npx vitest run / npm test / pytest
```

不通过→记录到报告。让 Build 修复后重跑。全部通过→记录：`N/N 通过`。

### Step 3: 逐 AC 验收（派 subagent）

把 spec.md 的 AC 列表拆成独立 subagent——一个 subagent 验收 3-5 条 AC。派多个 subagent 并行执行。

每个 subagent 的 prompt：

```
你是独立 QA。只根据 AC 文本和验证方式判断通过/不通过。

验收以下 AC：

- [ ] AC-1: <AC 描述> → 验证方式: <步骤>
- [ ] AC-2: <AC 描述> → 验证方式: <步骤>
...

要求：
1. 逐条执行验证方式中的步骤
2. 每条输出：✅ 通过 / ❌ 不通过 + 证据（测试输出、截图描述、操作结果）
3. 不通过的：描述实际行为 vs 期望行为
4. 不修改任何代码——只报告
```

收集所有 subagent 结果，汇总到报告中。

### Step 4: spec 合规审查（派 subagent）

派一个 subagent，给完整 spec.md + `git diff <spec-downstream>..HEAD`：

```
你是 spec 合规审查。判断最终实现是否和 spec 一致。

输入：
1. spec.md 当前 Sprint 的全部内容
2. git diff <downstream>..HEAD 的全部变更

判断：
- 少做的：spec 的 AC、用户旅程、数据模型中要求的，但代码里没有的
- 多做的：代码里有但 spec 没要求的（可能是 scope creep）
- 偏离的：spec 说 A 但代码做了 B

输出每条时标注严重度：
- CRITICAL: spec 要求的功能缺失
- WARNING: spec 没要求但加了（可能合理，需要沟通）
- NOTE: 小差异

结论：✅ 一致 / ⚠️ 有偏差（列出 + 严重度）
```

### Step 5: UI 规范检查（有前端时你做）

打开 `ui-design-system.md`，逐项核对当前实现：

```
- [ ] 色彩：用的色值和 ui-design-system 令牌一致？（不是近似的其他颜色）
- [ ] 字体：字号、行高、字族和规范一致？
- [ ] 间距：padding/margin/gap 用了规范的 spacing 令牌？
- [ ] 组件：所有 UI 组件来自 ui-design-system 组件库？有没有自造组件？
- [ ] 交互：Loading/Empty/Error/Edge 四态都有对应 UI？
- [ ] 反馈时间：操作后 200ms 内有视觉反馈？
```

每条输出 ✅ 合规 / ❌ 偏离 + 具体文件:行号 + 偏差描述。

### Step 6: 原型对比（有前端时你做）

用 Bash 截图当前实现的关键页面，和 prototype/ 中的原型逐页对比。

```
对比维度：
- [ ] 页面结构：布局和原型一致？
- [ ] 交互流：点击路径和原型一致？（不是多了步骤、少了步骤）
- [ ] 状态转换：Loading→结果、Error→恢复，和原型一致？
- [ ] 组件使用：原型用的组件，实现也用了？（不是替换成别的）
```

记录差异：页面/状态 + 原型什么样 vs 实现什么样。

### Step 7: 出报告

汇总全部六维结果，写入 `.product-trace/features/<feature>/sprints/sprint-N/acceptance/v1.md`。

**报告结构**：

```
## 验收环境
- 分支/Commit
- 验收日期
- spec 版本

## 六维结果

### 1. 功能正确
| AC | 结果 | 证据 |
|:--|:--|:--|
| AC-1 | ✅ | 截图/测试输出 |
| AC-2 | ❌ | 实际 vs 期望 |

总计: N/N 通过（或 N/M 通过）

### 2. 方向偏离
<spec 合规审查结果>
少做: ... / 多做: ... / 偏离: ...
结论: ✅ 一致 / ⚠️ 有偏差

### 3. 代码质量
测试命令: ...
结果: N/N 通过

### 4. 文档漂移
spec downstream: <commit> vs HEAD: <commit>
差异: N commits
漂移: 无 / 有（列出 silent drift commits）

### 5. UI 规范
<逐条检查结果>

### 6. 原型一致
<对比结果>

## 发现的问题
| # | 问题 | AC | 维度 | 严重度 | 状态 |
|:--|:--|:--|:--|:--|:--|

## 结论
- [ ] ✅ 通过 — 六维全部通过，可关闭 Sprint
- [ ] ⚠️ 有条件通过 — 有非阻塞问题，修复后不重验（条件: ...）
- [ ] ❌ 不通过 — 有阻塞项，修复后重新验收（出 v2.md）

> ⚠️ 以上为验收建议。最终由用户审阅确认后标记 Sprint ✅。
```

## 判定标准

| 结论 | 条件 |
|:--|:--|
| ✅ 通过 | 六维全部无阻塞问题。AC 全通过、spec 合规、测试全绿、无 silent drift、UI/原型一致。 |
| ⚠️ 有条件通过 | 有 WARNING 或 NOTE 级别问题，但不影响核心功能。列出条件，修复后不需重新验收。 |
| ❌ 不通过 | 有 AC 不通过、CRITICAL spec 偏差、测试失败、silent drift。修复后重新出 v2 报告，从头验收。 |

**不通过的 AC 不改状态**——留给 Build 修复。Verify 只报告，不修代码。

## 做完之后

将报告呈现给用户。让用户审阅后确认是否通过。**用户确认通过后**，在 roadmap.md 该 Sprint 标题后加 `✅`。

不通过→用户确认问题 → Build 修复 → 修复后重新验收（出 v2.md，覆盖全部六维，不能只测"上次失败的"）。

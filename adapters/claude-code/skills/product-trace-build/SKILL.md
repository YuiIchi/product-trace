---
name: product-trace-build
description: "Sprint开发阶段。执行手册(spec.md)就绪时 MUST 使用此 SKILL。支持两种模式——轻量(默认): 你直接TDD开发+派subagent审查 / 团队: 调度开发者Agent实现+QA Agent独立验收。有前端时读ui-design-system用已有组件、读prototype对齐交互流。关键词：实现、开发、TDD、测试、checkbox。"
---

# Build — Sprint 开发

## 你的位置

前面 Design 产出了执行手册（spec.md）和 prototype/，Plan 产出了 UI 设计规范（ui-design-system.md）。现在你是第四环——**把 spec 里的 Story 变成可工作的代码**。

你的输入是三份文件：
1. **spec.md** — 用户旅程（每个场景的四态）、验收标准（AC）、数据模型、Task 拆解（含文件路径和完成标准）
2. **ui-design-system.md** — 设计令牌、组件库、布局规范、交互规范（有前端时）
3. **prototype/** — 中保真交互原型（有前端时）

**文档链**：我产出代码 + 更新 ROADMAP checkbox + 维护 corrections-sprint-N.md → Verify 阶段读取 spec 验收标准，对照代码逐条独立验证。

## 什么时候该用我

- sprint-N/spec.md 已经写好（status: stable）
- ROADMAP 当前 Sprint 标注了 `← current`
- 如果 spec 还是 draft——先回 `/product-trace-design` 设计完
- 如果 Sprint 所有 Story 都 `[x]` 了——你该去 `/product-trace-verify` 验收了

## 两种开发模式

进入 Build 后先判断 Sprint 复杂度，选一种模式：

| | 轻量模式（默认） | 团队模式 |
|:--|:--|:--|
| **适合** | 单个 Story 1-3 个 Task，改动 ≤5 文件 | 多 Story 并行、架构决策、改动 >5 文件 |
| **你的角色** | 开发者——自己写代码、TDD、派 subagent 审查 | 编排者——调度开发者 Agent 实现、QA Agent 独立验收 |
| **质量门** | 你自己 + subagent 审查 | 开发者自检 + QA 独立验收 + 你 gating |
| **速度** | 快（无交接开销） | 稳（独立验收、反馈闭环） |

**选择规则**：默认轻量模式。Sprint 有 ≥3 个 Story 且 Story 之间有依赖时用团队模式。

## 核心概念（两种模式通用）

### TDD：红 → 绿 → 重构

**铁律：没有先写失败的测试，不准写实现代码。**

```
RED:   写一个会失败的测试 → 运行 → 确认它因"功能缺失"而失败（不是语法错误）
GREEN: 写最少代码让测试通过 → 运行 → 全绿
REFACTOR: 清理代码结构、命名、去重 → 运行 → 保持全绿
```

**测试从哪里来**：从 spec.md 的验收标准来。每条 AC 对应一个或多个测试。测试描述一个用户可见的行为，不是内部实现。

| 好测试 | 坏测试 |
|:--|:--|
| `test('输入"买牛奶"回车后，任务出现在列表顶部')` | `test('addTodo 函数正常工作')` |
| `test('网络断开时显示"加载失败，点击重试"')` | `test('error state handled')` |
| 测试用户看到的结果 | 测试内部函数调用 |

### 四态覆盖

spec 的用户旅程为每个场景定义了四种状态。每个涉及用户交互的 Story 必须覆盖：

| 状态 | 含义 | 测试要点 |
|:--|:--|:--|
| **Loading** | 数据还在加载中 | 骨架屏/loading 动画是否显示？异步操作是否最终完成？ |
| **Empty** | 数据为空（首次使用、清空后） | 是否显示空态引导（如"还没有任务，创建第一个"）？ |
| **Error** | 操作失败（网络、权限、超时） | 错误信息是否清晰？是否有重试入口？ |
| **Edge** | 边界（超长文本、并发、极限数据） | 输入 1000 字会怎样？同一秒双击提交会怎样？ |

有前端时，每态必须有对应的 UI 呈现——不是 `console.log`。

### 组件一致性

有前端时，所有 UI 组件必须来自 `ui-design-system.md`。**禁止自行创建组件**——如果 ui-design-system 缺少需要的组件，触发 `/product-trace-correct`（L0：在 ui-design-system 里新增组件定义，然后使用）。

交互流必须和 prototype 一致——用户点击的路径、状态转换的触发条件、每个状态的界面表现，不得偏离。

### SIGNAL 与 CORR

- **SIGNAL**：实现中发现 spec 描述不够准确，但不影响其他 Story 也不影响验收标准。记在 corrections 文件，不中断开发。格式：`- [日期] SIGNAL: <一句话>`
- **CORR**：偏差影响验收标准或范围 → 停手，触发 `/product-trace-correct`

## 你能用的工具

| 工具 | 干什么 |
|:--|:--|
| `pt session-start` | 进入会话时看上下文 |
| `pt status` | 看 Story 进度 |
| `pt progress` | 看进度条和完成率 |
| `pt session-stop` | 退出会话时对账 |
| `Agent(type="bmad-developer")` | 团队模式——派开发者 Agent 实现 Story |
| `Agent(type="bmad-qa")` | 团队模式——派 QA Agent 逐 AC 独立验收 |
| Bash | 跑测试和构建命令 |

---

## 轻量模式（默认）

### 1. 进上下文

`pt session-start`。确认当前 Sprint、Story 进度。

### 2. 逐个 Story 开发

读 spec.md 找到当前 Story 的所有 Task。

#### 对每个 Task：

**A. 读上下文** — Task 的目标、涉及文件、完成标准。打开源文件和测试文件确认当前状态。

**B. RED — 写失败测试** — 从 spec 该 Task 对应的 AC 派生测试。每条 AC 至少一个测试。覆盖四态中 Task 涉及的状态。运行，确认因"功能缺失"失败。

**C. GREEN — 最小实现** — 写最少代码让测试通过。读 ui-design-system 确认组件存在。读 prototype 确认交互流一致。运行，确认全绿。

**D. REFACTOR — 清理** — 命名清晰？去重？重构后保持全绿。

**E. 提交** — `git add` + `git commit -m "feat(Story-00N): <Task 描述>"`

### 3. 每个 Story 完成后的质量门

#### 3a. 自检

- [ ] 本 Story 的 Task 全部完成？
- [ ] 本 Story 的 AC 全部通过测试？
- [ ] 四态 Loading/Empty/Error/Edge 都已实现？
- [ ] 有前端时：所有组件来自 ui-design-system？
- [ ] 有前端时：交互流与 prototype 一致？
- [ ] spec 里的描述还准确吗？

#### 3b. 双审查（派 subagent）

**审查 1 — spec 合规**（先做）：

```
你是 spec 合规审查。只判断"实现是否和 spec 一致"：
1. 读 spec.md 中 Story-00N 段的用户旅程、AC、数据模型
2. 读 git diff，逐 AC 对比
3. 输出：
   - 少做的：spec 要求但代码里没有的（AC 编号 + 证据）
   - 多做的：代码里有但 spec 没要求的（文件+行号）
   - 四态缺失：Loading/Empty/Error/Edge 有哪个没覆盖
   - 结论：✅ 合规 / ⚠️ 有偏差（列出）
```

**审查 2 — 代码质量**（合规 ✅ 后才做）：

```
你是代码质量审查。读 git diff，判断：
- 命名是否清晰？
- 有没有明显的 bug 或边界遗漏？
- 代码结构是否合理？
```

不通过→修→重查。

#### 3c. 更新进度

Edit roadmap.md：该 Story `[ ]` 或 `[~]` → `[x]`。下一个 Story 的 checkbox → `[~]`。

### 4. 发现偏差时

不影响 AC → SIGNAL。影响 AC 或范围 → 立即 `/product-trace-correct`。

### 5. 全部 Story 完成后

`pt session-stop`，回答：进度更新？spec 还准吗？SIGNAL 升级吗？

---

## 团队模式（复杂 Sprint 用）

你是编排者，不直接写代码。你的工作是：分配任务、提供上下文、审核产出、决定放行。

### 1. Sprint 启动

`pt session-start`。读 spec.md，列出所有 Story 及其依赖关系。

### 2. 逐个 Story 走开发-验收闭环

```
你(编排) → 开发者 Agent(实现) → QA Agent(验收) → 你(gating)
```

#### Step A: 分配 Story 给开发者 Agent

派 `Agent(type="bmad-developer")`。给完整的上下文：

```markdown
## Story-00N: <标题>

**目标**：<Story 一句话目标>

**spec 上下文**（从 spec.md 提取）：
- 用户旅程：<该 Story 对应的场景描述，含四态要求>
- 验收标准：<该 Story 对应的 AC 列表>
- 数据模型：<该 Story 涉及的数据字段>
- Task 列表：<每个 Task 的目标、涉及文件、完成标准>

**技术约束**：
- 技术栈：<从 architecture.md 提取>
- 测试命令：<从 package.json 提取>
- <有前端时> UI 组件必须来自 ui-design-system.md：
  <列出该 Story 会用到的组件及其用法>
- <有前端时> 交互流参考 prototype/：<相关场景的交互描述>

**要求**：
- 严格 TDD：先写失败测试，再最小实现
- 覆盖 Loading/Empty/Error/Edge 四态
- 每个 Task 完成后 git commit
- 所有测试通过后报告我
```

开发者 Agent 完成后会报告结果。审核通过→进入 Step B。不通过→反馈修复→重审。

#### Step B: 派 QA Agent 独立验收

派 `Agent(type="bmad-qa")`。**不给开发者 Agent 的实现上下文**——QA 只看 spec。

```markdown
## 验收 Story-00N: <标题>

**spec 依据**（从 spec.md 提取的该 Story 段）：
<完整 AC 列表 + 用户旅程 + 数据模型>

**验证方式**：
<每条 AC 的验证命令或手动步骤>

**要求**：
- 逐 AC 验证，每条附证据（测试输出/截图）
- 发现 bug → 直接通知开发者 Agent 修复，修复后重测
- 全部 AC 通过后出验收报告
```

QA Agent 发现 bug → 开发者 Agent 修复 → QA Agent 重测 → 循环直到全部通过。

#### Step C: Gating

QA Agent 出验收报告后，你逐项确认：
- [ ] 所有 AC 通过？
- [ ] 开发者 Agent 的 TDD 过程有 commit 记录？
- [ ] QA Agent 的验收有独立证据？
- [ ] spec 还准吗？（不准→SIGNAL 或 CORR）
- [ ] 四态全部覆盖？

全部通过→进入 Step D。有一项不通过→打回对应角色。

#### Step D: 更新进度

Edit roadmap.md：该 Story → `[x]`，下一个 Story → `[~]`。

### 3. 发现偏差时

与轻量模式相同：不影响 AC → SIGNAL。影响 AC 或范围 → `/product-trace-correct`。

### 4. 全部 Story 完成后

`pt session-stop`。所有 Story `[x]` + 对账完成 → 告诉用户去 `/product-trace-verify`。

---

## 做完之后

所有 Story [x] + pt session-stop 对账完成 → 告诉用户："开发完成。下一步在新会话中用 `/product-trace-verify` 做独立验收。"

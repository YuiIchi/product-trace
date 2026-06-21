---
name: product-trace-build
description: "Sprint开发阶段。执行手册(spec.md)就绪时 MUST 使用此 SKILL。你将按spec Task逐项开发——先写测试→确认失败→最小实现→确认通过→重构——每完成一个Story自检spec还准吗、派subagent做spec合规+代码质量双审查、更新roadmap checkbox进度。有前端时读ui-design-system用已有组件、读prototype对齐交互流。关键词：实现、开发、TDD、测试、checkbox。"
---

# Build — Sprint 开发

## 你的位置

前面 Design 产出了执行手册（spec.md）和 prototype/，Plan 产出了 UI 设计规范（ui-design-system.md）。现在你是第四环——**按这份手册把代码写出来，每做完一个功能增量就自检、审查、更新进度**。

你的输入是三份文件：
1. **spec.md** — 用户旅程（每个场景的四态）、验收标准（AC）、数据模型、Task 拆解（含文件路径和完成标准）
2. **ui-design-system.md** — 设计令牌、组件库（每个组件的变体+状态+使用场景）、布局规范、交互规范（有前端时）
3. **prototype/** — 中保真交互原型（有前端时）

**文档链**：我产出代码 + 更新 ROADMAP checkbox + 维护 corrections-sprint-N.md → Verify 阶段读取 spec 验收标准，对照我的代码逐条独立验证。

## 什么时候该用我

- sprint-N/spec.md 已经写好（status: stable）
- ROADMAP 当前 Sprint 标注了 `← current`
- 如果 spec 还是 draft——先回 `/product-trace-design` 设计完
- 如果 Sprint 所有 Story 都 `[x]` 了——你该去 `/product-trace-verify` 验收了

## 核心概念

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

spec 的用户旅程为每个场景定义了四种状态。每个涉及用户交互的 Task 必须覆盖：

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

- **SIGNAL**：实现中发现 spec 描述不够准确，但不影响其他 Story 也不影响验收标准。记在 corrections 文件的 `## SIGNAL 占位` 段，不中断开发。格式：`- [日期] SIGNAL: <一句话>`
- **CORR**：偏差影响验收标准或范围 → 停下手头 Task，触发 `/product-trace-correct`

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt session-start` | 进入会话时看上下文 |
| `pt status` | 看 Story 进度 |
| `pt progress` | 看进度条和完成率 |
| `pt session-stop` | 退出会话时对账——改了什么？spec 还准吗？有没处理的偏差吗？ |

Bash 用来跑项目的测试和构建命令。

## 一步步做

### 1. 进上下文

`pt session-start`。确认当前 Sprint、当前 Story 进度、open corrections、SIGNAL 积压。

### 2. 逐个 Story 开发

读 spec.md 找到当前 Story 的所有 Task。**一次只做一个 Task，不走捷径。**

#### 对每个 Task：

**Step A: 读 Task 上下文**

Task 里有三个关键信息：目标一句话、涉及文件、完成标准。不要跳过——打开涉及的源文件和测试文件，确认当前状态。

**Step B: 写测试（RED）**

从 spec 该 Task 对应的 AC 派生测试。测试命名：`<AC 描述> → 验证方式`。每条 AC 至少一个测试。覆盖四态中 Task 涉及的状态。

写入测试文件。运行测试——必须失败。失败原因必须是"功能还没实现"，不是语法错误或引用了不存在的模块。测试通过说明你测的是已存在的行为，修测试。

**Step C: 实现（GREEN）**

写最少代码让测试通过。不提前做"以后可能需要"的功能。不优化没被测试覆盖的路径。

读 ui-design-system.md 确认使用的组件存在。读 prototype 确认交互流一致。

代码写完，运行测试——必须全绿。

**Step D: 重构（REFACTOR）**

测试绿了之后：命名是否清晰？有没有重复代码可以提取？逻辑是否简单？重构后运行测试——必须保持全绿。

**Step E: 提交**

`git add` + `git commit`。commit message 格式：`feat(Story-001): <Task 描述>`

### 3. 每个 Story 完成后

一个 Story 的全部 Task 完成后，做三件事：

#### 3a. 自检

对照 spec 逐项检查：
- [ ] 本 Story 的 Task 全部完成？
- [ ] 本 Story 的 AC 全部通过测试？
- [ ] 用户旅程中的 Loading/Empty/Error/Edge 四态都已实现？
- [ ] 有前端时：所有组件来自 ui-design-system？
- [ ] 有前端时：交互流与 prototype 一致？
- [ ] spec 里的描述还准确吗？（实现中发现的任何不一致=偏差）

#### 3b. 双审查（派独立 subagent）

**审查 1 — spec 合规**（不能同时做审查 2，必须先合规再质量）：

派 subagent，只给 spec.md 的该 Story 段 + git diff。让它判断：
- spec 要求的都实现了吗？（少的）
- 有没有实现 spec 没要求的东西？（多的）
- 四态覆盖完整吗？

subagent 提示模板：
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

**审查 2 — 代码质量**（spec 合规 ✅ 后才做）：

派 subagent，只给 git diff。让它判断：
- 命名是否清晰？
- 有没有明显的 bug 或边界遗漏？
- 代码结构是否合理？

两个审查都通过后，继续下一步。不通过→修→重查。

#### 3c. 更新进度

Edit roadmap.md，把该 Story 的 checkbox 从 `[ ]` 或 `[~]` 改为 `[x]`。

开始下一个 Story 前，把它的 checkbox 从 `[ ]` 改为 `[~]`。

### 4. 发现偏差时

- **不影响 AC 的偏差**（字段名改了、文件拆了两个）→ 记 SIGNAL 在 corrections 文件，继续开发
- **影响 AC 或 Story 范围的偏差** → 立即停手，触发 `/product-trace-correct`

### 5. 全部 Story 完成后

所有 Story `[x]` 后，运行 `pt session-stop`。回答三个必答题：
1. 进度：所有 checkbox 更新了？
2. spec 还准吗？（A=准 / B=L0 / C=L1 / D=L2 / E=L3）
3. SIGNAL 需要升级为 CORR 吗？

## 做完之后

所有 Story [x] + pt session-stop 对账完成 → 告诉用户："开发完成。下一步在新会话中用 `/product-trace-verify` 做独立验收。"

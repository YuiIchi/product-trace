---
name: product-trace-design
description: "Sprint设计阶段。ROADMAP当前Sprint有Story待展开时 MUST 使用此 SKILL。你将展开用户旅程(含Loading/Empty/Error/Edge状态)、有前端时出交互原型(引用ui-design-system)、写可测试的验收标准(每条附验证方式)、画数据模型、拆Task(含文件路径+完成标准)。产出 sprint-N/spec.md + prototype/。关键词：用户旅程、原型、验收标准、AC、Task拆解。"
---

# Design — Sprint 设计

## 你的位置

前面 Plan 产出了路线图（roadmap.md），划分好了 Sprint，每个 Sprint 有一组 Story。现在是第三环——**把当前 Sprint 里那几条 Story，从一句话标题展开成一份详细的执行手册，让接下来开发的人拿到就知道到底该做什么、怎么做才算对**。

**文档链**：我产出 sprint-N/spec.md → Build 阶段逐 Task 实现代码，Verify 阶段用它逐 AC 验收。

这份执行手册叫 `.product-trace/features/<feature>/sprints/sprint-N/spec.md`。它包含：用户完整的使用过程、每个步骤的状态覆盖、可测试的验收标准、数据模型、代码 Task 拆解。Build 和 Verify 只参考这一份手册，不回查更上游的文档。

## 什么时候该用我

- ROADMAP 的当前 Sprint 有 Story 还是 `[ ]` 状态
- 对应 sprint-N/spec.md 还不存在或只有初始模板
- 如果 spec 已经写好——引导用户去 `/product-trace-build`

## 核心概念

- **用户旅程**：不是需求列表，是从用户视角走一遍——先看到什么、做了什么操作、系统怎么反应。每个场景必须覆盖四种状态。
- **验收标准（AC）**：做完的标准，每条必须可独立测试。不写"用户体验好"——写"输入'买牛奶'回车后，任务出现在列表顶部"。
- **Task**：代码实现的拆分单位。一个 Task 做完就是一个可验证的功能增量。Build 阶段按 Task 逐个 TDD。

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt new-sprint` | 创建 sprint-N 目录和 corrections 文件 |
| `pt template spec` | 输出执行手册的标准模板 |

## 一步步做

### 1. 看上下文

`pt session-start` 确认当前 Sprint。如果有上一 Sprint 的 corrections 日志，看里面有没有高频问题——比如"上 Sprint 3 次纠偏都是因为错误态没考虑"，本 Sprint 就要主动补强。

### 2. 创建目录

`pt new-sprint` 自动创建 `sprint-N/` 和 corrections 文件。

### 3. 写用户旅程

一个场景一个场景写，用以下固定格式。每个场景覆盖四种状态。

**格式：**

```
### 场景: <场景名 — 一句话说清用户在这个场景做了什么>

**前置条件**: <用户从哪里开始？已经有哪些数据？>

**主流程**:
1. 用户做 X → 系统显示 Y
   - Loading: <加载中用户看到什么>
   - Empty: <数据为空时看到什么>
   - Error: <出错时看到什么，怎么恢复>
   - Edge: <边界：超长输入？快速双击？>

2. 用户做 X+1 → 系统响应 Y+1
   - Loading / Empty / Error / Edge: <同上>
```

**示例：**

```
### 场景: 用户创建第一个待办任务

**前置条件**: 用户已打开应用，列表中暂无任务

**主流程**:
1. 用户看到空列表 → 显示"还没有任务，输入第一条开始吧"
   - Loading: 首次加载时显示骨架占位
   - Empty: 上述引导文案 + 输入框自动聚焦
   - Error: 加载失败显示"加载失败，点击重试"
   - Edge: 无

2. 用户在输入框输入"买牛奶"回车 → 任务出现在列表顶部，输入框清空
   - Loading: 回车后按钮显示 spinner，输入框禁用
   - Empty: 不适用（此时列表已有数据）
   - Error: 网络失败时任务留在输入框，显示"添加失败，点击重试"
   - Edge: 输入 500 字超长文本 → 截断并显示省略号；空内容回车 → 不提交
```

每个场景写完向用户确认"这个流程对吗？"。

### 4. 出原型（有前端时必须）

在 `sprint-N/prototype/sprint-N.html` 放本 Sprint 的中保真交互原型。标准：

| 维度 | 标准 |
|:--|:--|
| 目的 | Build 前用最低成本验证交互流和状态覆盖。不是交付物，是校验工具 |
| 交互完整性 | 本 Sprint 所有用户场景的完整路径可点击走通 |
| 状态覆盖 | 每个场景四种状态：Loading / Empty / Error / Edge |
| 组件一致性 | 使用 `ui-design-system.md` 定义的组件（Button/Input/Card/Modal），不自行造组件 |
| 视觉精确度 | 结构正确即可，不追求像素级——视觉精确是 ui-design-system + 实现的责任 |
| 可测性 | Verify 阶段可用截图工具对比实现和原型 |
| 成本控制 | 一个 Sprint 的原型 30 分钟内可完成。不改 design-system 已有组件 |

写完后打开原型让用户点一遍："交互流对吗？有漏状态吗？"

### 5. 写验收标准

每条 AC 格式：`- [ ] AC-N: <可测试的行为描述> → 验证方式: <命令或步骤>`

**好 AC 示例**：
```
- [ ] AC-1: 输入"买牛奶"回车后，任务出现在列表顶部
  → 验证方式: 打开页面 → 输入"买牛奶" → 回车 → 检查列表第一项是否为"买牛奶"

- [ ] AC-2: 网络断开时添加任务，显示"添加失败，点击重试"
  → 验证方式: 断网 → 添加任务 → 检查是否显示错误提示和重试按钮

- [ ] AC-3: 输入空内容回车，不创建任务
  → 验证方式: 输入框留空 → 回车 → 检查列表项数不变
```

**坏 AC 示例**（不可测试、太模糊）：
```
❌ "用户能顺利添加任务" — "顺利"是什么？怎么验证？
❌ "错误处理完善" — 哪些错误？怎么算完善？
❌ "界面美观大方" — 这是意见，不是标准
```

**AC 覆盖清单**（写完逐项核对）：
- [ ] 覆盖了本 Sprint 所有 Story 的用户可见行为
- [ ] 每个场景的主流程有 AC
- [ ] 每个场景的四态中，至少 Loading/Error 有 AC
- [ ] 每条 AC 有明确的验证方式（命令或步骤）
- [ ] 有前端时：含 UI 相关 AC——遵守 ui-design-system、与 prototype 一致

### 6. 画数据模型

不是画完整 ER 图——只列本 Sprint 新增或修改的字段。格式：

| 实体 | 字段 | 类型 | 必填 | 说明 |
|:--|:--|:--|:--|:--|
| Task | title | string | ✓ | 任务标题，≤500字符 |
| Task | completed | boolean | ✓ | 默认 false |
| Task | createdAt | datetime | ✓ | 自动生成 |

如果本 Sprint 不涉及新数据字段，写"本 Sprint 无新增数据模型"——不强行编造。

### 7. 拆 Task

每个 Story 拆成 1-3 个 Task。**Task 粒度标准**：

| 好 Task | 坏 Task |
|:--|:--|
| 一个 Task = 一个可独立验证的功能增量 | 一个 Task = 一个文件 |
| 做完这个 Task，跑对应的测试能看到结果 | 做完这个 Task，"基础设施搭好了"但什么也看不到 |
| "实现 Task 数据模型和创建接口" | "写 model 层、controller 层、service 层" |
| 2-5 个 commit 能完成 | 需要 10+ 个 commit |

**每个 Task 格式**：

```
#### Task N: <一句话目标>

- 涉及文件: <新建或修改的文件路径>
- 完成标准: <一句话说清怎么算做完。Build 阶段据此判断 Task 是否完成>
```

**示例**：

```
### Story-001: 用户可创建待办任务

#### Task 1: 数据模型和创建接口
- 涉及文件: src/models/task.ts (新), src/api/tasks.ts (新)
- 完成标准: POST /tasks 接受 title 返回 Task 对象，含 id/title/completed/createdAt

#### Task 2: 任务输入和列表 UI
- 涉及文件: src/components/TaskInput.tsx (新), src/components/TaskList.tsx (新)
- 完成标准: 输入框回车创建任务，任务出现在列表顶部，覆盖四态
```

### 8. 写技术方案（按需）

只有本 Sprint 涉及架构决策时才写，比如"选 A 库还是 B 库"、"新增数据存储方案"。普通功能开发不需要这步。内容放在 spec.md §5。

### 9. 自检

写完 spec 后逐项确认：

- [ ] 用户旅程每个场景有四态覆盖？
- [ ] AC 每条可独立测试 + 有验证方式？
- [ ] AC 覆盖了所有场景的主流程和关键状态？
- [ ] Task 粒度合理——每个 Task 是一个可验证的增量？
- [ ] Task 有涉及文件路径 + 完成标准？
- [ ] 数据模型该列的字段都列了？

有一项不满足→补全再给用户看。

## 做完之后

告诉用户："执行手册已就绪。下一步用 `/product-trace-build` 开始按手册写代码。"

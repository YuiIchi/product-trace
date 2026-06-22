# Product Trace

AI 驱动的产品研发追踪工作流。从模糊想法到交付验收，整条链路有据可依。

## 安装

```bash
git clone <repo>
cd product-trace
bash install.sh
```

重启 Claude Code 后生效。

## 三种启动方式

### 1. 全新项目（绿地 Greenfield）

从零开始，有模糊产品想法：

```
/product-trace-discover     # 澄清想法 → 写 product-vision.md
/product-trace-plan         # 拆功能 → 排优先级 → 划 Sprint
/product-trace-design       # 展开 Sprint → 写 spec.md
/product-trace-build        # 按 spec 开发
/product-trace-verify       # 独立验收（新会话执行）
```

Agent 自动处理目录初始化、状态跟踪。

### 2. 已有项目（棕地 Brownfield）

现有代码，想纳入 Product Trace 管理：

```
/product-trace-discover     # Agent 自动识别棕地 → 扫描代码 → 生成快照 → 进入 Plan
/product-trace-plan         # 规划下一个 Sprint
```

Agent 扫描 `package.json`/目录结构 → 理解技术栈和已有功能 → 2-3 轮对话确认 → 生成 `roadmap.md`（Sprint 0 全 `[x]` + Sprint 1 ← current）。

一条命令搞定接入，之后走正常 Sprint 流程。

### 3. 恢复已有工作

项目已接入，直接打对应的 SKILL：

```
/product-trace-build        # 如果上次在开发
/product-trace-design       # 如果 Sprint 刚划好
/product-trace-verify       # 如果代码写完待验收
```

Agent 会通过 `pt session-start`（hooks 自动触发）获知当前进度，告诉你在哪、该做什么。

## 日常工作流

每次打开项目进入开发会话，Agent 自动显示当前状态。你只需打阶段 SKILL：

```
/product-trace-build        # 按 spec Task 逐个开发
                             # 每完成一个 Story 自检 spec 还准吗
/product-trace-correct       # 发现设计偏差时纠偏
/product-trace-new-requirement  # 有新需求时判定和路由
```

Sprint 所有 Story 完成后：

```
新会话 → /product-trace-verify  → 六维独立验收 → 你确认 → Sprint ✅
```

退出会话时 Agent 自动执行 `pt session-stop` 对账。

## 工作流全图

```
Discover → Plan → Design → Build → Verify
   ↓        ↓       ↓        ↓       ↓
 vision  roadmap  spec    代码   acceptance
         +arch   +proto   +checkbox
         +ui-ds  +corrections
```

## SKILL 参考（用户使用）

| SKILL | 何时用 |
|:--|:--|
| `/product-trace-discover` | 新项目澄清需求 / 已有项目棕地接入 |
| `/product-trace-plan` | 拆功能、排优先级、划 Sprint |
| `/product-trace-design` | 展开当前 Sprint 为执行手册 |
| `/product-trace-build` | 按 spec TDD 开发 |
| `/product-trace-verify` | 新会话独立六维验收 |
| `/product-trace-correct` | 开发中发现设计偏差，分级纠偏 |
| `/product-trace-new-requirement` | Sprint 进行中有新需求，判定和路由 |

## CLI 命令（Agent 内部使用，通过 hooks 自动触发）

| 命令 | 做什么 |
|:--|:--|
| `pt session-start` | 进入会话——看进度、检测漂移（SessionStart hook 自动触发） |
| `pt session-stop` | 退出会话——对账：改了什么、spec 还准吗（Stop hook 自动触发） |
| `pt init` | 首次初始化 `.product-trace/` 目录和文档骨架（Agent 按需调用） |
| `pt new-sprint` | 创建下一 Sprint 目录+文件（Agent 在 Design 阶段调用） |
| `pt status` | 查看 Sprint 和 Story 状态（Agent 需要时调用） |
| `pt progress` | 进度条 + 完成率（Agent 需要时调用） |
| `pt template <name>` | 输出模板（Agent 按需读取） |

## 文档结构

```
.product-trace/
├── features/
│   └── <feature-slug>/
│       ├── product-vision.md    # 产品目标书
│       ├── roadmap.md           # 路线图 + Sprint 划分 + 进度
│       ├── architecture.md      # 技术架构（可选）
│       ├── ui-design-system.md  # UI 设计规范（有前端时）
│       └── sprints/
│           └── sprint-N/
│               ├── spec.md      # 执行手册
│               ├── corrections-sprint-N.md
│               ├── acceptance/
│               └── prototype/
```

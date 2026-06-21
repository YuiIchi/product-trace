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
/pt init                    # 创建 .product-trace/ 目录结构
/pt session-start           # 确认初始化状态
/product-trace-discover     # 澄清想法 → 写 product-vision.md
/product-trace-plan         # 拆功能 → 排优先级 → 划 Sprint → 写 roadmap.md
/product-trace-design       # 展开当前 Sprint → 写 spec.md + prototype
/product-trace-build        # 按 spec 开发
/product-trace-verify       # 独立验收
```

### 2. 已有项目（棕地 Brownfield）

现有代码，想纳入 Product Trace 管理：

```
/product-trace-discover     # Agent 自动识别：有代码、无 .product-trace/ → 扫描代码 → 生成 vision + roadmap + architecture
/product-trace-plan         # 规划下一个 Sprint
```

Agent 会扫描 `package.json`/目录结构/README → 理解技术栈和已有功能 → 2-3 轮对话确认 → 生成 `roadmap.md`（Sprint 0 为已有功能全 `[x]`，Sprint 1 ← current 待规划）。

不需要 `pt init`——Agent 会自动创建所需文件。

### 3. 恢复已有工作

项目已接入，继续上次进度：

```
/pt session-start           # 查看当前 Sprint、Story 状态、漂移检测
```

之后根据当前阶段走对应的 `/product-trace-*` 命令。

## 日常工作流

每进入一个 Sprint 开发会话：

```
1. /pt session-start       → 看进度、当前 Story、漂移
2. /product-trace-build    → 按 spec Task 逐个开发
3. /pt session-stop        → 对账（进度、纠偏、SIGNAL）
```

Sprint 所有 Story 完成后：

```
新会话 → /product-trace-verify  → 六维独立验收 → 用户确认 → Sprint ✅
```

新需求进来（Sprint 进行中）：

```
/product-trace-new-requirement  → 判定增量/新Feature/紧急 → 走对应流程
```

## 工作流全图

```
Discover → Plan → Design → Build → Verify
   ↓        ↓       ↓        ↓       ↓
 vision  roadmap  spec    代码   acceptance
         +arch   +proto   +checkbox
         +ui-ds  +corrections
```

## 命令参考

| 命令 | 做什么 |
|:--|:--|
| `pt init` | 初始化 `.product-trace/` 目录和文档骨架 |
| `pt session-start` | 进入会话——看进度、检测漂移、显示 CORR |
| `pt session-stop` | 退出会话——对账：改了什么、spec 还准吗 |
| `pt status` | 查看所有 Sprint 和 Story 状态 |
| `pt progress` | 进度条 + 完成率 |
| `pt new-sprint` | 创建下一个 Sprint 目录、spec、corrections |
| `pt template <name>` | 输出模板（product-vision/roadmap/architecture/ui-design-system/spec/acceptance/corrections） |

## SKILL 参考

| SKILL | 何时用 |
|:--|:--|
| `/product-trace-discover` | 新项目澄清需求 / 已有项目棕地接入 |
| `/product-trace-plan` | 拆功能、排优先级、划 Sprint |
| `/product-trace-design` | 展开当前 Sprint 为执行手册 |
| `/product-trace-build` | 按 spec TDD 开发 |
| `/product-trace-verify` | 新会话独立六维验收 |
| `/product-trace-correct` | 开发中发现设计偏差，分级纠偏 |
| `/product-trace-new-requirement` | Sprint 进行中有新需求，判定和路由 |

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

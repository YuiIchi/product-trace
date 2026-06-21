---
name: product-trace-discover
description: 需求发现。当你收到模糊产品想法、功能提议，且项目还没有 product-vision.md 或 vision 尚在 draft 状态时，MUST 使用此 SKILL。多轮对话澄清需求→分析可行性→Go/No-Go 决策。产出 product-vision.md（status: stable）。关键词：产品想法、需求澄清、MVP、产品分析、Go/No-Go。
---

# Discover — 需求发现

Product Trace 是一套产品研发追踪框架——7 个 SKILL 串成链，配合 `pt` CLI 命令，让 Agent 每次进入会话即知项目状态。你是第一环：把模糊想法变成清晰的 product-vision.md。

## 前置条件

- 用户提出了一个产品想法或功能方向
- 项目还没有 product-vision.md，或 vision 处于 draft 状态
- 如果 vision 已是 stable，说明 Discover 已完成，应引导用户进入 `/product-trace-plan`

## 工具

| 命令 | 用途 |
|:--|:--|
| `pt init` | 初始化 docs/ 目录 |
| `pt session-start` | 查看项目当前上下文 |
| `pt template product-vision` | 输出 vision 模板 |

产出文件：`docs/features/<feature-slug>/product-vision.md`

## 执行

**Step 1**：运行 `pt session-start` 了解项目状态。如未初始化则 `pt init`。

**Step 2**：逐轮提问——一次一个问题，给 2-3 选项。必须搞清楚：(1) 谁的问题？他们现在怎么解决的？(2) MVP 最小范围？不做什么？(3) 有明显技术硬伤吗？问够 3-5 轮即停。

**Step 3**：分段写入 product-vision.md。每段写完后让用户确认：
- §1 问题与机会 → 确认
- §2 产品定位（一句话定位+价值主张+用户画像）→ 确认
- §3 MVP 范围（含/不含表格，不做什么必须写清楚）→ 确认
- §4 核心概念模型（2-3 个关键概念）→ 确认
- §5 关键风险 + Go/No-Go 建议

**Step 4**：等用户说 Go。Go 后改 frontmatter `status: stable`。

## 完成后

用户说 Go、vision status: stable → 引导用户进入 `/product-trace-plan` 做规划。

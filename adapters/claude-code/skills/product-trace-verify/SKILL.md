---
name: product-trace-verify
description: "Sprint验收阶段。Sprint所有Story完成后 MUST 在新会话中使用此SKILL——不得继承Build上下文。你以QA身份独立验证，不知道代码怎么写的：先漂移审计(文档代码间有无未记录差异)→逐AC派独立subagent验证(只看spec vs实际行为)→产出验收报告。关键词：验收、QA、AC、漂移审计。"
---

# Verify — Sprint 验收

## 你的位置

前面 Build 已经把 Sprint 的代码写完了，ROADMAP 里 Story 都标记了 `[x]`。现在你是最后一环——**以独立 QA 的身份进来，不看开发者写过什么、讨论过什么、妥协过什么，只拿 spec.md 上写的验收标准，去比对代码实际做了什么**。

你不是来做开发的，也不是来改代码的。你的职责是：文档说要做 X，实际行为是 X 吗？是→通过。不是→记录问题。文档说了要 X 但代码里有 Y（spec 没提的）→这也是偏差。

验收通过后，这个 Sprint 才算真正完成。

## 什么时候该用我

- Sprint 所有 Story 在 ROADMAP 中都是 `[x]`
- **必须在全新会话中运行**——不能继承 Build 会话的任何上下文
- spec.md 的 `open-corrections` 必须为 0（还有没关的纠偏就拒绝验收）

## 核心概念

- **漂移审计**：检查文档和代码之间有没有悄悄发生的差异。spec.md 头部记录了一个 `last-verified-against.downstream`（上次验证时指向的 git commit），对比当前最新 commit——如果之间有代码改动但没有对应的 CORR 记录，说明有人改了代码没更新文档，这就是 silent drift——它必须被解释或修复才能通过验收
- **逐 AC 验收**：每条验收标准独立验证。每条必须附证据——命令输出、截图或行为描述，不能只打勾

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt session-start` | 进入时看上下文 + 自动检测漂移 |
| `pt template acceptance` | 输出验收报告标准模板 |

用 Bash 跑项目测试命令和手动验证步骤。

## 一步步做

**1. 漂移审计**：`pt session-start` 看漂移警告。手动对比 spec `downstream` 和 `git log`——每个新增 commit 都有对应 CORR 吗？没有→silent drift→阻塞通过，必须先处理。

**2. CORR 检查**：看 spec frontmatter 的 `open-corrections`，>0 就拒绝验收。

**3. 逐 AC 验收**：读 spec.md §2 的每一条验收标准。每一条启动一个独立 subagent——只给它 AC 文本和代码仓库路径。subagent 输出：通过/不通过 + 证据。记住：你不应该知道代码怎么实现的——如果你发现自己用到了 Build 会话的知识，停下来。

**4. 写验收报告**：汇总所有 subagent 的结果，用 Write 写到 `docs/features/<feature>/sprints/sprint-N/acceptance/v1.md`。内容：验收环境（分支/日期）、每条 AC 结果+证据、漂移审计结论、发现的问题、最终结论（✅通过/⚠️有条件通过/❌不通过）。

**5. 标记完成**：全部 AC 通过后，在 ROADMAP 当前 Sprint 标题后面加 `✅`。

## 做完之后

告诉用户验收结论。如果通过——这个 Sprint 就完成了，可以开始规划下一个。如果不通过——列出所有不通过的 AC 和发现的问题。

---
name: product-trace-verify
description: Sprint 独立验收。当 Sprint 所有 Story [x] 后 MUST 使用此 SKILL，且必须在新会话中运行。你将作为 QA，只对照 spec.md 的验收标准和代码实际行为逐条验证。产出 acceptance/vN.md。关键词：验收、QA、测试、AC、验收报告、漂移审计。
---

# Product Trace — Verify（独立验收）

## 背景知识

Verify 是 Product Trace 链条的第五环——独立验收 Sprint。

```
代码 + spec.md  →  acceptance/vN.md  →  ROADMAP Sprint ✅
                      ← 你现在做这个
```

**关键原则：你不参与过开发。不知道实现时的讨论、妥协、取舍。你只对照 spec.md 写的和代码实际做的。**

## 可用工具

| 命令 | 用途 |
|:--|:--|
| `pt session-start` | 读取上下文 + 漂移检测 |
| `pt template acceptance` | 输出 acceptance/vN.md 模板 |

通过 Bash 运行项目测试命令和手动验证脚本。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| 漂移审计 | 对比 spec 的 `last-verified-against.downstream` 和当前 HEAD。有差异时逐一检查是否有对应 CORR。无 CORR 的差异是 silent drift——阻塞通过 |
| 逐 AC 验收 | 每条验收标准独立验证，每条必须附证据（命令输出/截图/行为描述） |
| SubAgent 验收 | 每条 AC 派一个独立 subagent，只给 AC 文本+代码，不给 Build 上下文 |

## 执行流程

### Step 1：漂移审计

运行 `pt session-start`。查看漂移警告。

手动检查：spec.md frontmatter 的 `last-verified-against.downstream` vs `git log --oneline`。
- 0 差异 → 无漂移
- N 个 commit → 逐一检查每个 commit 是否有对应 CORR
- 有 CORR → 已记录漂移
- 无 CORR → silent drift → 阻塞通过

### Step 2：CORR 检查

查看 `corrections-sprint-N.md` 和 spec.md frontmatter 的 `open-corrections`。
- `open-corrections > 0` → 拒绝验收，需先关闭所有 CORR

### Step 3：逐条 AC 验收

读取 spec.md §2 的验收标准。每条 AC 启动一个独立 subagent 验证：

- 给 subagent 的内容：AC 文本 + spec 用户旅程背景 + 代码仓库路径
- subagent 输出：通过 / 不通过 + 证据

### Step 4：汇总验收报告

用 Write 写入 `docs/features/<feature>/sprints/sprint-N/acceptance/v1.md`：

```yaml
---
doc: acceptance
feature: <feature-slug>
sprint: N
version: 1
status: draft
spec-version-at-time: spec.md@v1.0
superseded-by: none
---
```

正文包含：
- `## 验收环境` — 分支/commit/日期
- `## 验收结果` — 每条 AC 的通过状态+验证方式+证据
- `## 漂移审计` — 结论
- `## 发现的问题` — 表格：问题/AC/严重度/状态
- `## 结论` — ✅ 通过 / ⚠️ 有条件通过 / ❌ 不通过

### Step 5：结论

全部 AC 通过后，ROADMAP 当前 Sprint 标题后加 `✅`。告知用户进入 Sprint 收尾。

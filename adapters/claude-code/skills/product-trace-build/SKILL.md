---
name: product-trace-build
description: Sprint 开发实现。当 sprint-N/spec.md 就绪时 MUST 使用此 SKILL。你将按 spec 的 Task 拆解逐项实现：先写测试→确认失败→最小实现→确认通过→重构。每 Story 完成后自检漂移并审查。更新 ROADMAP checkbox。关键词：TDD、实现、开发、测试、代码审查、checkbox。
---

# Product Trace — Build（Sprint 开发）

## 背景知识

Build 是 Product Trace 链条的第四环——按 spec.md 实现代码。

```
sprint-N/spec.md  →  代码  →  ROADMAP checkbox [x]
     ✅              ← 你现在做这个
```

## 可用工具

| 命令 | 用途 |
|:--|:--|
| `pt session-start` | 读取 ROADMAP 和 spec 当前状态 |
| `pt status` | 显示当前 Sprint 的 Story 进度 |
| `pt progress` | 显示进度条和各 Sprint 完成率 |
| `pt session-stop` | 收尾对账——强制三问（进度/纠偏/SIGNAL） |

通过 Bash 运行项目自身的构建/测试命令（如 `npm test`、`npm run build`）。

## 核心概念

| 概念 | 说明 |
|:--|:--|
| TDD 节奏 | 红（写失败测试）→ 绿（最小实现）→ 重构（清理代码）。每一步必须验证 |
| SIGNAL 占位 | 实现中 spec 描述不准确时的临时标记，存在 `corrections-sprint-N.md` 的 `## SIGNAL 占位` 段。会话结束时升级为 CORR 或删除 |
| CORR | 确认的设计偏差记录。L0=技术细节/L1=验收标准/L2=功能范围/L3=产品方向 |
| 审查 | 每个 Story 完成后做两轮：spec 合规（多做少做？）和代码质量（命名/结构/边界） |

## 执行流程

### Step 1：恢复上下文

运行 `pt session-start`。确认当前 Sprint 和进行中的 Story。

### Step 2：按 Task 逐个实现

读取 `sprint-N/spec.md`，找到当前 Story 的第一个未完成 Task。每个 Task 按以下节奏：

1. **写测试**：在 `test/` 下写一个会失败的测试
2. **确认失败**：运行测试，确认它失败
3. **写实现**：在 `src/` 下写最小代码让测试通过
4. **确认通过**：运行测试，确认全部通过
5. **重构**：清理代码结构，保持测试绿
6. **标记完成**：在 spec.md 的 Task 前标记 `[x]`

每个 Task 完成后 git commit，commit message 格式 `feat: <Story-ID> <Task 简述>`。

### Step 3：每个 Story 完成后自检

一个 Story 的所有 Task 完成后：

1. 自检："spec 的用户旅程和验收标准还准吗？"
2. 准 → 更新 ROADMAP 中该 Story 的 checkbox 为 `[x]`
3. 不准 → 触发 `/product-trace-correct` 处理偏差

### Step 4：审查（每个 Story 完成后）

派两个独立 subagent（不继承当前会话上下文）：

- **审查 1 — spec 合规**：只给 spec.md + git diff。判断多做？少做？
- **审查 2 — 代码质量**：只给 git diff。判断命名、结构、边界。

审查发现的问题修复后重新审查。

### Step 5：全部 Story 完成后收尾

运行 `pt session-stop`。它输出本次变更的文件列表和三问：

1. 进度：哪些 checkbox 需要更新？
2. 纠偏：spec 还准吗？（A=准 B=L0 C=L1 D=L2 E=L3）
3. SIGNAL：本次标记的占位是否升级？

必须回答这三问。完成后告知用户下一步用 `/product-trace-verify` 独立验收。

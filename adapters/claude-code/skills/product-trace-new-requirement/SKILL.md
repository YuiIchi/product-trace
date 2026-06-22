---
name: product-trace-new-requirement
description: "新需求门控。Sprint进行中有新需求进来时 MUST 使用此 SKILL。你将判定需求级别——增量(入Backlog)、新Feature(独立走Discover完整流程)、紧急(插入当前Sprint,标记[!],必须记录对原计划的代价)——更新roadmap。关键词：新需求、增量、紧急、Backlog。"
---

# New Requirement — 新需求门控

## 你的位置

产品开发中，Sprint 做到一半经常来新需求。不是所有需求都该直接插进当前 Sprint——有些该排队，有些该走完整分析流程，只有真正阻塞发布的问题才能插队。你是旁路门控——**判断新需求是什么级别、该插到哪里、代价是什么**。

## 什么时候该用我

- Sprint 正在执行中，有新的需求进来
- 这个需求不属于当前 Sprint 已有 Story 的范围
- 如果需求范围很小且明确属于某个已有 Story——直接在 spec.md 的 Task 里加一条，不需要走这个流程

## 三种处理方式

**增量需求**——比如"列表加个搜索框"。不改变产品方向、不增加新用户类型、不影响架构。处理方式：判断归属（算哪个 Story 的延伸还是新 Story？）→ 正常排入 Backlog（P1/P2）或下个 Sprint。不要插入当前 Sprint。

**新 Feature**——比如"加用户认证系统"。独立产品模块、涉及新用户类型、可能需要新架构。处理方式：在 `.product-trace/features/` 下创建独立目录 → 告诉用户这个新 Feature 要独立走 `/product-trace-discover` → 在现有 ROADMAP 中加一段交叉引用指向新 Feature 的路线图。

**紧急需求**——比如"线上保存按钮坏了"。阻塞发布或影响正在使用的功能。处理方式：这是唯一允许插入当前 Sprint 的情况。在该 Sprint 的 spec.md 里加一条 Story，ROADMAP 里标记 `[!]` 并注明阻塞原因。**必须记录代价**——因为插入了它，原来的哪个 Story 要被延期到哪个 Sprint。

## 你能用的工具

| 命令 | 干什么 |
|:--|:--|
| `pt session-start` | 了解当前 Sprint 状态 |
| `pt status` | 查看已有 Story 和 Backlog |

用 Edit 更新 roadmap.md 和 spec.md。

## 一步步做

**1. 判定**：问自己三个问题——改变产品方向吗？新增用户类型吗？改变架构吗？全否→增量 / 有是→新 Feature / 线上问题→紧急。向用户确认判断。

**2. 增量处理**：找到这个需求最接近的已有 Story → 正常优先级加入 Backlog → Edit 更新 ROADMAP。

**3. 新 Feature 处理**：在 `.product-trace/features/<new-slug>/` 建目录 → 告知用户下一步用 `/product-trace-discover` → Edit 主 ROADMAP 加 `## Feature Tracks` 段交叉引用。

**4. 紧急处理**：Edit spec.md 当前 Sprint 段加新 Story → Edit ROADMAP 加 `[!]` 附原因 → Edit ROADMAP 注明"因紧急需求 XXX 插入，原 Story-N 延期至 Sprint N+1"。这是唯一允许中途插入 Sprint 的情况——代价必须白纸黑字写下来。

## 做完之后

告诉用户处理结果和新需求所在位置。增量→回 Build 继续当前 Sprint。新 Feature→引导 Discover 流程。紧急→回 Build 继续（优先做紧急 Story）。

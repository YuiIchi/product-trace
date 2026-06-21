---
name: product-trace-correct
description: 开发中纠偏。当 Build 过程中发现 spec/ROADMAP/vision 与实际情况不一致、用户说"等等不对"、"应该是.."时 MUST 使用此 SKILL。按 L0-L3 四级分级：L0=技术细节(30s)/L1=验收标准(完成Task后)/L2=功能范围(停手)/L3=产品方向(回Discover)。每次留 CORR 记录。关键词：纠偏、CORR、SIGNAL、L0、L1、L2、L3、设计变更。
---

# Correct — 开发中纠偏

Product Trace 旁路：实现中发现设计偏差时，不分级处理、留痕更新。每次产生一条 CORR 记录。

## 前置条件

- 在 Build 过程中，开发者发现实现和 spec/ROADMAP/vision 不一致
- 触发：用户说"等等这个不对"、"应该是..."
- 或 pt session-start/stop 检测到漂移

## 四级

| 等级 | 触发 | 上行到 | 闸门 |
|:--|:--|:--|:--|
| L0 | 字段类型/命名/文件拆分/库选择 | spec §5 | 🟢 不中断 |
| L1 | AC遗漏/状态缺漏/交互缺步 | spec §1+§2+代码+测试 | 🟡 完成当前Task |
| L2 | Story拆合移/Sprint Goal不可达 | ROADMAP+spec §4 | 🔴 停手 |
| L3 | 方向错/目标用户错/MVP错 | vision全链路 | ⚫ 回Discover |

## 执行

1. **CLASSIFY**：问"影响AC？影响其他Story？改变方向？"→全否L0/影响AC→L1/影响Story→L2/影响方向→L3。必须用户确认。
2. **GATE**：按闸门执行。
3. **SCOPE**：列出影响文档和代码，用户确认。
4. **PROPAGATE**：上游→下游顺序更新。L0:spec§5→CORR / L1:spec§1+§2→代码→测试→version bump→CORR / L2:ROADMAP→spec§4→ROADMAP version bump→CORR / L3:归档vision→re-Discover→re-Plan。
5. **LOG**：追加 CORR 到 `corrections-sprint-N.md`：
   ```
   ## CORR-SN-XXX
   - 日期/等级/发现于/触发/影响/状态: applied|deferred|reverted
   ```
6. **RE-VALIDATE**：列出需重验的 AC。

## 完成后

CORR 记录 + 文档更新 → 回到 `/product-trace-build` 继续（L3 除外，回 Discover）

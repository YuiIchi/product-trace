---
doc: acceptance
feature: <feature-slug>
sprint: N
version: 1
status: draft
spec-version-at-time: spec.md@v1.0
superseded-by: none
---

# Sprint N 验收报告 vN

## 验收环境
- 分支 / Commit
- 验收日期

## 六维验收结果

### 1. 功能正确 — 逐 AC
- [ ] AC-1: <描述>
  验证方式: ...
  证据: ...
- [ ] AC-2: ...

### 2. 方向偏离 — spec 合规审查
- 多做: <spec 没要求但实现了的>
- 少做: <spec 要求了但没实现的>
- 结论: 一致 / 存在偏差

### 3. 代码质量 — 全量测试
- 测试命令: ...
- 结果: <N/N 通过> / <有 N 个失败>
- 失败详情: ...

### 4. 文档漂移 — 审计
> spec downstream: <commit> vs HEAD: <commit>
> 差异: <N commits>
> 每个 commit 有对应 CORR 吗: 是 / 否（silent drift ⚠️）

### 5. UI 规范（有前端时）
- ui-design-system 遵守情况: <组件/色彩/间距/字体 符合/偏离>
- 偏差记录: ...

### 6. 原型一致（有前端时）
- prototype 对比结果: <一致 / 有差异>
- 差异记录: ...

## 发现的问题
| # | 问题 | AC | 维度 | 严重度 | 状态 |
|:--|:--|:--|:--|:--|:--|

## 结论
- [ ] ✅ 通过
- [ ] ⚠️ 有条件通过（条件: ...）
- [ ] ❌ 不通过（阻塞项: ...）

> ⚠️ 以上结论为验收建议。最终由用户审阅确认后标记 Sprint ✅。

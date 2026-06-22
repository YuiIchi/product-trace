# Product Trace — 项目开发规范

## 核心原则：改一处必须全局对齐

Product Trace 由三层组成，每层互相引用。修改任何一层时，**必须检查并同步更新其余两层**：

| 层 | 包含 | 被谁引用 |
|:--|:--|:--|
| SKILL（7 个 SKILL.md） | 工作流定义、触发条件、执行步骤、阶段衔接 | Agent 执行时读取 |
| 命令（pt CLI + TypeScript 源码） | `pt init/new-sprint/status/progress/session-start/stop/template` | SKILL 中用 Bash 调用，Agent 和用户直接使用 |
| 模板（7 个 .md 模板） | `product-vision/roadmap/architecture/ui-design-system/spec/acceptance/corrections` | `pt init`/`pt new-sprint`/`pt template` 读取，SKILL 中 Write 时参考 |

**改 SKILL 时** → 检查：模板是否需要同步更新？命令输出/参数是否匹配 SKILL 的描述？
**改命令时** → 检查：SKILL 中的命令示例是否需要更新？模板是否匹配新的命令行为？
**改模板时** → 检查：SKILL 中的文件路径/章节引用是否正确？`pt init`/`pt new-sprint` 的 fallback 是否同步？

## 工作流衔接链

```
Discover → Plan → Design → Build → Verify
   ↓        ↓       ↓        ↓       ↓
 vision  roadmap  spec    代码   acceptance
         +arch   +proto   +checkbox
         +ui-ds  +corrections
```

每个阶段的文档链必须在 SKILL.md 的"你的位置"段显式说明：**我产出 X → 下一个阶段用 X 做 Y**。

有前端时：
- Plan 必须产出 `ui-design-system.md`（设计令牌、组件库、布局规范）
- Design 的 prototype 引用 ui-design-system 的组件，只扩展不重复
- Build 读 ui-design-system 和 prototype，组件必须来自组件库
- Verify 检查 UI 规范（§5）和原型一致性（§6）

## 命名规范

- 所有文档文件名**全小写**：`roadmap.md`、`product-vision.md`、`architecture.md`、`ui-design-system.md`、`spec.md`、`acceptance.md`、`corrections.md`
- 目录名：`.product-trace/features/<feature-slug>/sprints/sprint-N/`
- YAML frontmatter 中 `doc` 字段保持原始大写（如 `doc: ROADMAP`）作为标识符
- SKILL 名：`product-trace-<verb>`（kebab-case）

## 提交规范

每次改完一组关联的 SKILL/命令/模板后：
1. `npm run build` — 确保 TypeScript 编译通过
2. `npx vitest run` — 确保 30 个测试全通过
3. 一条 commit 包含本次所有关联变更

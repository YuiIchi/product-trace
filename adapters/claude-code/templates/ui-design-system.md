---
doc: ui-design-system
feature: <feature-slug>
version: 1.0
status: draft
last-updated: YYYY-MM-DD
---

# UI 设计规范 — <Feature 名称>

> 这份规范是 Design、Build、Verify 三个阶段的唯一 UI 真相源。
> Design 的 prototype 引用这里定义的组件。Build 只使用这里定义的组件和样式。Verify 对照这里检查 UI 一致性。

## 1. 设计令牌（Design Tokens）

### 色彩
| 令牌 | 色值 | 用途 |
|:--|:--|:--|
| `--color-primary` | #... | 主按钮、链接、强调 |
| `--color-primary-hover` | #... | 主按钮悬停 |
| `--color-bg` | #... | 页面背景 |
| `--color-surface` | #... | 卡片、面板背景 |
| `--color-text` | #... | 正文（≥4.5:1 对比度） |
| `--color-text-muted` | #... | 辅助文字（≥4.5:1） |
| `--color-error` | #... | 错误状态 |
| `--color-success` | #... | 成功状态 |
| `--color-border` | #... | 边框、分割线 |

### 字体
| 令牌 | 值 | 用途 |
|:--|:--|:--|
| `--font-family` | ... | 正文字体 |
| `--font-family-display` | ... | 标题字体（可选，与正文有明显对比） |
| `--text-xs` | ... | 辅助、标签 |
| `--text-sm` | ... | 次要正文 |
| `--text-base` | ... | 正文 |
| `--text-lg` | ... | 小标题 |
| `--text-xl` | ... | 章节标题 |
| `--text-2xl` | ... | 页面标题（max 6rem） |
| `--leading` | ... | 行高。正文 ≥1.5 |

### 间距
| 令牌 | 值 | 用途 |
|:--|:--|:--|
| `--space-1` | ... | 紧密元素间距 |
| `--space-2` | ... | 相关元素间距 |
| `--space-4` | ... | 段落间距 |
| `--space-8` | ... | 区块间距 |
| `--space-16` | ... | 大区块间距 |

### 其他
| 令牌 | 值 | 用途 |
|:--|:--|:--|
| `--radius` | ... | 按钮/输入框/卡片圆角 |
| `--shadow` | ... | 卡片/弹窗阴影 |

## 2. 组件库

> Build 必须使用此处定义的组件。如果 prototype 需要新组件，在本 Sprint 的 spec 中说明并扩展本节。每个组件列出：HTML 结构、CSS 类、状态（Default/Hover/Active/Disabled/Loading）、使用场景。

### Button
- 变体: Primary / Secondary / Ghost / Danger
- 大小: sm / md / lg
- 触控: 最小 44px × 44px（移动端）

### Input
- 状态: Default / Focus / Error / Disabled
- 必须有 label 或 aria-label

### Card
- 仅在真正需要时使用。不用嵌套 Card

### Modal
- z-index: 50
- 必须有 Escape 关闭和点击遮罩关闭

### 其他
（按需扩展）

## 3. 布局规范

| 规则 | 值 |
|:--|:--|
| 最大内容宽度 | 如 1200px |
| 正文行宽 | ≤ 75ch |
| 响应式 | 移动优先，≥768px 时双列，≥1024px 时最大宽度 |
| Grid | `auto-fit, minmax(280px, 1fr)` 避免 breakpoint |

## 4. 交互规范

| 规则 | 说明 |
|:--|:--|
| 状态转换 | 每个交互必须有 Loading / Empty / Error / Edge 四态 |
| 反馈 | 操作后 200ms 内给视觉反馈 |
| 动画 | 使用 `ease-out`，禁用 `linear`。必须适配 `prefers-reduced-motion` |
| z-index | 按语义分层，不用 999 |
| 可访问性 | 所有交互支持键盘；焦点环可见；屏幕阅读器可访问 |

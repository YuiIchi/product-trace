#!/bin/bash
set -e

echo "=== Product Trace 卸载 ==="
echo ""

echo "卸载模式:"
echo "  1. 全局 — 从 ~/.claude/ 移除"
echo "  2. 本地 — 从当前项目 .claude/ 移除"
echo ""
read -p "选择 [1/2]: " mode

case $mode in
  1) DEST="$HOME/.claude" ;;
  2) DEST="$(pwd)/.claude" ;;
  *) echo "无效选择"; exit 1 ;;
esac

echo "→ 从 $DEST 移除 Product Trace..."

# 移除 Plugin 组件 — 逐 skill 删除
SKILLS="product-trace-discover product-trace-plan product-trace-design product-trace-build product-trace-verify product-trace-correct product-trace-new-requirement"
for skill in $SKILLS; do
  if [ -d "$DEST/skills/$skill" ]; then
    rm -rf "$DEST/skills/$skill"
    echo "  ✅ 已移除 $skill"
  fi
done

# 移除旧的嵌套目录（如果有）
[ -d "$DEST/skills/product-trace" ] && rm -rf "$DEST/skills/product-trace" && echo "  ✅ 已移除旧 product-trace/ 目录"

# 移除 hooks
if [ -f "$DEST/hooks/product-trace.json" ]; then
  rm -f "$DEST/hooks/product-trace.json"
  echo "  ✅ 已移除 hooks"
fi

# 移除 templates
if [ -d "$DEST/templates/product-trace" ]; then
  rm -rf "$DEST/templates/product-trace"
  echo "  ✅ 已移除 templates"
fi

# 卸载 CLI
npm unlink product-trace 2>/dev/null && echo "  ✅ 已卸载 pt 命令" || true
npm uninstall -g product-trace 2>/dev/null || true

echo ""
echo "✅ 卸载完成"
echo "注意: .product-trace/ 下的项目文档未被删除。如需删除请手动操作。"

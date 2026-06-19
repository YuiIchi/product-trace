#!/bin/bash
set -e

echo "=== Product Trace 安装 ==="
echo ""

PLUGIN_SRC="$(cd "$(dirname "$0")" && pwd)/adapters/claude-code"
CLI_SRC="$(cd "$(dirname "$0")" && pwd)"

# -------- 安装 CLI --------
echo "→ 安装 CLI..."
cd "$CLI_SRC"

if ! command -v node &>/dev/null; then
  echo "❌ 未找到 Node.js。请先安装 Node.js ≥ 18"
  exit 1
fi

npm install --silent
npm run build

# -------- 选择安装模式 --------
echo ""
echo "安装模式:"
echo "  1. 全局 — 安装到 ~/.claude/（所有项目可用）"
echo "  2. 本地 — 安装到当前项目 .claude/（仅当前项目）"
echo ""
read -p "选择 [1/2]: " mode

case $mode in
  1)
    DEST="$HOME/.claude"
    echo "→ 全局安装到 $DEST"

    # 安装 CLI 全局
    cd "$CLI_SRC" && npm link
    echo "  ✅ pt 命令全局可用"

    # 安装 Plugin 组件
    mkdir -p "$DEST/skills/product-trace"
    for skill_dir in "$PLUGIN_SRC/skills/"*/; do
      skill_name=$(basename "$skill_dir")
      cp -r "$skill_dir" "$DEST/skills/product-trace/$skill_name"
      echo "  ✅ skill: $skill_name"
    done

    mkdir -p "$DEST/hooks"
    cp "$PLUGIN_SRC/hooks/hooks.json" "$DEST/hooks/product-trace.json"
    echo "  ✅ hooks: product-trace.json"

    mkdir -p "$DEST/templates/product-trace"
    cp "$PLUGIN_SRC/templates/"*.md "$DEST/templates/product-trace/"
    echo "  ✅ templates"
    ;;

  2)
    DEST="$(pwd)/.claude"
    echo "→ 本地安装到 $DEST"

    # 安装 CLI 本地
    cd "$CLI_SRC" && npm link
    echo "  ✅ pt 命令可用"

    # 安装 Plugin 组件
    mkdir -p "$DEST/skills/product-trace"
    for skill_dir in "$PLUGIN_SRC/skills/"*/; do
      skill_name=$(basename "$skill_dir")
      cp -r "$skill_dir" "$DEST/skills/product-trace/$skill_name"
      echo "  ✅ skill: $skill_name"
    done

    mkdir -p "$DEST/hooks"
    cp "$PLUGIN_SRC/hooks/hooks.json" "$DEST/hooks/product-trace.json"
    echo "  ✅ hooks"

    mkdir -p "$DEST/templates/product-trace"
    cp "$PLUGIN_SRC/templates/"*.md "$DEST/templates/product-trace/"
    echo "  ✅ templates"
    ;;

  *)
    echo "无效选择"
    exit 1
    ;;
esac

echo ""
echo "✅ Product Trace 安装完成"
echo ""
echo "下一步:"
echo "  1. cd 到项目目录，运行 pt init 初始化文档结构"
echo "  2. 重启 Claude Code 或运行 /reload-plugins"
echo "  3. 使用 /product-trace-discover 开始 Discover"

#!/bin/bash
set -e

echo "=== Product Trace 安装 ==="
echo ""

PLUGIN_SRC="$(cd "$(dirname "$0")" && pwd)/adapters/claude-code"
CLI_SRC="$(cd "$(dirname "$0")" && pwd)"

echo "→ 安装 CLI..."
cd "$CLI_SRC"

if ! command -v node &>/dev/null; then
  echo "❌ 未找到 Node.js。请先安装 Node.js ≥ 18"
  exit 1
fi

npm install --silent
npm run build

echo ""
echo "安装模式:"
echo "  1. 全局 — 安装到 ~/.claude/（所有项目可用）"
echo "  2. 本地 — 安装到当前项目 .claude/（仅当前项目）"
echo ""
read -p "选择 [1/2]: " mode

case $mode in
  1) DEST="$HOME/.claude" ;;
  2) DEST="$(pwd)/.claude" ;;
  *) echo "无效选择"; exit 1 ;;
esac

echo "→ 安装到 $DEST"

# -------- CLI --------
cd "$CLI_SRC" && npm link
echo "  ✅ pt 命令可用"

# -------- Skills（扁平安装到 skills/ 下）--------
for skill_dir in "$PLUGIN_SRC/skills/"*/; do
  skill_name=$(basename "$skill_dir")
  rm -rf "$DEST/skills/$skill_name"
  cp -r "$skill_dir" "$DEST/skills/$skill_name"
  echo "  ✅ skill: $skill_name"
done

# -------- Templates --------
rm -rf "$DEST/templates/product-trace"
mkdir -p "$DEST/templates/product-trace"
cp "$PLUGIN_SRC/templates/"*.md "$DEST/templates/product-trace/"
echo "  ✅ templates"

# -------- Hooks --------
REGISTER_SCRIPT="$(cd "$(dirname "$0")" && pwd)/scripts/register-hooks.js"
if [ -f "$REGISTER_SCRIPT" ]; then
  node "$REGISTER_SCRIPT" "$DEST" "$PLUGIN_SRC"
  echo "  ✅ hooks 已注册到 settings.json"
else
  echo "  ⚠️  请在 settings.json 中手动添加 hooks（见 hooks/install-instructions.md）"
fi

echo ""
echo "✅ Product Trace 安装完成"
echo ""
echo "下一步:"
echo "  1. cd 到项目目录，运行 pt init 初始化文档结构"
echo "  2. 重启 Claude Code"
echo "  3. 使用 /product-trace-discover 开始 Discover"

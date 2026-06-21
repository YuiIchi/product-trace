#!/usr/bin/env node
/**
 * Register Product Trace hooks in Claude Code settings.json.
 * Usage: node register-hooks.js <DEST_DIR> <PLUGIN_SRC>
 */
const fs = require('fs');
const path = require('path');

const destDir = process.argv[2];  // e.g., ~/.claude or .claude/
const pluginSrc = process.argv[3]; // adapters/claude-code/

const settingsPath = path.join(destDir, 'settings.json');
const hooksSrcPath = path.join(pluginSrc, 'hooks', 'hooks.json');

// Read existing settings
let settings = {};
if (fs.existsSync(settingsPath)) {
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  } catch (e) {
    console.error(`❌ settings.json 解析失败: ${e.message}`);
    process.exit(1);
  }
}

// Read product-trace hooks
const ptHooks = JSON.parse(fs.readFileSync(hooksSrcPath, 'utf-8'));

// Save hooks file for reference
fs.mkdirSync(path.join(destDir, 'hooks'), { recursive: true });
fs.writeFileSync(
  path.join(destDir, 'hooks', 'product-trace.json'),
  JSON.stringify(ptHooks, null, 2) + '\n'
);

// Merge into settings.json
settings.hooks = settings.hooks || {};
for (const [event, entries] of Object.entries(ptHooks.hooks)) {
  settings.hooks[event] = settings.hooks[event] || [];
  for (const entry of entries) {
    // Avoid duplicate
    const exists = settings.hooks[event].some(
      e => JSON.stringify(e) === JSON.stringify(entry)
    );
    if (!exists) {
      settings.hooks[event].push(entry);
    }
  }
}

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log(`✅ hooks registered: ${Object.keys(ptHooks.hooks).join(', ')}`);

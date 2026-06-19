import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Resolve template path relative to the plugin install location
// or the adapters directory in development
const TEMPLATE_DIRS = [
  join(process.cwd(), 'adapters/claude-code/templates'),
  join(process.cwd(), '..', '..', 'adapters/claude-code/templates'), // from dist/
  join(process.env.HOME || '/', '.claude/templates/product-trace'),
  join(process.cwd(), '.claude/templates/product-trace'),
];

function findTemplateDir(): string | null {
  const found = TEMPLATE_DIRS.find(p => existsSync(p));
  return found || null;
}

const VALID_TEMPLATES = [
  'product-vision',
  'ROADMAP',
  'architecture',
  'ui-design-system',
  'spec',
  'acceptance',
  'corrections',
];

export function ptTemplate(name: string): void {
  if (!VALID_TEMPLATES.includes(name)) {
    console.log(`未知模板: ${name}`);
    console.log(`可用模板: ${VALID_TEMPLATES.join(', ')}`);
    return;
  }

  const templateDir = findTemplateDir();
  if (!templateDir) {
    console.log('未找到模板目录');
    console.log('确保 Product Trace Plugin 已安装（运行 install.sh）');
    return;
  }

  const templatePath = join(templateDir, `${name}.md`);
  if (!existsSync(templatePath)) {
    console.log(`模板文件不存在: ${name}.md`);
    return;
  }

  const content = readFileSync(templatePath, 'utf-8');
  console.log(content);
}

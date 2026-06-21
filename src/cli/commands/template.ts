import { getTemplateContent } from '../lib/project';

const VALID_TEMPLATES = [
  'product-vision', 'ROADMAP', 'architecture', 'ui-design-system',
  'spec', 'acceptance', 'corrections',
];

export function ptTemplate(name: string): void {
  if (!VALID_TEMPLATES.includes(name)) {
    console.log(`未知模板: ${name}`);
    console.log(`可用模板: ${VALID_TEMPLATES.join(', ')}`);
    return;
  }

  const content = getTemplateContent(name);
  if (!content) {
    console.log('未找到模板文件');
    console.log('确保 Product Trace 已安装（运行 install.sh）');
    return;
  }

  console.log(content);
}

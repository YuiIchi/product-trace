#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('pt')
  .description('Product Trace — 产品研发追踪工作流')
  .version('1.0.0');

program
  .command('session-start')
  .description('读 ROADMAP + spec → 检测漂移 → 输出上下文')
  .action(() => {
    console.log('TODO: session-start');
  });

program
  .command('session-stop')
  .description('git diff → 强制对账三问')
  .action(() => {
    console.log('TODO: session-stop');
  });

program
  .command('init')
  .description('初始化 docs/ 目录结构 + 创建模板')
  .action(() => {
    console.log('TODO: init');
  });

program
  .command('status')
  .description('显示当前 Sprint、Story 进度、未关 CORR')
  .action(() => {
    console.log('TODO: status');
  });

program
  .command('new-sprint')
  .description('创建 sprint-N/ 目录 + spec.md')
  .action(() => {
    console.log('TODO: new-sprint');
  });

program
  .command('progress')
  .description('从 ROADMAP checkbox 统计完成度')
  .action(() => {
    console.log('TODO: progress');
  });

program
  .command('template <name>')
  .description('输出指定模板内容')
  .action((name: string) => {
    console.log(`TODO: template ${name}`);
  });

program.parse();

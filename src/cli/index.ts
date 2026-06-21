#!/usr/bin/env node
import { Command } from 'commander';
import { sessionStart } from './commands/session-start';
import { sessionStop } from './commands/session-stop';
import { ptInit } from './commands/init';
import { ptStatus } from './commands/status';
import { ptNewSprint } from './commands/new-sprint';
import { ptProgress } from './commands/progress';
import { ptTemplate } from './commands/template';

const program = new Command();

program
  .name('pt')
  .description('Product Trace — 产品研发追踪工作流')
  .version('1.0.0');

program
  .command('session-start')
  .description('读 ROADMAP + spec → 检测漂移 → 输出上下文')
  .action(async () => {
    await sessionStart();
    process.exit(0);
  });

program
  .command('session-stop')
  .description('git diff → 强制对账三问')
  .action(async () => {
    await sessionStop();
    process.exit(0);
  });

program
  .command('init')
  .description('初始化 .product-trace/ 目录结构 + 创建模板')
  .action(() => {
    ptInit();
    process.exit(0);
  });

program
  .command('status')
  .description('显示当前 Sprint、Story 进度、未关 CORR')
  .action(() => {
    ptStatus();
    process.exit(0);
  });

program
  .command('new-sprint')
  .description('创建 sprint-N/ 目录 + spec.md + corrections')
  .action(() => {
    ptNewSprint();
    process.exit(0);
  });

program
  .command('progress')
  .description('从 ROADMAP checkbox 统计完成度')
  .action(() => {
    ptProgress();
    process.exit(0);
  });

program
  .command('template <name>')
  .description('输出指定模板内容')
  .action((name: string) => {
    ptTemplate(name);
    process.exit(0);
  });

program.parse();

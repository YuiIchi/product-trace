import { getDiffStat } from '../lib/git';

export async function sessionStop(): Promise<void> {
  const diff = await getDiffStat();

  console.log('--- Product Trace: 会话对账 ---');
  console.log();

  if (diff.files.length > 0) {
    console.log('本次修改:');
    diff.files.forEach(f => console.log(`  ${f}`));
    console.log(`  ${diff.summary}`);
  } else {
    console.log('本次修改: 无文件变更');
  }

  console.log();
  console.log('请回答（不能跳过）:');
  console.log();
  console.log('1. 进度: 哪些 checkbox 需要更新？');
  console.log('   → 更新 ROADMAP.md');
  console.log();
  console.log('2. 纠偏: spec/ROADMAP/vision 还准吗？');
  console.log('   A. 准 → 刷新 last-verified-against.downstream = HEAD');
  console.log('   B. L0 → 更新 spec §5 + 记 CORR');
  console.log('   C. L1 → 调 product-trace-correct');
  console.log('   D. L2 → 强制调 product-trace-correct');
  console.log('   E. L3 → 回 Discover');
  console.log();
  console.log('3. SIGNAL: 本次标记的占位需要升级吗？');
  console.log('   → 升级为 CORR / 删除');
}

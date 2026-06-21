import { getDiffStat, countCommitsSince } from '../lib/git';
import { getSessionStart, clearSession } from '../lib/session';

export async function sessionStop(): Promise<void> {
  const cwd = process.cwd();

  // Compare against session start commit to find all changes
  const sessionStartCommit = getSessionStart(cwd);
  let commitsSinceStart = 0;
  let diffFiles: string[] = [];
  let diffSummary = '';

  if (sessionStartCommit) {
    commitsSinceStart = await countCommitsSince(sessionStartCommit);
    // Get diff between session start and current HEAD
    const { execSync } = require('child_process');
    try {
      const diffOutput = execSync(
        `git diff --stat ${sessionStartCommit}..HEAD`,
        { cwd, encoding: 'utf-8' }
      );
      const lines = diffOutput.trim().split('\n');
      if (lines.length > 0) {
        diffSummary = lines[lines.length - 1]; // last line has summary
        diffFiles = lines.slice(0, -1).map((l: string) => l.split('|')[0].trim());
      }
    } catch {}
  }

  // Fallback: check unstaged changes
  if (diffFiles.length === 0) {
    const diff = await getDiffStat();
    diffFiles = diff.files;
    diffSummary = diff.summary;
  }

  // Clean up session file
  clearSession(cwd);

  console.log('--- Product Trace: 会话对账 ---');
  console.log();

  if (diffFiles.length > 0) {
    console.log('本次修改:');
    diffFiles.forEach(f => console.log(`  ${f}`));
    if (diffSummary) console.log(`  ${diffSummary}`);
  } else {
    console.log('本次修改: 无文件变更');
  }

  console.log();
  console.log('请回答（不能跳过）:');
  console.log();
  console.log('1. 进度: 哪些 checkbox 需要更新？');
  console.log('   → 更新 roadmap.md');
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

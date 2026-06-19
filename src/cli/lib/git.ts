import simpleGit from 'simple-git';

const git = simpleGit(process.cwd());

export async function getHeadCommit(): Promise<string> {
  const log = await git.log({ maxCount: 1 });
  return log.latest?.hash || '';
}

export async function getDiffStat(): Promise<{ files: string[]; summary: string }> {
  const diff = await git.diffSummary();
  const files = diff.files.map(f => f.file);
  return {
    files,
    summary: `${diff.insertions} insertions(+), ${diff.deletions} deletions(-) across ${diff.files.length} files`,
  };
}

export async function countCommitsSince(sinceCommit: string): Promise<number> {
  try {
    const log = await git.log({ from: sinceCommit, to: 'HEAD' });
    return log.total;
  } catch {
    return -1; // commit not found
  }
}

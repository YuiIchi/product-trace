import { describe, it, expect } from 'vitest';
import simpleGit from 'simple-git';

const git = simpleGit(process.cwd());

describe('git lib', () => {
  it('gets HEAD commit hash', async () => {
    const log = await git.log({ maxCount: 1 });
    expect(log.latest).toBeDefined();
    expect(log.latest!.hash).toMatch(/^[a-f0-9]{7,40}$/);
  });

  it('gets diff stat', async () => {
    const diff = await git.diffSummary();
    expect(diff).toBeDefined();
    expect(Array.isArray(diff.files)).toBe(true);
  });

  it('counts commits between two refs', async () => {
    const headHash = (await git.log({ maxCount: 1 })).latest!.hash;
    const log = await git.log({ from: headHash, to: 'HEAD' });
    expect(log.total).toBeGreaterThanOrEqual(0);
  });
});

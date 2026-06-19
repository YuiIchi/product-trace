import { describe, it, expect } from 'vitest';
import { parseRoadmap, getCurrentSprint, getStoryStatus } from '../roadmap';

const sampleRoadmap = `---
doc: ROADMAP
current-sprint: Sprint 2
---

# ROADMAP — Test

> 当前 Sprint: Sprint 2 ← current

## 工作流状态
- Discover: ✅ product-vision.md v1.0
- Sprint 2: ← current

## Sprint 1: 基础架构 ✅
- [x] Story-001: 初始化项目
- [x] Story-002: 配置 CI

## Sprint 2: 用户认证 ← current
- [~] Story-003: 登录
- [ ] Story-004: 注册
- [!] Story-005: 第三方登录 — API 阻塞

## Backlog
- [ ] Backlog-1 (P1)
`;

describe('parseRoadmap', () => {
  it('extracts current sprint from front-matter', () => {
    const result = parseRoadmap(sampleRoadmap);
    expect(result.currentSprint).toBe('Sprint 2');
  });

  it('parses sprints with stories and checkbox states', () => {
    const result = parseRoadmap(sampleRoadmap);

    // Sprint 1: completed with 2 done stories
    const sprint1 = result.sprints.find(s => s.name === 'Sprint 1');
    expect(sprint1).toBeDefined();
    expect(sprint1!.completed).toBe(true);
    expect(sprint1!.stories).toHaveLength(2);
    expect(sprint1!.stories[0].checkbox).toBe('[x]');

    // Sprint 2: current with 3 stories in mixed states
    const sprint2 = result.sprints.find(s => s.name === 'Sprint 2');
    expect(sprint2).toBeDefined();
    expect(sprint2!.isCurrent).toBe(true);
    expect(sprint2!.stories).toHaveLength(3);
    expect(sprint2!.stories[0].checkbox).toBe('[~]');
    expect(sprint2!.stories[0].id).toBe('Story-003');
    expect(sprint2!.stories[0].title).toBe('登录');
    expect(sprint2!.stories[1].checkbox).toBe('[ ]');
    expect(sprint2!.stories[2].checkbox).toBe('[!]');
    expect(sprint2!.stories[2].title).toBe('第三方登录');
    expect(sprint2!.stories[2].note).toBe('API 阻塞');
  });

  it('parses backlogs', () => {
    const result = parseRoadmap(sampleRoadmap);
    expect(result.backlogs).toHaveLength(1);
    expect(result.backlogs[0].id).toBe('Backlog-1');
    expect(result.backlogs[0].checkbox).toBe('[ ]');
  });
});

describe('getCurrentSprint', () => {
  it('finds the sprint marked ← current', () => {
    const result = parseRoadmap(sampleRoadmap);
    const current = getCurrentSprint(result);
    expect(current).toBeDefined();
    expect(current!.name).toBe('Sprint 2');
    expect(current!.isCurrent).toBe(true);
  });
});

describe('getStoryStatus', () => {
  it('counts stories by checkbox type', () => {
    const result = parseRoadmap(sampleRoadmap);
    const sprint2 = result.sprints.find(s => s.name === 'Sprint 2')!;
    const status = getStoryStatus(sprint2);
    expect(status.inProgress).toBe(1);
    expect(status.pending).toBe(1);
    expect(status.blocked).toBe(1);
    expect(status.completed).toBe(0);
    expect(status.total).toBe(3);
  });
});

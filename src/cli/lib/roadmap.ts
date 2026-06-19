import matter from 'gray-matter';

export interface Story {
  checkbox: '[ ]' | '[~]' | '[x]' | '[!]';
  id: string;
  title: string;
  note?: string;
}

export interface Sprint {
  name: string;
  goal: string;
  completed: boolean;
  isCurrent: boolean;
  stories: Story[];
}

export interface Roadmap {
  currentSprint: string | null;
  sprints: Sprint[];
  backlogs: Story[];
}

export function parseRoadmap(content: string): Roadmap {
  const { data, content: body } = matter(content);
  const lines = body.split('\n');
  const fmCurrentSprint = data['current-sprint'] || null;

  const sprints: Sprint[] = [];
  const backlogs: Story[] = [];
  let currentSection: 'sprint' | 'backlog' | null = null;
  let currentSprint: Sprint | null = null;

  for (const line of lines) {
    // Sprint header: ## Sprint N: <goal>
    const sprintMatch = line.match(/^## Sprint (\d+):\s*(.+)$/);
    if (sprintMatch) {
      if (currentSprint) sprints.push(currentSprint);
      const rawGoal = sprintMatch[2].trim();
      const isCompleted = rawGoal.includes('✅');
      const isCurrent = rawGoal.includes('← current');
      currentSprint = {
        name: `Sprint ${sprintMatch[1]}`,
        goal: rawGoal.replace(' ✅', '').replace(' ← current', '').trim(),
        completed: isCompleted,
        isCurrent,
        stories: [],
      };
      currentSection = 'sprint';
      continue;
    }

    // Backlog header
    if (line.match(/^## Backlog/i)) {
      if (currentSprint) sprints.push(currentSprint);
      currentSprint = null;
      currentSection = 'backlog';
      continue;
    }

    // Another ## section — end current sprint
    if (line.match(/^## /) && !line.match(/^## Sprint/)) {
      if (currentSprint && currentSection === 'sprint') {
        sprints.push(currentSprint);
        currentSprint = null;
      }
      currentSection = null;
    }

    // Checkbox line: - [x] Story-001: <title>
    const storyMatch = line.match(/^-\s*\[([ x~!])\]\s+(\S+):?\s*(.+)$/);
    if (storyMatch) {
      const checkbox = `[${storyMatch[1]}]` as Story['checkbox'];
      const id = storyMatch[2].replace(/:$/, '');
      let title = storyMatch[3].trim();
      let note: string | undefined;

      // Extract note after — (blocker reason)
      const noteMatch = title.match(/^(.+?)\s*—\s*(.+)$/);
      if (noteMatch && checkbox === '[!]') {
        title = noteMatch[1].trim();
        note = noteMatch[2].trim();
      }

      const story: Story = { checkbox, id, title, note };

      if (currentSection === 'sprint' && currentSprint) {
        currentSprint.stories.push(story);
      } else if (currentSection === 'backlog') {
        backlogs.push(story);
      }
    }
  }

  if (currentSprint) sprints.push(currentSprint);

  // Fallback: set isCurrent from frontmatter current-sprint if no ← current marker
  if (fmCurrentSprint && !sprints.some(s => s.isCurrent)) {
    const fallback = sprints.find(s => s.name === fmCurrentSprint);
    if (fallback) fallback.isCurrent = true;
  }

  return {
    currentSprint: fmCurrentSprint,
    sprints,
    backlogs,
  };
}

export function getCurrentSprint(roadmap: Roadmap): Sprint | undefined {
  return roadmap.sprints.find(s => s.isCurrent);
}

export interface StoryStatus {
  inProgress: number;
  pending: number;
  completed: number;
  blocked: number;
  total: number;
}

export function getStoryStatus(sprint: Sprint): StoryStatus {
  const status: StoryStatus = {
    inProgress: 0,
    pending: 0,
    completed: 0,
    blocked: 0,
    total: sprint.stories.length,
  };
  for (const s of sprint.stories) {
    switch (s.checkbox) {
      case '[~]':
        status.inProgress++;
        break;
      case '[ ]':
        status.pending++;
        break;
      case '[x]':
        status.completed++;
        break;
      case '[!]':
        status.blocked++;
        break;
    }
  }
  return status;
}

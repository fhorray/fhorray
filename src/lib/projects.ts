import { getPortfolioRepos, type UnifiedProject } from './github';

interface ProjectMeta {
  pt: {
    title: string;
    description: string;
  };
  en: {
    title: string;
    description: string;
  };
  cover?: string;
  video?: string;
  tags?: string[];
  priority?: number;
  enabled?: boolean;
}

// Load metadata of local projects
// Path is relative to this file (src/lib) -> ../content/projects/*/meta.json
const localProjectsMeta = import.meta.glob<{ default: ProjectMeta }>(
  '../content/projects/*/meta.json',
  { eager: true },
);

export async function getLocalProjects(lang: 'pt' | 'en'): Promise<UnifiedProject[]> {
  return Object.entries(localProjectsMeta)
    .filter(([_, meta]) => meta.default.enabled !== false)
    .map(([path, meta]) => {
    // Example of path: ../content/projects/project-1/meta.json
    // The slug is the folder name (project-1)
    const parts = path.split('/');
    const slug = parts[parts.length - 2];

    return {
      source: 'local',
      slug,
      title: meta.default[lang]?.title || meta.default.pt.title,
      description: meta.default[lang]?.description || meta.default.pt.description,
      cover: meta.default.cover,
      tags: meta.default.tags,
      priority: meta.default.priority ?? 50, // Default priority for local projects
    };
  });
}

export async function getAllProjects(env: any, lang: 'pt' | 'en'): Promise<UnifiedProject[]> {
  const localProjects = await getLocalProjects(lang);
  let githubProjects: UnifiedProject[] = [];

  try {
    githubProjects = await getPortfolioRepos(env, lang);
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    // Fallback to empty array for GitHub projects, keeping local projects
  }

  const allProjects = [...localProjects, ...githubProjects];

  // Sort by priority (lower number = higher priority)
  allProjects.sort((a, b) => a.priority - b.priority);

  return allProjects;
}

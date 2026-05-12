interface PortfolioConfig {
  enabled: boolean;
  priority?: number;
  cover?: string;
  tags?: string[];
  pt: { title: string; description: string };
  en: { title: string; description: string };
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
}

export interface UnifiedProject {
  source: 'local' | 'github';
  slug: string;
  title: string;
  description: string;
  cover?: string;
  tags?: string[];
  priority: number;
  githubUrl?: string;
  stars?: number;
  language?: string;
}

const CACHE_KEY = 'github_portfolio_repos';
const CACHE_TTL = 3600; // 1 hour in seconds

async function fetchProjectConfig(owner: string, repo: string, token?: string): Promise<PortfolioConfig | null> {
  const headers: HeadersInit = {
    'User-Agent': 'fhorray-portfolio',
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/portfolio.json`, { headers });
    if (!response.ok) return null;
    
    const data = await response.json() as { content: string };
    const binaryString = atob(data.content.replace(/\n/g, '')); // Decode base64 and remove newlines
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const content = new TextDecoder().decode(bytes);
    return JSON.parse(content) as PortfolioConfig;
  } catch (e) {
    console.error(`Error fetching config for ${repo}:`, e);
    return null;
  }
}

export async function fetchGitHubRepos(username: string, token?: string): Promise<GitHubRepo[]> {
  const headers: HeadersInit = {
    'User-Agent': 'fhorray-portfolio',
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json() as GitHubRepo[];
}

export async function getPortfolioRepos(env: any, lang: 'pt' | 'en'): Promise<UnifiedProject[]> {
  // 1. Try to read from KV cache if available
  if (env.PORTFOLIO_KV) {
    const cached = await env.PORTFOLIO_KV.get(CACHE_KEY, 'json');
    if (cached) {
      return cached as UnifiedProject[];
    }
  }

  const username = 'fhorray';
  const token = env.GITHUB_TOKEN;

  try {
    const repos = await fetchGitHubRepos(username, token);
    const portfolioProjects: UnifiedProject[] = [];

    // Process in parallel. Since there are few repos, we can try in parallel.
    const promises = repos.map(async (repo) => {
      const config = await fetchProjectConfig(username, repo.name, token);
      if (config && config.enabled) {
        portfolioProjects.push({
          source: 'github',
          slug: repo.name,
          title: config[lang]?.title || repo.name,
          description: config[lang]?.description || repo.description,
          cover: config.cover,
          tags: config.tags,
          priority: config.priority ?? 100,
          githubUrl: repo.html_url,
          stars: repo.stargazers_count,
          language: repo.language,
        });
      }
    });

    await Promise.all(promises);

    // Sort by priority
    portfolioProjects.sort((a, b) => a.priority - b.priority);

    // 2. Save to KV cache if available
    if (env.PORTFOLIO_KV && portfolioProjects.length > 0) {
      await env.PORTFOLIO_KV.put(CACHE_KEY, JSON.stringify(portfolioProjects), {
        expirationTtl: CACHE_TTL,
      });
    }

    return portfolioProjects;
  } catch (error) {
    console.error('Error in getPortfolioRepos:', error);
    return [];
  }
}

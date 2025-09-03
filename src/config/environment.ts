// Environment variables with defaults
export const config = {
  // GitHub repository for the resume YAML file
  // Format: "username/repository-name"
  RESUME_REPO: import.meta.env.VITE_RESUME_REPO || 'ahzs645/resume',
  
  // Branch to fetch from (usually 'main' or 'master')
  RESUME_BRANCH: import.meta.env.VITE_RESUME_BRANCH || 'main',
  
  // Path to the YAML file within the repository
  RESUME_FILE_PATH: import.meta.env.VITE_RESUME_FILE_PATH || 'CV.yaml',
  
  // GitHub Personal Access Token for private repositories
  // For private repos, create a token at: https://github.com/settings/tokens
  // Only needs 'repo' scope for private repositories
  GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN || '',
  
  // Fallback to local file if GitHub fetch fails
  USE_LOCAL_FALLBACK: import.meta.env.VITE_USE_LOCAL_FALLBACK !== 'false',
};

// GitHub raw URL generator
export const getGitHubRawUrl = (repo: string, branch: string, filePath: string): string => {
  return `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;
};

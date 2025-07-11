#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') });

// Configuration from environment variables
const RESUME_REPO = process.env.VITE_RESUME_REPO || 'ahzs645/resume';
const RESUME_BRANCH = process.env.VITE_RESUME_BRANCH || 'main';
const RESUME_FILE_PATH = process.env.VITE_RESUME_FILE_PATH || 'Ahmad_Jalil_CV.yaml';
// Support both custom token and GitHub Actions built-in token
const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';
const USE_LOCAL_FALLBACK = process.env.VITE_USE_LOCAL_FALLBACK !== 'false';

// Paths
const publicDir = path.join(__dirname, '..', 'public');
const localYamlPath = path.join(__dirname, '..', 'Ahmad_Jalil_CV.yaml');
const targetYamlPath = path.join(publicDir, 'Ahmad_Jalil_CV.yaml');

// GitHub URLs
const githubRawUrl = `https://raw.githubusercontent.com/${RESUME_REPO}/${RESUME_BRANCH}/${RESUME_FILE_PATH}`;
const githubApiUrl = `https://api.github.com/repos/${RESUME_REPO}/contents/${RESUME_FILE_PATH}?ref=${RESUME_BRANCH}`;

console.log(`🔄 Fetching resume from: ${GITHUB_TOKEN ? githubApiUrl : githubRawUrl}`);

async function fetchFromGitHub() {
  try {
    // For private repos with token, use GitHub API; for public repos, use raw URL
    const useApi = GITHUB_TOKEN && GITHUB_TOKEN.length > 0;
    const url = useApi ? githubApiUrl : githubRawUrl;
    
    console.log(`📡 Using ${useApi ? 'GitHub API' : 'Raw URL'} method`);
    
    // Prepare headers for authentication - Updated format
    const headers = {
      'User-Agent': 'Terminal-Portfolio-Builder',
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    
    // Add authorization header if token is provided - FIXED FORMAT
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;  // Updated to Bearer
    }
    
    console.log(`🔗 Fetching: ${url}`);
    console.log(`🔐 Auth header: ${headers['Authorization'] ? 'Bearer ***' : 'None'}`);
    
    const response = await fetch(url, { headers });
    
    console.log(`📊 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      // More detailed error handling
      const errorText = await response.text();
      console.log(`📄 Error response: ${errorText}`);
      
      if (response.status === 404) {
        const errorMsg = GITHUB_TOKEN 
          ? `Repository or file not found. Please check:\n  - Repository: ${RESUME_REPO}\n  - Branch: ${RESUME_BRANCH}\n  - File: ${RESUME_FILE_PATH}\n  - Token has access to the repository\n  - Token has 'repo' scope for private repositories`
          : `Repository or file not found. Please check:\n  - Repository: ${RESUME_REPO}\n  - Branch: ${RESUME_BRANCH}\n  - File: ${RESUME_FILE_PATH}\n  - Repository is private (add VITE_GITHUB_TOKEN to .env.local)`;
        throw new Error(errorMsg);
      }
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your GitHub token.');
      }
      if (response.status === 403) {
        // Check if it's a rate limit or permissions issue
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        if (rateLimitRemaining === '0') {
          throw new Error('GitHub API rate limit exceeded. Try again later or use a token.');
        }
        throw new Error('Access forbidden. Please check your GitHub token permissions or repository access.');
      }
      throw new Error(`GitHub fetch failed: ${response.status} ${response.statusText}`);
    }
    
    let yamlContent;
    
    if (useApi) {
      // GitHub API returns base64 encoded content
      const data = await response.json();
      if (data.encoding === 'base64') {
        yamlContent = Buffer.from(data.content, 'base64').toString('utf8');
      } else {
        throw new Error('Unexpected encoding from GitHub API');
      }
    } else {
      // Raw URL returns plain text
      yamlContent = await response.text();
    }
    
    // Basic validation that we got YAML content
    if (!yamlContent.trim()) {
      throw new Error('Empty file received from GitHub');
    }
    
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write the fetched content
    fs.writeFileSync(targetYamlPath, yamlContent, 'utf8');
    console.log(`✅ Successfully fetched and saved resume to ${targetYamlPath}`);
    console.log(`📏 Content size: ${yamlContent.length} characters`);
    console.log(`🔗 Used ${useApi ? 'GitHub API' : 'Raw URL'} method`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to fetch from GitHub: ${error.message}`);
    return false;
  }
}

async function useLocalFallback() {
  try {
    if (!fs.existsSync(localYamlPath)) {
      throw new Error(`Local YAML file not found at ${localYamlPath}`);
    }
    
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copy local file
    fs.copyFileSync(localYamlPath, targetYamlPath);
    console.log(`📁 Using local fallback: copied ${localYamlPath} to ${targetYamlPath}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Local fallback failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting resume fetch process...');
  console.log(`📂 Repository: ${RESUME_REPO}`);
  console.log(`🌿 Branch: ${RESUME_BRANCH}`);
  console.log(`📄 File: ${RESUME_FILE_PATH}`);
  console.log(`🔐 Token: ${GITHUB_TOKEN ? '✅ Provided' : '❌ Not provided (public repos only)'}`);
  console.log(`🔄 Local fallback: ${USE_LOCAL_FALLBACK ? 'enabled' : 'disabled'}`);
  console.log('');
  
  // Try to fetch from GitHub first
  const githubSuccess = await fetchFromGitHub();
  
  if (!githubSuccess && USE_LOCAL_FALLBACK) {
    console.log('🔄 Trying local fallback...');
    const localSuccess = await useLocalFallback();
    
    if (!localSuccess) {
      console.error('❌ Both GitHub fetch and local fallback failed!');
      process.exit(1);
    }
  } else if (!githubSuccess) {
    console.error('❌ GitHub fetch failed and local fallback is disabled!');
    process.exit(1);
  }
  
  console.log('🎉 Resume fetch process completed successfully!');
}

main().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
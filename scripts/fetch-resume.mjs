#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// GitHub raw URL
const githubUrl = `https://raw.githubusercontent.com/${RESUME_REPO}/${RESUME_BRANCH}/${RESUME_FILE_PATH}`;

console.log(`🔄 Fetching resume from: ${githubUrl}`);

async function fetchFromGitHub() {
  try {
    // Prepare headers for authentication
    const headers = {
      'User-Agent': 'Terminal-Portfolio-Builder'
    };
    
    // Add authorization header if token is provided
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    
    const response = await fetch(githubUrl, { headers });
    
    if (!response.ok) {
      if (response.status === 404) {
        const errorMsg = GITHUB_TOKEN 
          ? `Repository or file not found. Please check:\n  - Repository: ${RESUME_REPO}\n  - Branch: ${RESUME_BRANCH}\n  - File: ${RESUME_FILE_PATH}\n  - Token has access to the repository`
          : `Repository or file not found. Please check:\n  - Repository: ${RESUME_REPO}\n  - Branch: ${RESUME_BRANCH}\n  - File: ${RESUME_FILE_PATH}\n  - Repository is private (add VITE_GITHUB_TOKEN to .env.local or use GitHub secrets)`;
        throw new Error(errorMsg);
      }
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your GitHub token or use GitHub secrets for CI/CD.');
      }
      if (response.status === 403) {
        throw new Error('Access forbidden. Please check your GitHub token permissions or repository access.');
      }
      throw new Error(`GitHub fetch failed: ${response.status} ${response.statusText}`);
    }
    
    const yamlContent = await response.text();
    
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
  console.log(`� Token: ${GITHUB_TOKEN ? '✅ Provided' : '❌ Not provided (public repos only)'}`);
  console.log(`�🔄 Local fallback: ${USE_LOCAL_FALLBACK ? 'enabled' : 'disabled'}`);
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

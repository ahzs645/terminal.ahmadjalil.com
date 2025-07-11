#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const RESUME_REPO = process.env.VITE_RESUME_REPO || 'ahzs645/resume';
const RESUME_BRANCH = process.env.VITE_RESUME_BRANCH || 'main';
const RESUME_FILE_PATH = process.env.VITE_RESUME_FILE_PATH || 'Ahmad_Jalil_CV.yaml';
const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';

async function debugGitHubAccess() {
  console.log('🔍 Debugging GitHub API access...\n');
  
  const headers = {
    'User-Agent': 'Terminal-Portfolio-Debug',
    'Accept': 'application/vnd.github.v3+json'
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  
  // Test 1: Check repository access
  console.log('📁 Testing repository access...');
  const repoUrl = `https://api.github.com/repos/${RESUME_REPO}`;
  
  try {
    const repoResponse = await fetch(repoUrl, { headers });
    console.log(`Repository API Status: ${repoResponse.status}`);
    
    if (repoResponse.ok) {
      const repoData = await repoResponse.json();
      console.log(`✅ Repository found: ${repoData.full_name}`);
      console.log(`   Private: ${repoData.private}`);
      console.log(`   Default branch: ${repoData.default_branch}`);
    } else {
      console.log(`❌ Repository access failed: ${repoResponse.statusText}`);
      const errorData = await repoResponse.text();
      console.log(`Error details: ${errorData}`);
    }
  } catch (error) {
    console.log(`❌ Repository request failed: ${error.message}`);
  }
  
  console.log('');
  
  // Test 2: Check file access
  console.log('📄 Testing file access...');
  const fileUrl = `https://api.github.com/repos/${RESUME_REPO}/contents/${RESUME_FILE_PATH}?ref=${RESUME_BRANCH}`;
  
  try {
    const fileResponse = await fetch(fileUrl, { headers });
    console.log(`File API Status: ${fileResponse.status}`);
    
    if (fileResponse.ok) {
      const fileData = await fileResponse.json();
      console.log(`✅ File found: ${fileData.name}`);
      console.log(`   Size: ${fileData.size} bytes`);
      console.log(`   SHA: ${fileData.sha}`);
    } else {
      console.log(`❌ File access failed: ${fileResponse.statusText}`);
      const errorData = await fileResponse.text();
      console.log(`Error details: ${errorData}`);
    }
  } catch (error) {
    console.log(`❌ File request failed: ${error.message}`);
  }
  
  console.log('');
  
  // Test 3: List repository contents
  console.log('📂 Listing repository root contents...');
  const contentsUrl = `https://api.github.com/repos/${RESUME_REPO}/contents`;
  
  try {
    const contentsResponse = await fetch(contentsUrl, { headers });
    console.log(`Contents API Status: ${contentsResponse.status}`);
    
    if (contentsResponse.ok) {
      const contentsData = await contentsResponse.json();
      console.log(`✅ Repository contents:`);
      contentsData.forEach(item => {
        console.log(`   ${item.type === 'dir' ? '📁' : '📄'} ${item.name}`);
      });
    } else {
      console.log(`❌ Contents access failed: ${contentsResponse.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Contents request failed: ${error.message}`);
  }
}

debugGitHubAccess();

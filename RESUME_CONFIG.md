# Resume Repository Configuration

This project can now fetch your resume YAML file from any GitHub repository during the build process. This makes it easy to maintain your resume separately and allows others to use their own resume repositories.

## Quick Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your repository details:**
   ```env
   VITE_RESUME_REPO=your-username/your-resume-repo
   VITE_RESUME_BRANCH=main
   VITE_RESUME_FILE_PATH=your-resume-file.yaml
   VITE_GITHUB_TOKEN=ghp_your_token_here  # Required for private repos
   ```

3. **Test your configuration:**
   ```bash
   npm run validate-resume-config  # Validates your GitHub setup
   ```

4. **Build or develop:**
   ```bash
   npm run build  # Fetches resume and builds
   npm run dev    # For development
   ```

## Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_RESUME_REPO` | `ahzs645/resume` | GitHub repository in format `username/repo-name` |
| `VITE_RESUME_BRANCH` | `main` | Git branch to fetch from |
| `VITE_RESUME_FILE_PATH` | `Ahmad_Jalil_CV.yaml` | Path to YAML file in the repository |
| `VITE_GITHUB_TOKEN` | _(empty)_ | Personal Access Token for private repositories |
| `VITE_USE_LOCAL_FALLBACK` | `true` | Whether to use local file if GitHub fetch fails |

## Available Scripts

- `npm run validate-resume-config` - Test your GitHub repository configuration
- `npm run prepare-cv` - Fetch resume from GitHub (standalone)
- `npm run prepare-cv-local` - Use local YAML file (fallback)
- `npm run build` - Full build process (includes resume fetch)
- `npm run dev` - Development mode (tries GitHub in dev if local fails)

## GitHub Token Setup (for Private Repositories)

There are several ways to handle authentication for private repositories:

### Option 1: Local Development Only (Personal Access Token)

For local development with private repositories:

1. **Create a token:**
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Give it a descriptive name like "Terminal Portfolio Resume Access"
   - Set expiration as needed
   - Select scopes:
     - For private repos: `repo` (Full control of private repositories)
     - For public repos: `public_repo` (Access public repositories)

2. **Add to your local environment:**
   ```env
   VITE_GITHUB_TOKEN=ghp_your_token_here
   ```

⚠️ **Security Note:** Never commit your `.env.local` file or expose your token publicly.

### Option 2: GitHub Actions (Recommended for Production)

For GitHub Actions deployment:

#### Same User/Organization (Automatic)
If your resume repo is under the same GitHub user/organization as your portfolio:
- No additional setup needed! 
- GitHub Actions automatically uses `GITHUB_TOKEN` with appropriate permissions

#### Different User/Organization (Custom Token)
If your resume repo is under a different user/organization:

1. **Create a Personal Access Token** (same steps as Option 1)
2. **Add to Repository Secrets:**
   - Go to your portfolio repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `RESUME_GITHUB_TOKEN`
   - Value: Your personal access token

### Option 3: Public Repository (No Token Required)

Make your resume repository public:
- No authentication needed
- Works immediately with any configuration
- Resume data is publicly accessible (consider privacy implications)

## How It Works

1. **Build Time**: The `scripts/fetch-resume.mjs` script runs before the build
2. **GitHub Fetch**: Downloads your YAML file from the specified repository
3. **Local Fallback**: If GitHub fails and enabled, uses local `Ahmad_Jalil_CV.yaml`
4. **Runtime**: The app loads the YAML from the public directory

## Example Repository Structure

Your resume repository should contain a YAML file with the CV data:

```
your-resume-repo/
├── README.md
├── Ahmad_Jalil_CV.yaml  (or your custom filename)
└── other-files...
```

## Benefits

- ✅ **Centralized Resume**: Keep your resume in a dedicated repository
- ✅ **Easy Sharing**: Others can fork and use their own resume repo
- ✅ **Version Control**: Full history of resume changes
- ✅ **Automatic Updates**: Website updates when you push resume changes
- ✅ **Fallback Support**: Works offline with local files
- ✅ **Flexible Configuration**: Customize repo, branch, and file paths

## Error Handling

The system includes multiple fallback levels:

1. **Primary**: Fetch from configured GitHub repository
2. **Development Fallback**: Direct GitHub fetch in dev mode
3. **Local Fallback**: Use local YAML file (if enabled)
4. **Ultimate Fallback**: Default empty CV structure

## Deployment

## Deployment

### GitHub Actions Setup

The included workflow (`.github/workflows/deploy.yml`) automatically handles resume fetching and deployment:

#### Repository Variables (Optional)
Configure these in your repository settings if different from defaults:
- `RESUME_REPO` - Your resume repository (default: `ahzs645/resume`)
- `RESUME_BRANCH` - Branch to fetch from (default: `main`)
- `RESUME_FILE_PATH` - Path to YAML file (default: `Ahmad_Jalil_CV.yaml`)
- `USE_LOCAL_FALLBACK` - Enable local fallback (default: `true`)

#### Repository Secrets (If Needed)
Only required for cross-user private repositories:
- `RESUME_GITHUB_TOKEN` - Personal Access Token for accessing different user's private repo

#### Automatic Deployment Triggers
The workflow runs on:
- Push to `main` branch
- Manual trigger (workflow_dispatch)
- External webhook (repository_dispatch with type `resume-updated`)

### Setting Up Cross-Repository Updates

To automatically rebuild your portfolio when your resume repository is updated:

1. **In your resume repository**, create `.github/workflows/trigger-portfolio.yml`:
   ```yaml
   name: Trigger Portfolio Update
   on:
     push:
       branches: [ main ]
   
   jobs:
     trigger:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger portfolio rebuild
           run: |
             curl -X POST \
               -H "Authorization: token ${{ secrets.PORTFOLIO_TRIGGER_TOKEN }}" \
               -H "Accept: application/vnd.github.v3+json" \
               https://api.github.com/repos/YOUR_USERNAME/terminal.ahmadjalil.com/dispatches \
               -d '{"event_type":"resume-updated"}'
   ```

2. **Create a token** for cross-repository triggering and add it as `PORTFOLIO_TRIGGER_TOKEN` secret in your resume repository.

For automatic deployment with updated resumes:

1. **GitHub Actions**: Set up workflow to trigger builds on resume repo changes
2. **Webhooks**: Configure your hosting platform to rebuild on resume updates
3. **Environment Variables**: Set the configuration in your hosting platform

Example GitHub Actions workflow:
```yaml
name: Deploy on Resume Update
on:
  repository_dispatch:
    types: [resume-updated]
  
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      VITE_RESUME_REPO: ${{ secrets.RESUME_REPO }}
      VITE_RESUME_BRANCH: main
      VITE_RESUME_FILE_PATH: Ahmad_Jalil_CV.yaml
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

# Terminal Portfolio - Ahmad Jalil

A terminal-style portfolio website built with React, TypeScript, and Styled-Components, featuring dynamic CV data loading from YAML files.

**Live Demo:** [terminal.ahmadjalil.com](https://terminal.ahmadjalil.com)

## Overview

This is my personal terminal portfolio website that dynamically loads CV data from YAML files. Forked from [Sat Naing's terminal-portfolio](https://github.com/satnaing/terminal-portfolio) and enhanced with comprehensive CV management features.

## Features

### Core Terminal Features (from original)
- Responsive design for all devices
- Multiple themes (6 available)
- Autocomplete with TAB or Ctrl+i
- Command history navigation
- PWA and offline support
- Comprehensive test coverage

### Enhanced CV Features (my additions)
- **YAML-Driven CV System** - Dynamic CV data loading from YAML files
- **Easy Updates** - Update CV by editing YAML file only
- **Detailed Experience View** - `experience-details` command with full work history
- **Complete CV Sections** - Education, awards, publications, volunteer work
- **CV Overview** - Quick summary with section counts

## Tech Stack

- **Frontend:** React 18, TypeScript, Styled-Components
- **Data:** YAML parsing with js-yaml
- **Testing:** Vitest, React Testing Library
- **Build:** Vite
- **Deployment:** GitHub Pages

## Available Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `cv` | Complete CV overview with section counts |
| `education` | Academic background |
| `experience` | Work experience summary |
| `experience-details` | Detailed work experience with achievements |
| `volunteer` | Community involvement |
| `awards` | Recognition and achievements |
| `publications` | Research papers |
| `themes` | Switch between color themes |
| `clear` | Clear the terminal |

## YAML-Driven CV System

The portfolio can automatically pull CV data from any GitHub repository, making it easy to maintain your resume separately and allowing others to fork this project with their own resume data.

### Quick Setup for Your Own Resume

1. **Fork this repository**
2. **Configure your resume source:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your resume repository details
   ```
3. **Build and deploy:**
   ```bash
   npm run build  # Automatically fetches your resume
   ```

See [RESUME_CONFIG.md](RESUME_CONFIG.md) for detailed configuration options.

### Default Configuration

By default, pulls from `ahzs645/resume` repository. To update my CV:

1. Edit YAML in the [resume repository](https://github.com/ahzs645/resume)
2. Commit and push changes
3. GitHub Actions automatically deploys (using built-in `GITHUB_TOKEN`)

No additional setup required for same-user repositories!

## Running Locally

```bash
git clone https://github.com/ahzs645/terminal.ahmadjalil.com.git
cd terminal.ahmadjalil.com
npm install
npm run prepare-cv  # Fetches resume from GitHub
npm run dev
```

### Using Your Own Resume

```bash
# Configure your resume repository
cp .env.example .env.local
# Edit .env.local with your settings

# Fetch your resume and run
npm run prepare-cv
npm run dev
```

## Credits

Forked from [terminal-portfolio](https://github.com/satnaing/terminal-portfolio) by Sat Naing (@satnaing).

### My Contributions
- **GitHub Resume Integration** - Fetch resume from any GitHub repository
- **Configurable Resume Source** - Easy setup for others to use their own resumes
- YAML-driven CV data management system
- Enhanced CV commands and detailed views
- Professional focus for academic/research presentation
- Improved TypeScript interfaces and data handling

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Ahmad Jalil** - Researcher passionate about solving real-life challenges  
Website: [ahmadjalil.com](https://ahmadjalil.com) | Email: me@ahmadjalil.com
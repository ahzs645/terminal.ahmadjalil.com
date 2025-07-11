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

The portfolio automatically pulls CV data from `Ahmad_Jalil_CV.yaml`. To update:

1. Edit `Ahmad_Jalil_CV.yaml`
2. Commit and push changes
3. GitHub Actions automatically deploys

No code changes required.

## Running Locally

```bash
git clone https://github.com/ahzs645/terminal.ahmadjalil.com.git
cd terminal.ahmadjalil.com
pnpm install
pnpm run prepare-cv
pnpm dev
```

## Credits

Forked from [terminal-portfolio](https://github.com/satnaing/terminal-portfolio) by Sat Naing (@satnaing).

### My Contributions
- YAML-driven CV data management system
- Enhanced CV commands and detailed views
- Professional focus for academic/research presentation
- Improved TypeScript interfaces and data handling

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Ahmad Jalil** - Researcher passionate about solving real-life challenges  
Website: [ahmadjalil.com](https://ahmadjalil.com) | Email: me@ahmadjalil.com
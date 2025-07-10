# Terminal Portfolio - Ahmad Jalil

A terminal-style portfolio website that dynamically loads CV data from YAML files.

## Key Features

### 🚀 YAML-Driven CV System
The portfolio now automatically pulls CV data from `Ahmad_Jalil_CV.yaml`, making updates as simple as editing a text file:

- **Dynamic Commands**: `cv`, `education`, `experience`, `awards`, `publications`, `volunteer`
- **Auto-scaling**: Add or remove sections without touching code
- **Type Safety**: Full TypeScript support for all CV data
- **Terminal Aesthetic**: Maintains authentic terminal look and feel

### 📋 Available Commands
Try these commands in the terminal:
- `cv` - Complete CV overview with section counts
- `about` - Personal information
- `education` - Academic background
- `experience` - Work history with achievements
- `volunteer` - Community involvement
- `awards` - Recognition and achievements
- `publications` - Research papers
- `help` - See all available commands

### 🛠 Easy Updates
To update your CV information:
1. Edit `Ahmad_Jalil_CV.yaml`
2. Copy to `public/Ahmad_Jalil_CV.yaml`
3. Refresh the website

No code changes required!

## Technical Implementation

See [YAML_CV_SYSTEM.md](./YAML_CV_SYSTEM.md) for detailed technical documentation.

## Development

```bash
pnpm install
pnpm dev
```

The site will be available at `http://localhost:5173` (or next available port).

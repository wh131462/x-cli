# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

X-CLI is a Node.js command-line tool for scaffolding frontend projects (Vue/React/Angular) and managing development tools. It provides unified package manager wrappers (npm/yarn/pnpm/bun) and dev tool configuration.

Published as `@eternalheart/x-cli` on npm (ES Module).

## Development Commands

```bash
# Local development - link package globally for testing
npm run dev          # npm link
npm run dev:quit     # npm unlink

# Build (uses esbuild, outputs to dist/)
npm run build

# Publish to npm (builds first)
npm run cli:publish
npm run cli:publish:update  # bumps version then publishes

# Commits (uses commitizen with conventional changelog)
npm run commit
```

## CLI Commands

```bash
# Project creation
x new <name>              # Create Vue/React/Angular project (interactive)

# Dev tools management
x plugin init             # Initialize all dev tools (interactive)
x plugin install [name]   # Install plugin(s)
x plugin uninstall [name] # Uninstall plugin(s)
x plugin list             # List plugin status

# Package manager wrappers (auto-detect npm/yarn/pnpm/bun)
xi [package] [-D] [-g]    # Install
xu [package] [-g]         # Uninstall
xr [script]               # Run script

x update                  # Update CLI
```

## Architecture

### Directory Structure

- **bin/** - CLI entry points (`x.js`, `xi.js`, `xu.js`, `xr.js`)
- **common/** - Core logic (imported via `#common/*` path alias)
  - **command/** - Command implementations (init, new, plugin, update, xi, xu, xr)
  - **constants/** - Configuration (framework.const.js, devtools.const.js, manager.const.js)
  - **utils/** - Utilities (file ops, package managers, string transforms, UI helpers)

### Key Patterns

1. **Path Alias**: Use `#common/*` for imports (configured in jsconfig.json and package.json)

2. **Package Manager Detection** (in order):
   - `package.json` packageManager field
   - Lock file (pnpm-lock.yaml > yarn.lock > bun.lockb > package-lock.json)
   - Global installation (pnpm > yarn > bun > npm)
   - npm fallback

3. **Package Manager Abstraction** (`common/utils/manager/`):
   - `manager.js` - Detection logic and manager dispatch
   - `npm.js`, `pnpm.js`, `yarn.js`, `bun.js` - Individual implementations
   - Unified interface: `{ has, install, uninstall, run, npx }`

4. **Plugin Interface** (`common/command/plugin/plugins/`):
   - Each plugin exports `{ check(), install({ monorepo }), uninstall() }`
   - Plugins: gitignore, eslint, prettier, lint-staged, commitLint, husky

5. **Monorepo Detection**: Checks for pnpm-workspace.yaml, lerna.json, nx.json, turbo.json, or package.json workspaces

### Build System (esbuild.config.js)

- Bundles 4 entry points (bin/*.js) to dist/
- Target: Node 20+, ESM format, minified
- External packages not bundled
- Copies package.json (cleaned), readme.md to dist/

## Key Files

- **[manager.js](common/utils/manager/manager.js)** - Package manager detection and dispatch
- **[new.js](common/command/new/new.js)** - Project creation (Vue/React/Angular)
- **[plugin.js](common/command/plugin/plugin.js)** - Dev tools management
- **[framework.const.js](common/constants/framework.const.js)** - Framework CLI commands
- **[devtools.const.js](common/constants/devtools.const.js)** - Dev tool configurations

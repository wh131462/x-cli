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

# AI Workspace (Powered by OpenCode)
xa                        # Launch OpenCode TUI
xa --config               # Run configuration wizard
xa --manage               # Manage providers (add/edit/delete)
xa --info                 # Display configuration information
xa --info --verbose       # Display detailed configuration
xa -p [provider]          # Select provider (interactive if not specified)
xa -m [model]             # Select model (interactive if not specified)

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

- Bundles 4 entry points (bin/\*.js) to dist/
- Target: Node 20+, ESM format, minified
- External packages not bundled
- Copies package.json (cleaned), readme.md to dist/

## Key Files

- **[manager.js](common/utils/manager/manager.js)** - Package manager detection and dispatch
- **[new.js](common/command/new/new.js)** - Project creation (Vue/React/Angular)
- **[plugin.js](common/command/plugin/plugin.js)** - Dev tools management
- **[ai.js](common/command/ai/ai.js)** - AI Workspace integration (OpenCode TUI)
- **[framework.const.js](common/constants/framework.const.js)** - Framework CLI commands
- **[devtools.const.js](common/constants/devtools.const.js)** - Dev tool configurations

## AI Workspace (xa) Configuration

### Provider Configuration

X-CLI's AI功能基于 OpenCode, 配置存储在三个位置:

1. **`<x-cli-root>/opencode.json`** - X-CLI 专属 Provider 配置 (baseURL, models, options)
2. **`~/.config/opencode/opencode.json`** - OpenCode 全局配置 (首次运行可自动导入)
3. **`~/.local/share/opencode/auth.json`** - API Keys (由 `/connect` 命令或 `xa --manage` 管理)

**首次运行优化**: 如果用户之前安装过 OpenCode 并配置了全局配置，X-CLI 会在首次运行时检测并询问是否导入已有的 Provider 配置，避免重复配置。

### 配置文件说明

#### opencode.json 结构

```json
{
    "$schema": "https://opencode.ai/config.json",
    "provider": {
        "anthropic": {
            "npm": "@ai-sdk/anthropic",
            "name": "Anthropic (AI-in-One Proxy)",
            "options": {
                "baseURL": "https://ai-in.one"
            }
        },
        "deepseek": {
            "options": {
                "baseURL": "https://api.deepseek.com/v1"
            }
        }
    },
    "model": "anthropic/claude-sonnet-4-5"
}
```

#### auth.json 结构

```json
{
    "anthropic": {
        "type": "api",
        "key": "sk-ant-..."
    },
    "deepseek": {
        "type": "api",
        "key": "sk-..."
    }
}
```

### 配置优先级

OpenCode 会**合并**多个配置源，而非替换:

1. **Remote config** - `.well-known/opencode` (组织默认配置)
2. **Global config** - `~/.config/opencode/opencode.json` (全局用户配置)
3. **Custom config** - `OPENCODE_CONFIG` 环境变量指定的配置 (X-CLI 使用此方式)
4. **Project config** - 项目根目录的 `opencode.json` (项目特定配置)

**重要**: 配置是合并而非替换。后加载的配置只覆盖冲突的键，非冲突项保留。

### 配置管理工作流

#### 查看配置状态

```bash
# 查看配置摘要
xa --info

# 查看详细配置(包括所有 Provider 来源)
xa --info --verbose
```

#### 配置检查与自动修复

系统会自动检测以下问题:

- **auth-only**: Provider 只在 auth.json 中，配置不完整（**支持自动修复**）
- **missing-key**: Provider 在 config 中但缺少 API Key
- **invalid-model**: 默认模型的 Provider 未配置

**自动修复功能**: 当检测到配置不完整的 Provider (auth-only) 时，系统会提示是否立即修复：

- 自动补全 provider 配置 (id, name, baseURL, models)
- 保留已有的 API Key
- 交互式收集必要信息（API 类型、地址、模型列表等）

#### 修改配置后如何生效?

配置在启动时加载，修改后需要注意:

1. **删除 Provider 配置**

    ```bash
    # 方式1: 使用管理命令删除
    xa --manage  # 选择要删除的 provider

    # 方式2: 手动编辑配置文件
    # 编辑 opencode.json 删除 provider 配置
    # 编辑 auth.json 删除对应的 key
    ```

2. **添加新 Provider**

    ```bash
    xa --manage  # 选择 "添加新的 Provider"
    ```

3. **修改 baseURL 或其他选项**
    ```bash
    # 直接编辑 opencode.json, 下次启动生效
    vim <x-cli-root>/opencode.json
    ```

#### 配置验证与自动修复示例

启动时自动验证配置并提供修复:

```bash
$ xa

[配置警告]
  ⚠ 以下 Provider 只在 auth.json 中存在，配置不完整:
    - tron

  说明: 这些 Provider 的 API Key 已保存，但缺少完整配置
  建议: 立即修复以确保正常使用

? 是否立即修复这些 Provider 配置? (Y/n) Y

[自动修复配置]
检测到 1 个不完整的 Provider 配置

正在修复: tron
  ? 显示名称 (留空使用 "tron"): Tron (Anthropic 兼容)
  ? API 类型: Anthropic 兼容 (Claude)
  ? API 地址 (留空使用默认): https://openapi.troncode.cn
  ? 是否添加模型列表? (Y/n) Y
  输入模型名称 (每行一个，输入空行结束):
    模型 1: claude-3-5-sonnet-20241022
    模型 2: claude-3-5-haiku-20241022
    模型 3:
✓ tron 配置已补全

✓ 已修复 1 个 Provider 配置

✓ 配置修复完成，现在可以正常使用了
```

### 常见问题

#### Q: 为什么修改了 opencode.json，provider 还是显示旧的?

A: 可能原因:

1. **auth.json 中仍有旧的 API Key** - 即使删除了 config 配置，auth.json 中的 provider 仍会被加载
2. **解决方法**: 使用 `xa --manage` 删除不需要的 provider，或手动编辑 `~/.local/share/opencode/auth.json`

#### Q: 如何完全清理配置重新开始?

A: 删除两个配置文件:

```bash
# 删除 provider 配置
rm <x-cli-root>/opencode.json

# 删除 API keys
rm ~/.local/share/opencode/auth.json

# 重新配置
xa --config
```

#### Q: 如何在多个项目间共享 Provider 配置?

A: 使用 global config:

```bash
# 编辑全局配置
vim ~/.config/opencode/opencode.json

# 添加 provider 配置，所有项目都会继承
```

### 配置文件位置总结

| 文件                    | 位置                       | 用途              | 管理方式                    |
| ----------------------- | -------------------------- | ----------------- | --------------------------- |
| `opencode.json`         | `<x-cli-root>/`            | X-CLI 专属配置    | 手动编辑或 `xa --config`    |
| `opencode.json`         | `~/.config/opencode/`      | OpenCode 全局配置 | 首次运行自动导入或手动编辑  |
| `auth.json`             | `~/.local/share/opencode/` | API Keys          | `xa --manage` 或 `/connect` |
| `opencode.example.json` | `<x-cli-root>/`            | 配置模板          | 只读参考                    |

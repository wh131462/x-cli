# X-CLI

X-CLI 是一个前端项目脚手架和开发工具管理 CLI。支持创建 Vue/React/Angular 项目，并提供统一的包管理器封装和开发工具配置。

## 安装

```bash
npm install @eternalheart/x-cli -g
```

## 功能特性

- **多框架支持**：一键创建 Vue、React、Angular 项目
- **包管理器统一封装**：支持 npm/yarn/pnpm/bun，自动检测并使用正确的包管理器
- **开发工具管理**：一键配置 ESLint、Prettier、Husky、Commitlint 等
- **Monorepo 支持**：自动检测 monorepo 项目并应用对应配置
- **AI 工作区**：集成 Claude/OpenAI，支持文件读写、命令执行等 Agent 能力

## 使用说明

### 创建新项目

```bash
x new <projectName>
```

交互式选择框架（Vue/React/Angular/Vanilla）和工具，自动调用官方 CLI 创建项目。

### 开发工具管理

```bash
# 一键初始化所有开发工具（推荐）
x plugin init

# 安装指定插件
x plugin install <pluginName>

# 卸载插件
x plugin uninstall <pluginName>

# 查看插件状态
x plugin list
```

支持的插件：
- `gitignore` - Git 忽略文件
- `eslint` - 代码检查
- `prettier` - 代码格式化
- `lint-staged` - 暂存文件检查
- `commitLint` - 提交信息规范
- `husky` - Git Hooks

### 包管理器封装

```bash
# 安装依赖
xi [packageName] [-D] [-g]

# 卸载依赖
xu [packageName] [-g]

# 运行脚本
xr [script]
```

包管理器检测优先级：
1. `package.json` 的 `packageManager` 字段
2. 锁文件检测（pnpm-lock.yaml / yarn.lock / bun.lockb / package-lock.json）
3. 全局安装的包管理器（pnpm > yarn > bun > npm）
4. npm 兜底

### AI 工作区

基于 [OpenCode](https://github.com/anomalyco/opencode) 的完整 AI TUI 工作区。

```bash
# 启动 AI 工作区 (首次运行会自动进入配置向导)
xa

# 运行配置向导
xa --config

# 管理多个 Provider (添加/切换/修改/删除)
xa --manage

# 使用指定提供者
xa --provider openai

# 使用指定模型
xa --model gpt-4o
```

配置向导支持：
- Anthropic (Claude)
- OpenAI (GPT)
- Google (Gemini)
- DeepSeek
- Groq (快速推理)
- Azure OpenAI
- Amazon Bedrock
- Ollama (本地模型)
- OpenAI 兼容 API (自定义 baseUrl)

多 Provider 管理：
- 支持配置多个 Provider，随时切换
- Key 失效时可通过 `xa --manage` 修改配置
- 可以添加、删除、切换默认 Provider

OpenCode TUI 功能：
- 完整的终端 UI 界面
- 多轮对话 & 流式输出
- 文件读写、命令执行
- 内置斜杠命令 (`/help`, `/model`, `/init` 等)

配置方式：
```bash
# 方式1: 配置向导 (推荐)
xa --config

# 方式2: 环境变量
export ANTHROPIC_API_KEY=your-key
export OPENAI_API_KEY=your-key
```

### 其他命令

```bash
# 更新 x-cli
x update

# 查看文档
x doc
```

## 构建与发布

```bash
npm run build
npm run cli:publish
```

## 提交规范

使用 commitlint 和 cz-conventional-changelog 确保提交信息规范。

```bash
npm run commit
```

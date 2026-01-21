/**
 * AI 工作区命令入口
 * 支持配置向导 + OpenCode TUI
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { select, input, confirm } from '#common/utils/ui/promot.js';
import { logger } from '#common/utils/x/logger.js';

/**
 * 从 API 获取支持的模型列表
 * @param {string} baseUrl - API 地址
 * @param {string} apiKey - API Key
 * @returns {Promise<string[]>} 模型列表
 */
const fetchModelsFromApi = async (baseUrl, apiKey) => {
    try {
        // 移除末尾的 /v1 或 /
        const cleanUrl = baseUrl.replace(/\/v1\/?$/, '').replace(/\/$/, '');
        const modelsUrl = `${cleanUrl}/v1/models`;

        console.log(`正在获取模型列表...`);

        const response = await fetch(modelsUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(10000) // 10秒超时
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();

        // OpenAI 格式: { data: [{ id: "model-name" }, ...] }
        if (data.data && Array.isArray(data.data)) {
            const models = data.data
                .map(m => m.id)
                .filter(Boolean)
                .sort();
            console.log(`✓ 获取到 ${models.length} 个模型\n`);
            return models;
        }

        return [];
    } catch (error) {
        // 静默失败，回退到手动输入
        return [];
    }
};

// 支持的提供者 (对齐 OpenCode 官方支持)
// https://opencode.ai/docs/providers
const PROVIDERS = {
    anthropic: {
        name: 'Anthropic (Claude)',
        envKey: 'ANTHROPIC_API_KEY',
        models: ['claude-sonnet-4-5', 'claude-opus-4-5', 'claude-3-5-sonnet-20241022'],
        supportsBaseUrl: false
    },
    openai: {
        name: 'OpenAI (GPT)',
        envKey: 'OPENAI_API_KEY',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1', 'o1-mini', 'o3-mini'],
        supportsBaseUrl: true
    },
    google: {
        name: 'Google (Gemini)',
        envKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
        models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
        supportsBaseUrl: false
    },
    deepseek: {
        name: 'DeepSeek',
        envKey: 'DEEPSEEK_API_KEY',
        models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'],
        supportsBaseUrl: true,
        defaultBaseUrl: 'https://api.deepseek.com/v1'
    },
    groq: {
        name: 'Groq (快速推理)',
        envKey: 'GROQ_API_KEY',
        models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
        supportsBaseUrl: false
    },
    'azure-openai': {
        name: 'Azure OpenAI',
        envKey: 'AZURE_OPENAI_API_KEY',
        models: [],
        supportsBaseUrl: true,
        requiresBaseUrl: true,
        extraConfig: ['resourceName', 'deploymentName']
    },
    'amazon-bedrock': {
        name: 'Amazon Bedrock',
        envKey: 'AWS_ACCESS_KEY_ID',
        models: ['anthropic.claude-3-5-sonnet-20241022-v2:0', 'anthropic.claude-3-haiku-20240307-v1:0'],
        supportsBaseUrl: false,
        extraEnvKeys: ['AWS_SECRET_ACCESS_KEY', 'AWS_REGION']
    },
    ollama: {
        name: 'Ollama (本地模型)',
        envKey: null,
        models: [],
        supportsBaseUrl: true,
        defaultBaseUrl: 'http://localhost:11434/v1',
        noApiKey: true
    },
    'openai-compatible': {
        name: 'OpenAI 兼容 API (自定义)',
        envKey: 'OPENAI_API_KEY',
        models: [],
        supportsBaseUrl: true,
        requiresBaseUrl: true
    }
};

/**
 * 获取配置文件路径
 */
const getConfigPath = () => {
    return resolve(process.cwd(), 'opencode.json');
};

/**
 * 读取现有配置
 */
const loadConfig = () => {
    const configPath = getConfigPath();
    if (existsSync(configPath)) {
        try {
            return JSON.parse(readFileSync(configPath, 'utf-8'));
        } catch {
            return {};
        }
    }
    return {};
};

/**
 * 保存配置
 */
const saveConfig = (config) => {
    const configPath = getConfigPath();
    writeFileSync(configPath, JSON.stringify(config, null, 2));
};

/**
 * 检查是否已配置
 */
const isConfigured = () => {
    // 检查常见环境变量
    const envKeys = [
        'ANTHROPIC_API_KEY',
        'OPENAI_API_KEY',
        'GOOGLE_GENERATIVE_AI_API_KEY',
        'DEEPSEEK_API_KEY',
        'GROQ_API_KEY',
        'AZURE_OPENAI_API_KEY',
        'AWS_ACCESS_KEY_ID'
    ];

    if (envKeys.some(key => process.env[key])) {
        return true;
    }

    // 检查配置文件
    const config = loadConfig();
    if (config.provider) {
        for (const [providerName, providerConfig] of Object.entries(config.provider)) {
            // Ollama 等本地模型不需要 API Key
            if (PROVIDERS[providerName]?.noApiKey) {
                return true;
            }
            if (providerConfig.options?.apiKey) {
                return true;
            }
        }
    }

    return false;
};

/**
 * 获取已配置的 providers 列表
 */
const getConfiguredProviders = () => {
    const config = loadConfig();
    const providers = [];

    if (config.provider) {
        for (const [name, providerConfig] of Object.entries(config.provider)) {
            const isDefault = config.model?.startsWith(`${name}/`);
            providers.push({
                name,
                displayName: PROVIDERS[name]?.name || name,
                hasApiKey: !!providerConfig.options?.apiKey,
                baseUrl: providerConfig.options?.baseURL,
                isDefault
            });
        }
    }

    return providers;
};

/**
 * 显示已配置的 providers
 */
const listConfiguredProviders = () => {
    const providers = getConfiguredProviders();
    const config = loadConfig();

    if (providers.length === 0) {
        console.log('\n[list] 尚未配置任何 Provider\n');
        return;
    }

    console.log('\n[list] 已配置的 Providers:\n');
    providers.forEach((p, i) => {
        const defaultMark = p.isDefault ? ' *(默认)' : '';
        const keyStatus = p.hasApiKey ? '✓ Key' : (PROVIDERS[p.name]?.noApiKey ? '无需 Key' : '✗ Key');
        const baseUrl = p.baseUrl ? ` | ${p.baseUrl}` : '';
        console.log(`  ${i + 1}. ${p.displayName}${defaultMark}`);
        console.log(`     ${keyStatus}${baseUrl}\n`);
    });

    if (config.model) {
        console.log(`  当前模型: ${config.model}\n`);
    }
};

/**
 * 配置单个 provider
 */
const configureProvider = async (providerKey, config) => {
    const provider = PROVIDERS[providerKey];
    const actualProviderKey = providerKey === 'openai-compatible' ? 'openai' : providerKey;

    config.provider = config.provider || {};
    config.provider[actualProviderKey] = config.provider[actualProviderKey] || { options: {} };

    // 获取现有配置的 baseURL (优先使用已配置的值)
    const existingBaseUrl = config.provider[actualProviderKey].options?.baseURL;

    // 自定义 baseUrl 配置
    if (provider.supportsBaseUrl) {
        // 优先使用现有配置，其次使用 provider 预设，最后使用通用默认值
        const defaultUrl = existingBaseUrl || provider.defaultBaseUrl || 'https://api.openai.com/v1';

        if (provider.requiresBaseUrl) {
            const baseUrl = await input('请输入 API 地址 (baseUrl):', defaultUrl);
            if (baseUrl) {
                config.provider[actualProviderKey].options.baseURL = baseUrl;
                console.log(`✓ API 地址: ${baseUrl}\n`);
            }
        } else if (existingBaseUrl) {
            // 已有配置时，询问是否修改
            const keepExisting = await confirm(`保持当前 API 地址 (${existingBaseUrl})?`, true);
            if (!keepExisting) {
                const baseUrl = await input('请输入新的 API 地址 (baseUrl):', existingBaseUrl);
                if (baseUrl) {
                    config.provider[actualProviderKey].options.baseURL = baseUrl;
                    console.log(`✓ API 地址: ${baseUrl}\n`);
                }
            } else {
                console.log(`✓ API 地址: ${existingBaseUrl}\n`);
            }
        } else if (provider.defaultBaseUrl) {
            const useDefault = await confirm(`使用默认 API 地址 (${defaultUrl})?`, true);
            if (useDefault) {
                config.provider[actualProviderKey].options.baseURL = defaultUrl;
                console.log(`✓ API 地址: ${defaultUrl}\n`);
            } else {
                const baseUrl = await input('请输入 API 地址 (baseUrl):', defaultUrl);
                if (baseUrl) {
                    config.provider[actualProviderKey].options.baseURL = baseUrl;
                    console.log(`✓ API 地址: ${baseUrl}\n`);
                }
            }
        } else {
            const needBaseUrl = await confirm('是否使用自定义 API 地址 (baseUrl)?', false);
            if (needBaseUrl) {
                const baseUrl = await input('请输入 API 地址 (baseUrl):', defaultUrl);
                if (baseUrl) {
                    config.provider[actualProviderKey].options.baseURL = baseUrl;
                    console.log(`✓ API 地址: ${baseUrl}\n`);
                }
            }
        }
    }

    // API Key 配置
    if (!provider.noApiKey) {
        const envKey = provider.envKey ? process.env[provider.envKey] : null;
        let apiKey = '';

        if (envKey) {
            console.log(`已检测到环境变量 ${provider.envKey}`);
            const useEnv = await confirm('使用环境变量中的 API Key?', true);
            if (!useEnv) {
                apiKey = await input('请输入 API Key:');
            }
        } else {
            apiKey = await input('请输入 API Key:');
        }

        if (apiKey) {
            config.provider[actualProviderKey].options.apiKey = apiKey;
            console.log('✓ API Key 已保存\n');
        }
    } else {
        console.log('✓ 此提供者无需 API Key\n');
    }

    return { actualProviderKey, provider };
};

/**
 * 选择模型 (支持预设列表 + API获取 + 自定义输入)
 * @param {string} providerKey - Provider key
 * @param {string} currentModel - 当前模型
 * @param {object} config - 配置对象 (可选，用于从 API 获取模型列表)
 */
const selectModel = async (providerKey, currentModel = '', config = null) => {
    const provider = PROVIDERS[providerKey];
    const defaultModel = providerKey === 'ollama' ? 'llama3.2' : 'gpt-4o';
    const actualProviderKey = providerKey === 'openai-compatible' ? 'openai' : providerKey;

    // 尝试从 API 获取模型列表
    let apiModels = [];
    if (config) {
        const providerConfig = config.provider?.[actualProviderKey];
        const baseUrl = providerConfig?.options?.baseURL;
        const apiKey = providerConfig?.options?.apiKey;

        if (baseUrl && apiKey) {
            const shouldFetch = await confirm('是否从 API 获取可用模型列表?', true);
            if (shouldFetch) {
                apiModels = await fetchModelsFromApi(baseUrl, apiKey);
            }
        }
    }

    // 优先使用 API 获取的模型，其次预设模型
    const availableModels = apiModels.length > 0 ? apiModels : (provider?.models || []);

    // 如果没有可用模型，直接输入
    if (availableModels.length === 0) {
        return await input('请输入模型名称:', currentModel || defaultModel);
    }

    // 有模型列表时，添加"自定义输入"选项
    const options = [
        ...availableModels.map(m => ({ name: m, value: m })),
        { name: '> 自定义输入...', value: '__custom__' }
    ];

    const defaultValue = currentModel && availableModels.includes(currentModel)
        ? currentModel
        : availableModels[0];

    const selected = await select('选择模型', defaultValue, options);

    if (selected === '__custom__') {
        return await input('请输入模型名称:', currentModel || defaultModel);
    }

    return selected;
};

/**
 * 配置向导
 */
const configWizard = async () => {
    console.log('\n[config] X-CLI AI 配置向导\n');

    // 选择提供者
    const providerKey = await select(
        '选择 AI 提供者',
        'anthropic',
        Object.entries(PROVIDERS).map(([key, value]) => ({
            name: value.name,
            value: key
        }))
    );

    // 加载现有配置
    const config = loadConfig();
    config.$schema = 'https://opencode.ai/config.json';

    // 配置 provider
    const { actualProviderKey } = await configureProvider(providerKey, config);

    // 选择默认模型 (传入 config 以支持从 API 获取模型列表)
    const model = await selectModel(providerKey, '', config);

    if (model) {
        config.model = `${actualProviderKey}/${model}`;
        console.log(`✓ 默认模型: ${config.model}\n`);
    }

    // 添加 X-CLI Agent 配置
    config.agent = config.agent || {};
    config.agent['x-cli'] = {
        description: 'X-CLI AI 助手 - 全栈前端开发智能助手',
        prompt: `你是 X-CLI AI 助手，一个强大的全栈前端开发智能助手，运行在终端环境中。

## 核心能力

### 1. 项目创建与管理
- 使用 \`x new <name>\` 创建 Vue/React/Angular/Vanilla 项目
- 自动调用官方 CLI (create-vue, create-react-app, @angular/cli)
- 支持交互式选择框架和配置选项

### 2. 开发工具配置
- 一键初始化: \`x plugin init\` 配置所有开发工具
- 支持的插件: ESLint, Prettier, Husky, CommitLint, lint-staged, gitignore
- 自动检测 Monorepo (pnpm-workspace, lerna, nx, turbo)
- 智能适配项目结构和现有配置

### 3. 包管理器统一封装
- \`xi\` 安装依赖 (支持 -D 开发依赖, -g 全局)
- \`xu\` 卸载依赖
- \`xr\` 运行脚本
- 自动检测: packageManager 字段 > 锁文件 > 全局安装 > npm 兜底
- 支持 npm/yarn/pnpm/bun 无缝切换

### 4. 代码编写与调试
- 读取、分析、修改项目中的任何文件
- 执行终端命令，运行构建、测试、lint 等任务
- 调试代码问题，分析错误日志
- 代码重构和优化建议

### 5. 前端专业知识
- Vue/React/Angular 框架深度理解
- TypeScript/JavaScript 最佳实践
- CSS/SCSS/Tailwind 样式方案
- Webpack/Vite/Rollup 构建工具
- Node.js 后端开发
- Git 工作流和版本控制

## 工作风格
- 简洁专业，直接给出可执行的方案
- 优先使用项目已有的技术栈和规范
- 修改代码前先理解上下文
- 提供完整可运行的代码，而非片段
- 主动检测潜在问题并给出建议

## 可用命令
- /help - 查看帮助
- /model - 切换模型
- /compact - 压缩对话历史
- /clear - 清空对话
- Tab - 切换 build/plan 模式`
    };
    config.default_agent = 'x-cli';

    // 保存配置
    saveConfig(config);
    console.log('✓ 配置已保存到 opencode.json\n');

    return true;
};

/**
 * Provider 管理菜单
 */
const manageProviders = async () => {
    console.log('\n[config] Provider 管理\n');

    const action = await select(
        '选择操作',
        'list',
        [
            { name: '[list] 查看已配置的 Providers', value: 'list' },
            { name: '[+] 添加新的 Provider', value: 'add' },
            { name: '[~] 切换默认 Provider', value: 'switch' },
            { name: '[*] 修改 Provider 配置', value: 'edit' },
            { name: '[-] 删除 Provider', value: 'remove' },
            { name: '[<] 返回', value: 'back' }
        ]
    );

    const config = loadConfig();
    config.$schema = 'https://opencode.ai/config.json';

    switch (action) {
        case 'list':
            listConfiguredProviders();
            break;

        case 'add': {
            const providerKey = await select(
                '选择要添加的 Provider',
                'anthropic',
                Object.entries(PROVIDERS).map(([key, value]) => ({
                    name: value.name,
                    value: key
                }))
            );

            const { actualProviderKey } = await configureProvider(providerKey, config);

            // 询问是否设为默认
            const setDefault = await confirm('设为默认 Provider?', true);
            if (setDefault) {
                const model = await selectModel(providerKey, '', config);
                config.model = `${actualProviderKey}/${model}`;
            }

            saveConfig(config);
            console.log('✓ Provider 已添加\n');
            break;
        }

        case 'switch': {
            const providers = getConfiguredProviders();
            if (providers.length === 0) {
                console.log('\n[!]尚未配置任何 Provider，请先添加\n');
                break;
            }

            const selectedProvider = await select(
                '选择默认 Provider',
                providers.find(p => p.isDefault)?.name || providers[0].name,
                providers.map(p => ({
                    name: `${p.displayName}${p.isDefault ? ' (当前)' : ''}`,
                    value: p.name
                }))
            );

            const currentModel = config.model?.split('/')[1] || '';
            const model = await selectModel(selectedProvider, currentModel, config);

            config.model = `${selectedProvider}/${model}`;
            saveConfig(config);
            console.log(`✓ 已切换到 ${selectedProvider}/${model}\n`);
            break;
        }

        case 'edit': {
            const providers = getConfiguredProviders();
            if (providers.length === 0) {
                console.log('\n[!]尚未配置任何 Provider，请先添加\n');
                break;
            }

            const selectedProvider = await select(
                '选择要修改的 Provider',
                providers[0].name,
                providers.map(p => ({
                    name: p.displayName,
                    value: p.name
                }))
            );

            // 重新配置该 provider
            const providerKey = Object.keys(PROVIDERS).find(k =>
                k === selectedProvider || (k === 'openai-compatible' && selectedProvider === 'openai')
            ) || selectedProvider;

            await configureProvider(providerKey, config);
            saveConfig(config);
            console.log('✓ Provider 配置已更新\n');
            break;
        }

        case 'remove': {
            const providers = getConfiguredProviders();
            if (providers.length === 0) {
                console.log('\n[!]尚未配置任何 Provider\n');
                break;
            }

            const selectedProvider = await select(
                '选择要删除的 Provider',
                providers[0].name,
                providers.map(p => ({
                    name: `${p.displayName}${p.isDefault ? ' (默认)' : ''}`,
                    value: p.name
                }))
            );

            const confirmDelete = await confirm(`确定删除 ${selectedProvider}?`, false);
            if (confirmDelete) {
                delete config.provider[selectedProvider];

                // 如果删除的是默认 provider，清空 model
                if (config.model?.startsWith(`${selectedProvider}/`)) {
                    delete config.model;
                }

                saveConfig(config);
                console.log('✓ Provider 已删除\n');
            }
            break;
        }

        case 'back':
        default:
            return;
    }

    // 继续管理
    const continueManage = await confirm('继续管理 Providers?', false);
    if (continueManage) {
        await manageProviders();
    }
};

/**
 * 启动 OpenCode TUI
 */
const launchOpencode = (options = {}) => {
    const args = [];

    if (options.model) {
        args.push('--model', options.model);
    }

    if (options.provider) {
        args.push('--provider', options.provider);
    }

    const opencode = spawn('npx', ['opencode-ai', ...args], {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: {
            ...process.env,
            FORCE_COLOR: '1'
        }
    });

    opencode.on('error', (err) => {
        logger.error(`启动 OpenCode 失败: ${err.message}`);
        process.exit(1);
    });

    opencode.on('close', (code) => {
        process.exit(code || 0);
    });
};

/**
 * AI 工作区主入口
 * @param {object} options
 * @param {string|boolean} [options.provider] - 指定提供者 (true 表示交互选择)
 * @param {string|boolean} [options.model] - 指定模型 (true 表示交互选择)
 * @param {boolean} [options.config] - 进入配置模式
 * @param {boolean} [options.manage] - 进入管理模式
 */
export const ai = async (options = {}) => {
    // Provider 管理模式
    if (options.manage) {
        await manageProviders();
        const startNow = await confirm('现在启动 AI 工作区?', true);
        if (startNow) {
            launchOpencode(options);
        }
        return;
    }

    // 强制配置模式
    if (options.config) {
        await configWizard();
        const startNow = await confirm('现在启动 AI 工作区?', true);
        if (startNow) {
            launchOpencode(options);
        }
        return;
    }

    // 检查是否已配置
    if (!isConfigured()) {
        console.log('\n[!]未检测到 API Key 配置\n');
        const runConfig = await confirm('是否运行配置向导?', true);
        if (runConfig) {
            await configWizard();
        } else {
            console.log('\n提示: 你可以通过以下方式配置:');
            console.log('  1. 运行 xa --config');
            console.log('  2. 运行 xa --manage 管理多个 Provider');
            console.log('  3. 设置环境变量 ANTHROPIC_API_KEY 或 OPENAI_API_KEY');
            console.log('  4. 在 TUI 中使用 /connect 命令\n');
        }
    }

    // 处理 -p 无参数的情况：交互选择 provider
    if (options.provider === true) {
        const providers = getConfiguredProviders();
        if (providers.length === 0) {
            console.log('\n[!] 尚未配置任何 Provider，请先运行 xa --config\n');
            return;
        }
        const config = loadConfig();
        const selectedProvider = await select(
            '选择 Provider',
            providers.find(p => p.isDefault)?.name || providers[0].name,
            providers.map(p => ({
                name: `${p.displayName}${p.isDefault ? ' (当前)' : ''}`,
                value: p.name
            }))
        );
        options.provider = selectedProvider;

        // 同时让用户选择模型
        const currentModel = config.model?.split('/')[1] || '';
        const model = await selectModel(selectedProvider, currentModel, config);
        options.model = model;
    }

    // 处理 -m 无参数的情况：交互选择 model
    if (options.model === true) {
        const config = loadConfig();
        const currentProvider = options.provider || config.model?.split('/')[0] || 'openai';
        const currentModel = config.model?.split('/')[1] || '';
        const model = await selectModel(currentProvider, currentModel, config);
        options.model = model;
    }

    // 启动 OpenCode TUI
    launchOpencode(options);
};

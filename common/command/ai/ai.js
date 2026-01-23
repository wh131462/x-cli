/**
 * AI 工作区命令入口
 * 支持配置向导 + OpenCode TUI
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { select, input, confirm } from '#common/utils/ui/promot.js';
import { logger } from '#common/utils/x/logger.js';
import { rootPath } from '#common/utils/file/path.js';

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
                Authorization: `Bearer ${apiKey}`,
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
                .map((m) => m.id)
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
    openrouter: {
        name: 'OpenRouter',
        envKey: 'OPENROUTER_API_KEY',
        models: ['anthropic/claude-sonnet-4', 'openai/gpt-4o', 'google/gemini-2.0-flash-exp'],
        supportsBaseUrl: true,
        defaultBaseUrl: 'https://openrouter.ai/api/v1'
    },
    // 自定义 Provider 模板 (用于添加新的自定义 provider)
    __custom__: {
        name: '自定义 Provider (OpenAI 兼容)',
        envKey: null,
        models: [],
        supportsBaseUrl: true,
        requiresBaseUrl: true,
        isCustomTemplate: true
    }
};

/**
 * 获取配置文件路径（存放在脚手架安装目录）
 */
const getConfigPath = () => {
    return resolve(rootPath, 'opencode.json');
};

/**
 * 获取模板配置文件路径
 */
const getExampleConfigPath = () => {
    return resolve(rootPath, 'opencode.example.json');
};

/**
 * 获取 OpenCode 官方 auth.json 路径
 * 遵循 XDG 规范: ~/.local/share/opencode/auth.json
 */
const getAuthPath = () => {
    const home = homedir();
    const dataDir = resolve(home, '.local', 'share', 'opencode');
    return resolve(dataDir, 'auth.json');
};

/**
 * 读取 auth.json
 */
const loadAuth = () => {
    const authPath = getAuthPath();
    if (existsSync(authPath)) {
        try {
            return JSON.parse(readFileSync(authPath, 'utf-8'));
        } catch {
            return {};
        }
    }
    return {};
};

/**
 * 保存 auth.json
 */
const saveAuth = (auth) => {
    const authPath = getAuthPath();
    const authDir = dirname(authPath);

    // 确保目录存在
    if (!existsSync(authDir)) {
        mkdirSync(authDir, { recursive: true });
    }

    writeFileSync(authPath, JSON.stringify(auth, null, 2));
};

/**
 * 读取模板配置
 */
const loadExampleConfig = () => {
    const examplePath = getExampleConfigPath();
    if (existsSync(examplePath)) {
        try {
            return JSON.parse(readFileSync(examplePath, 'utf-8'));
        } catch {
            return {};
        }
    }
    return {};
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
 * 确保基础配置文件存在
 * 如果 opencode.json 不存在，则从 opencode.example.json 生成基础配置
 */
const ensureBaseConfig = () => {
    const configPath = getConfigPath();

    // 如果配置文件已存在，直接返回
    if (existsSync(configPath)) {
        return;
    }

    // 从模板文件生成基础配置
    const exampleConfig = loadExampleConfig();
    const baseConfig = {
        $schema: 'https://opencode.ai/config.json',
        // 复制样式配置
        ...(exampleConfig.theme && { theme: exampleConfig.theme }),
        ...(exampleConfig.username && { username: exampleConfig.username }),
        ...(exampleConfig.tui && { tui: exampleConfig.tui }),
        ...(exampleConfig.keybinds && { keybinds: exampleConfig.keybinds }),
        // 复制 agent 配置
        ...(exampleConfig.agent && { agent: exampleConfig.agent }),
        ...(exampleConfig.default_agent && { default_agent: exampleConfig.default_agent }),
        // 空的 provider 和 model，等待用户配置
        provider: {},
        model: ''
    };

    saveConfig(baseConfig);
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

    if (envKeys.some((key) => process.env[key])) {
        return true;
    }

    // 检查 auth.json (OpenCode 官方存储位置)
    const auth = loadAuth();
    if (Object.keys(auth).length > 0) {
        return true;
    }

    // 检查配置文件中的 apiKey
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
 * 同时从 opencode.json 和 auth.json 读取
 */
const getConfiguredProviders = () => {
    const config = loadConfig();
    const auth = loadAuth();
    const providers = [];
    const seenProviders = new Set();

    // 从 config.provider 读取
    if (config.provider) {
        for (const [name, providerConfig] of Object.entries(config.provider)) {
            const isDefault = config.model?.startsWith(`${name}/`);
            const hasAuthKey = !!auth[name]?.key;
            const hasConfigKey = !!providerConfig.options?.apiKey;
            seenProviders.add(name);
            providers.push({
                name,
                displayName: PROVIDERS[name]?.name || providerConfig.name || name,
                hasApiKey: hasAuthKey || hasConfigKey,
                authSource: hasAuthKey ? 'auth.json' : hasConfigKey ? 'config' : null,
                baseUrl: providerConfig.options?.baseURL,
                isDefault,
                inConfig: true,
                inAuth: hasAuthKey
            });
        }
    }

    // 从 auth.json 读取（补充未在 config 中的 provider）
    for (const [name, authConfig] of Object.entries(auth)) {
        if (!seenProviders.has(name) && authConfig.key) {
            const isDefault = config.model?.startsWith(`${name}/`);
            providers.push({
                name,
                displayName: PROVIDERS[name]?.name || name,
                hasApiKey: true,
                authSource: 'auth.json',
                baseUrl: PROVIDERS[name]?.defaultBaseUrl || null,
                isDefault,
                inConfig: false,
                inAuth: true
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
        console.log('  auth.json: ' + getAuthPath());
        console.log('  config: ' + getConfigPath() + '\n');
        return;
    }

    console.log('\n[list] 已配置的 Providers:\n');
    providers.forEach((p, i) => {
        const defaultMark = p.isDefault ? ' *(默认)' : '';
        let keyStatus = '';
        if (PROVIDERS[p.name]?.noApiKey) {
            keyStatus = '无需 Key';
        } else if (p.hasApiKey) {
            keyStatus = `✓ Key (${p.authSource})`;
        } else {
            keyStatus = '✗ Key';
        }
        const baseUrl = p.baseUrl ? ` | ${p.baseUrl}` : '';
        const configStatus = p.inConfig ? '' : ' [仅 auth]';
        console.log(`  ${i + 1}. ${p.displayName}${defaultMark}${configStatus}`);
        console.log(`     ${keyStatus}${baseUrl}\n`);
    });

    if (config.model) {
        console.log(`  当前模型: ${config.model}\n`);
    }

    console.log(`  [auth.json] ${getAuthPath()}`);
    console.log(`  [config]    ${getConfigPath()}\n`);
};

/**
 * 配置自定义 Provider
 * @returns {Promise<{providerId: string, displayName: string, baseUrl: string, models: string[]}>}
 */
const configureCustomProvider = async () => {
    console.log('\n[自定义 Provider 配置]\n');
    console.log('提示: 自定义 Provider 需要支持 OpenAI 兼容 API\n');

    // 1. 输入 Provider ID (用于配置文件和 auth.json)
    const providerId = await input('Provider ID (小写字母、数字、短横线):', 'my-provider');

    // 验证 ID 格式
    if (!/^[a-z0-9-]+$/.test(providerId)) {
        console.log('\n✗ ID 格式无效，只能包含小写字母、数字和短横线\n');
        return null;
    }

    // 检查是否与内置 provider 冲突
    if (PROVIDERS[providerId] && !PROVIDERS[providerId].isCustomTemplate) {
        console.log(`\n✗ ID "${providerId}" 与内置 Provider 冲突，请使用其他名称\n`);
        return null;
    }

    // 2. 输入显示名称
    const displayName = await input('显示名称:', providerId);

    // 3. 输入 API 地址
    const baseUrl = await input('API 地址 (baseURL):', 'https://api.example.com/v1');
    if (!baseUrl) {
        console.log('\n✗ API 地址不能为空\n');
        return null;
    }

    // 4. 输入 API Key
    const apiKey = await input('API Key:');

    // 5. 获取模型列表 (优先从 API 获取)
    const models = [];

    // 尝试从 API 获取模型列表
    if (apiKey && baseUrl) {
        const apiModels = await fetchModelsFromApi(baseUrl, apiKey);
        if (apiModels.length > 0) {
            // 让用户选择要添加的模型
            console.log('\n选择要添加的模型 (输入序号，多个用逗号分隔，如: 1,3,5，直接回车选择全部):');
            apiModels.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));
            console.log(`  0. 手动输入模型名称`);
            const selection = await input('选择:', '全部');
            if (selection === '0') {
                // 用户选择手动输入
                console.log('\n输入模型名称 (每行一个，输入空行结束):');
                let modelInput = await input('模型 1:');
                while (modelInput) {
                    models.push(modelInput);
                    modelInput = await input(`模型 ${models.length + 1}:`);
                }
            } else if (selection === '全部' || selection === '') {
                // 选择全部模型
                models.push(...apiModels);
                console.log(`✓ 已添加全部 ${apiModels.length} 个模型\n`);
            } else {
                // 选择特定模型
                const indices = selection.split(',').map((s) => parseInt(s.trim()) - 1);
                indices.forEach((i) => {
                    if (apiModels[i]) models.push(apiModels[i]);
                });
                if (models.length > 0) {
                    console.log(`✓ 已添加 ${models.length} 个模型\n`);
                }
            }
        } else {
            console.log('\n[!] 无法从 API 获取模型列表，请手动输入\n');
        }
    }

    // 如果 API 获取失败或未配置 API Key，手动输入
    if (models.length === 0) {
        console.log('输入模型名称 (每行一个，输入空行结束):');
        let modelInput = await input('模型 1:');
        while (modelInput) {
            models.push(modelInput);
            modelInput = await input(`模型 ${models.length + 1}:`);
        }

        // 如果还是没有模型，提示必须输入一个
        if (models.length === 0) {
            const defaultModel = await input('请至少输入一个模型名称:');
            if (defaultModel) models.push(defaultModel);
        }
    }

    return { providerId, displayName, baseUrl, apiKey, models };
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
        const auth = loadAuth();
        const existingAuthKey = auth[actualProviderKey]?.key;
        const envKey = provider.envKey ? process.env[provider.envKey] : null;
        let apiKey = '';

        if (existingAuthKey) {
            console.log(`已检测到 auth.json 中的 API Key (${actualProviderKey})`);
            const keepExisting = await confirm('保持现有 API Key?', true);
            if (!keepExisting) {
                apiKey = await input('请输入新的 API Key:');
            }
        } else if (envKey) {
            console.log(`已检测到环境变量 ${provider.envKey}`);
            const useEnv = await confirm('使用环境变量中的 API Key?', true);
            if (!useEnv) {
                apiKey = await input('请输入 API Key:');
            }
        } else {
            apiKey = await input('请输入 API Key:');
        }

        if (apiKey) {
            // 保存到 auth.json (OpenCode 官方存储位置)
            auth[actualProviderKey] = {
                type: 'api',
                key: apiKey
            };
            saveAuth(auth);
            console.log('✓ API Key 已保存到 auth.json\n');
        } else if (existingAuthKey) {
            console.log('✓ 保持现有 API Key\n');
        }
    } else {
        console.log('✓ 此提供者无需 API Key\n');
    }

    return { actualProviderKey, provider };
};

/**
 * 选择模型 (支持预设列表 + 配置文件模型 + API获取 + 自定义输入)
 * @param {string} providerKey - Provider key
 * @param {string} currentModel - 当前模型
 * @param {object} config - 配置对象 (可选，用于从 API 获取模型列表)
 */
const selectModel = async (providerKey, currentModel = '', config = null) => {
    const provider = PROVIDERS[providerKey];
    const defaultModel = providerKey === 'ollama' ? 'llama3.2' : 'gpt-4o';

    // 从配置文件中获取模型列表 (自定义 provider)
    let configModels = [];
    if (config?.provider?.[providerKey]?.models) {
        configModels = Object.keys(config.provider[providerKey].models);
    }

    // 尝试从 API 获取模型列表
    let apiModels = [];
    if (config) {
        const providerConfig = config.provider?.[providerKey];
        const baseUrl = providerConfig?.options?.baseURL;
        // 从 auth.json 获取 API Key
        const auth = loadAuth();
        const apiKey = auth[providerKey]?.key || providerConfig?.options?.apiKey;

        if (baseUrl && apiKey && configModels.length === 0) {
            const shouldFetch = await confirm('是否从 API 获取可用模型列表?', true);
            if (shouldFetch) {
                apiModels = await fetchModelsFromApi(baseUrl, apiKey);
            }
        }
    }

    // 优先使用配置文件模型，其次 API 模型，最后预设模型
    const availableModels =
        configModels.length > 0 ? configModels : apiModels.length > 0 ? apiModels : provider?.models || [];

    // 如果没有可用模型，直接输入
    if (availableModels.length === 0) {
        return await input('请输入模型名称:', currentModel || defaultModel);
    }

    // 有模型列表时，添加"自定义输入"选项
    const options = [
        ...availableModels.map((m) => ({ name: m, value: m })),
        { name: '> 自定义输入...', value: '__custom__' }
    ];

    const defaultValue = currentModel && availableModels.includes(currentModel) ? currentModel : availableModels[0];

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

    // 从模板文件读取默认配置 (agent、样式等)
    const exampleConfig = loadExampleConfig();

    // 合并 agent 配置
    if (exampleConfig.agent) {
        config.agent = { ...config.agent, ...exampleConfig.agent };
    }
    if (exampleConfig.default_agent) {
        config.default_agent = exampleConfig.default_agent;
    }

    // 合并样式配置 (仅在用户未配置时使用模板默认值)
    if (exampleConfig.theme && !config.theme) {
        config.theme = exampleConfig.theme;
    }
    if (exampleConfig.username && !config.username) {
        config.username = exampleConfig.username;
    }
    if (exampleConfig.tui && !config.tui) {
        config.tui = exampleConfig.tui;
    }
    if (exampleConfig.keybinds && !config.keybinds) {
        config.keybinds = exampleConfig.keybinds;
    }

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

    const action = await select('选择操作', 'list', [
        { name: '[list] 查看已配置的 Providers', value: 'list' },
        { name: '[+] 添加新的 Provider', value: 'add' },
        { name: '[~] 切换默认 Provider', value: 'switch' },
        { name: '[*] 修改 Provider 配置', value: 'edit' },
        { name: '[-] 删除 Provider', value: 'remove' },
        { name: '[<] 返回', value: 'back' }
    ]);

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
                Object.entries(PROVIDERS)
                    .filter(([key]) => key !== '__custom__')
                    .map(([key, value]) => ({
                        name: value.name,
                        value: key
                    }))
                    .concat([{ name: PROVIDERS.__custom__.name, value: '__custom__' }])
            );

            let actualProviderKey;
            let defaultModel = '';

            if (providerKey === '__custom__') {
                // 自定义 Provider 配置流程
                const customConfig = await configureCustomProvider();
                if (!customConfig) {
                    console.log('\n✗ 自定义 Provider 配置取消\n');
                    break;
                }

                const { providerId, displayName, baseUrl, apiKey, models } = customConfig;
                actualProviderKey = providerId;

                // 保存到 opencode.json
                config.provider = config.provider || {};
                config.provider[providerId] = {
                    npm: '@ai-sdk/openai-compatible',
                    name: displayName,
                    options: {
                        baseURL: baseUrl
                    },
                    models: {}
                };

                // 添加模型配置
                models.forEach((m) => {
                    config.provider[providerId].models[m] = { name: m };
                });

                // 保存 API Key 到 auth.json
                if (apiKey) {
                    const auth = loadAuth();
                    auth[providerId] = { type: 'api', key: apiKey };
                    saveAuth(auth);
                    console.log('\n✓ API Key 已保存到 auth.json');
                }

                defaultModel = models[0] || '';
                console.log(`✓ Provider "${displayName}" 配置完成\n`);
            } else {
                // 内置 Provider 配置流程
                const result = await configureProvider(providerKey, config);
                actualProviderKey = result.actualProviderKey;
            }

            // 询问是否设为默认
            const setDefault = await confirm('设为默认 Provider?', true);
            if (setDefault) {
                const model = await selectModel(actualProviderKey, defaultModel, config);
                config.model = `${actualProviderKey}/${model}`;
                console.log(`✓ 默认模型: ${config.model}`);
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
                providers.find((p) => p.isDefault)?.name || providers[0].name,
                providers.map((p) => ({
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
                providers.map((p) => ({
                    name: p.displayName,
                    value: p.name
                }))
            );

            // 重新配置该 provider
            const providerKey =
                Object.keys(PROVIDERS).find(
                    (k) => k === selectedProvider || (k === 'openai-compatible' && selectedProvider === 'openai')
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
                providers.map((p) => ({
                    name: `${p.displayName}${p.isDefault ? ' (默认)' : ''}${p.inAuth ? ' [auth]' : ''}${p.inConfig ? ' [config]' : ''}`,
                    value: p.name
                }))
            );

            const providerInfo = providers.find((p) => p.name === selectedProvider);
            const deleteOptions = [];
            if (providerInfo?.inAuth) deleteOptions.push('auth.json 中的 API Key');
            if (providerInfo?.inConfig) deleteOptions.push('opencode.json 中的配置');

            console.log(`\n将删除: ${deleteOptions.join(' 和 ')}`);
            const confirmDelete = await confirm(`确定删除 ${selectedProvider}?`, false);
            if (confirmDelete) {
                // 删除 auth.json 中的 key
                if (providerInfo?.inAuth) {
                    const auth = loadAuth();
                    delete auth[selectedProvider];
                    saveAuth(auth);
                    console.log('✓ 已从 auth.json 删除 API Key');
                }

                // 删除 config 中的 provider
                if (providerInfo?.inConfig && config.provider?.[selectedProvider]) {
                    delete config.provider[selectedProvider];
                    console.log('✓ 已从 opencode.json 删除配置');
                }

                // 如果删除的是默认 provider，清空 model
                if (config.model?.startsWith(`${selectedProvider}/`)) {
                    delete config.model;
                    console.log('✓ 已清空默认模型设置');
                }

                saveConfig(config);
                console.log('');
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
 * 获取本地 opencode 可执行文件路径
 */
const getOpencodeBinPath = () => {
    // Windows 上使用 .bin/opencode.cmd，Unix 上使用 .bin/opencode
    const binName = process.platform === 'win32' ? 'opencode.cmd' : 'opencode';

    try {
        // 使用 import.meta.resolve 定位 opencode-ai 包的 package.json
        const packageJsonPath = import.meta.resolve('opencode-ai/package.json');
        // packageJsonPath 格式: file:///path/to/node_modules/opencode-ai/package.json
        const packageDir = fileURLToPath(new URL('.', packageJsonPath));
        // 从包目录向上找到 node_modules，再找 .bin
        const nodeModulesDir = resolve(packageDir, '..');
        const binPath = resolve(nodeModulesDir, '.bin', binName);
        return binPath;
    } catch {
        // 回退：尝试从 rootPath 查找
        return resolve(rootPath, 'node_modules', '.bin', binName);
    }
};

/**
 * 启动 OpenCode TUI
 */
const launchOpencode = (options = {}) => {
    const args = [];

    // 优先使用命令行参数
    if (options.model) {
        args.push('--model', options.model);
    }

    // 获取本地安装的 opencode 可执行文件路径
    const opencodeBin = getOpencodeBinPath();

    // 检查可执行文件是否存在
    if (!existsSync(opencodeBin)) {
        logger.error(`未找到 opencode: ${opencodeBin}`);
        logger.error('请尝试重新安装 @eternalheart/x-cli');
        process.exit(1);
    }

    // 通过 OPENCODE_CONFIG 环境变量指定配置文件路径
    // Windows 上执行 .cmd 文件需要 shell: true
    const opencode = spawn(opencodeBin, args, {
        stdio: 'inherit',
        cwd: process.cwd(),
        shell: process.platform === 'win32',
        env: {
            ...process.env,
            FORCE_COLOR: '1',
            OPENCODE_CONFIG: getConfigPath()
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
    // 确保基础配置文件存在（首次运行时生成）
    ensureBaseConfig();

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
            providers.find((p) => p.isDefault)?.name || providers[0].name,
            providers.map((p) => ({
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

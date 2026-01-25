/**
 * AI Provider 常量和工具函数
 */

import { loadConfig, loadAuth } from './config.js';

// 支持的提供者 (对齐 OpenCode 官方支持)
// https://opencode.ai/docs/providers
export const PROVIDERS = {
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
    '__custom-openai__': {
        name: '自定义 Provider (OpenAI 兼容)',
        envKey: null,
        models: [],
        supportsBaseUrl: true,
        requiresBaseUrl: true,
        isCustomTemplate: true,
        apiType: 'openai'
    },
    '__custom-anthropic__': {
        name: '自定义 Provider (Anthropic 兼容)',
        envKey: null,
        models: [],
        supportsBaseUrl: true,
        requiresBaseUrl: true,
        isCustomTemplate: true,
        apiType: 'anthropic'
    }
};

/**
 * 从 API 获取支持的模型列表
 * @param {string} baseUrl - API 地址
 * @param {string} apiKey - API Key
 * @returns {Promise<string[]>} 模型列表
 */
export const fetchModelsFromApi = async (baseUrl, apiKey) => {
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

/**
 * 获取已配置的 providers 列表
 * 同时从 opencode.json 和 auth.json 读取
 */
export const getConfiguredProviders = () => {
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
 * 检查是否已配置
 */
export const isConfigured = () => {
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

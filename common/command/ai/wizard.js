/**
 * AI 配置向导模块
 * 提供交互式配置管理界面
 */

import { select, input, confirm } from '#common/utils/ui/promot.js';
import {
    loadConfig,
    saveConfig,
    loadAuth,
    saveAuth,
    loadExampleConfig,
    loadGlobalConfig,
    getConfigPath,
    getAuthPath,
    getGlobalConfigPath
} from './config.js';
import { PROVIDERS, fetchModelsFromApi, getConfiguredProviders } from './providers.js';
import { validateAndSyncConfig } from './validation.js';
import { detectApiType } from './detection.js';
import { existsSync } from 'node:fs';

/**
 * 选择模型 (支持预设列表 + 配置文件模型 + API获取 + 自定义输入)
 * @param {string} providerKey - Provider key
 * @param {string} currentModel - 当前模型
 * @param {object} config - 配置对象 (可选，用于从 API 获取模型列表)
 */
export const selectModel = async (providerKey, currentModel = '', config = null) => {
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
 * 配置单个 provider
 */
export const configureProvider = async (providerKey, config) => {
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

        // 根据 npm 包类型显示提示
        const isAnthropicSdk = provider.npm?.includes('anthropic');
        const urlHint = isAnthropicSdk
            ? '(SDK 会自动追加 /messages，需包含 /v1)'
            : '(SDK 会自动追加 /chat/completions，需包含 /v1)';

        if (provider.requiresBaseUrl) {
            const baseUrl = await input(`请输入 API 地址 ${urlHint}:`, defaultUrl);
            if (baseUrl) {
                config.provider[actualProviderKey].options.baseURL = baseUrl;
                console.log(`✓ API 地址: ${baseUrl}\n`);
            }
        } else if (existingBaseUrl) {
            // 已有配置时，询问是否修改
            const keepExisting = await confirm(`保持当前 API 地址 (${existingBaseUrl})?`, true);
            if (!keepExisting) {
                const baseUrl = await input(`请输入新的 API 地址 ${urlHint}:`, existingBaseUrl);
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
                const baseUrl = await input(`请输入 API 地址 ${urlHint}:`, defaultUrl);
                if (baseUrl) {
                    config.provider[actualProviderKey].options.baseURL = baseUrl;
                    console.log(`✓ API 地址: ${baseUrl}\n`);
                }
            }
        } else {
            const needBaseUrl = await confirm('是否使用自定义 API 地址 (baseUrl)?', false);
            if (needBaseUrl) {
                const baseUrl = await input(`请输入 API 地址 ${urlHint}:`, defaultUrl);
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

    // 确保 provider 配置包含 id 和 npm 字段
    if (!config.provider[actualProviderKey].id) {
        config.provider[actualProviderKey].id = actualProviderKey;
    }
    if (!config.provider[actualProviderKey].npm && provider.npm) {
        config.provider[actualProviderKey].npm = provider.npm;
    }
    if (!config.provider[actualProviderKey].name && provider.name) {
        config.provider[actualProviderKey].name = provider.name;
    }

    return { actualProviderKey, provider };
};

/**
 * 配置自定义 Provider
 * @param {string} apiType - API 类型: 'openai' 或 'anthropic'
 * @returns {Promise<{providerId: string, displayName: string, baseUrl: string, apiKey: string, models: string[], apiType: string}>}
 */
export const configureCustomProvider = async (apiType = 'openai') => {
    const isAnthropic = apiType === 'anthropic';
    const apiTypeName = isAnthropic ? 'Anthropic' : 'OpenAI';

    console.log(`\n[自定义 Provider 配置 - ${apiTypeName} 兼容]\n`);
    console.log(`提示: 自定义 Provider 需要支持 ${apiTypeName} 兼容 API`);
    if (isAnthropic) {
        console.log('  - SDK 会自动追加 /messages 到 baseURL');
        console.log('  - 所以 baseURL 应包含 /v1 (如: https://api.example.com/v1)');
        console.log('  - 使用 x-api-key 认证头');
    } else {
        console.log('  - SDK 会自动追加 /chat/completions 到 baseURL');
        console.log('  - 所以 baseURL 应包含 /v1 (如: https://api.example.com/v1)');
        console.log('  - 使用 Authorization: Bearer 认证头');
    }
    console.log('');

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
    const defaultBaseUrl = isAnthropic ? 'https://api.anthropic.com' : 'https://api.example.com/v1';
    const baseUrl = await input('API 地址 (baseURL):', defaultBaseUrl);
    if (!baseUrl) {
        console.log('\n✗ API 地址不能为空\n');
        return null;
    }

    // 4. 输入 API Key
    const apiKey = await input('API Key:');

    // 4.5 自动检测 API 类型
    let detectedType = apiType;
    if (apiKey && baseUrl) {
        const shouldDetect = await confirm('是否自动检测 API 类型?', true);
        if (shouldDetect) {
            console.log('\n正在检测 API 类型...');
            const detection = await detectApiType(baseUrl, apiKey);

            if (detection.success) {
                console.log(`✓ 检测成功: ${detection.type} 兼容 API`);
                console.log(`  端点: ${detection.details.endpoint}`);

                // 如果检测到的类型与用户选择的不一致，询问是否切换
                if (detection.type !== apiType) {
                    console.log(`\n⚠️  检测到的类型 (${detection.type}) 与您选择的类型 (${apiType}) 不一致`);
                    const useDetected = await confirm(`是否使用检测到的类型 (${detection.type})?`, true);
                    if (useDetected) {
                        detectedType = detection.type;
                        console.log(`✓ 已切换到 ${detectedType} 兼容配置\n`);
                    }
                } else {
                    console.log(`✓ 配置正确\n`);
                }
            } else {
                console.log(`✗ 检测失败: ${detection.error}`);
                console.log('提示: 仍可继续配置，但可能无法正常使用');
                const continueAnyway = await confirm('是否继续?', false);
                if (!continueAnyway) {
                    return null;
                }
            }
        }
    }

    // 更新 apiType 为检测到的类型
    const finalApiType = detectedType;

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

    return { providerId, displayName, baseUrl, apiKey, models, apiType: finalApiType };
};

/**
 * 配置向导
 */
export const configWizard = async () => {
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

    let actualProviderKey;
    let defaultModel = '';

    // 处理自定义 Provider
    if (providerKey.startsWith('__custom')) {
        const apiType = providerKey === '__custom-anthropic__' ? 'anthropic' : 'openai';
        const customConfig = await configureCustomProvider(apiType);
        if (!customConfig) {
            console.log('\n✗ 自定义 Provider 配置取消\n');
            return false;
        }

        const { providerId, displayName, baseUrl, apiKey, models, apiType: configApiType } = customConfig;
        actualProviderKey = providerId;

        // 创建 provider 配置
        config.provider = config.provider || {};

        if (configApiType === 'anthropic') {
            config.provider[providerId] = {
                id: providerId,
                npm: '@ai-sdk/anthropic',
                name: displayName,
                options: {
                    baseURL: baseUrl
                },
                models: {}
            };
        } else {
            config.provider[providerId] = {
                id: providerId,
                npm: '@ai-sdk/openai-compatible',
                name: displayName,
                options: {
                    baseURL: baseUrl
                },
                models: {}
            };
        }

        // 添加模型配置
        models.forEach((m) => {
            config.provider[providerId].models[m] = { name: m };
        });

        // 保存 API Key 到 auth.json
        if (apiKey) {
            const auth = loadAuth();
            auth[providerId] = { type: 'api', key: apiKey };
            saveAuth(auth);
        }

        defaultModel = models[0] || '';
        console.log(`✓ Provider "${displayName}" 配置完成\n`);
    } else {
        // 配置内置 provider
        const result = await configureProvider(providerKey, config);
        actualProviderKey = result.actualProviderKey;
    }

    // 选择默认模型 (传入 config 以支持从 API 获取模型列表)
    const model = await selectModel(actualProviderKey, defaultModel, config);

    if (model) {
        config.model = `${actualProviderKey}/${model}`;
        console.log(`✓ 默认模型: ${config.model}\n`);
    }

    // 从模板文件读取默认配置 (样式等，但不包括 agent)
    const exampleConfig = loadExampleConfig();

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

    // 注意：不再自动设置 agent 和 default_agent
    // OpenCode 会使用配置的 provider，无需额外设置 agent

    // 保存配置
    saveConfig(config);
    console.log('✓ 配置已保存到 opencode.json\n');

    return true;
};

/**
 * 显示配置信息
 */
export const displayConfigInfo = (verbose = false) => {
    const configPath = getConfigPath();
    const authPath = getAuthPath();
    const globalConfigPath = getGlobalConfigPath();
    const config = loadConfig();
    const globalConfig = loadGlobalConfig();
    const providers = getConfiguredProviders();

    console.log('\n[配置信息]');
    console.log(`  X-CLI 配置: ${configPath}`);
    console.log(`  认证文件: ${authPath}`);

    // 显示全局配置信息
    const hasGlobalConfig = existsSync(globalConfigPath);
    if (hasGlobalConfig) {
        const globalProviderCount = Object.keys(globalConfig.provider || {}).length;
        console.log(`  全局配置: ${globalConfigPath} (${globalProviderCount} 个 Providers)`);
    }

    console.log(`  已配置 Providers: ${providers.length}`);
    if (config.model) {
        console.log(`  默认模型: ${config.model}`);
    }

    if (verbose) {
        console.log('\n[Providers 详情]');
        providers.forEach((p, i) => {
            const defaultMark = p.isDefault ? ' *(默认)' : '';
            const sources = [];
            if (p.inConfig) sources.push('config');
            if (p.inAuth) sources.push('auth');
            console.log(`  ${i + 1}. ${p.displayName}${defaultMark}`);
            console.log(`     来源: ${sources.join(' + ')}`);
            if (p.baseUrl) console.log(`     URL: ${p.baseUrl}`);
        });

        // 显示全局配置中存在但未导入的 provider
        if (hasGlobalConfig && globalConfig.provider) {
            const globalOnly = Object.keys(globalConfig.provider).filter(
                (name) => !providers.some((p) => p.name === name)
            );
            if (globalOnly.length > 0) {
                console.log('\n[全局配置中未导入的 Providers]');
                globalOnly.forEach((name) => {
                    console.log(`  - ${name} (可通过 xa --manage 添加)`);
                });
            }
        }
    }

    // 显示配置警告
    const warnings = validateAndSyncConfig();
    if (warnings.length > 0) {
        console.log('\n[配置警告]');
        warnings.forEach((w) => {
            console.log(`  ⚠ ${w.message}:`);
            w.providers.forEach((p) => console.log(`    - ${p}`));
        });
        console.log('\n  建议: 使用 xa --manage 管理这些 Provider\n');
    } else {
        console.log('\n  ✓ 配置正常\n');
    }
};

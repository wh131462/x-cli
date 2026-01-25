/**
 * Provider 管理界面模块
 */

import { select, input, confirm } from '#common/utils/ui/promot.js';
import {
    loadConfig,
    saveConfig,
    loadAuth,
    saveAuth,
    loadGlobalConfig,
    getConfigPath,
    getAuthPath,
    getGlobalConfigPath
} from './config.js';
import { PROVIDERS, getConfiguredProviders } from './providers.js';
import {
    validateAndSyncConfig,
    classifyConfigIssues,
    autoFixTemplateKeyProviders,
    autoFixAuthOnlyProviders,
    autoFixMissingKeyProviders
} from './validation.js';
import { selectModel, configureProvider, configureCustomProvider } from './wizard.js';

/**
 * 显示已配置的 providers 并提供管理选项
 * 使用循环代替递归，避免用户迷失在多层菜单中
 */
export const listConfiguredProviders = async () => {
    // 使用 while 循环代替递归
    while (true) {
        const providers = getConfiguredProviders();
        let config = loadConfig();

        if (providers.length === 0) {
            console.log('\n[list] 尚未配置任何 Provider\n');
            console.log('  配置文件: ' + getConfigPath());
            console.log('  认证文件: ' + getAuthPath() + '\n');

            const addNew = await confirm('是否添加新的 Provider?', true);
            if (addNew) {
                return 'add';
            }
            return null;
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

            // 显示配置来源
            const sources = [];
            if (p.inConfig) sources.push('config');
            if (p.inAuth) sources.push('auth');
            const sourceInfo = sources.length > 0 ? ` [来源: ${sources.join(' + ')}]` : ' [仅 auth]';

            console.log(`  ${i + 1}. ${p.displayName}${defaultMark}${sourceInfo}`);
            console.log(`     ${keyStatus}${baseUrl}\n`);
        });

        if (config.model) {
            console.log(`  当前模型: ${config.model}\n`);
        }

        // 显示配置警告并提供修复
        const warnings = validateAndSyncConfig();
        if (warnings.length > 0) {
            const issues = classifyConfigIssues(warnings);
            const hasIssues = issues.blocking.length > 0 || issues.warning.length > 0;

            if (hasIssues) {
                console.log('[配置警告]\n');

                if (issues.blocking.length > 0) {
                    console.log('❌ 阻塞性问题:');
                    issues.blocking.forEach((w) => {
                        console.log(`  ${w.message}:`);
                        w.providers.forEach((p) => console.log(`    • ${p}`));
                    });
                    console.log('');
                }

                if (issues.warning.length > 0) {
                    console.log('⚠️  警告问题:');
                    issues.warning.forEach((w) => {
                        console.log(`  ${w.message}:`);
                        w.providers.forEach((p) => console.log(`    • ${p}`));
                    });
                    console.log('');
                }

                const shouldFix = await confirm('是否立即修复这些问题?', true);
                if (shouldFix) {
                    // 修复所有问题
                    for (const issue of issues.blocking) {
                        if (issue.type === 'template-key') {
                            await autoFixTemplateKeyProviders(issue.providers);
                        }
                    }
                    for (const issue of issues.warning) {
                        if (issue.type === 'auth-only') {
                            await autoFixAuthOnlyProviders(issue.providers);
                        } else if (issue.type === 'missing-key') {
                            await autoFixMissingKeyProviders(issue.providers);
                        }
                    }
                    console.log('✓ 配置已修复\n');
                    // 继续循环，重新显示列表
                    continue;
                }
            }
        }

        // 提供管理选项
        const options = providers.map((p) => ({
            name: `${p.displayName}${p.isDefault ? ' (默认)' : ''}`,
            value: p.name
        }));
        options.push({ name: '[+] 添加新的 Provider', value: '__add__' });
        options.push({ name: '[<] 返回', value: '__back__' });

        const selectedProvider = await select('选择要管理的 Provider', '__back__', options);

        if (selectedProvider === '__back__') {
            return null;
        }

        if (selectedProvider === '__add__') {
            return 'add';
        }

        // 选择对该 provider 的操作
        const providerInfo = providers.find((p) => p.name === selectedProvider);
        const actions = [
            { name: '设为默认', value: 'default' },
            { name: '编辑配置', value: 'edit' },
            { name: '删除', value: 'delete' },
            { name: '返回', value: 'back' }
        ];

        const action = await select(`对 ${providerInfo.displayName} 执行操作`, 'default', actions);

        if (action === 'back') {
            // 继续循环，重新显示列表
            continue;
        }

        if (action === 'default') {
            // 检查是否有 API Key
            if (!providerInfo?.hasApiKey && !PROVIDERS[selectedProvider]?.noApiKey) {
                console.log(`\n[!] ${selectedProvider} 尚未配置 API Key`);
                const configureKey = await confirm('是否现在配置?', true);
                if (configureKey) {
                    const apiKey = await input('请输入 API Key:');
                    if (apiKey) {
                        const auth = loadAuth();
                        auth[selectedProvider] = { type: 'api', key: apiKey };
                        saveAuth(auth);
                        console.log('✓ API Key 已保存到 auth.json\n');
                    }
                }
            }

            const currentModel = config.model?.split('/')[1] || '';
            const model = await selectModel(selectedProvider, currentModel, config);
            config.model = `${selectedProvider}/${model}`;
            saveConfig(config);
            console.log(`✓ 已切换到 ${selectedProvider}/${model}\n`);
        } else if (action === 'edit') {
            // 检查是否是自定义 Provider
            const isCustomProvider = config.provider?.[selectedProvider] && !PROVIDERS[selectedProvider];

            if (isCustomProvider) {
                console.log(`\n[编辑自定义 Provider: ${selectedProvider}]\n`);
                const providerConfig = config.provider[selectedProvider];

                const currentName = providerConfig.name || selectedProvider;
                const newName = await input('显示名称:', currentName);
                if (newName && newName !== currentName) {
                    config.provider[selectedProvider].name = newName;
                }

                // 根据 npm 包类型显示提示
                const isAnthropicSdk = providerConfig.npm?.includes('anthropic');
                const urlHint = isAnthropicSdk
                    ? '(SDK 会自动追加 /messages，需包含 /v1)'
                    : '(SDK 会自动追加 /chat/completions，需包含 /v1)';

                const currentBaseUrl = providerConfig.options?.baseURL || '';
                const newBaseUrl = await input(`API 地址 ${urlHint}:`, currentBaseUrl);
                if (newBaseUrl) {
                    config.provider[selectedProvider].options = config.provider[selectedProvider].options || {};
                    config.provider[selectedProvider].options.baseURL = newBaseUrl;
                }

                const auth = loadAuth();
                const existingKey = auth[selectedProvider]?.key;
                if (existingKey) {
                    console.log(`\n已检测到 auth.json 中的 API Key`);
                    const keepKey = await confirm('保持现有 API Key?', true);
                    if (!keepKey) {
                        const newKey = await input('请输入新的 API Key:');
                        if (newKey) {
                            auth[selectedProvider] = { type: 'api', key: newKey };
                            saveAuth(auth);
                            console.log('✓ API Key 已更新\n');
                        }
                    }
                } else {
                    const newKey = await input('请输入 API Key:');
                    if (newKey) {
                        auth[selectedProvider] = { type: 'api', key: newKey };
                        saveAuth(auth);
                        console.log('✓ API Key 已保存到 auth.json\n');
                    }
                }
            } else {
                const providerKey =
                    Object.keys(PROVIDERS).find(
                        (k) => k === selectedProvider || (k === 'openai-compatible' && selectedProvider === 'openai')
                    ) || selectedProvider;

                await configureProvider(providerKey, config);
            }

            saveConfig(config);
            console.log('✓ Provider 配置已更新\n');
        } else if (action === 'delete') {
            const deleteOptions = [];
            if (providerInfo?.inAuth) deleteOptions.push('auth.json 中的 API Key');
            if (providerInfo?.inConfig) deleteOptions.push('opencode.json 中的配置');

            console.log(`\n将删除: ${deleteOptions.join(' 和 ')}`);
            const confirmDelete = await confirm(`确定删除 ${selectedProvider}?`, false);

            if (confirmDelete) {
                // 从 auth.json 删除
                if (providerInfo?.inAuth) {
                    const auth = loadAuth();
                    delete auth[selectedProvider];
                    saveAuth(auth);
                }

                // 从 config 删除
                if (providerInfo?.inConfig && config.provider?.[selectedProvider]) {
                    delete config.provider[selectedProvider];
                }

                // 如果删除的是默认 provider，清除 model 设置
                if (config.model?.startsWith(`${selectedProvider}/`)) {
                    delete config.model;
                }

                saveConfig(config);
                console.log(`✓ ${selectedProvider} 已删除\n`);
            }
        }

        // 操作完成后继续循环，重新显示列表
        continue;
    }
};

/**
 * Provider 管理菜单
 */
export const manageProviders = async () => {
    console.log('\n[config] Provider 管理\n');

    // 检查是否有全局配置可导入
    const globalConfig = loadGlobalConfig();
    const hasGlobalProviders = globalConfig.provider && Object.keys(globalConfig.provider).length > 0;

    const menuOptions = [
        { name: '[list] 查看/管理 Providers', value: 'list' },
        { name: '[+] 添加新的 Provider', value: 'add' }
    ];

    // 如果有全局配置，添加导入选项
    if (hasGlobalProviders) {
        menuOptions.splice(1, 0, {
            name: `[↓] 从全局配置导入 (${Object.keys(globalConfig.provider).length} 个)`,
            value: 'import'
        });
    }

    menuOptions.push({ name: '[<] 返回', value: 'back' });

    const action = await select('选择操作', 'list', menuOptions);

    let config = loadConfig();
    config.$schema = 'https://opencode.ai/config.json';

    switch (action) {
        case 'list': {
            const result = await listConfiguredProviders();
            // 如果返回 'add'，跳转到添加流程
            if (result === 'add') {
                return manageProviders(); // 重新进入管理菜单，会自动选择 add
            }
            break;
        }

        case 'import': {
            console.log('\n[从全局配置导入]\n');
            console.log(`  全局配置: ${getGlobalConfigPath()}`);
            console.log(`  可用 Providers: ${Object.keys(globalConfig.provider).length} 个\n`);

            // 显示全局配置中的 providers
            const globalProviders = Object.keys(globalConfig.provider);
            const currentProviders = Object.keys(config.provider || {});

            console.log('全局配置中的 Providers:');
            globalProviders.forEach((name, i) => {
                const exists = currentProviders.includes(name);
                const mark = exists ? ' [已存在]' : ' [新]';
                console.log(`  ${i + 1}. ${name}${mark}`);
            });
            console.log('');

            const importAll = await confirm('是否导入全部 Providers?', true);
            if (importAll) {
                // 合并配置（保留现有配置，新增不存在的）
                config.provider = config.provider || {};
                let importCount = 0;
                let skipCount = 0;

                globalProviders.forEach((name) => {
                    if (!config.provider[name]) {
                        config.provider[name] = globalConfig.provider[name];
                        importCount++;
                    } else {
                        skipCount++;
                    }
                });

                // 如果全局配置有默认模型且当前没有，也导入
                if (globalConfig.model && !config.model) {
                    config.model = globalConfig.model;
                    console.log(`✓ 已导入默认模型: ${globalConfig.model}`);
                }

                saveConfig(config);
                console.log(
                    `✓ 已导入 ${importCount} 个新 Provider${skipCount > 0 ? `，跳过 ${skipCount} 个已存在的` : ''}\n`
                );
            } else {
                console.log('\n导入已取消\n');
            }
            break;
        }

        case 'add': {
            const providerKey = await select(
                '选择要添加的 Provider',
                'anthropic',
                Object.entries(PROVIDERS)
                    .filter(([key]) => !key.startsWith('__custom'))
                    .map(([key, value]) => ({
                        name: value.name,
                        value: key
                    }))
                    .concat([
                        { name: PROVIDERS['__custom-openai__'].name, value: '__custom-openai__' },
                        { name: PROVIDERS['__custom-anthropic__'].name, value: '__custom-anthropic__' }
                    ])
            );

            let actualProviderKey;
            let defaultModel = '';

            if (providerKey.startsWith('__custom')) {
                // 自定义 Provider 配置流程
                const apiType = providerKey === '__custom-anthropic__' ? 'anthropic' : 'openai';
                const customConfig = await configureCustomProvider(apiType);
                if (!customConfig) {
                    console.log('\n✗ 自定义 Provider 配置取消\n');
                    break;
                }

                const { providerId, displayName, baseUrl, apiKey, models, apiType: configApiType } = customConfig;
                actualProviderKey = providerId;

                // 根据 API 类型选择不同的配置方式
                config.provider = config.provider || {};

                if (configApiType === 'anthropic') {
                    // Anthropic 兼容: 使用内置 anthropic provider 但覆盖 baseURL
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
                    // OpenAI 兼容: 使用 openai-compatible SDK
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
                    console.log('\n✓ API Key 已保存到 auth.json');
                }

                defaultModel = models[0] || '';
                console.log(`✓ Provider "${displayName}" 配置完成\n`);
            } else {
                // 内置 Provider 配置流程
                // 询问是否自定义 Provider ID
                const customizeId = await confirm(`是否自定义 Provider ID? (默认使用 "${providerKey}")`, false);

                if (customizeId) {
                    // 自定义 ID 流程
                    const providerId = await input('Provider ID (小写字母、数字、短横线):', providerKey);

                    // 验证 ID 格式
                    if (!/^[a-z0-9-]+$/.test(providerId)) {
                        console.log('\n✗ ID 格式无效，只能包含小写字母、数字和短横线\n');
                        break;
                    }

                    // 检查是否已存在
                    if (config.provider?.[providerId]) {
                        console.log(`\n✗ Provider ID "${providerId}" 已存在\n`);
                        break;
                    }

                    actualProviderKey = providerId;

                    // 获取内置 provider 的配置
                    const provider = PROVIDERS[providerKey];
                    const displayName = await input('显示名称:', `${provider.name} (自定义)`);

                    // 根据 provider 类型显示提示
                    const isAnthropicSdk = provider.npm?.includes('anthropic') || providerKey === 'anthropic';
                    const urlHint = isAnthropicSdk
                        ? '(SDK 会自动追加 /messages，需包含 /v1)'
                        : '(SDK 会自动追加 /chat/completions，需包含 /v1)';

                    // 配置 baseURL
                    const defaultBaseUrl =
                        provider.defaultBaseUrl ||
                        (providerKey === 'anthropic' ? 'https://api.anthropic.com/v1' : 'https://api.openai.com/v1');
                    const baseUrl = await input(`API 地址 ${urlHint}:`, defaultBaseUrl);

                    // 创建 provider 配置
                    config.provider = config.provider || {};
                    config.provider[providerId] = {
                        id: providerId,
                        npm: provider.npm || `@ai-sdk/${providerKey}`,
                        name: displayName,
                        options: {
                            baseURL: baseUrl
                        },
                        models: {}
                    };

                    // 配置 API Key
                    const apiKey = await input('API Key:');
                    if (apiKey) {
                        const auth = loadAuth();
                        auth[providerId] = { type: 'api', key: apiKey };
                        saveAuth(auth);
                        console.log('\n✓ API Key 已保存到 auth.json');
                    }

                    console.log(`✓ Provider "${displayName}" 配置完成\n`);
                } else {
                    // 使用默认 ID
                    const result = await configureProvider(providerKey, config);
                    actualProviderKey = result.actualProviderKey;
                }
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

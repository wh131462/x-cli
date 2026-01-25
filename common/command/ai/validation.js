/**
 * AI 配置验证和修复模块
 */

import { input, confirm, select } from '#common/utils/ui/promot.js';
import { loadConfig, saveConfig, loadAuth, saveAuth } from './config.js';
import { PROVIDERS } from './providers.js';

// 配置问题严重程度
export const CONFIG_ISSUE_SEVERITY = {
    BLOCKING: 'blocking', // 阻塞性问题，必须修复才能启动
    WARNING: 'warning', // 警告性问题，建议修复但可跳过
    INFO: 'info' // 信息性提示
};

/**
 * 验证和同步配置
 * 检测配置不一致并给出警告
 */
export const validateAndSyncConfig = () => {
    const config = loadConfig();
    const auth = loadAuth();
    const warnings = [];

    // 检测使用模板 key 的 provider（旧版本 bug 导致）
    const templateKeyProviders = [];
    if (config.provider) {
        for (const [name] of Object.entries(config.provider)) {
            if (name.startsWith('__custom-')) {
                templateKeyProviders.push(name);
            }
        }
    }

    if (templateKeyProviders.length > 0) {
        warnings.push({
            type: 'template-key',
            providers: templateKeyProviders,
            message: '以下 Provider 使用了无效的模板 ID，需要重新配置'
        });
    }

    // 检测 auth.json 中有但 config.provider 中没有的 provider
    const authOnlyProviders = Object.keys(auth).filter(
        (name) => !config.provider?.[name] && !PROVIDERS[name]?.noApiKey
    );

    if (authOnlyProviders.length > 0) {
        warnings.push({
            type: 'auth-only',
            providers: authOnlyProviders,
            message: '以下 Provider 只在 auth.json 中存在，配置不完整'
        });
    }

    // 检测 config.provider 中有但 auth.json 中没有 key 的 provider（需要 API Key 的）
    if (config.provider) {
        const configOnlyProviders = Object.keys(config.provider).filter((name) => {
            const provider = PROVIDERS[name];
            const needsKey = !provider?.noApiKey;
            const hasKey = !!auth[name]?.key || !!config.provider[name].options?.apiKey;
            return needsKey && !hasKey;
        });

        if (configOnlyProviders.length > 0) {
            warnings.push({
                type: 'missing-key',
                providers: configOnlyProviders,
                message: '以下 Provider 在配置中但缺少 API Key'
            });
        }
    }

    // 检测默认模型的 provider 是否存在
    if (config.model) {
        const [modelProvider] = config.model.split('/');
        const providerExists = config.provider?.[modelProvider] || auth[modelProvider];
        if (!providerExists) {
            warnings.push({
                type: 'invalid-model',
                providers: [modelProvider],
                message: `默认模型 "${config.model}" 的 Provider "${modelProvider}" 未配置`
            });
        }
    }

    return warnings;
};

/**
 * 对配置警告进行分类
 * @param {Array} warnings - 警告列表
 * @returns {Object} 分类后的问题
 */
export const classifyConfigIssues = (warnings) => {
    const issues = {
        blocking: [], // template-key: 无法正常使用
        warning: [], // auth-only, missing-key: 可能影响功能
        info: [] // invalid-model: 可以在 TUI 中切换
    };

    warnings.forEach((w) => {
        switch (w.type) {
            case 'template-key':
                issues.blocking.push(w);
                break;
            case 'auth-only':
            case 'missing-key':
                issues.warning.push(w);
                break;
            default:
                issues.info.push(w);
        }
    });

    return issues;
};

/**
 * 修复使用模板 key 的 provider
 * 引导用户重新配置这些 provider
 */
export const autoFixTemplateKeyProviders = async (templateKeyProviders) => {
    const config = loadConfig();
    const auth = loadAuth();
    let fixed = 0;

    console.log('\n[修复无效的 Provider 配置]');
    console.log('检测到使用了旧版本创建的配置，这些配置使用了无效的 ID');
    console.log('需要重新配置以确保正常使用\n');

    for (const oldKey of templateKeyProviders) {
        const oldConfig = config.provider[oldKey];
        const oldAuth = auth[oldKey];

        console.log(`正在修复: ${oldKey}`);
        console.log(`  当前配置: ${oldConfig.name || oldKey}`);
        if (oldConfig.options?.baseURL) {
            console.log(`  API 地址: ${oldConfig.options.baseURL}`);
        }
        console.log('');

        // 询问用户新的 Provider ID
        const providerId = await input('  新的 Provider ID (小写字母、数字、短横线):', 'my-provider');

        // 验证 ID 格式
        if (!/^[a-z0-9-]+$/.test(providerId)) {
            console.log('  ✗ ID 格式无效，跳过此 Provider\n');
            continue;
        }

        // 检查是否与其他 provider 冲突
        if (config.provider[providerId]) {
            console.log(`  ✗ ID "${providerId}" 已存在，跳过此 Provider\n`);
            continue;
        }

        // 询问显示名称
        const displayName = await input('  显示名称:', oldConfig.name || providerId);

        // 确认 baseURL
        const currentBaseUrl = oldConfig.options?.baseURL || '';
        const baseUrl = await input('  API 地址 (baseURL):', currentBaseUrl);

        // 创建新的 provider 配置
        config.provider[providerId] = {
            id: providerId,
            npm: oldConfig.npm || '@ai-sdk/openai-compatible',
            name: displayName,
            options: {
                baseURL: baseUrl
            },
            models: oldConfig.models || {}
        };

        // 迁移 API Key
        if (oldAuth) {
            auth[providerId] = oldAuth;
            delete auth[oldKey];
        }

        // 删除旧配置
        delete config.provider[oldKey];

        // 更新默认模型（如果使用了旧 key）
        if (config.model?.startsWith(`${oldKey}/`)) {
            const modelName = config.model.split('/')[1];
            config.model = `${providerId}/${modelName}`;
            console.log(`  ✓ 已更新默认模型: ${config.model}`);
        }

        console.log(`  ✓ ${oldKey} -> ${providerId} 修复完成\n`);
        fixed++;
    }

    if (fixed > 0) {
        saveConfig(config);
        saveAuth(auth);
        console.log(`✓ 已修复 ${fixed} 个 Provider 配置\n`);
    }

    return fixed;
};

/**
 * 自动修复配置不一致
 * 为 auth.json 中存在但 opencode.json 中缺少的 provider 补全配置
 */
export const autoFixAuthOnlyProviders = async (authOnlyProviders) => {
    const config = loadConfig();
    let fixed = 0;

    console.log('\n[自动修复配置]');
    console.log(`检测到 ${authOnlyProviders.length} 个不完整的 Provider 配置\n`);

    for (const providerName of authOnlyProviders) {
        console.log(`正在修复: ${providerName}`);

        // 询问用户这个 provider 的基本信息
        const displayName = await input(`  显示名称 (留空使用 "${providerName}"):`, providerName);

        // 询问 API 类型
        const apiType = await select('  API 类型:', 'anthropic', [
            { name: 'Anthropic 兼容 (Claude)', value: 'anthropic' },
            { name: 'OpenAI 兼容 (GPT)', value: 'openai' }
        ]);

        // 询问 baseURL
        const defaultBaseUrl = apiType === 'anthropic' ? 'https://api.anthropic.com' : 'https://api.openai.com/v1';
        const baseUrl = await input(`  API 地址 (留空使用默认):`, defaultBaseUrl);

        // 询问是否添加模型
        const addModels = await confirm('  是否添加模型列表?', true);
        const models = {};

        if (addModels) {
            console.log('  输入模型名称 (每行一个，输入空行结束):');
            let modelInput = await input('    模型 1:');
            let modelCount = 1;
            while (modelInput) {
                models[modelInput] = { name: modelInput };
                modelCount++;
                modelInput = await input(`    模型 ${modelCount}:`);
            }
        }

        // 创建 provider 配置
        config.provider = config.provider || {};
        config.provider[providerName] = {
            id: providerName,
            npm: apiType === 'anthropic' ? '@ai-sdk/anthropic' : '@ai-sdk/openai-compatible',
            name: displayName,
            options: {
                baseURL: baseUrl
            },
            models: models
        };

        console.log(`✓ ${providerName} 配置已补全\n`);
        fixed++;
    }

    if (fixed > 0) {
        saveConfig(config);
        console.log(`✓ 已修复 ${fixed} 个 Provider 配置\n`);
    }

    return fixed;
};

/**
 * 自动修复缺少 API Key 的 Provider
 * 为 config 中存在但 auth.json 中缺少 key 的 provider 添加 key
 */
export const autoFixMissingKeyProviders = async (missingKeyProviders) => {
    const auth = loadAuth();
    let fixed = 0;

    console.log('\n[修复缺少 API Key 的 Provider]');
    console.log(`检测到 ${missingKeyProviders.length} 个 Provider 缺少 API Key\n`);

    for (const providerName of missingKeyProviders) {
        console.log(`正在修复: ${providerName}`);

        // 询问用户是否添加 API Key 或删除配置
        const action = await select('选择操作:', 'add-key', [
            { name: '添加 API Key', value: 'add-key' },
            { name: '删除此 Provider 配置', value: 'delete' },
            { name: '跳过', value: 'skip' }
        ]);

        if (action === 'add-key') {
            const apiKey = await input('  请输入 API Key:');
            if (apiKey) {
                auth[providerName] = { type: 'api', key: apiKey };
                console.log(`✓ ${providerName} API Key 已添加\n`);
                fixed++;
            } else {
                console.log(`✗ 未输入 API Key，跳过\n`);
            }
        } else if (action === 'delete') {
            const config = loadConfig();
            if (config.provider?.[providerName]) {
                delete config.provider[providerName];
                saveConfig(config);
                console.log(`✓ ${providerName} 配置已删除\n`);
                fixed++;
            }
        } else {
            console.log(`跳过 ${providerName}\n`);
        }
    }

    if (fixed > 0) {
        saveAuth(auth);
        console.log(`✓ 已修复 ${fixed} 个 Provider\n`);
    }

    return fixed;
};

/**
 * 统一的配置验证和修复流程
 * @returns {Promise<boolean>} 是否可以继续启动
 */
export const validateAndFixConfig = async () => {
    const warnings = validateAndSyncConfig();

    if (warnings.length === 0) {
        return true; // 配置正常，可以启动
    }

    const issues = classifyConfigIssues(warnings);

    // 显示配置摘要
    console.log('\n[配置检查]\n');

    // 显示阻塞性问题
    if (issues.blocking.length > 0) {
        console.log('❌ 发现阻塞性问题，必须修复才能启动:\n');
        issues.blocking.forEach((w) => {
            console.log(`  ${w.message}:`);
            w.providers.forEach((p) => console.log(`    • ${p}`));
        });
    }

    // 显示警告性问题
    if (issues.warning.length > 0) {
        if (issues.blocking.length > 0) console.log('');
        console.log('⚠️  发现警告问题，建议修复:\n');
        issues.warning.forEach((w) => {
            console.log(`  ${w.message}:`);
            w.providers.forEach((p) => console.log(`    • ${p}`));
        });
    }

    // 显示信息性提示
    if (issues.info.length > 0) {
        if (issues.blocking.length > 0 || issues.warning.length > 0) console.log('');
        console.log('ℹ️  提示:\n');
        issues.info.forEach((w) => {
            console.log(`  ${w.message}:`);
            w.providers.forEach((p) => console.log(`    • ${p}`));
        });
    }

    console.log('');

    // 处理阻塞性问题
    if (issues.blocking.length > 0) {
        console.log('必须先修复阻塞性问题才能继续。\n');
        const shouldFix = await confirm('是否立即修复?', true);

        if (!shouldFix) {
            console.log('\n提示: 使用 xa --manage 可随时修复配置\n');
            return false; // 不启动
        }

        // 修复所有阻塞性问题
        for (const issue of issues.blocking) {
            if (issue.type === 'template-key') {
                await autoFixTemplateKeyProviders(issue.providers);
            }
        }

        console.log('\n✓ 阻塞性问题已修复\n');
    }

    // 处理警告性问题
    if (issues.warning.length > 0) {
        const shouldFix = await confirm('是否修复警告问题?', issues.blocking.length > 0);

        if (shouldFix) {
            for (const issue of issues.warning) {
                if (issue.type === 'auth-only') {
                    await autoFixAuthOnlyProviders(issue.providers);
                } else if (issue.type === 'missing-key') {
                    await autoFixMissingKeyProviders(issue.providers);
                }
                // 其他类型的警告可以在这里处理
            }
            console.log('\n✓ 警告问题已修复\n');
        } else {
            const continueAnyway = await confirm('仍要继续启动?', true);
            if (!continueAnyway) {
                console.log('\n提示: 使用 xa --manage 可随时修复配置\n');
                return false;
            }
        }
    }

    return true; // 可以启动
};

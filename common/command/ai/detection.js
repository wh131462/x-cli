/**
 * API 连通性检测和类型识别模块
 */

import { loadConfig, loadAuth } from './config.js';
import { PROVIDERS } from './providers.js';

/**
 * 检测 API 类型和连通性
 * @param {string} baseUrl - API 地址
 * @param {string} apiKey - API Key
 * @returns {Promise<{success: boolean, type?: string, error?: string, details?: object}>}
 */
export const detectApiType = async (baseUrl, apiKey) => {
    const results = {
        success: false,
        type: null,
        error: null,
        details: {}
    };

    // 移除末尾的斜杠
    const cleanUrl = baseUrl.replace(/\/$/, '');

    // 测试 1: Anthropic API (使用 /v1/messages)
    try {
        const anthropicUrl = `${cleanUrl}/v1/messages`;
        const anthropicResponse = await fetch(anthropicUrl, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-haiku-20241022',
                max_tokens: 10,
                messages: [{ role: 'user', content: 'hi' }]
            }),
            signal: AbortSignal.timeout(10000)
        });

        const anthropicData = await anthropicResponse.json();

        // 成功：返回了 message 对象
        if (anthropicResponse.ok && anthropicData.type === 'message') {
            results.success = true;
            results.type = 'anthropic';
            results.details = {
                endpoint: '/v1/messages',
                testModel: anthropicData.model,
                responseId: anthropicData.id
            };
            return results;
        }

        // 记录 Anthropic 测试失败信息
        results.details.anthropic = {
            status: anthropicResponse.status,
            error: anthropicData.type === 'error' ? anthropicData : null
        };
    } catch (error) {
        results.details.anthropic = { error: error.message };
    }

    // 测试 2: OpenAI API (使用 /v1/chat/completions)
    try {
        const openaiUrl = `${cleanUrl}/v1/chat/completions`;
        const openaiResponse = await fetch(openaiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                max_tokens: 10,
                messages: [{ role: 'user', content: 'hi' }]
            }),
            signal: AbortSignal.timeout(10000)
        });

        const openaiData = await openaiResponse.json();

        // 成功：返回了 choices 数组
        if (openaiResponse.ok && openaiData.choices) {
            results.success = true;
            results.type = 'openai';
            results.details = {
                endpoint: '/v1/chat/completions',
                testModel: openaiData.model,
                responseId: openaiData.id
            };
            return results;
        }

        // 记录 OpenAI 测试失败信息
        results.details.openai = {
            status: openaiResponse.status,
            error: openaiData.error || openaiData
        };
    } catch (error) {
        results.details.openai = { error: error.message };
    }

    // 测试 3: 尝试获取模型列表 (通用)
    try {
        const modelsUrl = `${cleanUrl}/v1/models`;
        const modelsResponse = await fetch(modelsUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(10000)
        });

        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            results.details.models = {
                available: modelsData.data?.length > 0,
                count: modelsData.data?.length || 0
            };
        }
    } catch (error) {
        // 忽略模型列表错误
    }

    // 所有测试都失败
    results.error = '无法连接到 API，请检查 baseURL 和 API Key 是否正确';
    return results;
};

/**
 * 检测单个 Provider 的连通性
 * @param {string} providerName - Provider 名称
 * @returns {Promise<{success: boolean, provider: string, type?: string, error?: string}>}
 */
export const testProvider = async (providerName) => {
    const config = loadConfig();
    const auth = loadAuth();

    const providerConfig = config.provider?.[providerName];
    if (!providerConfig) {
        return {
            success: false,
            provider: providerName,
            error: `Provider "${providerName}" 未在配置中找到`
        };
    }

    // 获取 baseURL
    const baseUrl = providerConfig.options?.baseURL;
    if (!baseUrl) {
        // 检查是否是不需要 baseURL 的内置 provider
        const builtinProvider = PROVIDERS[providerName];
        if (builtinProvider && !builtinProvider.supportsBaseUrl) {
            return {
                success: true,
                provider: providerName,
                type: 'builtin',
                message: '内置 Provider，使用官方端点'
            };
        }
        return {
            success: false,
            provider: providerName,
            error: '未配置 baseURL'
        };
    }

    // 获取 API Key
    const apiKey = auth[providerName]?.key || providerConfig.options?.apiKey;
    if (!apiKey) {
        // 检查是否是 Ollama 等不需要 key 的 provider
        const builtinProvider = PROVIDERS[providerName];
        if (builtinProvider?.noApiKey) {
            // 简单测试连通性
            try {
                const response = await fetch(`${baseUrl}/v1/models`, {
                    signal: AbortSignal.timeout(5000)
                });
                return {
                    success: response.ok,
                    provider: providerName,
                    type: 'no-auth',
                    error: response.ok ? null : `HTTP ${response.status}`
                };
            } catch (error) {
                return {
                    success: false,
                    provider: providerName,
                    error: `连接失败: ${error.message}`
                };
            }
        }
        return {
            success: false,
            provider: providerName,
            error: '未配置 API Key'
        };
    }

    // 执行 API 类型检测
    console.log(`\n正在测试 ${providerName}...`);
    const detection = await detectApiType(baseUrl, apiKey);

    if (detection.success) {
        console.log(`✓ 连接成功 (${detection.type} 兼容)`);
        console.log(`  端点: ${detection.details.endpoint}`);
        if (detection.details.testModel) {
            console.log(`  测试模型: ${detection.details.testModel}`);
        }
    } else {
        console.log(`✗ 连接失败`);
        console.log(`  ${detection.error}`);
        if (detection.details.anthropic) {
            console.log(`  Anthropic 端点: HTTP ${detection.details.anthropic.status || '超时'}`);
        }
        if (detection.details.openai) {
            console.log(`  OpenAI 端点: HTTP ${detection.details.openai.status || '超时'}`);
        }
    }

    return {
        success: detection.success,
        provider: providerName,
        type: detection.type,
        error: detection.error,
        details: detection.details
    };
};

/**
 * 检测所有已配置的 Providers
 * @returns {Promise<Array>} 检测结果列表
 */
export const testAllProviders = async () => {
    const config = loadConfig();
    const providers = Object.keys(config.provider || {});

    if (providers.length === 0) {
        console.log('\n未配置任何 Provider\n');
        return [];
    }

    console.log(`\n开始检测 ${providers.length} 个 Provider...\n`);

    const results = [];
    for (const providerName of providers) {
        const result = await testProvider(providerName);
        results.push(result);
        console.log(''); // 空行分隔
    }

    // 显示汇总
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    console.log('='.repeat(50));
    console.log(`检测完成: ${successCount} 成功, ${failCount} 失败\n`);

    if (failCount > 0) {
        console.log('失败的 Providers:');
        results
            .filter((r) => !r.success)
            .forEach((r) => {
                console.log(`  • ${r.provider}: ${r.error}`);
            });
        console.log('\n建议: 使用 xa --manage 修复配置\n');
    }

    return results;
};

/**
 * 智能建议正确的配置
 * @param {object} detection - 检测结果
 * @param {string} currentNpm - 当前配置的 npm 包
 * @returns {object} 建议的配置
 */
export const suggestCorrectConfig = (detection, currentNpm) => {
    const suggestions = {
        needsChange: false,
        recommendedNpm: currentNpm,
        recommendedBaseUrl: null,
        reason: null
    };

    if (!detection.success) {
        return suggestions;
    }

    // 检测到的类型与当前配置不匹配
    if (detection.type === 'anthropic' && currentNpm !== '@ai-sdk/anthropic') {
        suggestions.needsChange = true;
        suggestions.recommendedNpm = '@ai-sdk/anthropic';
        suggestions.reason = '检测到 Anthropic 兼容 API，但当前配置为 OpenAI 兼容';
    } else if (detection.type === 'openai' && currentNpm === '@ai-sdk/anthropic') {
        suggestions.needsChange = true;
        suggestions.recommendedNpm = '@ai-sdk/openai-compatible';
        suggestions.reason = '检测到 OpenAI 兼容 API，但当前配置为 Anthropic 兼容';
    }

    return suggestions;
};

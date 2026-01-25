/**
 * AI 工作区命令入口
 * 支持配置向导 + OpenCode TUI
 */

import { select, confirm } from '#common/utils/ui/promot.js';
import { ensureBaseConfig, loadConfig } from './config.js';
import { isConfigured, getConfiguredProviders } from './providers.js';
import { validateAndFixConfig } from './validation.js';
import { configWizard, displayConfigInfo, selectModel } from './wizard.js';
import { manageProviders } from './wizard-manage.js';
import { launchOpencode } from './launcher.js';
import { testProvider, testAllProviders } from './detection.js';

/**
 * AI 工作区主入口
 * @param {object} options
 * @param {string|boolean} [options.provider] - 指定提供者 (true 表示交互选择)
 * @param {string|boolean} [options.model] - 指定模型 (true 表示交互选择)
 * @param {boolean} [options.config] - 进入配置模式
 * @param {boolean} [options.manage] - 进入管理模式
 * @param {boolean} [options.info] - 显示配置信息
 * @param {boolean} [options.verbose] - 显示详细信息
 * @param {boolean} [options.test] - 测试 Provider 连通性
 */
export const ai = async (options = {}) => {
    // 确保基础配置文件存在（首次运行时生成，可能导入全局配置）
    const { needsConfig } = await ensureBaseConfig();

    // 显示配置信息模式
    if (options.info) {
        displayConfigInfo(options.verbose);
        return;
    }

    // 测试 Provider 连通性模式
    if (options.test) {
        if (options.provider && typeof options.provider === 'string') {
            // 测试单个 provider
            await testProvider(options.provider);
        } else {
            // 测试所有 providers
            await testAllProviders();
        }
        return;
    }

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

    // 首次运行时，如果用户选择立即配置
    if (needsConfig) {
        await configWizard();
    }

    // 检查是否已配置
    if (!isConfigured()) {
        console.log('\n[!] 未检测到 API Key 配置\n');
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

    // 启动前验证和修复配置
    const shouldLaunch = await validateAndFixConfig();
    if (!shouldLaunch) {
        return; // 用户选择不启动或修复失败
    }

    // 启动 OpenCode TUI
    launchOpencode(options);
};

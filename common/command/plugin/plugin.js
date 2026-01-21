import { logger } from '#common/utils/x/logger.js';
import { commitLint } from '#common/command/plugin/plugins/commit-lint/commit-lint.js';
import { eslint } from '#common/command/plugin/plugins/eslint/eslint.js';
import { gitignore } from '#common/command/plugin/plugins/gitignore/gitignore.js';
import { husky } from '#common/command/plugin/plugins/hsuky/husky.js';
import { prettier } from '#common/command/plugin/plugins/prettier/prettier.js';
import { lintStaged } from '#common/command/plugin/plugins/lint-staged/lint-staged.js';
import { executeTogether } from '#common/utils/node/execute.js';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * 插件列表
 */
const plugins = { gitignore, eslint, prettier, lintStaged, commitLint, husky };

/**
 * 检测是否为 monorepo
 * @returns {boolean}
 */
export const isMonorepo = () => {
    const cwd = process.cwd();
    // 检测常见 monorepo 标志
    const monorepoIndicators = ['pnpm-workspace.yaml', 'lerna.json', 'nx.json', 'rush.json', 'turbo.json'];

    for (const indicator of monorepoIndicators) {
        if (existsSync(resolve(cwd, indicator))) {
            return true;
        }
    }

    // 检查 package.json 中的 workspaces 字段
    try {
        const packageJsonPath = resolve(cwd, 'package.json');
        if (existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
            if (packageJson.workspaces) {
                return true;
            }
        }
    } catch (e) {
        // ignore
    }

    return false;
};

/**
 * 插件操作
 * @param action {"install"|"uninstall"|"list"|"init"}
 * @param pluginName {string|undefined}
 * @returns {Promise<void>}
 */
export const plugin = async (action, pluginName) => {
    if (!['install', 'uninstall', 'list', 'init'].includes(action)) {
        logger.warn('Invalid action! Available: install/uninstall/list/init');
        throw new Error('Invalid action.');
    }

    if (action === 'list') {
        await list();
    } else if (action === 'init') {
        await initDevTools();
    } else {
        if (pluginName) {
            if (!plugins[pluginName]) {
                logger.warn(`Plugin ${pluginName} not found`);
                throw new Error(`Plugin ${pluginName} not found`);
            }
            await plugins[pluginName][action]();
        } else {
            await executeTogether(...Object.keys(plugins).map((key) => plugins[key][action]()));
        }
    }
};

/**
 * 列出所有插件状态
 */
const list = async () => {
    const checks = Object.keys(plugins).map((key) => {
        return (async () => {
            const has = await plugins[key]?.['check']?.();
            logger.info(`[${has ? '+' : '-'}] ${key} - ${has ? 'installed' : 'uninstalled'}`);
        })();
    });
    return await Promise.allSettled(checks);
};

/**
 * 一键初始化所有开发工具
 * @returns {Promise<void>}
 */
export const initDevTools = async () => {
    const monorepo = isMonorepo();
    logger.info(`Project type: ${monorepo ? 'Monorepo' : 'Single project'}`);

    // 选择要安装的工具
    const toolsToInstall = await selectTools();

    if (toolsToInstall.length === 0) {
        logger.info('No tools selected, skipping initialization');
        return;
    }

    // 依次安装选中的工具（有依赖关系，需要按顺序）
    const installOrder = ['gitignore', 'eslint', 'prettier', 'lintStaged', 'commitLint', 'husky'];

    for (const tool of installOrder) {
        if (toolsToInstall.includes(tool) && plugins[tool]) {
            logger.info(`Installing ${tool}...`);
            try {
                // 传入 monorepo 参数
                await plugins[tool].install({ monorepo });
                logger.info(`${tool} installed`);
            } catch (e) {
                logger.error(`${tool} installation failed:`, e);
            }
        }
    }

    logger.info('Dev tools initialization complete!');
};

/**
 * 选择要安装的工具
 * @returns {Promise<string[]>}
 */
const selectTools = async () => {
    const { default: inquirer } = await import('inquirer');

    const { tools } = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'tools',
            message: 'Select dev tools to install:',
            choices: [
                { name: 'gitignore - Git ignore file', value: 'gitignore', checked: true },
                { name: 'ESLint - Code linting', value: 'eslint', checked: true },
                { name: 'Prettier - Code formatting', value: 'prettier', checked: true },
                { name: 'lint-staged - Staged files check', value: 'lintStaged', checked: true },
                { name: 'commitlint - Commit message lint', value: 'commitLint', checked: true },
                { name: 'Husky - Git Hooks', value: 'husky', checked: true }
            ]
        }
    ]);

    return tools;
};

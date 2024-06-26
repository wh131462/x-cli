import { logger } from '#common/utils/x/logger.js';
import { commitLint } from '#common/command/plugin/plugins/commit-lint/commit-lint.js';
import { eslint } from '#common/command/plugin/plugins/eslint/eslint.js';
import { gitignore } from '#common/command/plugin/plugins/gitignore/gitignore.js';
import { husky } from '#common/command/plugin/plugins/hsuky/husky.js';
import { comment } from '#common/command/plugin/plugins/comment/comment.js';
import { prettier } from '#common/command/plugin/plugins/prettier/prettier.js';
import { executeTogether } from '#common/utils/node/execute.js';
import { lintStaged } from '#common/command/plugin/plugins/lint-staged/lint-staged.js';

/**
 * 插件的使用
 * @param action {"install"|"uninstall"|"list"}
 * @param pluginName {string|undefined}
 * @returns {Promise<void>}
 */
export const plugin = async (action, pluginName) => {
    if (!['install', 'uninstall', 'list'].includes(action)) {
        logger.warn('Not correct action! You can use install/uninstall/list command with plugin.');
        throw 'Not correct action.';
    }
    if (action === 'list') {
        await list();
    } else {
        if (pluginName) await plugins?.[pluginName]?.[action]?.();
        else await executeTogether(...Object.keys(plugins).map((key) => plugins[key][action]()));
    }
};

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
 * 插件列表
 */
const plugins = { gitignore, comment, lintStaged, husky, commitLint, eslint, prettier };

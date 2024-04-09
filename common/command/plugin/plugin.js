import { logger } from '#common/utils/logger.js';

/**
 * 插件的使用
 * @param action {"add"|"remove"|"list"}
 * @param pluginName {string|undefined}
 * @returns {Promise<void>}
 */
export const plugin = async (action, pluginName) => {
    if (action === 'list') {
        await list();
    } else {
        await plugins?.[pluginName]?.[action]?.();
    }
};

const list = async () => {
    const checks = Object.entries(plugins).map(([key, call]) => {
        return (async () => {
            const has = await call?.['check']?.();
            logger.info(`[${has ? '+' : '-'}] ${key} - ${has ? 'installed' : 'uninstalled'}`);
        })();
    });
    await Promise.allSettled(checks);
};
/**
 * 插件列表
 * @type {{eslint: {add: ((function(): Promise<*>)|*), check: ((function(): Promise<*>)|*), remove: ((function(): Promise<*>)|*)}, comment: {add: ((function(): Promise<*>)|*), check: ((function(): Promise<*>)|*), remove: ((function(): Promise<*>)|*)}}}
 */
const plugins = {
    comment: {
        check: async () => {
            return true;
        },
        add: async () => {},
        remove: async () => {}
    },
    eslint: {
        check: async () => {
            return false;
        },
        add: async () => {},
        remove: async () => {}
    }
};

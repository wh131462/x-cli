import { nameConverter } from '#common/utils/manager/utils.js';
import { execute, executeInteraction } from '#common/utils/node/execute.js';

/**
 * bun 安装包
 * @param packageName
 * @param isDev
 * @param isGlobal
 * @param options
 * @returns {Promise<unknown>}
 */
export const bunInstall = (packageName, isDev = false, isGlobal = false, options = {}) => {
    let command = 'bun';
    let installType = 'add';
    if (isDev) installType = 'add --dev';
    else if (isGlobal) installType = 'add --global';
    if (!packageName) installType = 'install';
    const fullCommand = `${command} ${installType} ${nameConverter(packageName)} ${Object.entries(options)
        .map(([key, value]) => `--${key}=${value}`)
        .join(' ')}`;
    return execute(fullCommand);
};

/**
 * bun 卸载包
 * @param packageName
 * @param isGlobal
 * @param options
 * @returns {Promise<unknown>}
 */
export const bunUninstall = (packageName, isGlobal = false, options = {}) => {
    if (!packageName) return Promise.reject('packageName is required');
    let command = isGlobal ? 'bun remove --global' : 'bun remove';
    const fullCommand = `${command} ${nameConverter(packageName)} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return execute(fullCommand);
};

/**
 * bun 运行脚本
 * @param scriptName
 * @param options
 * @returns {Promise<unknown>}
 */
export const bunRun = (scriptName, options = {}) => {
    const fullCommand = `bun run ${scriptName} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return executeInteraction(fullCommand);
};

/**
 * bunx (类似 npx)
 * @param command
 * @returns {Promise<unknown>}
 */
export const bunx = (command) => {
    return executeInteraction(`bunx ${command}`);
};

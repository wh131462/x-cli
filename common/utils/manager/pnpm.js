import { exec } from 'child_process';
import { logger } from '#common/utils/logger.js';
import { nameConverter } from '#common/utils/manager/utils.js';
import { execute } from '#common/utils/node/execute.js';

/**
 * pnpm安装
 * @returns {Promise<unknown>}
 * @constructor
 */
export const PNPM_INSTALL = () => {
    return execute('curl -fsSL https://get.pnpm.io/install.sh | sh -');
};
// 使用pnpm安装包
export const pnpmInstall = (packageName, isDev = false, isGlobal = false, option = {}) => {
    let command = 'pnpm';
    let installType = 'add';
    if (isDev) installType = 'add --save-dev';
    else if (isGlobal) installType = 'add --global';

    const fullCommand = `${command} ${installType} ${nameConverter(packageName)} ${Object.entries(option)
        .map(([key, value]) => `--${key}=${value}`)
        .join(' ')}`;
    return execute(fullCommand);
};
// 使用pnpm卸载包
export const pnpmUninstall = (packageName, isGlobal = false, options = {}) => {
    let command = isGlobal ? 'pnpm remove -g' : 'pnpm remove';
    const fullCommand = `${command} ${nameConverter(packageName)} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return execute(fullCommand);
};

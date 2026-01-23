import { nameConverter } from '#common/utils/manager/utils.js';
import { execute, executeInteraction } from '#common/utils/node/execute.js';

/**
 * pnpm安装
 * @returns {Promise<unknown>}
 * @constructor
 */
export const PNPM_INSTALL = () => {
    if (process.platform === 'win32') {
        // Windows: 使用 npm 安装（最可靠）
        return execute('npm install -g pnpm');
    } else {
        // Unix: 使用官方安装脚本
        return execute('curl -fsSL https://get.pnpm.io/install.sh | sh -');
    }
};
// 使用pnpm安装包
export const pnpmInstall = (packageName, isDev = false, isGlobal = false, option = {}) => {
    let command = 'pnpm';
    let installType = 'add';
    if (isDev) installType = 'add --save-dev';
    else if (isGlobal) installType = 'add --global';
    if (!packageName) installType = 'install';
    const fullCommand = `${command} ${installType} ${nameConverter(packageName)} ${Object.entries(option)
        .map(([key, value]) => `--${key}=${value}`)
        .join(' ')}`;
    return execute(fullCommand);
};
// 使用pnpm卸载包
export const pnpmUninstall = (packageName, isGlobal = false, options = {}) => {
    if (!packageName) return Promise.reject('packageName is required');
    let command = isGlobal ? 'pnpm remove -g' : 'pnpm remove';
    const fullCommand = `${command} ${nameConverter(packageName)} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return execute(fullCommand);
};

// 运行pnpm脚本
export const pnpmRun = (scriptName, options = {}) => {
    const fullCommand = `pnpm ${scriptName} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return executeInteraction(fullCommand);
};

/**
 * pnpx (pnpm dlx)
 * @param command
 * @returns {Promise<never>|Promise<unknown>}
 */
export const pnpx = (command) => {
    // pnpm dlx 不需要 -y 选项，默认自动安装
    return executeInteraction(`pnpm dlx ${command}`);
};

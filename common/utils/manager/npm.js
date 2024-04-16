import { exec } from 'child_process';
import { logger } from '#common/utils/logger.js';
import { nameConverter } from '#common/utils/manager/utils.js';
import { execute, executeInteraction } from '#common/utils/node/execute.js';

/**
 * npm安装
 * @returns {Promise<unknown>}
 * @constructor
 */
export const NPM_INSTALL = () => {
    return new Promise((resolve) => {
        logger.warn('[NPM_INSTALL]请移步官网下载:https://nodejs.org/en');
        resolve();
    });
};
/**
 * npm 安装
 * @param packageName
 * @param isDev
 * @param isGlobal
 * @param options
 * @returns {Promise<unknown>}
 */
export const npmInstall = (packageName, isDev = false, isGlobal = false, options = {}) => {
    let command = 'npm';
    let installType = 'install';

    if (isDev) {
        installType = 'install --save-dev';
    } else if (isGlobal) {
        command = 'npm';
        installType = 'install -g';
    } else {
        command = 'npm';
    }

    const fullCommand = `${command} ${installType} ${nameConverter(packageName)} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return execute(fullCommand);
};

/**
 * 卸载npm包
 * @param packageName
 * @param isGlobal
 * @param options
 * @returns {Promise<unknown>}
 */
export const npmUninstall = (packageName, isGlobal = false, options = {}) => {
    let command = isGlobal ? 'npm uninstall -g' : 'npm uninstall';
    const fullCommand = `${command} ${nameConverter(packageName)} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return execute(fullCommand);
};
/**
 * 运行npm脚本
 * @param scriptName
 * @param options
 * @returns {Promise<unknown>}
 */
export const npmRun = (scriptName, options = {}) => {
    const fullCommand = `npm run ${scriptName} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return execute(fullCommand);
};

/**
 * npm是否存在某个包
 * @param packageName
 * @param isGlobal
 */
export const npmHas = async (packageName, isGlobal = false) => {
    const command = `npm list ${nameConverter(packageName)} ${isGlobal ? '-g' : ''} --depth=0`;
    const res = await execute(`${command} | grep ${packageName}`);
    return typeof res === 'boolean' ? res : res.toString()?.trim()?.includes(packageName);
};
/**
 * npx
 * @param command
 * @returns {Promise<never>|Promise<unknown>}
 */
export const npx = (command) => {
    return executeInteraction(`npx -y ${command} `);
};

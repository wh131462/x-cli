import { npmInstall } from '#common/utils/manager/npm.js';
import { execute, executeInteraction } from '#common/utils/node/execute.js';
import { nameConverter } from '#common/utils/manager/utils.js';

/**
 * yarn安装
 * @returns {Promise<void>}
 * @constructor
 */
export const YARN_INSTALL = async () => {
    await npmInstall('yarn', false, true);
};
// 使用yarn安装包
export const yarnInstall = (packageName, isDev = false, isGlobal = false, option = {}) => {
    let command = 'yarn';
    let installType = 'add';

    if (isDev) {
        installType = 'add --dev';
    } else if (isGlobal) {
        command = 'yarn global';
        installType = 'add';
    } else {
        command = 'yarn';
    }

    const fullCommand = `${command} ${installType} ${nameConverter(packageName)} ${Object.keys(option)
        .map((key) => `--${key}=${option[key]}`)
        .join(' ')}`;
    return execute(fullCommand);
};

// 使用yarn卸载包
export const yarnUninstall = (packageName, isGlobal = false, options = {}) => {
    let command = isGlobal ? 'yarn global remove' : 'yarn remove';
    const fullCommand = `${command} ${nameConverter(packageName)} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return execute(fullCommand);
};
// 运行yarn脚本
export const yarnRun = (scriptName, options = {}) => {
    const fullCommand = `yarn run ${scriptName} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return execute(fullCommand);
};

/**
 * yarnCreate - 类似npx
 * @param command
 * @returns {Promise<never>|Promise<unknown>}
 */
export const yarnCreate = (command) => {
    return executeInteraction(`yarn create ${command}`);
};

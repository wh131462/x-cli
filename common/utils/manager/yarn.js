import { exec, execSync } from 'child_process';
import { npmInstall } from '#common/utils/manager/npm.js';

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

    const fullCommand = `${command} ${installType} ${packageName} ${Object.keys(option)
        .map((key) => `--${key}=${option[key]}`)
        .join(' ')}`;
    return new Promise((resolve, reject) => {
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    });
};

// 使用yarn卸载包
export const yarnUninstall = (packageName, isGlobal = false, options = {}) => {
    let command = isGlobal ? 'yarn global remove' : 'yarn remove';
    const fullCommand = `${command} ${packageName} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return new Promise((resolve, reject) => {
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    });
};
// 运行yarn脚本
export const yarnRun = (scriptName, options = {}) => {
    const fullCommand = `yarn run ${scriptName} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return new Promise((resolve, reject) => {
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    });
};

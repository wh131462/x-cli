import { exec, execSync } from 'child_process';
import { logger } from '#common/utils/logger.js';

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

    const fullCommand = `${command} ${installType} ${packageName} ${Object.keys(options)
        .map((key) => `--${key}=${options[key]}`)
        .join(' ')}`;
    return new Promise((resolve, reject) => {
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                logger.info(`${stdout}\n[npm][${packageName}]安装完成!`);
                resolve({ stdout, stderr });
            }
        });
    });
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
/**
 * npx
 * @param command
 * @returns {Promise<unknown>}
 */
export const npx = (command) => {
    const fullCommand = `$npx ${command}`;
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

/**
 * npm是否存在某个包
 * @param packageName
 * @param isGlobal
 */
export const npmHas = (packageName, isGlobal = false) => {
    const command = `npm list ${packageName} ${isGlobal ? '-g' : ''} --depth=0`;
    return new Promise((resolve, reject) => {
        exec(`${command} | grep ${packageName}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                const hasPackage = stdout?.trim()?.includes(packageName);
                resolve(hasPackage);
            }
        });
    });
};

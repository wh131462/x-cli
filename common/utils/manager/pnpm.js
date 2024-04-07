import { exec, execSync } from 'child_process';

/**
 * pnpm安装
 * @returns {Promise<unknown>}
 * @constructor
 */
export const PNPM_INSTALL = () => {
    return new Promise((resolve, reject) => {
        exec('curl -fsSL https://get.pnpm.io/install.sh | sh -', (error, stdout, stderr) => {
            if (error) reject(error);
            console.log(stdout);
            resolve();
        });
    });
};
// 使用pnpm安装包
export const pnpmInstall = (packageName, isDev = false, isGlobal = false, option = {}) => {
    let command = 'pnpm';
    let installType = 'add';
    if (isDev) installType = 'add --save-dev';
    else if (isGlobal) installType = 'add --global';

    const fullCommand = `${command} ${installType} ${packageName} ${Object.entries(option)
        .map(([key, value]) => `--${key}=${value}`)
        .join(' ')}`;

    return new Promise((resolve, reject) => {
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) reject(error);
            else resolve({ stdout, stderr });
        });
    });
};
// 使用pnpm卸载包
export const pnpmUninstall = (packageName, isGlobal = false, options = {}) => {
    let command = isGlobal ? 'pnpm remove -g' : 'pnpm remove';
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

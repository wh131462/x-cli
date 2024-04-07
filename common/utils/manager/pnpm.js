import { exec } from 'child_process';
// 使用pnpm安装包
export const pnpmInstall = (packageName, isDev = false, isGlobal = false, option = {}) => {
    let command = 'pnpm';
    let installType = 'add';
    if (isDev) {
        installType = 'add --save-dev';
    } else if (isGlobal) {
        command = 'pnpm';
        installType = 'add --global';
    } else {
        command = 'pnpm';
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

const { exec } = require('child_process');
export const npmInstall = (packageName, isDev = false, isGlobal = false, option = {}) => {
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
                resolve({ stdout, stderr });
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    });
};

// 卸载npm包
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
// 运行npm脚本
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
// 执行任意npm命令

export const npmExec = (command, options = {}) => {
    const fullCommand = `${command} ${Object.keys(options)
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

import { execSync } from 'child_process';

/**
 * npm 安装
 * @param packageName
 * @param isDev
 * @param isGlobal
 */
export const npmInstall = (packageName, isDev = false, isGlobal = false) => {
    execSync(`npm install ${isDev ? '--save-dev --save-exact' : ''}${isGlobal ? '-g' : ''} ${packageName}`);
};
/**
 * init
 * @param packageName
 * @param isDev
 */
export const npmInit = (packageName, isDev) => {
    execSync(`npm init ${isDev ? '--save-dev --save-exact' : ''} ${packageName}`);
};

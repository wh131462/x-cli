import { writeConfig } from '#common/utils/file/writeConfig.js';
import { npmInstall } from '#common/utils/manager/npm.js';

const commitlintConfig = {
    extends: ['@commitlint/config-conventional']
};
/**
 * 导出对应的安装模式
 * @type {{install: Promise<*>, config: Promise | Promise<unknown>}}
 */
export const commitLint = {
    install: npmInstall('@commitlint/{cli,config-conventional}', true),
    config: writeConfig('.commitlintrc.cjs', commitlintConfig)
};

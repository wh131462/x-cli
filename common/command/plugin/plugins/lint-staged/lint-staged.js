import { writeConfig } from '#common/utils/file/writeConfig.js';
import { npmHas, npmInstall, npmUninstall } from '#common/utils/manager/npm.js';
import { removeFile } from '#common/utils/file/remove.js';
const lintStagedConfig = {
    '*.{js,ts,jsx,tsx,vue}': ['prettier --write', 'eslint --fix'],
    '*.{html,css,scss,less,json}': ['prettier --write']
};
/**
 * lint stage
 * @type {IPlugin}
 */
export const lintStaged = {
    check: () => npmHas('lint-staged'),
    install: () =>
        Promise.allSettled([npmInstall('lint-staged', true), writeConfig('.lintstagedrc', lintStagedConfig)]),
    uninstall: () => Promise.allSettled([npmUninstall('lint-staged', true), removeFile('.lintstagedrc')])
};

import { writeConfig } from '#common/utils/file/writeConfig.js';
import { removeFile } from '#common/utils/file/remove.js';
import { managerHas, managerInstall, managerUninstall } from '#common/utils/manager/manager.js';
import { executeTogether } from '#common/utils/node/execute.js';

const lintStagedConfig = {
    '*.{js,ts,jsx,tsx,vue}': ['prettier --write', 'eslint --fix'],
    '*.{html,css,scss,less,json}': ['prettier --write']
};
/**
 * lint stage
 * @type {IPlugin}
 */
export const lintStaged = {
    check: () => managerHas('lint-staged'),
    install: () => executeTogether(managerInstall('lint-staged', true), writeConfig('.lintstagedrc', lintStagedConfig)),
    uninstall: () => executeTogether(managerUninstall('lint-staged'), removeFile('.lintstagedrc'))
};

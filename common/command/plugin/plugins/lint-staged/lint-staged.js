import { writeConfig } from '#common/utils/file/writeConfig.js';
import { removeFile } from '#common/utils/file/remove.js';
import { managerHas, managerInstall, managerUninstall } from '#common/utils/manager/manager.js';
import { executeTogether } from '#common/utils/node/execute.js';
import { lintStagedConfig } from '#common/constants/devtools.const.js';

/**
 * lint-staged
 * @type {IPlugin}
 */
export const lintStaged = {
    check: () => managerHas('lint-staged'),
    install: async ({ monorepo = false } = {}) => {
        return executeTogether(managerInstall('lint-staged', true), writeConfig('.lintstagedrc.json', lintStagedConfig));
    },
    uninstall: () => executeTogether(managerUninstall('lint-staged'), removeFile('.lintstagedrc.json'), removeFile('.lintstagedrc'))
};

import { writeConfig } from '#common/utils/file/writeConfig.js';
import { removeFile } from '#common/utils/file/remove.js';
import { managerHas, managerInstall, managerUninstall } from '#common/utils/manager/manager.js';
import { executeTogether } from '#common/utils/node/execute.js';
import { prettierConfig } from '#common/constants/devtools.const.js';

/**
 * prettier
 * @type {IPlugin}
 */
export const prettier = {
    check: () => managerHas('prettier'),
    install: async ({ monorepo = false } = {}) => {
        return executeTogether(managerInstall('prettier', true), writeConfig('.prettierrc.json', prettierConfig));
    },
    uninstall: () => executeTogether(managerUninstall('prettier'), removeFile('.prettierrc.json'), removeFile('.prettierrc'))
};

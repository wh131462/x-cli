import { writeConfig } from '#common/utils/file/writeConfig.js';
import { removeDir } from '#common/utils/file/remove.js';
import { managerHas, managerInstall, managerUninstall } from '#common/utils/manager/manager.js';
import { execute, executeTogether } from '#common/utils/node/execute.js';
import { huskyPreCommit, huskyCommitMsg } from '#common/constants/devtools.const.js';

/**
 * husky
 * @type {IPlugin}
 */
export const husky = {
    check: () => managerHas('husky'),
    install: async ({ monorepo = false } = {}) => {
        await managerInstall('husky', true);
        await execute('npx husky init');
        await writeConfig('.husky/pre-commit', huskyPreCommit);
        await writeConfig('.husky/commit-msg', huskyCommitMsg);
    },
    uninstall: () => executeTogether(managerUninstall('husky'), removeDir('.husky'))
};

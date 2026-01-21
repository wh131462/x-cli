import { writeConfig } from '#common/utils/file/writeConfig.js';
import { removeFile } from '#common/utils/file/remove.js';
import { execute, executeTogether } from '#common/utils/node/execute.js';
import { managerHas, managerInstall, managerUninstall } from '#common/utils/manager/manager.js';
import { commitlintConfig } from '#common/constants/devtools.const.js';

const czConfig = {
    path: 'cz-conventional-changelog'
};

/**
 * commit lint
 * @type {IPlugin}
 */
export const commitLint = {
    check: () => managerHas('@commitlint/config-conventional'),
    install: async ({ monorepo = false } = {}) => {
        return executeTogether(
            managerInstall(['commitizen', '@commitlint/cli', '@commitlint/config-conventional'], true),
            execute('npx commitizen init cz-conventional-changelog --save-dev --save-exact --force'),
            writeConfig('.commitlintrc.json', commitlintConfig),
            writeConfig('.czrc', czConfig)
        );
    },
    uninstall: () =>
        executeTogether(
            managerUninstall(['@commitlint/cli', '@commitlint/config-conventional', 'commitizen', 'cz-conventional-changelog']),
            removeFile('.commitlintrc.json'),
            removeFile('.commitlintrc'),
            removeFile('.czrc')
        )
};

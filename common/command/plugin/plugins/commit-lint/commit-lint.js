import { writeConfig } from '#common/utils/file/writeConfig.js';
import { npmHas } from '#common/utils/manager/npm.js';
import { removeFile } from '#common/utils/file/remove.js';
import { execute } from '#common/utils/node/execute.js';
import { managerInstall, managerUninstall } from '#common/utils/manager/manager.js';

const commitlintConfig = {
    extends: ['@commitlint/config-conventional']
};
const czConfig = {
    path: 'cz-conventional-changelog'
};
/**
 * commit lint
 * @type {IPlugin}
 */
export const commitLint = {
    check: () => npmHas('@commitlint/config-conventional', 'commitizen'),
    install: () =>
        Promise.allSettled([
            managerInstall(['commitizen', 'commitlint', '@commitlint/cli', '@commitlint/config-conventional'], true),
            execute('commitizen init cz-conventional-changelog --save-dev --save-exact'),
            writeConfig('.commitlintrc', commitlintConfig),
            writeConfig('.czrc', czConfig)
        ]),
    uninstall: () =>
        Promise.allSettled([
            managerUninstall(['@commitlint/cli', '@commitlint/config-conventional', 'commitizen']),
            removeFile('.commitlintrc'),
            removeFile('.czrc')
        ])
};

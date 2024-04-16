import { writeConfig } from '#common/utils/file/writeConfig.js';
import { npmHas, npmInstall, npmUninstall } from '#common/utils/manager/npm.js';
import { removeFile } from '#common/utils/file/remove.js';
import { execute } from '#common/utils/node/execute.js';

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
            npmInstall(['@commitlint/cli', '@commitlint/config-conventional'], true),
            npmInstall('commitlint', true),
            npmInstall('commitizen', true),
            execute('commitizen init cz-conventional-changelog --save-dev --save-exact'),
            writeConfig('.commitlintrc', commitlintConfig),
            writeConfig('.czrc', czConfig)
        ]),
    uninstall: () =>
        Promise.allSettled([
            npmUninstall(['@commitlint/cli', '@commitlint/config-conventional'], true),
            npmUninstall('commitizen', true),
            removeFile('.commitlintrc'),
            removeFile('.czrc')
        ])
};

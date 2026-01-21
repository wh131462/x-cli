import { writeConfig } from '#common/utils/file/writeConfig.js';
import { removeFile } from '#common/utils/file/remove.js';
import { managerHas, managerInstall, managerUninstall } from '#common/utils/manager/manager.js';
import { executeTogether } from '#common/utils/node/execute.js';
import { eslintConfigSingle, eslintConfigMonorepo } from '#common/constants/devtools.const.js';

/**
 * eslint
 * @type {IPlugin}
 */
export const eslint = {
    check: () => managerHas('eslint'),
    install: async ({ monorepo = false } = {}) => {
        const config = monorepo ? eslintConfigMonorepo : eslintConfigSingle;
        return executeTogether(
            managerInstall(
                [
                    'eslint-plugin-unused-imports',
                    '@typescript-eslint/eslint-plugin@latest',
                    '@typescript-eslint/parser@latest',
                    'eslint@latest',
                    'eslint-config-prettier'
                ],
                true
            ),
            writeConfig('.eslintrc.json', config)
        );
    },
    uninstall: () =>
        executeTogether(
            managerUninstall([
                'eslint-plugin-unused-imports',
                '@typescript-eslint/eslint-plugin',
                '@typescript-eslint/parser',
                'eslint',
                'eslint-config-prettier'
            ]),
            removeFile('.eslintrc.json'),
            removeFile('.eslintrc')
        )
};

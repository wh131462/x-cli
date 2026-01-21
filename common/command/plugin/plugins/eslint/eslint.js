import { removeFile } from '#common/utils/file/remove.js';
import { managerHas, managerInstall, managerUninstall } from '#common/utils/manager/manager.js';
import { executeTogether } from '#common/utils/node/execute.js';
import { eslintConfigSingle, eslintConfigMonorepo } from '#common/constants/devtools.const.js';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * eslint (flat config)
 * @see https://typescript-eslint.io/getting-started
 * @type {IPlugin}
 */
export const eslint = {
    check: () => managerHas('eslint'),
    install: async ({ monorepo = false } = {}) => {
        const config = monorepo ? eslintConfigMonorepo : eslintConfigSingle;
        const configPath = resolve(process.cwd(), 'eslint.config.mjs');

        // 安装依赖
        await managerInstall(
            [
                'eslint@latest',
                '@eslint/js',
                'typescript-eslint',
                'eslint-config-prettier',
                'eslint-plugin-unused-imports',
                'globals'
            ],
            true
        );

        // 写入配置文件
        writeFileSync(configPath, config, 'utf-8');
    },
    uninstall: () =>
        executeTogether(
            managerUninstall([
                'eslint',
                '@eslint/js',
                'typescript-eslint',
                'eslint-config-prettier',
                'eslint-plugin-unused-imports',
                'globals'
            ]),
            removeFile('eslint.config.mjs'),
            removeFile('eslint.config.js'),
            // 清理旧格式配置文件
            removeFile('.eslintrc.json'),
            removeFile('.eslintrc.js'),
            removeFile('.eslintrc')
        )
};

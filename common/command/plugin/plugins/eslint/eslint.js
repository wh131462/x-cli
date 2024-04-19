import { writeConfig } from '#common/utils/file/writeConfig.js';
import { npmHas } from '#common/utils/manager/npm.js';
import { removeFile } from '#common/utils/file/remove.js';
import { managerInstall, managerUninstall } from '#common/utils/manager/manager.js';

const eslintConfig = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'unused-imports'],
    rules: {
        'no-case-declarations': 'off',
        'unused-imports/no-unused-imports': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    Function: false
                }
            }
        ],
        '@typescript-eslint/prefer-readonly-parameter-types': 'off'
    }
};
/**
 * eslint
 * @type {IPlugin}
 * */
export const eslint = {
    check: () => npmHas('eslint'),
    install: () =>
        Promise.allSettled([
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
            writeConfig('.eslintrc', eslintConfig)
        ]),
    uninstall: () =>
        Promise.allSettled([
            managerUninstall(
                [
                    'eslint-plugin-unused-imports',
                    '@typescript-eslint/eslint-plugin@latest',
                    '@typescript-eslint/parser@latest',
                    'eslint@latest',
                    'eslint-config-prettier'
                ],
                true
            ),
            removeFile('.eslintrc')
        ])
};

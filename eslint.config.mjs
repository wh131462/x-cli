// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021
            }
        },
        plugins: {
            'unused-imports': unusedImports
        },
        rules: {
            'no-case-declarations': 'off',
            'unused-imports/no-unused-imports': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off'
        }
    },
    {
        ignores: ['node_modules/', 'dist/', 'build/']
    }
);

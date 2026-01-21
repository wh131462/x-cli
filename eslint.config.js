import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**']
    },
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021
            }
        }
    },
    ...tseslint.configs.recommended,
    {
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
    eslintConfigPrettier
);

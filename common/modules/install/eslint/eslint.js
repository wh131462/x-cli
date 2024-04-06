// 2. 安装 eslint
import { npmInstall } from '#common/utils/npmInstall.js';
import { createConfig } from '#common/utils/createConfig.js';

console.log('Installing eslint...');
npmInstall(
    [
        'eslint-plugin-unused-imports',
        '@typescript-eslint/eslint-plugin@latest',
        '@typescript-eslint/parser@latest',
        'eslint@latest',
        'eslint-config-prettier'
    ],
    true
);

// 生成 eslint 配置文件
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
createConfig('.eslintrc', eslintConfig);

/**
 * ESLint Flat Config - 单项目
 * @see https://typescript-eslint.io/getting-started
 */
export const eslintConfigSingle = `// @ts-check
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
`;

/**
 * ESLint Flat Config - Monorepo
 */
export const eslintConfigMonorepo = `// @ts-check
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
        ignores: ['**/node_modules/', '**/dist/', '**/build/']
    }
);
`;

/**
 * Prettier 配置
 */
export const prettierConfig = {
    singleQuote: true,
    semi: true,
    tabWidth: 4,
    trailingComma: 'none',
    printWidth: 120,
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
    singleAttributePerLine: true
};

/**
 * Commitlint 配置
 */
export const commitlintConfig = {
    extends: ['@commitlint/config-conventional']
};

/**
 * Lint-staged 配置 - 通用
 */
export const lintStagedConfig = {
    '*.{js,ts,jsx,tsx,vue,mjs,cjs}': ['prettier --write', 'eslint --fix'],
    '*.{html,css,scss,less,json,md,yaml,yml}': ['prettier --write']
};

/**
 * Husky pre-commit 脚本 (v9+)
 */
export const huskyPreCommit = `npx lint-staged
`;

/**
 * Husky commit-msg 脚本 (v9+)
 */
export const huskyCommitMsg = `npx --no -- commitlint --edit $1
`;

/**
 * gitignore 通用配置
 */
export const gitignoreContent = `# Dependencies
node_modules/
.pnp/
.pnp.js

# Build outputs
dist/
build/
out/
.next/
.nuxt/
.output/

# Cache
.cache/
.parcel-cache/
.turbo/
.nx/
.angular/

# IDE
.idea/
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
*.sublime-workspace
*.sublime-project

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Environment
.env
.env.local
.env.*.local

# Testing
coverage/
.nyc_output/

# Misc
*.local
`;

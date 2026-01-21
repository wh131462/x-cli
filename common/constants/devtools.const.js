/**
 * ESLint 配置 - 单项目
 */
export const eslintConfigSingle = {
    env: {
        browser: true,
        es2021: true,
        node: true
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
        '@typescript-eslint/no-unused-vars': 'off'
    }
};

/**
 * ESLint 配置 - Monorepo
 */
export const eslintConfigMonorepo = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true
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
        '@typescript-eslint/no-unused-vars': 'off'
    },
    ignorePatterns: ['**/node_modules/**', '**/dist/**', '**/build/**']
};

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
 * Husky pre-commit 脚本
 */
export const huskyPreCommit = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
echo "Running pre-commit checks..."
npx lint-staged
`;

/**
 * Husky commit-msg 脚本
 */
export const huskyCommitMsg = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx --no -- commitlint --edit $1
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

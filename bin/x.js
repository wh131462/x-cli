#! /usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
// 1. 安装 prettier
console.log('Installing prettier...');
execSync('npm install --save-dev --save-exact prettier');

// 生成 prettier 配置文件
const prettierConfig = {
    singleQuote: true,
    experimentalTernaries: false,
    semi: true,
    tabWidth: 4,
    trailingComma: 'none',
    printWidth: 360,
    quoteProps: 'consistent',
    bracketSpacing: true,
    bracketSameLine: true,
    arrowParens: 'always',
    htmlWhitespaceSensitivity: 'css',
    endOfLine: 'lf',
    singleAttributePerLine: true
};

fs.writeFileSync('.prettierrc', JSON.stringify(prettierConfig, null, 2));

// 2. 安装 eslint
console.log('Installing eslint...');
execSync('npm install eslint-plugin-unused-imports @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest --save-dev');
execSync('npm install --save-dev eslint-config-prettier');

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

fs.writeFileSync('.eslintrc', JSON.stringify(eslintConfig, null, 2));

// 3. 安装 lint-staged
console.log('Installing lint-staged...');
execSync('npm install --save-dev lint-staged');

// 生成 lint-staged 配置文件
const lintStagedConfig = {
    '*.{js,ts,jsx,tsx,vue}': ['prettier --write', 'eslint --fix'],
    '*.{html,css,scss,less,json}': ['prettier --write']
};

fs.writeFileSync('.lintstagedrc', JSON.stringify(lintStagedConfig, null, 2));

// 4. 安装 commit-lint
console.log('Installing commit-lint...');
execSync('npm install --save-dev @commitlint/{cli,config-conventional}');

// 初始化 husky
console.log('Initializing husky...');
execSync('npx husky init');

// 生成 commit-lint 配置文件
const commitlintConfig = {
    extends: ['@commitlint/config-conventional']
};

fs.writeFileSync('.commitlintrc.cjs', `module.exports = ${JSON.stringify(commitlintConfig, null, 2)};`);

// 5. 安装 cz
console.log('Installing commitizen...');
execSync('npm install -D commitizen');
console.log('Initializing cz...');
execSync('commitizen init cz-conventional-changelog --save-dev --save-exact');

// 生成 cz 配置文件
const czConfig = {
    path: 'cz-conventional-changelog'
};

fs.writeFileSync('.czrc', JSON.stringify(czConfig, null, 2));

// 6. 安装 husky
console.log('Installing husky...');
execSync('npm install --save-dev husky');

// 生成 husky 配置文件
const huskyConfigPrecommit = `#!/usr/bin/env sh
# 导入 Husky 脚本
. "$(dirname -- "$0")/_/husky.sh"
# 如果要执行 rebase 需要跳过当前所有hooks
# todo-highlight HUSKY=0 git rebase ...
echo "Running pre-commit script..."
npx lint-staged && HUSKY=0 git add .
# 不管是否通过 都允许执行
exit 0;`;

const huskyConfigCommitMsg = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx --no -- commitlint --edit \$1`;

fs.writeFileSync('.husky/pre-commit', huskyConfigPrecommit);
fs.writeFileSync('.husky/commit-msg', huskyConfigCommitMsg);

// 7. 创建 .gitignore 文件
console.log('Creating .gitignore file...');
const gitignoreContent = `# Compiled output
dist
tmp
out-tsc
bazel-out

# Node
node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

# Miscellaneous
.angular/cache
.sass-cache/
connect.lock
coverage
libpeerconnection.log
testem.log
typings

# System files
.DS_Store
Thumbs.db
yarn.lock
package-lock.json`;

fs.writeFileSync('.gitignore', gitignoreContent);

console.log('Setup completed successfully!');

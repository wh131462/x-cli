// 3. 安装 lint-staged
import { writeConfig } from '#common/utils/file/writeConfig.js';
import { npmInstall } from '#common/utils/manager/npm.js';
console.log('Installing lint-staged...');
npmInstall('lint-staged', true);
// 生成 lint-staged 配置文件
const lintStagedConfig = {
    '*.{js,ts,jsx,tsx,vue}': ['prettier --write', 'eslint --fix'],
    '*.{html,css,scss,less,json}': ['prettier --write']
};
writeConfig('.lintstagedrc', lintStagedConfig);

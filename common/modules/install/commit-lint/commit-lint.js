// 4. 安装 commit-lint
import { npmInstall } from '#common/utils/npmInstall.js';
import { writeConfig } from '#common/utils/writeConfig.js';
console.log('Installing commit-lint...');
npmInstall('@commitlint/{cli,config-conventional}', true);
// 生成 commit-lint 配置文件
const commitlintConfig = {
    extends: ['@commitlint/config-conventional']
};
writeConfig('.commitlintrc.cjs', commitlintConfig);

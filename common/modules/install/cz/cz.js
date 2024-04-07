// 5. 安装 cz
import { npmInstall } from '#common/utils/npmInstall.js';
import { execSync } from 'child_process';
import { writeConfig } from '#common/utils/writeConfig.js';

console.log('Installing commitizen...');
npmInstall('commitizen', true);
console.log('Initializing cz...');
execSync('commitizen init cz-conventional-changelog --save-dev --save-exact');
// 生成 cz 配置文件
const czConfig = {
    path: 'cz-conventional-changelog'
};
writeConfig('.czrc', czConfig);

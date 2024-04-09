// 5. 安装 cz
import { execSync } from 'child_process';
import { writeConfig } from '#common/utils/file/writeConfig.js';
import { npmInstall } from '#common/utils/manager/npm.js';
import { execute } from '#common/utils/node/execute.js';
// 生成 cz 配置文件
const czConfig = {
    path: 'cz-conventional-changelog'
};
export const cz = {
    install: async () => {
        await execute('commitizen init cz-conventional-changelog --save-dev --save-exact');
        await npmInstall('commitizen', true);
    },
    config: writeConfig('.czrc', czConfig)
};

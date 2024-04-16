// 6. 安装 husky
import { execSync } from 'child_process';
import { writeConfig } from '#common/utils/file/writeConfig.js';
import { npmHas, npmInstall, npmUninstall } from '#common/utils/manager/npm.js';
import { removeDir } from '#common/utils/file/remove.js';

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
/**
 * husky
 * @type {IPlugin}
 */
export const husky = {
    check: () => npmHas('husky'),
    install: async () => {
        for await (const call of [
            npmInstall('husky', true),
            execSync('npx husky init'),
            writeConfig('.husky/pre-commit', huskyConfigPrecommit),
            writeConfig('.husky/commit-msg', huskyConfigCommitMsg)
        ]) {
        }
    },
    uninstall: () => Promise.allSettled([npmUninstall('husky'), removeDir('./husky')])
};

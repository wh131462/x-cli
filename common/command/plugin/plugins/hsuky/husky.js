import { removeDir } from '#common/utils/file/remove.js';
import { managerHas, managerInstall, managerUninstall } from '#common/utils/manager/manager.js';
import { execute, executeTogether } from '#common/utils/node/execute.js';
import { huskyPreCommit, huskyCommitMsg } from '#common/constants/devtools.const.js';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * husky (v9+)
 * @see https://typicode.github.io/husky/get-started.html
 * @type {IPlugin}
 */
export const husky = {
    check: () => managerHas('husky'),
    install: async ({ monorepo = false } = {}) => {
        // 安装 husky
        await managerInstall('husky', true);

        // 初始化 husky（会创建 .husky 目录和默认 pre-commit）
        await execute('npx husky init');

        // 覆盖 pre-commit 内容
        const preCommitPath = resolve(process.cwd(), '.husky/pre-commit');
        writeFileSync(preCommitPath, huskyPreCommit, 'utf-8');

        // 创建 commit-msg hook
        const commitMsgPath = resolve(process.cwd(), '.husky/commit-msg');
        writeFileSync(commitMsgPath, huskyCommitMsg, 'utf-8');
    },
    uninstall: () => executeTogether(managerUninstall('husky'), removeDir('.husky'))
};

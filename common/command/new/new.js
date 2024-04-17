import { execute } from '#common/utils/node/execute.js';
import { inquire, select } from '#common/utils/ui/promot.js';
import {
    handleDirectory,
    handlePackageJson,
    handlePrepare,
    handleProject,
    handleStory,
    handleXrx
} from '#common/command/new/handlers.js';
import { logger } from '#common/utils/x/logger.js';

export const newProject = async (projectName) => {
    await handlePrepare(projectName);
    // 获取前缀
    const compLibName = await inquire('请输入组件库的名称(回车确认)', 'ui');
    const prefix = await inquire('请输入组件库使用的组件前缀[prefix](回车确认)', compLibName);
    const playLibName = await inquire('请输入demo库的名称(回车确认)', 'play');
    const manager = await select('选择你的包管理器(回车确认)', 'pnpm', ['pnpm', 'npm', 'yarn']);
    // 组装有用的变量组
    const useful = {
        projectName,
        compLibName,
        prefix,
        playLibName,
        manager
    };
    try {
        await handleProject(useful);
        await handleDirectory(useful);
        await handleStory(useful);
        await handlePackageJson(useful);
        await handleXrx(useful);
        await execute(`git init && git add . && git commit -m "chore: init project ${projectName}"`);
    } catch (e) {
        logger.error(e);
    }
};

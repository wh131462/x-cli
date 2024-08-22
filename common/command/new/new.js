import { execute } from '#common/utils/node/execute.js';
import { inquire, select } from '#common/utils/ui/promot.js';
import {
    handleDirectory,
    handlePackageJson,
    handlePrepare,
    handleProject,
    handleSelect,
    handleStory,
    handleXrc
} from '#common/command/new/handlers.js';
import { logger } from '#common/utils/x/logger.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

export const newProject = async (projectName) => {
    await handlePrepare(kebabcase(projectName));
    // 获取前缀
    const componentLibName = await inquire('请输入组件库的名称(回车确认)', 'ui');
    const prefix = await inquire('请输入组件库使用的组件前缀[prefix](回车确认)', kebabcase(componentLibName));
    const demoLibName = await inquire('请输入demo库的名称(回车确认)', 'play');
    const packageManager = await select('选择你的包管理器(回车确认)', 'pnpm', ['pnpm', 'npm', 'yarn']);
    const registry = await inquire('指定仓库源(回车确认)', 'https://registry.npmjs.com');
    // 组装有用的变量组
    // 因为驼峰法projectName会被nx改为连词符法 所以需要调整
    const useful = {
        projectName: kebabcase(projectName),
        componentLibName: kebabcase(componentLibName),
        demoLibName: kebabcase(demoLibName),
        packageManager,
        registry,
        prefix
    };
    try {
        await handleProject(useful);
        await handleDirectory(useful);
        await handleSelect(useful);
        await handleStory(useful);
        await handlePackageJson(useful);
        await handleXrc(useful);
        await execute(`git init && git add . && git commit -m "chore: init project ${projectName}"`);
    } catch (e) {
        logger.error(e);
    }
};

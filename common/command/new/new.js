import { inquire, select } from '#common/utils/ui/promot.js';
import { logger } from '#common/utils/x/logger.js';
import { FrameworkConfig, FrameworkChoices } from '#common/constants/framework.const.js';
import { getManagerByName, getManagerFromGlobal } from '#common/utils/manager/manager.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { removeFile } from '#common/utils/file/remove.js';

/**
 * 创建新项目
 * @param projectName
 */
export const newProject = async (projectName) => {
    projectName = kebabcase(projectName);

    // 1. 检查项目是否已存在
    if (existsSync(resolve(process.cwd(), projectName))) {
        const del = await inquire('Found existing project with same name, delete it?', null, 'confirm');
        if (del) {
            await removeFile(resolve(process.cwd(), projectName));
        } else {
            throw new Error('User cancelled project creation.');
        }
    }

    // 2. 选择框架
    const framework = await select('Select framework', 'vue', FrameworkChoices);
    const frameworkConfig = FrameworkConfig[framework];

    // 3. 选择具体工具
    const tool = await select(`Select ${frameworkConfig.name} project tool`, frameworkConfig.choices[0].value, frameworkConfig.choices);

    // 4. 获取创建命令
    const createCommand = frameworkConfig.commands[tool](projectName);

    // 5. 检测包管理器用于执行 npx
    const globalManager = (await getManagerFromGlobal()) || 'npm';
    const manager = getManagerByName(globalManager);

    logger.info(`Creating ${frameworkConfig.name} project using ${globalManager}...`);

    try {
        // 6. 执行创建命令
        await manager.npx(createCommand);

        logger.info(`Project ${projectName} created successfully!`);

        // 7. 询问是否初始化开发工具
        const initTools = await inquire('Initialize dev tools (eslint, prettier, husky, commitlint)?', true, 'confirm');

        if (initTools) {
            process.chdir(projectName);
            // 动态导入避免循环依赖
            const { initDevTools } = await import('#common/command/plugin/plugin.js');
            await initDevTools();
            logger.info('Dev tools initialized!');
        }
    } catch (e) {
        logger.error('Project creation failed:', e);
        throw e;
    }
};

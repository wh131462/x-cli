import { cli_dependencies } from '#common/constants/x.const.js';
import { logger } from '#common/utils/logger.js';
import { execute } from '#common/utils/node/execute.js';
import { inquire } from '#common/utils/ui/promot.js';

/**
 * 检查依赖
 */
export const checkDependencies = async () => {
    const registry = await inquire('设置仓库源:', 'https://registry.npmmirror.com');
    logger.info('[init]开始检查依赖项...');
    try {
        await execute(`npm config set registry ${registry}`);
        await execute(`yarn config set registry ${registry}`);
        await execute(`pnpm config set registry ${registry}`);
        for (const dept of cli_dependencies) {
            const has = await dept?.check();
            if (!has) {
                logger.info(`[init]未安装依赖项[${dept.name}],正在安装...`);
                await dept?.install?.();
            }
        }
    } catch (e) {}
    logger.info('[init]依赖项检查完成.');
};

export const init = async () => {
    await checkDependencies();
};

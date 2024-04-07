import { cli_dependencies } from '#common/constants/x.const.js';
import { logger } from '#common/utils/logger.js';

/**
 * 检查依赖
 */
export const checkDependencies = async () => {
    logger.info('[init]开始检查依赖项...');
    try {
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

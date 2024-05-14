import { logger } from '#common/utils/x/logger.js';
import { managerExec } from '#common/utils/x/managerExec.js';

/**
 * xi
 * 执行当前环境下的内容
 */
export const xi = async (packageName, isDev, isGlobal) => {
    await managerExec(async ({ has, install }) => {
        if (packageName) {
            if (await has(packageName)) {
                const warning = `${packageName}  has been installed.`;
                logger.warn(warning);
            } else {
                await install(packageName, isDev, isGlobal);
            }
        } else {
            await install();
        }
    });
};
